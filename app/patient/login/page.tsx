'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DEMO_PATIENT } from '@/lib/demoAccounts'

export default function PatientLoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function enterDemo() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: DEMO_PATIENT.email,
          password: DEMO_PATIENT.password,
          role: 'patient',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sign in failed')
      router.push('/patient/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <p className="hero__eyebrow" style={{ color: 'oklch(0.82 0.04 90)' }}>
          Patient portal
        </p>
        <h1>Complete your speech check-in from home or clinic.</h1>
        <p>Use the enrollment ID from your clinician if you are activating for the first time.</p>
      </aside>
      <div className="auth-panel">
        <div className="auth-card">
          <div>
            <h2>Patient demo</h2>
            <p className="meta">One click opens an active patient chart. No password entry.</p>
          </div>
          <div className="demo-creds">
            Signs in as <strong>{DEMO_PATIENT.label}</strong> ({DEMO_PATIENT.patientId}).
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" type="button" onClick={enterDemo} disabled={loading}>
            {loading ? 'Opening chart…' : 'Enter patient portal'}
          </button>
          <p className="auth-switch">
            Have a patient ID? <Link href="/patient/signup">Activate account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
