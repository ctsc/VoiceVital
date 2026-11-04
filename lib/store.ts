import type {
  AnalysisResult,
  Clinic,
  DoctorProfile,
  PatientProfile,
  Recording,
  StoreSnapshot,
} from './types'

const GLOBAL_KEY = '__voicevital_store__'

interface Store {
  clinic: Clinic
  doctors: Map<string, DoctorProfile>
  patients: Map<string, PatientProfile>
  recordings: Map<string, Recording>
  emailIndex: Map<string, { role: 'doctor' | 'patient'; id: string }>
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(9 + (n % 5), 15 + (n % 3) * 10, 0, 0)
  return d.toISOString()
}

function result(
  prediction: AnalysisResult['prediction'],
  probability: number,
  confidence: AnalysisResult['confidence'],
): AnalysisResult {
  const message =
    prediction === 'dementia'
      ? 'Voice biomarkers suggest elevated cognitive-risk patterns. Recommend clinical follow-up.'
      : 'Voice biomarkers fall within expected ranges for this protocol. Continue routine monitoring.'
  return { prediction, probability, confidence, message }
}

function buildSeed(): Store {
  const clinic: Clinic = {
    id: 'clinic_riverside',
    name: 'Riverside Cognitive Care',
    city: 'Chicago',
    state: 'IL',
  }

  const doctor: DoctorProfile = {
    id: 'doc_elena',
    email: 'elena.okonkwo@riversidecc.health',
    password: 'ClinicDemo2024!',
    firstName: 'Elena',
    lastName: 'Okonkwo',
    title: 'MD, Behavioral Neurology',
    clinicId: clinic.id,
  }

  const patients: PatientProfile[] = [
    {
      id: 'PT-4821',
      email: 'margaret.chen@email.com',
      password: 'PatientDemo2024!',
      firstName: 'Margaret',
      lastName: 'Chen',
      dateOfBirth: '1948-03-14',
      sex: 'female',
      status: 'active',
      clinicId: clinic.id,
      doctorId: doctor.id,
      enrolledAt: daysAgo(180),
      lastVisitAt: daysAgo(3),
    },
    {
      id: 'PT-4903',
      email: 'james.whitfield@email.com',
      password: 'PatientDemo2024!',
      firstName: 'James',
      lastName: 'Whitfield',
      dateOfBirth: '1952-11-02',
      sex: 'male',
      status: 'active',
      clinicId: clinic.id,
      doctorId: doctor.id,
      enrolledAt: daysAgo(140),
      lastVisitAt: daysAgo(8),
    },
    {
      id: 'PT-5017',
      email: 'rosa.delgado@email.com',
      password: 'PatientDemo2024!',
      firstName: 'Rosa',
      lastName: 'Delgado',
      dateOfBirth: '1957-07-22',
      sex: 'female',
      status: 'active',
      clinicId: clinic.id,
      doctorId: doctor.id,
      enrolledAt: daysAgo(95),
      lastVisitAt: daysAgo(1),
    },
    {
      id: 'PT-5122',
      email: 'harold.nguyen@email.com',
      password: 'PatientDemo2024!',
      firstName: 'Harold',
      lastName: 'Nguyen',
      dateOfBirth: '1944-01-30',
      sex: 'male',
      status: 'active',
      clinicId: clinic.id,
      doctorId: doctor.id,
      enrolledAt: daysAgo(210),
      lastVisitAt: daysAgo(12),
    },
    {
      id: 'PT-5288',
      email: 'aisha.patel@email.com',
      password: 'PatientDemo2024!',
      firstName: 'Aisha',
      lastName: 'Patel',
      dateOfBirth: '1961-09-08',
      sex: 'female',
      status: 'active',
      clinicId: clinic.id,
      doctorId: doctor.id,
      enrolledAt: daysAgo(60),
      lastVisitAt: daysAgo(5),
    },
    {
      id: 'PT-5340',
      email: null,
      password: null,
      firstName: 'Robert',
      lastName: 'Kessler',
      dateOfBirth: '1949-05-19',
      sex: 'male',
      status: 'pendingActivation',
      clinicId: clinic.id,
      doctorId: doctor.id,
      enrolledAt: daysAgo(2),
      lastVisitAt: null,
    },
    {
      id: 'PT-5411',
      email: 'linda.morales@email.com',
      password: 'PatientDemo2024!',
      firstName: 'Linda',
      lastName: 'Morales',
      dateOfBirth: '1955-12-11',
      sex: 'female',
      status: 'active',
      clinicId: clinic.id,
      doctorId: doctor.id,
      enrolledAt: daysAgo(75),
      lastVisitAt: daysAgo(6),
    },
    {
      id: 'PT-5499',
      email: null,
      password: null,
      firstName: 'Thomas',
      lastName: 'Brooks',
      dateOfBirth: '1946-08-27',
      sex: 'male',
      status: 'pendingActivation',
      clinicId: clinic.id,
      doctorId: doctor.id,
      enrolledAt: daysAgo(1),
      lastVisitAt: null,
    },
  ]

  const recordings: Recording[] = [
    {
      id: 'rec_1001',
      patientId: 'PT-4821',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(3),
      durationSec: 47,
      scriptId: 'en-US',
      fileName: 'chen_session_nov.webm',
      analysisStatus: 'complete',
      result: result('no_dementia', 0.18, 'high'),
      notes: 'Steady pacing; minor fatigue at close.',
    },
    {
      id: 'rec_1002',
      patientId: 'PT-4821',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(31),
      durationSec: 44,
      scriptId: 'en-US',
      fileName: 'chen_session_oct.webm',
      analysisStatus: 'complete',
      result: result('no_dementia', 0.22, 'high'),
      notes: null,
    },
    {
      id: 'rec_1003',
      patientId: 'PT-4903',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(8),
      durationSec: 51,
      scriptId: 'en-US',
      fileName: 'whitfield_followup.webm',
      analysisStatus: 'complete',
      result: result('dementia', 0.71, 'medium'),
      notes: 'Increased pause density vs prior visit.',
    },
    {
      id: 'rec_1004',
      patientId: 'PT-4903',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(45),
      durationSec: 49,
      scriptId: 'en-US',
      fileName: 'whitfield_baseline.webm',
      analysisStatus: 'complete',
      result: result('dementia', 0.58, 'medium'),
      notes: null,
    },
    {
      id: 'rec_1005',
      patientId: 'PT-5017',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(1),
      durationSec: 46,
      scriptId: 'en-US',
      fileName: 'delgado_weekly.webm',
      analysisStatus: 'complete',
      result: result('no_dementia', 0.14, 'high'),
      notes: null,
    },
    {
      id: 'rec_1006',
      patientId: 'PT-5017',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(15),
      durationSec: 48,
      scriptId: 'en-US',
      fileName: 'delgado_prior.webm',
      analysisStatus: 'complete',
      result: result('no_dementia', 0.19, 'high'),
      notes: null,
    },
    {
      id: 'rec_1007',
      patientId: 'PT-5122',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(12),
      durationSec: 53,
      scriptId: 'en-US',
      fileName: 'nguyen_quarterly.webm',
      analysisStatus: 'complete',
      result: result('dementia', 0.79, 'high'),
      notes: 'Prosodic variability reduced; refer to full battery.',
    },
    {
      id: 'rec_1008',
      patientId: 'PT-5122',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(90),
      durationSec: 50,
      scriptId: 'en-US',
      fileName: 'nguyen_summer.webm',
      analysisStatus: 'complete',
      result: result('dementia', 0.64, 'medium'),
      notes: null,
    },
    {
      id: 'rec_1009',
      patientId: 'PT-5288',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(5),
      durationSec: 45,
      scriptId: 'en-US',
      fileName: 'patel_intake.webm',
      analysisStatus: 'complete',
      result: result('no_dementia', 0.27, 'medium'),
      notes: 'First protocol completion.',
    },
    {
      id: 'rec_1010',
      patientId: 'PT-5411',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(6),
      durationSec: 47,
      scriptId: 'en-US',
      fileName: 'morales_checkin.webm',
      analysisStatus: 'complete',
      result: result('no_dementia', 0.31, 'medium'),
      notes: null,
    },
    {
      id: 'rec_1011',
      patientId: 'PT-5411',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(40),
      durationSec: 42,
      scriptId: 'en-US',
      fileName: 'morales_sept.webm',
      analysisStatus: 'complete',
      result: result('no_dementia', 0.24, 'high'),
      notes: null,
    },
    {
      id: 'rec_1012',
      patientId: 'PT-4903',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(2),
      durationSec: 38,
      scriptId: 'en-US',
      fileName: 'whitfield_partial.webm',
      analysisStatus: 'pending',
      result: null,
      notes: 'Session interrupted; awaiting re-upload.',
    },
    {
      id: 'rec_1013',
      patientId: 'PT-5288',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(20),
      durationSec: 44,
      scriptId: 'en-US',
      fileName: 'patel_practice.webm',
      analysisStatus: 'complete',
      result: result('no_dementia', 0.21, 'high'),
      notes: null,
    },
    {
      id: 'rec_1014',
      patientId: 'PT-4821',
      doctorId: doctor.id,
      clinicId: clinic.id,
      createdAt: daysAgo(70),
      durationSec: 46,
      scriptId: 'en-US',
      fileName: 'chen_august.webm',
      analysisStatus: 'complete',
      result: result('no_dementia', 0.16, 'high'),
      notes: null,
    },
  ]

  const store: Store = {
    clinic,
    doctors: new Map([[doctor.id, doctor]]),
    patients: new Map(patients.map((p) => [p.id, p])),
    recordings: new Map(recordings.map((r) => [r.id, r])),
    emailIndex: new Map(),
  }

  store.emailIndex.set(doctor.email.toLowerCase(), { role: 'doctor', id: doctor.id })
  for (const p of patients) {
    if (p.email) {
      store.emailIndex.set(p.email.toLowerCase(), { role: 'patient', id: p.id })
    }
  }

  return store
}

