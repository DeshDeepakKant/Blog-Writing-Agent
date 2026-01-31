# Blog Writing Agent (BWA) 🤖✍️

An autonomous, multi-agent system powered by **LangGraph** designed to research and write high-quality technical blog posts with integrated AI-generated diagrams.

## 🌟 Key Features

-   **Autonomous Research**: Intelligent routing determines if web research is needed via Tavily.
-   **Hierarchical Drafting**: An orchestrator plans the post, and parallel workers draft individual sections.
-   **AI-Generated Visuals**: Automatically identifies where diagrams are needed and generates them using Gemini 2.5 Flash Image.
-   **Premium React UI**: A modern, glassmorphic dark-themed React application powered by Vite.
-   **Streaming FastAPI Backend**: Real-time progress updates are streamed to the frontend via Server-Sent Events (SSE).

## 🚀 Quick Start

### 1. Configure Environment
Create a `.env` file with the following:
```env
TAVILY_API_KEY=your_key
GOOGLE_API_KEY=your_key
```

### 2. Run the Backend (FastAPI)
```bash
python3 backend/api.py
```
*The backend API will run on `http://localhost:8000`.*

### 3. Run the Frontend (React Vite)
```bash
cd frontend
npm install
npm run dev
```
*The web interface will be available at `http://localhost:5173` (or similar port).*

## 📚 Documentation

Dive deeper into the project's internals:

-   [**Architecture Overview**](docs/architecture.md): Understand the LangGraph workflow and state management.
-   [**Backend API**](docs/backend_api.md): Details on nodes, schemas, and logic.
-   [**Frontend Guide**](docs/frontend_guide.md): Explore the React UI and its features.
-   [**Setup and Usage**](docs/setup_and_usage.md): Step-by-step technical setup and dependencies.

## 📁 Repository Structure

```text
.
├── backend/            # FastAPI and LangGraph core logic
│   ├── api.py          # API wrapper for SSE streaming
│   └── bwa_backend.py  # Graph definition and Gemini integration
├── frontend/           # Premium React (Vite) application
├── docs/               # In-depth technical documentation
└── examples/           # Step-by-step educational scripts
```

## 🛠️ Built With

-   **LangGraph**
-   **Google Gemini (1.5 Flash & 2.5 Flash Image)**
-   **Tavily Search**
-   **FastAPI & Python**
-   **Vite, React & TypeScript**
-   **Vanilla CSS**

---
