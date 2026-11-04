# VoiceVital

Research prototype for **voice-based dementia screening**. Not a medical device and not intended for clinical diagnosis.

Clinic workflows let clinicians enroll patients, collect guided speech samples, and review biomarker-style scores beside visit history.

## What changed (important)

This project was **originally deployed on GCP / Firebase**:

| Layer | Original stack |
|-------|----------------|
| Frontend | React + Vite on **Firebase Hosting** |
| Auth | **Firebase Auth** with custom role claims (doctor / patient), including OAuth-capable identity |
| Data | **Cloud Firestore** for clinics, doctors, patients, recordings |
| Files | **Firebase Storage** for patient audio |
| APIs | **Firebase Cloud Functions** (register doctor, create patient stub, activate patient, upload tokens) |
| ML | **FastAPI** service loading joblib models from `models/` (historically Elastic Beanstalk / similar) |

It has been **migrated to Vercel + Next.js** so the product can live as a recruiter-facing demo:

- **No Firebase / GCP project required** to run or deploy
- **OAuth and Firebase Auth removed** for local and Vercel ease (demo httpOnly session cookies instead)
- **No database** — an in-memory server store seeds a full clinic and accepts enrollments / assessments for the process lifetime
- **Analysis is simulated** in a Next.js route handler (realistic scores + latency). The real training code and model artifacts remain in the repo for the research story

Legacy Firebase config and Cloud Functions source remain under `firebase.json`, `firestore.rules`, `storage.rules`, and `functions/` as historical reference. They are not used by the Next.js app.

## Quick start

Node.js 18+ recommended.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo access

Login pages are one-click. No typing credentials:

- `/doctor/login` → **Enter clinician portal** (Dr. Elena Okonkwo)
- `/patient/login` → **Enter patient portal** (Margaret Chen, PT-4821)

Pending enrollment IDs you can activate at `/patient/signup`: `PT-5340`, `PT-5499`.

Underlying demo accounts (if you need them for API testing):

- Clinician: `elena.okonkwo@riversidecc.health` / `ClinicDemo2024!`
- Patient: `margaret.chen@email.com` / `PatientDemo2024!`

## Deploy on Vercel

1. Push this repo to GitHub / GitLab / Bitbucket
2. Import the project in [Vercel](https://vercel.com)
3. Framework preset: **Next.js** (root directory)
4. Deploy — no Firebase env vars needed

```bash
npx vercel
```

Cold starts reset the in-memory store to the seeded Riverside Cognitive Care clinic.

## Repository layout

```
VoiceVital/
├── app/             Next.js App Router (UI + API routes)
├── components/      Shared UI
├── lib/             In-memory store, session helpers, types
├── styles/          Design tokens and layout CSS
├── backend/         Original FastAPI ML API (not required for the demo)
├── ml/              Training / feature-engineering scripts
├── models/          Trained joblib artifacts (gitignored binaries; keep locally)
├── reports/         Metrics and technical report
├── functions/       Legacy Firebase Cloud Functions (unused at runtime)
└── vercel.json      Vercel project hints
```

## Original ML path (still in repo)

The research API loads `models/enhanced_gb_combined_features.joblib` by default:

```bash
python -m venv venv
# Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8001
```

That path is **optional**. The Vercel demo does not call it.

To retrain (research only):

```bash
python ml/advanced_features_extractor.py
python ml/enhanced_gb_training.py
python ml/comprehensive_analysis.py
```

## Product routes

| Path | Purpose |
|------|---------|
| `/` | Marketing / brand landing |
| `/doctor/login` · `/doctor/signup` · `/doctor/dashboard` | Clinician portal |
| `/patient/login` · `/patient/signup` · `/patient/dashboard` | Patient portal |
| `/patient/assessment` | Guided script + upload / analyze |
| `/tech-stack` | Architecture and migration notes |

## Disclaimer

VoiceVital is a portfolio and research demonstration. Screening outputs are illustrative and must not be used for medical decision-making.
