import { promises as fs } from "fs"
import path from "path"
import type { AdminChangePriority, AdminChangeRequest } from "@/lib/models"

const DATA_DIR = path.join(process.cwd(), "data")
const REQUESTS_FILE = path.join(DATA_DIR, "admin-change-requests.json")

type CreateAdminChangeRequestInput = {
  title: string
  description: string
  priority: AdminChangePriority
}

async function ensureRequestsFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(REQUESTS_FILE)
  } catch {
    await fs.writeFile(REQUESTS_FILE, "[]", "utf8")
  }
}

export async function listAdminChangeRequests(): Promise<AdminChangeRequest[]> {
  await ensureRequestsFile()
  const file = await fs.readFile(REQUESTS_FILE, "utf8")
  const parsed = JSON.parse(file)

  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed as AdminChangeRequest[]
}

export async function createAdminChangeRequest(
  input: CreateAdminChangeRequestInput
): Promise<AdminChangeRequest> {
  const request: AdminChangeRequest = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    priority: input.priority,
    createdAt: new Date().toISOString(),
  }

  const existing = await listAdminChangeRequests()
  const updated = [request, ...existing]
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(updated, null, 2), "utf8")

  return request
}
