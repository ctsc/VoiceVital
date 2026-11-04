import { redirect } from 'next/navigation'

export default function LegacyAssessmentRedirect() {
  redirect('/patient/assessment')
}
