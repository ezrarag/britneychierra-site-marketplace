import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { isValidAdminPassword } from "@/lib/admin-auth"
import { getAboutPageContent, upsertAboutPageContent } from "@/lib/about-server"

const statSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
})

const timelineSchema = z.object({
  year: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
})

const serviceSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
})

const teamSchema = z.object({
  name: z.string().trim().min(1),
  role: z.string().trim().min(1),
  bio: z.string().trim().min(1),
  imageUrl: z.string().trim().min(1),
})

const aboutSchema = z.object({
  heroEyebrow: z.string().trim().min(1),
  heroTitle: z.string().trim().min(1),
  heroIntro: z.string().trim().min(1),
  heroQuote: z.string().trim().min(1),
  heroImageUrl: z.string().trim().min(1),
  missionTitle: z.string().trim().min(1),
  missionBody: z.string().trim().min(1),
  stats: z.array(statSchema).min(1),
  timeline: z.array(timelineSchema).min(1),
  services: z.array(serviceSchema).min(1),
  team: z.array(teamSchema).min(1),
  ctaTitle: z.string().trim().min(1),
  ctaBody: z.string().trim().min(1),
  ctaLabel: z.string().trim().min(1),
  ctaHref: z.string().trim().min(1),
})

export async function GET() {
  const content = await getAboutPageContent()
  return NextResponse.json(content)
}

export async function PUT(req: NextRequest) {
  if (!isValidAdminPassword(req.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = aboutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid about content payload." }, { status: 400 })
  }

  try {
    await upsertAboutPageContent(parsed.data)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
