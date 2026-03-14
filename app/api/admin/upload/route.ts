import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { isValidAdminPassword } from "@/lib/admin-auth"
import { adminStorageBucket, isAdminStorageConfigured } from "@/lib/firebase/admin"

const MAX_FILE_SIZE = 10 * 1024 * 1024

function sanitizeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function getFolderName(folder: FormDataEntryValue | null) {
  if (folder === "music") {
    return "Music"
  }

  if (folder === "shop") {
    return "Shop"
  }

  if (folder === "about") {
    return "About"
  }

  return null
}

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password")
  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isAdminStorageConfigured || !adminStorageBucket) {
    return NextResponse.json({ error: "Firebase Storage is not configured." }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get("file")
  const folderName = getFolderName(formData.get("folder"))
  const entityIdValue = formData.get("entityId")
  const entityId = typeof entityIdValue === "string" ? entityIdValue : ""

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 })
  }

  if (!folderName) {
    return NextResponse.json({ error: "Upload folder is invalid." }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image must be 10MB or smaller." }, { status: 400 })
  }

  const sanitizedEntityId = sanitizeSegment(entityId || file.name.replace(/\.[^.]+$/, "")) || "asset"
  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : ""
  const objectPath = `britneychierra/${folderName}/${sanitizedEntityId}-${Date.now()}-${randomUUID()}${extension}`
  const downloadToken = randomUUID()

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadedFile = adminStorageBucket.file(objectPath)

    await uploadedFile.save(buffer, {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    })

    const url = `https://firebasestorage.googleapis.com/v0/b/${adminStorageBucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${downloadToken}`

    return NextResponse.json({ ok: true, path: objectPath, url })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
