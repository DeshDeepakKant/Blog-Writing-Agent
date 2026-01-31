import json
from datetime import date
from typing import Any, Dict, Optional
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent))
from bwa_backend import app as graph_app

app = FastAPI(title="Blog Writing Agent API")

# Add CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    topic: str
    as_of: Optional[str] = None

@app.post("/generate")
async def generate_blog(request: GenerateRequest):
    topic = request.topic.strip()
    as_of = request.as_of or date.today().isoformat()

    inputs: Dict[str, Any] = {
        "topic": topic,
        "mode": "",
        "needs_research": False,
        "queries": [],
        "evidence": [],
        "plan": None,
        "as_of": as_of,
        "recency_days": 7,
        "sections": [],
        "merged_md": "",
        "md_with_placeholders": "",
        "image_specs": [],
        "final": "",
    }

    def event_generator():
        try:
            # Yield initial start event
            yield {
                "event": "start",
                "data": json.dumps({"status": "started", "topic": topic})
            }
            
            # Run the LangGraph app in a streaming fashion
            for step in graph_app.stream(inputs, stream_mode="updates"):
                # step is a dict like {"node_name": {"key": "value"}}
                node_name = next(iter(step.keys()))
                payload = step[node_name]
                
                # Convert the payload to a JSON-serializable format
                data_str = json.dumps({
                    "node": node_name,
                    "payload": payload
                }, default=str)
                
                yield {
                    "event": "update",
                    "data": data_str
                }
                
            # Once stream is finished, we could also fetch the final output if needed,
            # but LangGraph's streaming yields the final node's output as the last update.
            # We explicitly yield a done event.
            yield {
                "event": "done",
                "data": json.dumps({"status": "completed"})
            }

        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)})
            }

    return EventSourceResponse(event_generator())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
