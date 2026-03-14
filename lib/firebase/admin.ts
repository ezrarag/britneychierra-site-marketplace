import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

function normalizeMultiline(value?: string) {
  return value?.replace(/\\n/g, "\n")
}

function getAdminConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = normalizeMultiline(process.env.FIREBASE_PRIVATE_KEY)
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  return { projectId, clientEmail, privateKey, storageBucket }
}

const config = getAdminConfig()

const adminApp = config
  ? getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(config),
        storageBucket: config.storageBucket,
      })
  : null

export const adminDb = adminApp ? getFirestore(adminApp) : null
export const adminStorageBucket = adminApp && config?.storageBucket ? getStorage(adminApp).bucket(config.storageBucket) : null
export const isAdminFirebaseConfigured = Boolean(adminDb)
export const isAdminStorageConfigured = Boolean(adminStorageBucket)
