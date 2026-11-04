import type { AnalysisStatus, PredictionLabel } from '@/lib/types'

export function AnalysisBadge({ status }: { status: AnalysisStatus }) {
  if (status === 'complete') return <span className="badge badge-ok">Complete</span>
  if (status === 'failed') return <span className="badge badge-risk">Failed</span>
  return <span className="badge badge-pending">Pending review</span>
}

export function PredictionBadge({ prediction }: { prediction: PredictionLabel | null | undefined }) {
  if (!prediction) return <span className="badge badge-muted">Awaiting score</span>
  if (prediction === 'dementia') return <span className="badge badge-risk">Elevated risk</span>
  return <span className="badge badge-ok">Expected range</span>
}
