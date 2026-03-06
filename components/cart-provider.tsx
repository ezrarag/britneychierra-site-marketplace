"use client"

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import { CartItem } from "@/lib/models"

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotalCents: number
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (type: CartItem["type"], id: string) => void
  updateQuantity: (type: CartItem["type"], id: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const CART_STORAGE_KEY = "bc_cart_v1"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return
    }

    try {
      setItems(JSON.parse(raw))
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
      subtotalCents: items.reduce((acc, item) => acc + item.quantity * item.unitPriceCents, 0),
      addItem: (item, quantity = 1) => {
        setItems((prev) => {
          const existing = prev.find((entry) => entry.type === item.type && entry.id === item.id)
          if (existing) {
            return prev.map((entry) =>
              entry.type === item.type && entry.id === item.id
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry,
            )
          }

          return [...prev, { ...item, quantity }]
        })
      },
      removeItem: (type, id) => {
        setItems((prev) => prev.filter((item) => !(item.type === type && item.id === id)))
      },
      updateQuantity: (type, id, quantity) => {
        if (quantity <= 0) {
          setItems((prev) => prev.filter((item) => !(item.type === type && item.id === id)))
          return
        }

        setItems((prev) =>
          prev.map((item) => (item.type === type && item.id === id ? { ...item, quantity } : item)),
        )
      },
      clear: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }

  return context
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}
