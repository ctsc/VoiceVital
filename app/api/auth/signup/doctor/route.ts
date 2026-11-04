import { NextResponse } from 'next/server'
import { setSession } from '@/lib/session'
import { publicDoctor, registerDoctor } from '@/lib/store'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      password?: string
      firstName?: string
      lastName?: string
      title?: string
    }

    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (body.password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const doctor = registerDoctor({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      title: body.title,
    })

    await setSession({ role: 'doctor', id: doctor.id })

    return NextResponse.json({
      user: {
        role: 'doctor',
        id: doctor.id,
        email: doctor.email,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        clinicId: doctor.clinicId,
        doctorId: doctor.id,
      },
      profile: publicDoctor(doctor),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to register.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
