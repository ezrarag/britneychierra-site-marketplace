"use client"

import { useEffect, useState } from "react"
import { AboutPageContent, AboutServiceItem, AboutStat, AboutTeamMember, AboutTimelineItem } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type AdminAboutEditorProps = {
  adminPassword: string
  onMessage: (message: string) => void
}

const emptyStat = (): AboutStat => ({ value: "", label: "" })
const emptyTimeline = (): AboutTimelineItem => ({ year: "", title: "", description: "" })
const emptyService = (): AboutServiceItem => ({ title: "", description: "" })
const emptyTeamMember = (): AboutTeamMember => ({ name: "", role: "", bio: "", imageUrl: "" })

const initialAboutState: AboutPageContent = {
  heroEyebrow: "",
  heroTitle: "",
  heroIntro: "",
  heroQuote: "",
  heroImageUrl: "",
  missionTitle: "",
  missionBody: "",
  stats: [emptyStat()],
  timeline: [emptyTimeline()],
  services: [emptyService()],
  team: [emptyTeamMember()],
  ctaTitle: "",
  ctaBody: "",
  ctaLabel: "",
  ctaHref: "",
}

export function AdminAboutEditor({ adminPassword, onMessage }: AdminAboutEditorProps) {
  const [content, setContent] = useState<AboutPageContent>(initialAboutState)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false)
  const [heroUploadFile, setHeroUploadFile] = useState<File | null>(null)
  const [heroUploadInputKey, setHeroUploadInputKey] = useState(0)

  useEffect(() => {
    async function loadAbout() {
      setIsLoading(true)
      try {
        const res = await fetch("/api/about", { cache: "no-store" })
        const data = (await res.json()) as AboutPageContent
        setContent(data)
      } catch (error) {
        onMessage(error instanceof Error ? error.message : "Failed to load About page content")
      } finally {
        setIsLoading(false)
      }
    }

    void loadAbout()
  }, [onMessage])

  async function uploadHeroImage() {
    if (!heroUploadFile) {
      onMessage("Choose a hero image before uploading")
      return
    }

    setIsUploadingHeroImage(true)

    try {
      const formData = new FormData()
      formData.append("file", heroUploadFile)
      formData.append("folder", "about")
      formData.append("entityId", "about-hero")

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-password": adminPassword,
        },
        body: formData,
      })

      const data = (await res.json()) as { error?: string; url?: string }
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Hero image upload failed")
      }

      setContent((current) => ({ ...current, heroImageUrl: data.url! }))
      setHeroUploadFile(null)
      setHeroUploadInputKey((current) => current + 1)
      onMessage("Hero image uploaded")
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Hero image upload failed")
    } finally {
      setIsUploadingHeroImage(false)
    }
  }

  function updateStat(index: number, field: keyof AboutStat, value: string) {
    setContent((current) => ({
      ...current,
      stats: current.stats.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }))
  }

  function updateTimeline(index: number, field: keyof AboutTimelineItem, value: string) {
    setContent((current) => ({
      ...current,
      timeline: current.timeline.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  function updateService(index: number, field: keyof AboutServiceItem, value: string) {
    setContent((current) => ({
      ...current,
      services: current.services.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  function updateTeamMember(index: number, field: keyof AboutTeamMember, value: string) {
    setContent((current) => ({
      ...current,
      team: current.team.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }))
  }

  async function saveAbout() {
    setIsSaving(true)
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify(content),
      })

      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error || "Failed to save About page")
      }

      onMessage("About page saved")
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Failed to save About page")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <p className="text-gray-400">Loading About page content...</p>
  }

  return (
    <div className="space-y-5">
      <Card className="bg-transparent border-white/10">
        <CardHeader>
          <CardTitle>Hero</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="eyebrow"
            value={content.heroEyebrow}
            onChange={(event) => setContent((current) => ({ ...current, heroEyebrow: event.target.value }))}
            className="bg-transparent border-white/20"
          />
          <Input
            placeholder="hero image url"
            value={content.heroImageUrl}
            onChange={(event) => setContent((current) => ({ ...current, heroImageUrl: event.target.value }))}
            className="bg-transparent border-white/20"
          />
          <Textarea
            placeholder="hero title"
            value={content.heroTitle}
            onChange={(event) => setContent((current) => ({ ...current, heroTitle: event.target.value }))}
            className="bg-transparent border-white/20 md:col-span-2"
          />
          <Textarea
            placeholder="hero intro"
            value={content.heroIntro}
            onChange={(event) => setContent((current) => ({ ...current, heroIntro: event.target.value }))}
            className="bg-transparent border-white/20 md:col-span-2"
          />
          <Textarea
            placeholder="hero quote"
            value={content.heroQuote}
            onChange={(event) => setContent((current) => ({ ...current, heroQuote: event.target.value }))}
            className="bg-transparent border-white/20 md:col-span-2"
          />
          <div className="md:col-span-2 rounded-lg border border-white/10 p-3 space-y-3">
            <p className="text-sm text-gray-300">Upload About hero image to Firebase Storage</p>
            <div className="flex flex-col gap-2 md:flex-row">
              <Input
                key={heroUploadInputKey}
                type="file"
                accept="image/*"
                onChange={(event) => setHeroUploadFile(event.target.files?.[0] ?? null)}
                className="bg-transparent border-white/20"
              />
              <Button
                type="button"
                variant="outline"
                className="border-white/20"
                onClick={uploadHeroImage}
                disabled={!adminPassword || !heroUploadFile || isUploadingHeroImage}
              >
                {isUploadingHeroImage ? "Uploading..." : "Upload Hero Image"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Uploads to `britneychierra/About` and fills the hero image URL.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-transparent border-white/10">
        <CardHeader>
          <CardTitle>Mission + Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="mission title"
            value={content.missionTitle}
            onChange={(event) => setContent((current) => ({ ...current, missionTitle: event.target.value }))}
            className="bg-transparent border-white/20"
          />
          <Textarea
            placeholder="mission body"
            value={content.missionBody}
            onChange={(event) => setContent((current) => ({ ...current, missionBody: event.target.value }))}
            className="bg-transparent border-white/20"
          />

          <div className="space-y-3">
            {content.stats.map((stat, index) => (
              <div key={`stat-${index}`} className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
                <Input
                  placeholder="value"
                  value={stat.value}
                  onChange={(event) => updateStat(index, "value", event.target.value)}
                  className="bg-transparent border-white/20"
                />
                <Input
                  placeholder="label"
                  value={stat.label}
                  onChange={(event) => updateStat(index, "label", event.target.value)}
                  className="bg-transparent border-white/20"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20"
                  onClick={() =>
                    setContent((current) => ({
                      ...current,
                      stats: current.stats.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                  disabled={content.stats.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="border-white/20"
              onClick={() => setContent((current) => ({ ...current, stats: [...current.stats, emptyStat()] }))}
            >
              Add Stat
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-transparent border-white/10">
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.timeline.map((item, index) => (
            <div key={`timeline-${index}`} className="space-y-3 rounded-lg border border-white/10 p-4">
              <div className="grid gap-3 md:grid-cols-[180px_1fr]">
                <Input
                  placeholder="year"
                  value={item.year}
                  onChange={(event) => updateTimeline(index, "year", event.target.value)}
                  className="bg-transparent border-white/20"
                />
                <Input
                  placeholder="title"
                  value={item.title}
                  onChange={(event) => updateTimeline(index, "title", event.target.value)}
                  className="bg-transparent border-white/20"
                />
              </div>
              <Textarea
                placeholder="description"
                value={item.description}
                onChange={(event) => updateTimeline(index, "description", event.target.value)}
                className="bg-transparent border-white/20"
              />
              <Button
                type="button"
                variant="outline"
                className="border-white/20"
                onClick={() =>
                  setContent((current) => ({
                    ...current,
                    timeline: current.timeline.filter((_, itemIndex) => itemIndex !== index),
                  }))
                }
                disabled={content.timeline.length === 1}
              >
                Remove Timeline Item
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="border-white/20"
            onClick={() => setContent((current) => ({ ...current, timeline: [...current.timeline, emptyTimeline()] }))}
          >
            Add Timeline Item
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-transparent border-white/10">
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.services.map((item, index) => (
            <div key={`service-${index}`} className="space-y-3 rounded-lg border border-white/10 p-4">
              <Input
                placeholder="title"
                value={item.title}
                onChange={(event) => updateService(index, "title", event.target.value)}
                className="bg-transparent border-white/20"
              />
              <Textarea
                placeholder="description"
                value={item.description}
                onChange={(event) => updateService(index, "description", event.target.value)}
                className="bg-transparent border-white/20"
              />
              <Button
                type="button"
                variant="outline"
                className="border-white/20"
                onClick={() =>
                  setContent((current) => ({
                    ...current,
                    services: current.services.filter((_, itemIndex) => itemIndex !== index),
                  }))
                }
                disabled={content.services.length === 1}
              >
                Remove Service
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="border-white/20"
            onClick={() => setContent((current) => ({ ...current, services: [...current.services, emptyService()] }))}
          >
            Add Service
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-transparent border-white/10">
        <CardHeader>
          <CardTitle>Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.team.map((member, index) => (
            <div key={`team-${index}`} className="space-y-3 rounded-lg border border-white/10 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="name"
                  value={member.name}
                  onChange={(event) => updateTeamMember(index, "name", event.target.value)}
                  className="bg-transparent border-white/20"
                />
                <Input
                  placeholder="role"
                  value={member.role}
                  onChange={(event) => updateTeamMember(index, "role", event.target.value)}
                  className="bg-transparent border-white/20"
                />
              </div>
              <Input
                placeholder="image url"
                value={member.imageUrl}
                onChange={(event) => updateTeamMember(index, "imageUrl", event.target.value)}
                className="bg-transparent border-white/20"
              />
              <Textarea
                placeholder="bio"
                value={member.bio}
                onChange={(event) => updateTeamMember(index, "bio", event.target.value)}
                className="bg-transparent border-white/20"
              />
              <Button
                type="button"
                variant="outline"
                className="border-white/20"
                onClick={() =>
                  setContent((current) => ({
                    ...current,
                    team: current.team.filter((_, itemIndex) => itemIndex !== index),
                  }))
                }
                disabled={content.team.length === 1}
              >
                Remove Team Member
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="border-white/20"
            onClick={() => setContent((current) => ({ ...current, team: [...current.team, emptyTeamMember()] }))}
          >
            Add Team Member
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-transparent border-white/10">
        <CardHeader>
          <CardTitle>Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="cta title"
            value={content.ctaTitle}
            onChange={(event) => setContent((current) => ({ ...current, ctaTitle: event.target.value }))}
            className="bg-transparent border-white/20 md:col-span-2"
          />
          <Textarea
            placeholder="cta body"
            value={content.ctaBody}
            onChange={(event) => setContent((current) => ({ ...current, ctaBody: event.target.value }))}
            className="bg-transparent border-white/20 md:col-span-2"
          />
          <Input
            placeholder="cta label"
            value={content.ctaLabel}
            onChange={(event) => setContent((current) => ({ ...current, ctaLabel: event.target.value }))}
            className="bg-transparent border-white/20"
          />
          <Input
            placeholder="cta href"
            value={content.ctaHref}
            onChange={(event) => setContent((current) => ({ ...current, ctaHref: event.target.value }))}
            className="bg-transparent border-white/20"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" className="bg-white text-black" onClick={saveAbout} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save About Page"}
        </Button>
      </div>
    </div>
  )
}
