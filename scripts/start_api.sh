#!/bin/bash
# Start the VoiceVitals FastAPI server

cd "$(dirname "$0")/.."

if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv311" ]; then
    source .venv311/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
fi

python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8001 --reload
