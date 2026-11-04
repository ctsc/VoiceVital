import Link from 'next/link'
import Waveform from '@/components/Waveform'

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero__backdrop" />
        <Waveform />
        <div className="hero__content">
          <p className="hero__eyebrow">Speech biomarker research</p>
          <h1>VoiceVital</h1>
          <p className="hero__lede">
            Clinic-ready workflows that turn short speech samples into cognitive risk signals.
          </p>
          <div className="hero__actions">
            <Link className="btn btn-primary" href="/doctor/login">
              Enter clinician portal
            </Link>
            <Link className="btn btn-secondary" href="/patient/login">
              Patient check-in
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Built for the visit, not the demo reel</h2>
            <p>
              Enroll patients, capture a guided reading, and review scored sessions beside the
              clinical record.
            </p>
          </div>
          <div className="story-grid">
            <div>
              <article className="story-panel">
                <h3>Guided speech protocol</h3>
                <p>
                  Patients read calibrated passages while the clinic records timing, pacing, and
                  session context for the biomarker pipeline.
                </p>
              </article>
              <article className="story-panel">
                <h3>Clinician review queue</h3>
                <p>
                  Scores land next to visit history so neurologists can decide when a fuller
                  cognitive battery is warranted.
                </p>
              </article>
              <article className="story-panel">
                <h3>Research-grade models</h3>
                <p>
                  Gradient-boosted classifiers trained on engineered acoustic features. Artifacts and
                  training code ship with the repo.
                </p>
              </article>
            </div>
            <aside className="feature-rail">
              <h3>What you can explore</h3>
              <ul>
                <li>
                  <strong>Riverside Cognitive Care</strong>
                  <span>Seeded clinic with active patients and scored sessions</span>
                </li>
                <li>
                  <strong>Doctor + patient portals</strong>
                  <span>Enrollment, activation, assessment, and review</span>
                </li>
                <li>
                  <strong>Original ML stack</strong>
                  <span>FastAPI, joblib models, and training notebooks retained</span>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="split-cta">
            <Link href="/doctor/login">
              <h3>Clinician</h3>
              <p>Manage roster, issue patient IDs, review biomarker results.</p>
            </Link>
            <Link href="/patient/login">
              <h3>Patient</h3>
              <p>Activate enrollment, complete a speech session, see history.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
