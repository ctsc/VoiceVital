'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { PredictionBadge } from '@/components/StatusBadge'
import { getAssessmentScript } from '@/lib/audioScripts'
import { formatProbability } from '@/lib/format'
import type { AnalysisResult, Recording } from '@/lib/types'

export default function PatientAssessmentPage() {
  const router = useRouter()
  const script = useMemo(() => getAssessmentScript('en-US'), [])
  const [ready, setReady] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [recording, setRecording] = useState<Recording | null>(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || data.user.role !== 'patient') {
          router.replace('/patient/login')
          return
        }
        setReady(true)
      })
      .catch(() => router.replace('/patient/login'))
  }, [router])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)
    setRecording(null)

    if (!file) {
      setError('Choose an audio file to continue.')
      return
    }

    setAnalyzing(true)
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('notes', notes)
      body.append('scriptId', script.locale)
      body.append('durationSec', String(Math.round(script.totalDurationMs / 1000)))

      const res = await fetch('/api/analyze', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data.result)
      setRecording(data.recording)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  if (!ready) {
    return (
      <div className="product-shell">
        <p className="loading-line">Preparing assessment…</p>
      </div>
    )
  }

  return (
    <div className="product-shell">
      <header className="product-header">
        <div>
          <h1>Speech assessment</h1>
          <p>Read the protocol aloud, then upload your recording for scoring.</p>
        </div>
        <div className="product-actions">
          <Link className="btn btn-secondary" href="/patient/dashboard">
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="assessment-layout">
        <section className="panel">
          <div className="panel-head">
            <h2>Reading script</h2>
            <span className="form-hint tabular">
              ~{Math.round(script.totalDurationMs / 1000)}s total
            </span>
          </div>
          <div className="script-list">
            {script.segments.map((segment, index) => (
              <article key={segment.id} className="script-item">
                <p className="script-item__meta">
                  Passage {index + 1} · {Math.round(segment.durationMs / 1000)}s
                </p>
                <p>{segment.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="upload-box">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', margin: 0 }}>
            Submit session
          </h2>
          <p className="form-hint">
            Accepts common audio formats. Scoring runs through the demo analysis pipeline.
          </p>
          <form onSubmit={onSubmit} className="form-grid">
            <div className="field">
              <label htmlFor="audio">Audio file</label>
              <input
                id="audio"
                type="file"
                accept="audio/*,.webm,.wav,.mp3,.m4a"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="field">
              <label htmlFor="notes">Session notes (optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Fatigue, interruptions, environment…"
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={analyzing}>
              {analyzing ? 'Analyzing speech…' : 'Upload and analyze'}
            </button>
          </form>

          {analyzing && (
            <p className="loading-line">Extracting biomarkers and scoring the session…</p>
          )}

          {result && recording && (
            <div className={`result-block ${result.prediction === 'dementia' ? 'risk' : 'ok'}`}>
              <PredictionBadge prediction={result.prediction} />
              <h3>
                {result.prediction === 'dementia'
                  ? 'Elevated cognitive-risk pattern'
                  : 'Within expected range'}
              </h3>
              <p>
                Probability {formatProbability(result.probability)} with {result.confidence}{' '}
                confidence.
              </p>
              <p>{result.message}</p>
              <p className="form-hint">Saved as {recording.fileName}</p>
              <Link className="btn btn-secondary" href="/patient/dashboard">
                View in history
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
