"use client"

import Image from "next/image"
import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatUsd, useCart } from "@/components/cart-provider"

export default function CartPage() {
  return (
    <Suspense fallback={<CartPageInner isSearchReady={false} />}>
      <CartPageWithSearch />
    </Suspense>
  )
}

function CartPageWithSearch() {
  const searchParams = useSearchParams()
  return <CartPageInner isSearchReady status={searchParams.get("status")} />
}

function CartPageInner({ isSearchReady, status }: { isSearchReady: boolean; status?: string | null }) {
  const { items, subtotalCents, updateQuantity, removeItem, clear } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const statusMessage = useMemo(() => {
    if (!isSearchReady) {
      return null
    }
    if (status === "success") {
      return "Checkout complete. Thank you for your order."
    }
    if (status === "cancelled") {
      return "Checkout cancelled. Your cart is unchanged."
    }
    return null
  }, [isSearchReady, status])

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      const data = (await res.json()) as { url?: string; error?: string }

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to start checkout")
      }

      window.location.href = data.url
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed")
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-10">CART</h1>

          {statusMessage && <p className="mb-6 text-gray-300">{statusMessage}</p>}

          {items.length === 0 ? (
            <Card className="bg-transparent border-white/10">
              <CardContent className="p-8 text-gray-400">Your cart is empty.</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={`${item.type}-${item.id}`} className="bg-transparent border-white/10">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="rounded"
                      />
                      <div className="min-w-0">
                        <p className="text-sm uppercase text-gray-500">{item.type}</p>
                        <p className="font-semibold truncate">{item.title}</p>
                        <p className="text-gray-400">{formatUsd(item.unitPriceCents)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="border-white/30"
                        onClick={() => updateQuantity(item.type, item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        className="border-white/30"
                        onClick={() => updateQuantity(item.type, item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button variant="outline" className="border-white/30" onClick={() => removeItem(item.type, item.id)}>
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
                <p className="text-xl font-semibold">Subtotal</p>
                <p className="text-2xl font-black">{formatUsd(subtotalCents)}</p>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <Button onClick={handleCheckout} disabled={isCheckingOut || items.length === 0} className="bg-white text-black">
                  {isCheckingOut ? "Redirecting..." : "Checkout with Stripe"}
                </Button>
                <Button variant="outline" className="border-white/30" onClick={clear}>
                  Clear cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
