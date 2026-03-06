"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MusicTrack, ShopItem } from "@/lib/models"
import { formatUsd } from "@/components/cart-provider"

const ADMIN_PASSWORD_KEY = "bc_admin_password"

const defaultMusicForm: MusicTrack = {
  id: "",
  title: "",
  duration: "3:00",
  imageUrl: "/placeholder.svg?height=300&width=300",
  streams: 0,
  spotifyUrl: "",
  appleMusicUrl: "",
  priceCents: 129,
  active: true,
}

const defaultShopForm: ShopItem = {
  id: "",
  title: "",
  category: "casual",
  priceCents: 0,
  imageUrl: "/placeholder.svg?height=400&width=300",
  isGrwm: false,
  affiliateUrl: "",
  videoUrl: "",
  active: true,
}

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [music, setMusic] = useState<MusicTrack[]>([])
  const [shop, setShop] = useState<ShopItem[]>([])
  const [musicForm, setMusicForm] = useState<MusicTrack>(defaultMusicForm)
  const [shopForm, setShopForm] = useState<ShopItem>(defaultShopForm)
  const [message, setMessage] = useState<string | null>(null)

  const isAuthed = Boolean(adminPassword)

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-password": adminPassword,
    }),
    [adminPassword],
  )

  useEffect(() => {
    const stored = window.localStorage.getItem(ADMIN_PASSWORD_KEY)
    if (stored) {
      setAdminPassword(stored)
    }
  }, [])

  const loadData = async () => {
    const [musicRes, shopRes] = await Promise.all([fetch("/api/music", { cache: "no-store" }), fetch("/api/shop")])
    const musicData = (await musicRes.json()) as { tracks: MusicTrack[] }
    const shopData = (await shopRes.json()) as { items: ShopItem[] }
    setMusic(musicData.tracks)
    setShop(shopData.items)
  }

  useEffect(() => {
    void loadData()
  }, [])

  const signIn = () => {
    if (!passwordInput) {
      return
    }

    setAdminPassword(passwordInput)
    window.localStorage.setItem(ADMIN_PASSWORD_KEY, passwordInput)
    setMessage("Password set for this browser. If APIs reject, verify it matches server password.")
  }

  const signOut = () => {
    setAdminPassword("")
    setPasswordInput("")
    window.localStorage.removeItem(ADMIN_PASSWORD_KEY)
  }

  const saveMusic = async (event: FormEvent) => {
    event.preventDefault()
    const res = await fetch("/api/music", {
      method: music.some((track) => track.id === musicForm.id) ? "PUT" : "POST",
      headers: authHeaders,
      body: JSON.stringify(musicForm),
    })

    if (!res.ok) {
      setMessage("Failed to save music entry")
      return
    }

    setMessage("Music entry saved")
    setMusicForm(defaultMusicForm)
    await loadData()
  }

  const saveShop = async (event: FormEvent) => {
    event.preventDefault()
    const res = await fetch("/api/shop", {
      method: shop.some((item) => item.id === shopForm.id) ? "PUT" : "POST",
      headers: authHeaders,
      body: JSON.stringify(shopForm),
    })

    if (!res.ok) {
      setMessage("Failed to save shop entry")
      return
    }

    setMessage("Shop entry saved")
    setShopForm(defaultShopForm)
    await loadData()
  }

  const deleteMusic = async (id: string) => {
    const res = await fetch(`/api/music?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        "x-admin-password": adminPassword,
      },
    })

    if (!res.ok) {
      setMessage("Failed to delete music entry")
      return
    }

    await loadData()
  }

  const deleteShop = async (id: string) => {
    const res = await fetch(`/api/shop?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        "x-admin-password": adminPassword,
      },
    })

    if (!res.ok) {
      setMessage("Failed to delete shop entry")
      return
    }

    await loadData()
  }

  const seedFromDefaults = async () => {
    const res = await fetch("/api/admin/seed", {
      method: "POST",
      headers: {
        "x-admin-password": adminPassword,
      },
    })

    const data = (await res.json()) as { error?: string; result?: { seededMusic: number; seededShop: number } }

    if (!res.ok) {
      setMessage(data.error || "Seed failed")
      return
    }

    setMessage(`Seed complete. Added ${data.result?.seededMusic ?? 0} music / ${data.result?.seededShop ?? 0} shop`)
    await loadData()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">ADMIN DASHBOARD</h1>

          {!isAuthed ? (
            <Card className="bg-transparent border-white/10 max-w-md">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-400 text-sm">Default password: temp123</p>
                <Input
                  type="password"
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                  className="bg-transparent border-white/20"
                  placeholder="Enter admin password"
                />
                <Button className="bg-white text-black" onClick={signIn}>
                  Enter Admin
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-white/20" onClick={seedFromDefaults}>
                  Seed Firestore from current defaults
                </Button>
                <Button variant="outline" className="border-white/20" onClick={signOut}>
                  Sign out
                </Button>
              </div>

              {message && <p className="text-gray-300">{message}</p>}

              <Tabs defaultValue="music" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="music">Music</TabsTrigger>
                  <TabsTrigger value="shop">Shop</TabsTrigger>
                </TabsList>

                <TabsContent value="music" className="space-y-5">
                  <Card className="bg-transparent border-white/10">
                    <CardHeader>
                      <CardTitle>Add / Edit Music</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="grid gap-3 md:grid-cols-2" onSubmit={saveMusic}>
                        <Input
                          placeholder="id (example: neon-dreams)"
                          value={musicForm.id}
                          onChange={(event) => setMusicForm((prev) => ({ ...prev, id: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="title"
                          value={musicForm.title}
                          onChange={(event) => setMusicForm((prev) => ({ ...prev, title: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="duration"
                          value={musicForm.duration}
                          onChange={(event) => setMusicForm((prev) => ({ ...prev, duration: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          type="number"
                          placeholder="streams"
                          value={musicForm.streams}
                          onChange={(event) => setMusicForm((prev) => ({ ...prev, streams: Number(event.target.value) || 0 }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          type="number"
                          placeholder="price cents"
                          value={musicForm.priceCents}
                          onChange={(event) =>
                            setMusicForm((prev) => ({ ...prev, priceCents: Number(event.target.value) || 0 }))
                          }
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="image url"
                          value={musicForm.imageUrl}
                          onChange={(event) => setMusicForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="spotify url"
                          value={musicForm.spotifyUrl}
                          onChange={(event) => setMusicForm((prev) => ({ ...prev, spotifyUrl: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="apple music url"
                          value={musicForm.appleMusicUrl}
                          onChange={(event) => setMusicForm((prev) => ({ ...prev, appleMusicUrl: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Button type="submit" className="bg-white text-black md:col-span-2">
                          Save Music Entry
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <div className="grid gap-3">
                    {music.map((track) => (
                      <Card key={track.id} className="bg-transparent border-white/10">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{track.title}</p>
                            <p className="text-sm text-gray-400">
                              {track.id} | {track.duration} | {formatUsd(track.priceCents)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="border-white/20" onClick={() => setMusicForm(track)}>
                              Edit
                            </Button>
                            <Button variant="outline" className="border-white/20" onClick={() => deleteMusic(track.id)}>
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="shop" className="space-y-5">
                  <Card className="bg-transparent border-white/10">
                    <CardHeader>
                      <CardTitle>Add / Edit Shop</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="grid gap-3 md:grid-cols-2" onSubmit={saveShop}>
                        <Input
                          placeholder="id"
                          value={shopForm.id}
                          onChange={(event) => setShopForm((prev) => ({ ...prev, id: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="title"
                          value={shopForm.title}
                          onChange={(event) => setShopForm((prev) => ({ ...prev, title: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="category"
                          value={shopForm.category}
                          onChange={(event) => setShopForm((prev) => ({ ...prev, category: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          type="number"
                          placeholder="price cents"
                          value={shopForm.priceCents}
                          onChange={(event) => setShopForm((prev) => ({ ...prev, priceCents: Number(event.target.value) || 0 }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="image url"
                          value={shopForm.imageUrl}
                          onChange={(event) => setShopForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="affiliate url"
                          value={shopForm.affiliateUrl}
                          onChange={(event) => setShopForm((prev) => ({ ...prev, affiliateUrl: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <Input
                          placeholder="video url"
                          value={shopForm.videoUrl}
                          onChange={(event) => setShopForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
                          className="bg-transparent border-white/20"
                        />
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <input
                            type="checkbox"
                            checked={shopForm.isGrwm}
                            onChange={(event) => setShopForm((prev) => ({ ...prev, isGrwm: event.target.checked }))}
                          />
                          GRWM / Watch Item
                        </label>
                        <Button type="submit" className="bg-white text-black md:col-span-2">
                          Save Shop Entry
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <div className="grid gap-3">
                    {shop.map((item) => (
                      <Card key={item.id} className="bg-transparent border-white/10">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-gray-400">
                              {item.id} | {item.category} | {item.isGrwm ? "WATCH" : formatUsd(item.priceCents)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="border-white/20" onClick={() => setShopForm(item)}>
                              Edit
                            </Button>
                            <Button variant="outline" className="border-white/20" onClick={() => deleteShop(item.id)}>
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
