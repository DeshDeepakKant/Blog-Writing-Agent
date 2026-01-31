# Backend API Documentation

The backend of the Blog Writing Agent is comprised of two core files housed in the `backend/` directory:
1. `bwa_backend.py`: The LangGraph state machine definition.
2. `api.py`: The FastAPI server wrapping the graph.

## Data Schemas

### `Task`
Individual sections to be written.
- `id`: Unique identifier.
- `title`: Section title.
- `goal`: Description of section intent.
- `bullets`: Key points to cover.
- `target_words`: Writing length constraint.

### `Plan`
Full blog post specification.
- `blog_title`, `audience`, `tone`, `blog_kind`.
- `tasks`: List of `Task` objects.

### `EvidenceItem`
A single research result.
- `title`, `url`, `snippet`, `source`, `published_at`.

## Core Nodes

### `router_node`
Determines if the topic is "evergreen" or requires fresh data.
- **Returns**: `needs_research`, `mode`, `queries`, `recency_days`.

### `orchestrator_node`
Generates the `Plan`.
- **Logic**: Adjusts tasks based on the `mode`. For example, `open_book` mode focuses on recent news roundups.

### `worker_node`
The primary writing engine.
- **Logic**: Each worker is given a specific `Task`. It must cover all bullets and adhere to the target word count. It cites evidence URLs using markdown links if research was performed.

### `generate_and_place_images`
Handles image integration.
- **Process**: Iterates through `image_specs`, generates images via Gemini, saves them to the `/images` directory, and replaces placeholders (e.g., `[[IMAGE_1]]`) in the markdown.

## Streaming Server (api.py)
The core graph is launched via a single endpoint. Every invoked node dispatches an SSE packet shaped like:
```json
{
  "event": "update",
  "data": {
    "node": "worker_node",
    "payload": {"sections": [ ... ]}
  }
}
```
Client applications decode these steps to follow the agent's real-time trajectory.
