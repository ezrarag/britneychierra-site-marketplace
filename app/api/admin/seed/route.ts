import { NextRequest, NextResponse } from "next/server"
import { isValidAdminPassword } from "@/lib/admin-auth"
import { seedCatalogIfEmpty } from "@/lib/catalog-server"
import { seedAboutPageIfEmpty } from "@/lib/about-server"

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password")
  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [catalogResult, aboutResult] = await Promise.all([seedCatalogIfEmpty(), seedAboutPageIfEmpty()])
    const result = {
      ...catalogResult,
      ...aboutResult,
    }
    return NextResponse.json({ ok: true, result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
