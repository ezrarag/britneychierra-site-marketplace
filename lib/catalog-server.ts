import { adminDb, isAdminFirebaseConfigured } from "@/lib/firebase/admin"
import { MusicTrack, ShopItem } from "@/lib/models"
import { seedMusicTracks, seedShopItems } from "@/lib/seed-data"

const MUSIC_COLLECTION = "music"
const SHOP_COLLECTION = "shop"

export async function listMusicTracks(): Promise<MusicTrack[]> {
  if (!isAdminFirebaseConfigured || !adminDb) {
    return seedMusicTracks
  }
  const db = adminDb

  const snapshot = await db.collection(MUSIC_COLLECTION).get()
  if (snapshot.empty) {
    return []
  }

  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<MusicTrack, "id">) }))
}

export async function listShopItems(): Promise<ShopItem[]> {
  if (!isAdminFirebaseConfigured || !adminDb) {
    return seedShopItems
  }
  const db = adminDb

  const snapshot = await db.collection(SHOP_COLLECTION).get()
  if (snapshot.empty) {
    return []
  }

  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<ShopItem, "id">) }))
}

export async function upsertMusicTrack(track: MusicTrack) {
  if (!isAdminFirebaseConfigured || !adminDb) {
    throw new Error("Firebase Admin is not configured.")
  }
  const db = adminDb

  const { id, ...payload } = track
  await db.collection(MUSIC_COLLECTION).doc(id).set(payload, { merge: true })
}

export async function upsertShopItem(item: ShopItem) {
  if (!isAdminFirebaseConfigured || !adminDb) {
    throw new Error("Firebase Admin is not configured.")
  }
  const db = adminDb

  const { id, ...payload } = item
  await db.collection(SHOP_COLLECTION).doc(id).set(payload, { merge: true })
}

export async function deleteMusicTrack(id: string) {
  if (!isAdminFirebaseConfigured || !adminDb) {
    throw new Error("Firebase Admin is not configured.")
  }
  const db = adminDb
  await db.collection(MUSIC_COLLECTION).doc(id).delete()
}

export async function deleteShopItem(id: string) {
  if (!isAdminFirebaseConfigured || !adminDb) {
    throw new Error("Firebase Admin is not configured.")
  }
  const db = adminDb
  await db.collection(SHOP_COLLECTION).doc(id).delete()
}

export async function seedCatalogIfEmpty() {
  if (!isAdminFirebaseConfigured || !adminDb) {
    throw new Error("Firebase Admin is not configured.")
  }
  const db = adminDb

  const [musicSnapshot, shopSnapshot] = await Promise.all([
    db.collection(MUSIC_COLLECTION).get(),
    db.collection(SHOP_COLLECTION).get(),
  ])

  if (musicSnapshot.empty) {
    await Promise.all(
      seedMusicTracks.map(async ({ id, ...payload }) => {
        await db.collection(MUSIC_COLLECTION).doc(id).set(payload, { merge: true })
      }),
    )
  }

  if (shopSnapshot.empty) {
    await Promise.all(
      seedShopItems.map(async ({ id, ...payload }) => {
        await db.collection(SHOP_COLLECTION).doc(id).set(payload, { merge: true })
      }),
    )
  }

  return {
    seededMusic: musicSnapshot.empty ? seedMusicTracks.length : 0,
    seededShop: shopSnapshot.empty ? seedShopItems.length : 0,
  }
}
