import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { getClinic, getDoctor, getPatient, publicDoctor, publicPatient } from '@/lib/store'

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ user: null })
  }

  const clinic = getClinic()

  if (user.role === 'doctor') {
    const doctor = getDoctor(user.id)
    return NextResponse.json({
      user,
      clinic,
      profile: doctor ? publicDoctor(doctor) : null,
    })
  }

  const patient = getPatient(user.id)
  const doctor = patient ? getDoctor(patient.doctorId) : null
  return NextResponse.json({
    user,
    clinic,
    profile: patient ? publicPatient(patient) : null,
    doctor: doctor ? publicDoctor(doctor) : null,
  })
}
