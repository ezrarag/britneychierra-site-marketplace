import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function normalizeMultiline(value?: string) {
  return value?.replace(/\\n/g, "\n")
}

function getAdminConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = normalizeMultiline(process.env.FIREBASE_PRIVATE_KEY)

  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  return { projectId, clientEmail, privateKey }
}

const config = getAdminConfig()

const adminApp = config
  ? getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(config),
      })
  : null

export const adminDb = adminApp ? getFirestore(adminApp) : null
export const isAdminFirebaseConfigured = Boolean(adminDb)
