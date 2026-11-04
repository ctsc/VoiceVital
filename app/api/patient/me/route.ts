import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { getClinic, getDoctor, getPatient, publicDoctor, publicPatient } from '@/lib/store'

export async function GET() {
  const user = await getSessionUser()
  if (!user || user.role !== 'patient') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const patient = getPatient(user.id)
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
  }

  const doctor = getDoctor(patient.doctorId)
  return NextResponse.json({
    clinic: getClinic(),
    patient: publicPatient(patient),
    doctor: doctor ? publicDoctor(doctor) : null,
  })
}
