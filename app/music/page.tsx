"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, ExternalLink } from "lucide-react"
import Image from "next/image"

const tracks = [
  {
    id: 1,
    title: "NEON DREAMS",
    duration: "3:24",
    image: "/placeholder.svg?height=300&width=300",
    streams: "45K",
  },
  {
    id: 2,
    title: "MIDNIGHT VIBES",
    duration: "2:58",
    image: "/placeholder.svg?height=300&width=300",
    streams: "32K",
  },
  {
    id: 3,
    title: "GOLDEN HOUR",
    duration: "4:12",
    image: "/placeholder.svg?height=300&width=300",
    streams: "67K",
  },
  {
    id: 4,
    title: "ELECTRIC SOUL",
    duration: "3:45",
    image: "/placeholder.svg?height=300&width=300",
    streams: "54K",
  },
]

export default function MusicPage() {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayPause = (trackId: number) => {
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
          {/* Header */}
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
              <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-bold">
                <ExternalLink className="w-5 h-5 mr-2" />
                SPOTIFY
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-bold"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                APPLE MUSIC
              </Button>
            </div>
          </motion.div>

          {/* Latest Tracks */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-black tracking-wider mb-12">LATEST TRACKS</h2>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <Image
                              src={track.image || "/placeholder.svg"}
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
                              <span>{track.streams} STREAMS</span>
                            </div>
                          </div>
                        </div>

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
