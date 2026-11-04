export type Role = 'doctor' | 'patient'

export type AnalysisStatus = 'pending' | 'complete' | 'failed'

export type PredictionLabel = 'dementia' | 'no_dementia'

export type Confidence = 'low' | 'medium' | 'high'

export interface Clinic {
  id: string
  name: string
  city: string
  state: string
}

export interface DoctorProfile {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  title: string
  clinicId: string
}

export interface PatientProfile {
  id: string
  email: string | null
  password: string | null
  firstName: string
  lastName: string
  dateOfBirth: string
  sex: 'female' | 'male' | 'other'
  status: 'pendingActivation' | 'active'
  clinicId: string
  doctorId: string
  enrolledAt: string
  lastVisitAt: string | null
}

export interface AnalysisResult {
  prediction: PredictionLabel
  probability: number
  confidence: Confidence
  message: string
}

export interface Recording {
  id: string
  patientId: string
  doctorId: string
  clinicId: string
  createdAt: string
  durationSec: number
  scriptId: string
  fileName: string
  analysisStatus: AnalysisStatus
  result: AnalysisResult | null
  notes: string | null
}

export interface SessionUser {
  role: Role
  id: string
  email: string
  firstName: string
  lastName: string
  clinicId: string
  doctorId?: string
  patientId?: string
}

export interface StoreSnapshot {
  clinic: Clinic
  doctors: DoctorProfile[]
  patients: PatientProfile[]
  recordings: Recording[]
}
