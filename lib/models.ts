export type CatalogItemType = "music" | "shop"

export interface MusicTrack {
  id: string
  title: string
  duration: string
  imageUrl: string
  streams: number
  spotifyUrl?: string
  appleMusicUrl?: string
  priceCents: number
  active: boolean
}

export interface ShopItem {
  id: string
  title: string
  category: string
  priceCents: number
  imageUrl: string
  isGrwm: boolean
  affiliateUrl?: string
  videoUrl?: string
  active: boolean
}

export interface CartItem {
  type: CatalogItemType
  id: string
  title: string
  imageUrl: string
  unitPriceCents: number
  quantity: number
}

export type AdminChangePriority = "low" | "medium" | "high"

export interface AdminChangeRequest {
  id: string
  title: string
  description: string
  priority: AdminChangePriority
  createdAt: string
}

export interface AboutStat {
  value: string
  label: string
}

export interface AboutTimelineItem {
  year: string
  title: string
  description: string
}

export interface AboutServiceItem {
  title: string
  description: string
}

export interface AboutTeamMember {
  name: string
  role: string
  bio: string
  imageUrl: string
}

export interface AboutPageContent {
  heroEyebrow: string
  heroTitle: string
  heroIntro: string
  heroQuote: string
  heroImageUrl: string
  missionTitle: string
  missionBody: string
  stats: AboutStat[]
  timeline: AboutTimelineItem[]
  services: AboutServiceItem[]
  team: AboutTeamMember[]
  ctaTitle: string
  ctaBody: string
  ctaLabel: string
  ctaHref: string
}
