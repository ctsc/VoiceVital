# Model artifacts

Place trained joblib (and related) artifacts here for local FastAPI inference, for example:

- `enhanced_gb_combined_features.joblib`

Binary weights are gitignored. Training scripts live in `../ml/`. The Vercel / Next.js demo does **not** load these files at runtime; it simulates analysis while keeping this folder for the research portfolio.
