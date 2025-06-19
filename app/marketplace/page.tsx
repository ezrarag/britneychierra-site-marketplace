"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ExternalLink, Play } from "lucide-react"
import Image from "next/image"

const outfitCategories = [
  { id: "all", label: "ALL LOOKS" },
  { id: "casual", label: "CASUAL" },
  { id: "glam", label: "GLAM" },
  { id: "streetwear", label: "STREET" },
  { id: "grwm", label: "GRWM" },
]

const featuredOutfits = [
  {
    id: 1,
    title: "PINK PARADISE SET",
    category: "glam",
    price: "$45.99",
    image: "/placeholder.svg?height=400&width=300",
    isGRWM: false,
  },
  {
    id: 2,
    title: "STREETWEAR SUNDAY",
    category: "grwm",
    price: "WATCH NOW",
    image: "/placeholder.svg?height=400&width=300",
    isGRWM: true,
  },
  {
    id: 3,
    title: "NEON DREAMS CROP",
    category: "casual",
    price: "$32.99",
    image: "/placeholder.svg?height=400&width=300",
    isGRWM: false,
  },
  {
    id: 4,
    title: "DATE NIGHT GLAM",
    category: "grwm",
    price: "WATCH NOW",
    image: "/placeholder.svg?height=400&width=300",
    isGRWM: true,
  },
]

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOutfits = featuredOutfits.filter((outfit) => {
    const matchesCategory = selectedCategory === "all" || outfit.category === selectedCategory
    const matchesSearch = outfit.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-[6vw] md:text-[8vw] lg:text-[10vw] font-black leading-[0.8] tracking-tighter mb-8">
              <span className="text-white">CURATED</span>
              <br />
              <span className="text-gray-500">LOOKS.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
              Every piece personally selected and styled. From everyday casual to glam night out.
            </p>

            {/* Search */}
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

          {/* Category Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex flex-wrap gap-8">
              {outfitCategories.map((category) => (
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

          {/* Outfit Grid */}
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
                      src={outfit.image || "/placeholder.svg"}
                      alt={outfit.title}
                      width={300}
                      height={400}
                      className="w-full h-80 object-cover"
                    />
                    {outfit.isGRWM && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button className="bg-white text-black hover:bg-gray-200">
                          <Play className="w-5 h-5 mr-2" />
                          WATCH
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold tracking-wider mb-4">{outfit.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{outfit.price}</span>
                      <Button className="bg-white text-black hover:bg-gray-200">
                        {outfit.isGRWM ? "WATCH" : "SHOP"}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
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
