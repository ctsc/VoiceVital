# Quick start

Python 3.11+ and Node.js 18+ are required. This tool is for research only, not clinical diagnosis.

## Backend

From the repo root:

```bash
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8001
```

API: http://localhost:8001  
Docs: http://localhost:8001/docs

Or run `scripts/start_api.bat` (Windows) / `scripts/start_api.sh` (macOS/Linux).

## Frontend

```bash
cd webapp
npm install
npm run dev
```

App: http://localhost:3000

Or run `scripts/start_frontend.bat` / `scripts/start_frontend.sh`.

## Check it

1. Open http://localhost:3000
2. Upload an MP3 or WAV, or use a patient assessment flow
3. Confirm a prediction comes back from the API

Direct API test:

```bash
curl -X POST http://localhost:8001/predict -F "file=@path/to/audio.mp3"
```

## Models

The default artifact is `models/enhanced_gb_combined_features.joblib`. If none is found, the API still starts and returns dummy predictions.

Retrain from `ml/` after placing audio in `data/raw/`.
