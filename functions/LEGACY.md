# Legacy Firebase Cloud Functions

These callable functions powered the original GCP / Firebase deployment (`registerDoctor`, `createPatientStub`, `activatePatient`, `issueUploadToken`, `validateAudioMetadata`).

The Next.js app on Vercel **does not deploy or invoke** this package. Equivalent demo behavior lives in `app/api/*` with an in-memory store.

Kept in the repo as historical reference for the original secure clinic architecture.
