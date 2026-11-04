'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function PatientSignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    patientId: 'PT-5340',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Activation failed')
      router.push('/patient/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Activation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <p className="hero__eyebrow" style={{ color: 'oklch(0.82 0.04 90)' }}>
          Activate enrollment
        </p>
        <h1>Link your clinician-issued patient ID.</h1>
        <p>Pending IDs in the demo roster include PT-5340 and PT-5499.</p>
      </aside>
      <div className="auth-panel">
        <div className="auth-card">
          <div>
            <h2>Activate patient account</h2>
            <p className="meta">Requires an enrollment ID from your clinician</p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="patientId">Patient ID</label>
              <input
                id="patientId"
                value={form.patientId}
                onChange={(e) => update('patientId', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                minLength={8}
                required
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Activating…' : 'Activate account'}
            </button>
          </form>
          <p className="auth-switch">
            Already activated? <Link href="/patient/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
