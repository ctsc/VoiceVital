import { NextResponse } from 'next/server'
import { setSession } from '@/lib/session'
import { activatePatient, publicPatient } from '@/lib/store'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      patientId?: string
      email?: string
      password?: string
    }

    if (!body.patientId || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Patient ID, email, and password are required.' },
        { status: 400 },
      )
    }
    if (body.password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const patient = activatePatient({
      patientId: body.patientId.trim().toUpperCase(),
      email: body.email,
      password: body.password,
    })

    await setSession({ role: 'patient', id: patient.id })

    return NextResponse.json({
      user: {
        role: 'patient',
        id: patient.id,
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        clinicId: patient.clinicId,
        doctorId: patient.doctorId,
        patientId: patient.id,
      },
      profile: publicPatient(patient),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to activate account.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
