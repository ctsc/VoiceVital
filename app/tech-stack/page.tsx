import Link from 'next/link'

const items = [
  {
    label: 'Today',
    body: 'Next.js App Router on Vercel. Route handlers hold an in-memory clinic store so the product feels live without a database.',
  },
  {
    label: 'Original app',
    body: 'React + Vite on Firebase Hosting, with Firebase Auth (role claims), Firestore, Cloud Storage, and callable Cloud Functions for doctor/patient workflows.',
  },
  {
    label: 'ML API',
    body: 'FastAPI service (backend/) with realtime feature extraction and joblib classifiers. Historically hosted outside the SPA (Elastic Beanstalk / similar).',
  },
  {
    label: 'Models',
    body: 'Training code lives in ml/. Artifacts such as enhanced_gb_combined_features.joblib belong in models/. This demo simulates scoring instead of loading joblib on Vercel.',
  },
  {
    label: 'Auth change',
    body: 'OAuth and Firebase Auth were removed for the portfolio deploy. Demo sessions use httpOnly cookies and fixed clinic credentials so recruiters can explore without cloud projects.',
  },
  {
    label: 'Reports',
    body: 'Cross-validation metrics and the technical write-up remain under reports/ for the research narrative.',
  },
]

export default function TechStackPage() {
  return (
    <div className="tech-page">
      <div>
        <p className="hero__eyebrow">Architecture</p>
        <h1>From Firebase and GCP to a Vercel demo</h1>
        <p>
          VoiceVital began as a secured clinic prototype on Google Cloud. This repository now runs
          as a recruiter-facing Next.js demo that keeps the ML research artifacts and product flows
          without requiring Firebase credentials.
        </p>
      </div>

      <div className="tech-list">
        {items.map((item) => (
          <article key={item.label} className="tech-item">
            <strong>{item.label}</strong>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <div className="product-actions">
        <Link className="btn btn-primary" href="/doctor/login">
          Open clinician portal
        </Link>
        <Link className="btn btn-secondary" href="/">
          Back home
        </Link>
      </div>
    </div>
  )
}
