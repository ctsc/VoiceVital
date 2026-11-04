import { cookies } from 'next/headers'
import type { SessionUser } from './types'
import { getDoctor, getPatient } from './store'

export const SESSION_COOKIE = 'vv_session'

export interface SessionPayload {
  role: 'doctor' | 'patient'
  id: string
}

function encode(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
}

function decode(raw: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as SessionPayload
    if (parsed.role !== 'doctor' && parsed.role !== 'patient') return null
    if (typeof parsed.id !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

export async function setSession(payload: SessionPayload) {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, encode(payload), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSession() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

export async function readSessionPayload(): Promise<SessionPayload | null> {
  const jar = await cookies()
  const raw = jar.get(SESSION_COOKIE)?.value
  if (!raw) return null
  return decode(raw)
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const payload = await readSessionPayload()
  if (!payload) return null

  if (payload.role === 'doctor') {
    const doctor = getDoctor(payload.id)
    if (!doctor) return null
    return {
      role: 'doctor',
      id: doctor.id,
      email: doctor.email,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      clinicId: doctor.clinicId,
      doctorId: doctor.id,
    }
  }

  const patient = getPatient(payload.id)
  if (!patient || !patient.email || patient.status !== 'active') return null
  return {
    role: 'patient',
    id: patient.id,
    email: patient.email,
    firstName: patient.firstName,
    lastName: patient.lastName,
    clinicId: patient.clinicId,
    doctorId: patient.doctorId,
    patientId: patient.id,
  }
}

export function requireRole(user: SessionUser | null, role: 'doctor' | 'patient'): SessionUser {
  if (!user || user.role !== role) {
    throw new Error('Unauthorized')
  }
  return user
}
