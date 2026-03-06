"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, ExternalLink, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { MusicTrack } from "@/lib/models"
import { useCart, formatUsd } from "@/components/cart-provider"

export default function MusicPage() {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const res = await fetch("/api/music", { cache: "no-store" })
        if (!res.ok) {
          throw new Error("Failed to load music")
        }
        const data = (await res.json()) as { tracks: MusicTrack[] }
        setTracks(data.tracks.filter((track) => track.active))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    void loadTracks()
  }, [])

  const featuredLinks = useMemo(() => {
    const firstTrack = tracks[0]
    return {
      spotify: firstTrack?.spotifyUrl,
      apple: firstTrack?.appleMusicUrl,
    }
  }, [tracks])

  const handlePlayPause = (trackId: string) => {
    if (currentTrack === trackId) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(trackId)
      setIsPlaying(true)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-[6vw] md:text-[8vw] lg:text-[10vw] font-black leading-[0.8] tracking-tighter mb-8">
              <span className="text-white">MUSICAL</span>
              <br />
              <span className="text-gray-500">JOURNEY.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
              From bedroom pop to electronic vibes, my music reflects experiences, dreams, and generational energy.
            </p>

            <div className="flex gap-6">
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-bold"
                disabled={!featuredLinks.spotify}
              >
                <a href={featuredLinks.spotify || "#"} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  SPOTIFY
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-bold"
                disabled={!featuredLinks.apple}
              >
                <a href={featuredLinks.apple || "#"} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  APPLE MUSIC
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-black tracking-wider mb-4">LATEST TRACKS</h2>
            {isLoading && <p className="text-gray-400 mb-8">Loading tracks...</p>}
            {error && <p className="text-red-400 mb-8">{error}</p>}

            <div className="space-y-6">
              {tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-transparent border-white/10 hover:border-white/30 transition-all duration-300 group">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <Image
                              src={track.imageUrl || "/placeholder.svg"}
                              alt={track.title}
                              width={80}
                              height={80}
                              className="rounded"
                            />
                            <Button
                              size="sm"
                              onClick={() => handlePlayPause(track.id)}
                              className="absolute inset-0 bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {currentTrack === track.id && isPlaying ? (
                                <Pause className="w-6 h-6" />
                              ) : (
                                <Play className="w-6 h-6" />
                              )}
                            </Button>
                          </div>

                          <div>
                            <h3 className="text-2xl font-bold tracking-wider mb-2">{track.title}</h3>
                            <div className="flex items-center gap-6 text-gray-400">
                              <span>{track.duration}</span>
                              <span>{Math.round(track.streams / 1000)}K STREAMS</span>
                              <span>{formatUsd(track.priceCents)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              addItem({
                                type: "music",
                                id: track.id,
                                title: track.title,
                                imageUrl: track.imageUrl,
                                unitPriceCents: track.priceCents,
                              })
                            }
                            className="bg-white text-black hover:bg-gray-200 px-4 py-3"
                            disabled={track.priceCents <= 0}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            ADD
                          </Button>
                          <Button
                            onClick={() => handlePlayPause(track.id)}
                            className="bg-white text-black hover:bg-gray-200 px-6 py-3"
                          >
                            {currentTrack === track.id && isPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
