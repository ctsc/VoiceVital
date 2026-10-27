# Backend

FastAPI service for VoiceVitals speech analysis.

```bash
# from repo root, with venv active
pip install -r requirements.txt
python -m uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8001
```

- `api/` HTTP endpoints (`/predict`, `/predict-url`, `/webhook/analyze`)
- `src/` production feature pipeline
- `services/` realtime classifier used by URL/webhook routes

The trained model is loaded from `../models/enhanced_gb_combined_features.joblib` unless `MODEL_PATH` is set.

Research and training scripts live in `../ml/`.
