# VoiceVitals

Research tool for voice-based dementia screening. Not a medical device and not intended for clinical diagnosis.

The production app is a React frontend (`webapp/`) plus a FastAPI backend (`backend/`) that scores speech with engineered voice biomarkers.

## Layout

```
VoiceVitals/
├── webapp/          React + TypeScript frontend
├── backend/         FastAPI API, feature pipeline, realtime classifier
├── functions/       Firebase Cloud Functions
├── ml/              Training scripts and data-ingest pipeline
├── models/          Trained model artifacts
├── reports/         Metrics and analysis outputs
├── docs/            Plans and research notes
└── scripts/         Local start and seed helpers
```

## Quick start

Python 3.11+ and Node.js 18+ are required.

```bash
git clone https://gitlab.com/cartertierney0/VoiceVitals.git
cd VoiceVitals

python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

python -m uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8001
```

In a second terminal:

```bash
cd webapp
npm install
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:8001
- API docs: http://localhost:8001/docs

Windows helpers: `scripts\start_api.bat` and `scripts\start_frontend.bat`.

## Model

The API loads `models/enhanced_gb_combined_features.joblib` by default. Override with `MODEL_PATH` or `REALTIME_MODEL_PATH`.

To retrain:

```bash
python ml/advanced_features_extractor.py
python ml/enhanced_gb_training.py
python ml/comprehensive_analysis.py
```

Place raw audio in `data/raw/` first (that directory is gitignored).

## Results (research)

| Model | F1 | Accuracy | Precision | Recall |
|-------|----|----------|-----------|--------|
| Enhanced GB (combined) | 0.6154 | 0.6129 | 0.5909 | 0.6429 |
| Tuned GB (baseline) | 0.4338 | 0.6129 | 0.5500 | 0.3571 |

Details: `docs/research/FINAL_ANALYSIS_SUMMARY.md` and `reports/`.

## Firebase

Config at the repo root: `firebase.json`, `firestore.rules`, `storage.rules`. Cloud Functions live in `functions/`. Seed demo data with `npm run seed:demo` (needs a service account).
