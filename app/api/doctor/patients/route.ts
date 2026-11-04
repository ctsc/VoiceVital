import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import {
  createPatientStub,
  getClinic,
  listPatientsForDoctor,
  publicPatient,
} from '@/lib/store'

export async function GET() {
  const user = await getSessionUser()
  if (!user || user.role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const patients = listPatientsForDoctor(user.id).map(publicPatient)
  return NextResponse.json({ clinic: getClinic(), patients })
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user || user.role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      firstName?: string
      lastName?: string
      dateOfBirth?: string
      sex?: 'female' | 'male' | 'other'
    }

    if (!body.firstName || !body.lastName || !body.dateOfBirth || !body.sex) {
      return NextResponse.json({ error: 'All patient fields are required.' }, { status: 400 })
    }

    const patient = createPatientStub({
      doctorId: user.id,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      sex: body.sex,
    })

    return NextResponse.json({ patient: publicPatient(patient) })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to create patient.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
