'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { SessionUser } from '@/lib/types'

export default function SiteNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setUser(data.user ?? null)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
    return () => {
      cancelled = true
    }
  }, [pathname])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const hideMarketingLinks = pathname.startsWith('/doctor/dashboard') || pathname.startsWith('/patient/')

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link href="/" className="brand">
          Voice<span>Vital</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {!hideMarketingLinks && (
            <>
              <Link className="nav-link" href="/tech-stack">
                Tech stack
              </Link>
              <Link className="nav-link" href="/doctor/login">
                Clinician
              </Link>
              <Link className="nav-link" href="/patient/login">
                Patient
              </Link>
            </>
          )}
          {user?.role === 'doctor' && (
            <Link className="nav-link" href="/doctor/dashboard">
              Dashboard
            </Link>
          )}
          {user?.role === 'patient' && (
            <>
              <Link className="nav-link" href="/patient/dashboard">
                Dashboard
              </Link>
              <Link className="btn btn-primary" href="/patient/assessment">
                Assessment
              </Link>
            </>
          )}
          {user ? (
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Sign out
            </button>
          ) : (
            <Link className="btn btn-primary" href="/doctor/login">
              Open clinic
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
