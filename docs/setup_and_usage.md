# Setup and Usage Guide

Follow these steps to get the Blog Writing Agent up and running on your local machine.

## Prerequisites

- **Python 3.10+**
- **pip** (Python package installer)
- **Node.js 18+ & npm** (Javascript environment)

## Environment Setup

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd Blog-Writing-Agent
    ```

2.  **Install Python Backend Dependencies**:
    ```bash
    pip install fastapi uvicorn sse-starlette pydantic langgraph langchain-google-genai google-generativeai tavily-python pandas
    ```

3.  **Install Node Frontend Dependencies**:
    ```bash
    cd frontend
    npm install
    cd ..
    ```

4.  **Configure API Keys**:
    Create a `.env` file in the root directory and add your credentials. (Note: The project operates entirely on the Google Gemini ecosystem now.)
    ```env
    GOOGLE_API_KEY=your_google_genai_key
    TAVILY_API_KEY=your_tavily_key
    ```

## Running the Application

### 1. Start the FastAPI Backend
Launch the backend server to process GraphQL operations and stream events.
```bash
python3 backend/api.py
```

### 2. Start the React UI
Launch the Vite development server.
```bash
cd frontend
npm run dev
```

The UI will typically be accessible securely at `http://localhost:5173`.

---

## Exploring the Agent with Examples

For experimentation, learning, and step-by-step trace execution, five highly documented Python scripts are provided in the `examples/` directory.

- `1_bwa_basic.py`: Basic orchestrator/worker pattern.
- `2_bwa_improved_prompting.py`: Prompt engineering iterations.
- `3_bwa_research.py`: Web research logic integration.
- `4_bwa_research_fine_tuned.py`: Advanced historical constraints.
- `5_bwa_image.py`: Full multi-node workflow including GenAI imaging.

You can run them directly via Python:
`python3 examples/1_bwa_basic.py`
