# Legacy Firebase / GCP notes

Original production used:

- `firebase.json` — hosting, functions, emulators
- `firestore.rules` / `firestore.indexes.json`
- `storage.rules`
- `.firebaserc`
- `functions/` — Cloud Functions
- `scripts/seedDemoData.js` — Admin SDK seed (requires Google credentials)

None of these are required to run the current Next.js demo. See the root README for the migration story.
