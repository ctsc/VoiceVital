import { NextResponse } from 'next/server'
import { setSession } from '@/lib/session'
import { findUserByEmail, publicDoctor, publicPatient } from '@/lib/store'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      password?: string
      role?: 'doctor' | 'patient'
    }

    const email = body.email?.trim() ?? ''
    const password = body.password ?? ''
    const role = body.role

    if (!email || !password || (role !== 'doctor' && role !== 'patient')) {
      return NextResponse.json({ error: 'Email, password, and role are required.' }, { status: 400 })
    }

    const found = findUserByEmail(email)
    if (!found || found.role !== role) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    if (found.role === 'doctor') {
      if (found.doctor.password !== password) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
      }
      await setSession({ role: 'doctor', id: found.doctor.id })
      return NextResponse.json({
        user: {
          role: 'doctor',
          id: found.doctor.id,
          email: found.doctor.email,
          firstName: found.doctor.firstName,
          lastName: found.doctor.lastName,
          clinicId: found.doctor.clinicId,
          doctorId: found.doctor.id,
        },
        profile: publicDoctor(found.doctor),
      })
    }

    if (!found.patient.password || found.patient.password !== password || found.patient.status !== 'active') {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    await setSession({ role: 'patient', id: found.patient.id })
    return NextResponse.json({
      user: {
        role: 'patient',
        id: found.patient.id,
        email: found.patient.email,
        firstName: found.patient.firstName,
        lastName: found.patient.lastName,
        clinicId: found.patient.clinicId,
        doctorId: found.patient.doctorId,
        patientId: found.patient.id,
      },
      profile: publicPatient(found.patient),
    })
  } catch {
    return NextResponse.json({ error: 'Unable to sign in.' }, { status: 500 })
  }
}
