import { NextRequest, NextResponse } from "next/server"
import { deleteShopItem, listShopItems, upsertShopItem } from "@/lib/catalog-server"
import { isValidAdminPassword } from "@/lib/admin-auth"
import { ShopItem } from "@/lib/models"

function isAuthorized(req: NextRequest) {
  return isValidAdminPassword(req.headers.get("x-admin-password"))
}

export async function GET() {
  const items = await listShopItems()
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await req.json()) as ShopItem
  await upsertShopItem(body)
  return NextResponse.json({ ok: true })
}

export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await req.json()) as ShopItem
  await upsertShopItem(body)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = req.nextUrl.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  await deleteShopItem(id)
  return NextResponse.json({ ok: true })
}
