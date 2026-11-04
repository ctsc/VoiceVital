'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { AnalysisBadge, PredictionBadge } from '@/components/StatusBadge'
import { formatDate, formatDateTime, formatProbability } from '@/lib/format'
import type { Clinic, DoctorProfile, PatientProfile, Recording } from '@/lib/types'

export default function PatientDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [patient, setPatient] = useState<Omit<PatientProfile, 'password'> | null>(null)
  const [doctor, setDoctor] = useState<Omit<DoctorProfile, 'password'> | null>(null)
  const [recordings, setRecordings] = useState<Recording[]>([])

  const load = useCallback(async () => {
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    if (!session.user || session.user.role !== 'patient') {
      router.replace('/patient/login')
      return
    }

    const [meRes, recordingsRes] = await Promise.all([
      fetch('/api/patient/me'),
      fetch('/api/patient/recordings'),
    ])
    if (!meRes.ok || !recordingsRes.ok) {
      router.replace('/patient/login')
      return
    }
    const me = await meRes.json()
    const rec = await recordingsRes.json()
    setClinic(me.clinic)
    setPatient(me.patient)
    setDoctor(me.doctor)
    setRecordings(rec.recordings)
    setLoading(false)
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  if (loading || !patient) {
    return (
      <div className="product-shell">
        <p className="loading-line">Loading your chart…</p>
      </div>
    )
  }

  const latest = recordings.find((r) => r.analysisStatus === 'complete' && r.result)

  return (
    <div className="product-shell">
      <header className="product-header">
        <div>
          <h1>
            {patient.firstName} {patient.lastName}
          </h1>
          <p>
            {patient.id}
            {clinic ? ` · ${clinic.name}` : ''}
          </p>
        </div>
        <div className="product-actions">
          <Link className="btn btn-primary" href="/patient/assessment">
            Start assessment
          </Link>
        </div>
      </header>

      <div className="metric-row">
        <div className="metric">
          <p className="metric__label">Clinician</p>
          <p className="metric__value" style={{ fontSize: '1.35rem' }}>
            {doctor ? `Dr. ${doctor.lastName}` : 'Assigned'}
          </p>
          <p className="metric__hint">{doctor?.title ?? 'Neurology'}</p>
        </div>
        <div className="metric">
          <p className="metric__label">Sessions</p>
          <p className="metric__value tabular">{recordings.length}</p>
          <p className="metric__hint">On file</p>
        </div>
        <div className="metric">
          <p className="metric__label">Last visit</p>
          <p className="metric__value" style={{ fontSize: '1.35rem' }}>
            {formatDate(patient.lastVisitAt)}
          </p>
          <p className="metric__hint">Speech protocol</p>
        </div>
        <div className="metric">
          <p className="metric__label">Latest score</p>
          <p className="metric__value" style={{ fontSize: '1.2rem' }}>
            {latest ? (
              <PredictionBadge prediction={latest.result?.prediction} />
            ) : (
              <span className="badge badge-muted">No score yet</span>
            )}
          </p>
          <p className="metric__hint">
            {latest?.result ? formatProbability(latest.result.probability) : 'Complete a session'}
          </p>
        </div>
      </div>

      <div className="two-col">
        <section className="panel">
          <div className="panel-head">
            <h2>Session history</h2>
          </div>
          {recordings.length === 0 ? (
            <p className="empty-state">No recordings yet. Start your first assessment.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {recordings.map((r) => (
                    <tr key={r.id}>
                      <td>{formatDateTime(r.createdAt)}</td>
                      <td className="tabular">{r.durationSec}s</td>
                      <td>
                        <AnalysisBadge status={r.analysisStatus} />
                      </td>
                      <td>
                        <div style={{ display: 'grid', gap: '0.25rem' }}>
                          <PredictionBadge prediction={r.result?.prediction} />
                          {r.result && (
                            <span className="tabular" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                              {formatProbability(r.result.probability)} · {r.result.confidence} confidence
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="side-note">
          <h3>Before your next session</h3>
          <ol>
            <li>Find a quiet room with stable internet.</li>
            <li>Read each passage at a natural speaking pace.</li>
            <li>Upload the recording when the script is finished.</li>
          </ol>
          <p>Results are screening signals for your care team, not a diagnosis.</p>
          <Link className="btn btn-secondary" href="/patient/assessment">
            Open assessment
          </Link>
        </aside>
      </div>
    </div>
  )
}
