"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ExternalLink, Play, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { ShopItem } from "@/lib/models"
import { formatUsd, useCart } from "@/components/cart-provider"

const staticCategories = [
  { id: "all", label: "ALL LOOKS" },
  { id: "casual", label: "CASUAL" },
  { id: "glam", label: "GLAM" },
  { id: "streetwear", label: "STREET" },
  { id: "grwm", label: "GRWM" },
]

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [items, setItems] = useState<ShopItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await fetch("/api/shop", { cache: "no-store" })
        if (!res.ok) {
          throw new Error("Failed to load shop items")
        }
        const data = (await res.json()) as { items: ShopItem[] }
        setItems(data.items.filter((item) => item.active))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    void loadItems()
  }, [])

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(items.map((item) => item.category)))
    const dynamicEntries = dynamic
      .filter((category) => !staticCategories.some((entry) => entry.id === category))
      .map((category) => ({ id: category, label: category.toUpperCase() }))

    return [...staticCategories, ...dynamicEntries]
  }, [items])

  const filteredOutfits = items.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-[6vw] md:text-[8vw] lg:text-[10vw] font-black leading-[0.8] tracking-tighter mb-8">
              <span className="text-white">CURATED</span>
              <br />
              <span className="text-gray-500">LOOKS.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
              Every piece personally selected and styled. From everyday casual to glam night out.
            </p>

            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                placeholder="SEARCH LOOKS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-transparent border-white/20 text-white placeholder:text-gray-500 h-12 text-lg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex flex-wrap gap-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-xl font-bold tracking-wider transition-colors ${
                    selectedCategory === category.id ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>

          {isLoading && <p className="text-gray-400 mb-8">Loading shop items...</p>}
          {error && <p className="text-red-400 mb-8">{error}</p>}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredOutfits.map((outfit, index) => (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-transparent border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300 group">
                  <div className="relative">
                    <Image
                      src={outfit.imageUrl || "/placeholder.svg"}
                      alt={outfit.title}
                      width={300}
                      height={400}
                      className="w-full h-80 object-cover"
                    />
                    {outfit.isGrwm && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button asChild className="bg-white text-black hover:bg-gray-200">
                          <a href={outfit.videoUrl || "#"} target="_blank" rel="noreferrer">
                            <Play className="w-5 h-5 mr-2" />
                            WATCH
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold tracking-wider mb-4">{outfit.title}</h3>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl font-bold">{outfit.isGrwm ? "WATCH NOW" : formatUsd(outfit.priceCents)}</span>
                      {outfit.isGrwm ? (
                        <Button asChild className="bg-white text-black hover:bg-gray-200">
                          <a href={outfit.videoUrl || "#"} target="_blank" rel="noreferrer">
                            WATCH
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            addItem({
                              type: "shop",
                              id: outfit.id,
                              title: outfit.title,
                              imageUrl: outfit.imageUrl,
                              unitPriceCents: outfit.priceCents,
                            })
                          }
                          className="bg-white text-black hover:bg-gray-200"
                          disabled={outfit.priceCents <= 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          ADD
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