function getStore(): Store {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: Store }
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = buildSeed()
  }
  return g[GLOBAL_KEY]
}

export function getClinic(): Clinic {
  return getStore().clinic
}

export function findUserByEmail(email: string) {
  const store = getStore()
  const entry = store.emailIndex.get(email.toLowerCase())
  if (!entry) return null
  if (entry.role === 'doctor') {
    const doctor = store.doctors.get(entry.id)
    return doctor ? ({ role: 'doctor' as const, doctor }) : null
  }
  const patient = store.patients.get(entry.id)
  return patient ? ({ role: 'patient' as const, patient }) : null
}

export function getDoctor(id: string) {
  return getStore().doctors.get(id) ?? null
}

export function getPatient(id: string) {
  return getStore().patients.get(id) ?? null
}

export function listPatientsForDoctor(doctorId: string): PatientProfile[] {
  return [...getStore().patients.values()]
    .filter((p) => p.doctorId === doctorId)
    .sort((a, b) => a.lastName.localeCompare(b.lastName))
}

export function listRecordingsForDoctor(doctorId: string): Recording[] {
  return [...getStore().recordings.values()]
    .filter((r) => r.doctorId === doctorId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function listRecordingsForPatient(patientId: string): Recording[] {
  return [...getStore().recordings.values()]
    .filter((r) => r.patientId === patientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function registerDoctor(input: {
  email: string
  password: string
  firstName: string
  lastName: string
  title?: string
}): DoctorProfile {
  const store = getStore()
  const email = input.email.toLowerCase().trim()
  if (store.emailIndex.has(email)) {
    throw new Error('An account with that email already exists.')
  }
  const id = `doc_${Date.now().toString(36)}`
  const doctor: DoctorProfile = {
    id,
    email,
    password: input.password,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    title: input.title?.trim() || 'MD',
    clinicId: store.clinic.id,
  }
  store.doctors.set(id, doctor)
  store.emailIndex.set(email, { role: 'doctor', id })
  return doctor
}

export function createPatientStub(input: {
  doctorId: string
  firstName: string
  lastName: string
  dateOfBirth: string
  sex: PatientProfile['sex']
}): PatientProfile {
  const store = getStore()
  const doctor = store.doctors.get(input.doctorId)
  if (!doctor) throw new Error('Doctor not found.')
  const seq = 5500 + store.patients.size
  const id = `PT-${seq}`
  const patient: PatientProfile = {
    id,
    email: null,
    password: null,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    dateOfBirth: input.dateOfBirth,
    sex: input.sex,
    status: 'pendingActivation',
    clinicId: doctor.clinicId,
    doctorId: doctor.id,
    enrolledAt: new Date().toISOString(),
    lastVisitAt: null,
  }
  store.patients.set(id, patient)
  return patient
}

export function activatePatient(input: {
  patientId: string
  email: string
  password: string
}): PatientProfile {
  const store = getStore()
  const patient = store.patients.get(input.patientId)
  if (!patient) throw new Error('Patient ID not found. Ask your clinician for the enrollment code.')
  if (patient.status === 'active' && patient.email) {
    throw new Error('This patient profile is already activated.')
  }
  const email = input.email.toLowerCase().trim()
  if (store.emailIndex.has(email)) {
    throw new Error('An account with that email already exists.')
  }
  patient.email = email
  patient.password = input.password
  patient.status = 'active'
  store.emailIndex.set(email, { role: 'patient', id: patient.id })
  return patient
}

export function hashString(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function simulateAnalysis(seedKey: string): AnalysisResult {
  const h = hashString(seedKey)
  const risk = (h % 100) / 100
  if (risk > 0.62) {
    const probability = 0.55 + (h % 35) / 100
    const confidence = probability > 0.75 ? 'high' : 'medium'
    return result('dementia', Math.min(0.92, probability), confidence)
  }
  const probability = 0.08 + (h % 28) / 100
  const confidence = probability < 0.2 ? 'high' : 'medium'
  return result('no_dementia', probability, confidence)
}

export function addRecording(input: {
  patientId: string
  doctorId: string
  clinicId: string
  durationSec: number
  scriptId: string
  fileName: string
  notes?: string | null
}): Recording {
  const store = getStore()
  const patient = store.patients.get(input.patientId)
  if (!patient) throw new Error('Patient not found.')

  const analysis = simulateAnalysis(`${input.fileName}:${input.patientId}:${Date.now()}`)
  const id = `rec_${Date.now().toString(36)}`
  const recording: Recording = {
    id,
    patientId: input.patientId,
    doctorId: input.doctorId,
    clinicId: input.clinicId,
    createdAt: new Date().toISOString(),
    durationSec: input.durationSec,
    scriptId: input.scriptId,
    fileName: input.fileName,
    analysisStatus: 'complete',
    result: analysis,
    notes: input.notes ?? null,
  }
  store.recordings.set(id, recording)
  patient.lastVisitAt = recording.createdAt
  return recording
}

export function publicPatient(p: PatientProfile) {
  const { password: _pw, ...rest } = p
  return rest
}

export function publicDoctor(d: DoctorProfile) {
  const { password: _pw, ...rest } = d
  return rest
}

export function snapshot(): StoreSnapshot {
  const store = getStore()
  return {
    clinic: store.clinic,
    doctors: [...store.doctors.values()].map((d) => ({ ...d, password: '***' })),
    patients: [...store.patients.values()].map((p) => ({
      ...p,
      password: p.password ? '***' : null,
    })),
    recordings: [...store.recordings.values()],
  }
}
