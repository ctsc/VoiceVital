import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { listRecordingsForPatient } from '@/lib/store'

export async function GET() {
  const user = await getSessionUser()
  if (!user || user.role !== 'patient') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const recordings = listRecordingsForPatient(user.id)
  return NextResponse.json({ recordings })
}
