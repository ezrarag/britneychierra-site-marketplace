import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  createAdminChangeRequest,
  listAdminChangeRequests,
} from "@/lib/admin-change-requests"
import { sendSlackAdminChangeRequestNotification } from "@/lib/slack"

const createRequestSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(10).max(4000),
  priority: z.enum(["low", "medium", "high"]),
})

export async function GET() {
  try {
    const requests = await listAdminChangeRequests()
    return NextResponse.json(requests)
  } catch (error) {
    console.error("Failed to load admin change requests:", error)
    return NextResponse.json(
      { error: "Failed to load admin change requests." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a title, description, and priority." },
        { status: 400 }
      )
    }

    const created = await createAdminChangeRequest(parsed.data)

    try {
      await sendSlackAdminChangeRequestNotification(created)
    } catch (error) {
      console.error("Slack notification failed for admin change request:", error)
    }

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Failed to create admin change request:", error)
    return NextResponse.json(
      { error: "Failed to create admin change request." },
      { status: 500 }
    )
  }
}
