# Frontend Guide - Blog Writing Agent

The Blog Writing Agent features a sleek **React (Vite)** application for a premium, interactive user experience.

## React UI (`frontend/`)

### Design Architecture
The frontend leverages a dark-themed **glassmorphism** design aesthetic implemented purely using Vanilla CSS (`index.css`). It operates as a Single Page Application communicating through the React library.

### UI Components

#### Main Layout (`App.tsx`)
- **BlogForm**: A sidebar panel that controls what topic to generate and what date to use as reference.
- **ProgressTracker**: Automatically appears when a generation begins. Visually indicates the exact node the LangGraph backend is currently executing inside the backend architecture, derived automatically from the SSE stream.
- **BlogViewer**: A live Markdown renderer combining `react-markdown` capable of rendering the final text output of the agent smoothly in the browser.

### Key Features
- **Server-Sent Events (SSE)**: Uses the `fetch` API stream reader to consume event data coming directly from the `fastapi` server in real time.
- **State Inference**: Parses incoming `update` events to understand when sections are merged or when the graph hits the final node, enabling lightning-fast UX without polling.
