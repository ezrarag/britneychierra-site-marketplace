import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { listMusicTracks, listShopItems } from "@/lib/catalog-server"
import { CartItem } from "@/lib/models"

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return new Stripe(secretKey, { apiVersion: "2025-08-27.basil" })
}

export async function POST(req: NextRequest) {
  try {
    const { items } = (await req.json()) as { items: CartItem[] }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const [music, shop] = await Promise.all([listMusicTracks(), listShopItems()])

    const musicMap = new Map(music.map((item) => [item.id, item]))
    const shopMap = new Map(shop.map((item) => [item.id, item]))

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    for (const item of items) {
      const source = item.type === "music" ? musicMap.get(item.id) : shopMap.get(item.id)
      if (!source) {
        continue
      }

      const unitAmount = source.priceCents
      if (unitAmount <= 0) {
        continue
      }

      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: source.title,
            images: source.imageUrl?.startsWith("http") ? [source.imageUrl] : undefined,
            metadata: {
              type: item.type,
              id: source.id,
            },
          },
        },
      })
    }

    if (!lineItems.length) {
      return NextResponse.json({ error: "No purchasable items in cart" }, { status: 400 })
    }

    const stripe = getStripeClient()
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const connectAccountId = process.env.STRIPE_CONNECT_ACCOUNT_ID

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/cart?status=success`,
      cancel_url: `${origin}/cart?status=cancelled`,
      payment_intent_data: connectAccountId
        ? {
            transfer_data: {
              destination: connectAccountId,
            },
          }
        : undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
