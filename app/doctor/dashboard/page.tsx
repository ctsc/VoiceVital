'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnalysisBadge, PredictionBadge } from '@/components/StatusBadge'
import { ageFromDob, formatDate, formatDateTime, formatProbability } from '@/lib/format'
import type { Clinic, PatientProfile, Recording } from '@/lib/types'

type RecordingRow = Recording & { patientName: string }

export default function DoctorDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [doctorName, setDoctorName] = useState('')
  const [patients, setPatients] = useState<Omit<PatientProfile, 'password'>[]>([])
  const [recordings, setRecordings] = useState<RecordingRow[]>([])
  const [error, setError] = useState('')
  const [createdId, setCreatedId] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '1950-01-15',
    sex: 'female' as 'female' | 'male' | 'other',
  })
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setError('')
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    if (!session.user || session.user.role !== 'doctor') {
      router.replace('/doctor/login')
      return
    }
    setDoctorName(`Dr. ${session.user.firstName} ${session.user.lastName}`)
    setClinic(session.clinic)

    const [patientsRes, recordingsRes] = await Promise.all([
      fetch('/api/doctor/patients'),
      fetch('/api/doctor/recordings'),
    ])
    if (!patientsRes.ok || !recordingsRes.ok) {
      setError('Unable to load clinic data.')
      setLoading(false)
      return
    }
    const patientsData = await patientsRes.json()
    const recordingsData = await recordingsRes.json()
    setPatients(patientsData.patients)
    setRecordings(recordingsData.recordings)
    setLoading(false)
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    const active = patients.filter((p) => p.status === 'active').length
    const pending = patients.filter((p) => p.status === 'pendingActivation').length
    const elevated = recordings.filter((r) => r.result?.prediction === 'dementia').length
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const recent = recordings.filter((r) => new Date(r.createdAt).getTime() >= weekAgo).length
    return { active, pending, elevated, recent }
  }, [patients, recordings])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreatedId('')
    setError('')
    try {
      const res = await fetch('/api/doctor/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not enroll patient')
      setCreatedId(data.patient.id)
      setForm({ firstName: '', lastName: '', dateOfBirth: '1950-01-15', sex: 'female' })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not enroll patient')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="product-shell">
        <p className="loading-line">Loading clinic roster…</p>
      </div>
    )
  }

  return (
    <div className="product-shell">
      <header className="product-header">
        <div>
          <h1>{clinic?.name ?? 'Clinic'}</h1>
          <p>
            {doctorName}
            {clinic ? ` · ${clinic.city}, ${clinic.state}` : ''}
          </p>
        </div>
      </header>

      <div className="metric-row">
        <div className="metric">
          <p className="metric__label">Active patients</p>
          <p className="metric__value tabular">{stats.active}</p>
          <p className="metric__hint">{stats.pending} awaiting activation</p>
        </div>
        <div className="metric">
          <p className="metric__label">Sessions (7d)</p>
          <p className="metric__value tabular">{stats.recent}</p>
          <p className="metric__hint">Completed or pending review</p>
        </div>
        <div className="metric">
          <p className="metric__label">Elevated flags</p>
          <p className="metric__value tabular">{stats.elevated}</p>
          <p className="metric__hint">Across scored recordings</p>
        </div>
        <div className="metric">
          <p className="metric__label">Roster size</p>
          <p className="metric__value tabular">{patients.length}</p>
          <p className="metric__hint">Including pending IDs</p>
        </div>
      </div>

      <div className="two-col">
        <section className="panel">
          <div className="panel-head">
            <h2>Patients</h2>
          </div>
          {patients.length === 0 ? (
            <p className="empty-state">No patients enrolled yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Age</th>
                    <th>Status</th>
                    <th>Last visit</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {p.lastName}, {p.firstName}
                      </td>
                      <td className="tabular">{p.id}</td>
                      <td className="tabular">{ageFromDob(p.dateOfBirth)}</td>
                      <td>
                        {p.status === 'active' ? (
                          <span className="badge badge-ok">Active</span>
                        ) : (
                          <span className="badge badge-pending">Pending</span>
                        )}
                      </td>
                      <td>{formatDate(p.lastVisitAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="enroll-form">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: 0 }}>
            Enroll patient
          </h2>
          <p className="form-hint">Creates a pending ID the patient uses to activate.</p>
          <form onSubmit={onCreate} className="form-grid">
            <div className="form-grid two">
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="dob">Date of birth</label>
              <input
                id="dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="sex">Sex</label>
              <select
                id="sex"
                value={form.sex}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sex: e.target.value as typeof form.sex }))
                }
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            {error && <p className="form-error">{error}</p>}
            {createdId && (
              <p className="form-hint">
                Enrollment created. Share patient ID <strong>{createdId}</strong> for activation.
              </p>
            )}
            <button className="btn btn-primary" type="submit" disabled={creating}>
              {creating ? 'Creating…' : 'Create patient ID'}
            </button>
          </form>
        </aside>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Recent recordings</h2>
        </div>
        {recordings.length === 0 ? (
          <p className="empty-state">No recordings yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Patient</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {recordings.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDateTime(r.createdAt)}</td>
                    <td>{r.patientName}</td>
                    <td className="tabular">{r.durationSec}s</td>
                    <td>
                      <AnalysisBadge status={r.analysisStatus} />
                    </td>
                    <td>
                      <div style={{ display: 'grid', gap: '0.25rem' }}>
                        <PredictionBadge prediction={r.result?.prediction} />
                        {r.result && (
                          <span className="tabular" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                            {formatProbability(r.result.probability)} · {r.result.confidence}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ maxWidth: '16rem', color: 'var(--ink-soft)' }}>{r.notes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
