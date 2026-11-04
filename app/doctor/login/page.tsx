'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DEMO_DOCTOR } from '@/lib/demoAccounts'

export default function DoctorLoginPage() {
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
          email: DEMO_DOCTOR.email,
          password: DEMO_DOCTOR.password,
          role: 'doctor',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Sign in failed')
      router.push('/doctor/dashboard')
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
          Clinician portal
        </p>
        <h1>Review speech sessions with the chart open.</h1>
        <p>Riverside Cognitive Care keeps enrollment and biomarker scores in one place.</p>
      </aside>
      <div className="auth-panel">
        <div className="auth-card">
          <div>
            <h2>Clinician demo</h2>
            <p className="meta">One click opens the seeded clinic roster. No password entry.</p>
          </div>
          <div className="demo-creds">
            Signs in as <strong>{DEMO_DOCTOR.label}</strong> at {DEMO_DOCTOR.clinic}.
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" type="button" onClick={enterDemo} disabled={loading}>
            {loading ? 'Opening clinic…' : 'Enter clinician portal'}
          </button>
          <p className="auth-switch">
            Want a fresh seat? <Link href="/doctor/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
