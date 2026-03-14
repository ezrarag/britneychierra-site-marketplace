import { adminDb, isAdminFirebaseConfigured } from "@/lib/firebase/admin"
import { AboutPageContent } from "@/lib/models"
import { seedAboutPageContent } from "@/lib/seed-data"

const SITE_CONTENT_COLLECTION = "siteContent"
const ABOUT_DOC_ID = "about"

export async function getAboutPageContent(): Promise<AboutPageContent> {
  if (!isAdminFirebaseConfigured || !adminDb) {
    return seedAboutPageContent
  }

  const snapshot = await adminDb.collection(SITE_CONTENT_COLLECTION).doc(ABOUT_DOC_ID).get()
  if (!snapshot.exists) {
    return seedAboutPageContent
  }

  return {
    ...seedAboutPageContent,
    ...(snapshot.data() as Partial<AboutPageContent>),
  }
}

export async function upsertAboutPageContent(content: AboutPageContent) {
  if (!isAdminFirebaseConfigured || !adminDb) {
    throw new Error("Firebase Admin is not configured.")
  }

  await adminDb.collection(SITE_CONTENT_COLLECTION).doc(ABOUT_DOC_ID).set(content, { merge: true })
}

export async function seedAboutPageIfEmpty() {
  if (!isAdminFirebaseConfigured || !adminDb) {
    throw new Error("Firebase Admin is not configured.")
  }

  const docRef = adminDb.collection(SITE_CONTENT_COLLECTION).doc(ABOUT_DOC_ID)
  const snapshot = await docRef.get()
  if (snapshot.exists) {
    return { seededAbout: false }
  }

  await docRef.set(seedAboutPageContent)
  return { seededAbout: true }
}
