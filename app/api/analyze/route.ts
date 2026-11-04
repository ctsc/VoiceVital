import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { addRecording, getPatient } from '@/lib/store'

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user || user.role !== 'patient') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    const notes = String(form.get('notes') ?? '') || null
    const scriptId = String(form.get('scriptId') ?? 'en-US')
    const durationSec = Number(form.get('durationSec') ?? 45)

    const patient = getPatient(user.id)
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const fileName =
      file instanceof File && file.name
        ? file.name
        : `assessment_${patient.id.toLowerCase()}_${Date.now()}.webm`

    // Simulated processing latency so the UI feels like a real pipeline
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const recording = addRecording({
      patientId: patient.id,
      doctorId: patient.doctorId,
      clinicId: patient.clinicId,
      durationSec: Number.isFinite(durationSec) ? durationSec : 45,
      scriptId,
      fileName,
      notes,
    })

    return NextResponse.json({ recording, result: recording.result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
