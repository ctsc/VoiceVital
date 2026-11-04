import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { getPatient, listRecordingsForDoctor } from '@/lib/store'

export async function GET() {
  const user = await getSessionUser()
  if (!user || user.role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const recordings = listRecordingsForDoctor(user.id).map((r) => {
    const patient = getPatient(r.patientId)
    return {
      ...r,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : r.patientId,
    }
  })

  return NextResponse.json({ recordings })
}
