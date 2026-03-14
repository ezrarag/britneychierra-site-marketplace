import { AboutPageContent, MusicTrack, ShopItem } from "@/lib/models"

export const seedMusicTracks: MusicTrack[] = [
  {
    id: "neon-dreams",
    title: "NEON DREAMS",
    duration: "3:24",
    imageUrl: "/placeholder.svg?height=300&width=300",
    streams: 45000,
    spotifyUrl: "https://spotify.com/track/neon-dreams",
    appleMusicUrl: "https://music.apple.com/track/neon-dreams",
    priceCents: 129,
    active: true,
  },
  {
    id: "midnight-vibes",
    title: "MIDNIGHT VIBES",
    duration: "2:58",
    imageUrl: "/placeholder.svg?height=300&width=300",
    streams: 32000,
    spotifyUrl: "https://spotify.com/track/midnight-vibes",
    appleMusicUrl: "https://music.apple.com/track/midnight-vibes",
    priceCents: 129,
    active: true,
  },
  {
    id: "golden-hour",
    title: "GOLDEN HOUR",
    duration: "4:12",
    imageUrl: "/placeholder.svg?height=300&width=300",
    streams: 67000,
    spotifyUrl: "https://spotify.com/track/golden-hour",
    appleMusicUrl: "https://music.apple.com/track/golden-hour",
    priceCents: 129,
    active: true,
  },
  {
    id: "electric-soul",
    title: "ELECTRIC SOUL",
    duration: "3:45",
    imageUrl: "/placeholder.svg?height=300&width=300",
    streams: 54000,
    spotifyUrl: "https://spotify.com/track/electric-soul",
    appleMusicUrl: "https://music.apple.com/track/electric-soul",
    priceCents: 129,
    active: true,
  },
]

export const seedShopItems: ShopItem[] = [
  {
    id: "pink-paradise-set",
    title: "PINK PARADISE SET",
    category: "glam",
    priceCents: 4599,
    imageUrl: "/placeholder.svg?height=400&width=300",
    isGrwm: false,
    active: true,
  },
  {
    id: "streetwear-sunday",
    title: "STREETWEAR SUNDAY",
    category: "grwm",
    priceCents: 0,
    imageUrl: "/placeholder.svg?height=400&width=300",
    isGrwm: true,
    videoUrl: "https://youtube.com",
    active: true,
  },
  {
    id: "neon-dreams-crop",
    title: "NEON DREAMS CROP",
    category: "casual",
    priceCents: 3299,
    imageUrl: "/placeholder.svg?height=400&width=300",
    isGrwm: false,
    active: true,
  },
  {
    id: "date-night-glam",
    title: "DATE NIGHT GLAM",
    category: "grwm",
    priceCents: 0,
    imageUrl: "/placeholder.svg?height=400&width=300",
    isGrwm: true,
    videoUrl: "https://youtube.com",
    active: true,
  },
]

export const seedAboutPageContent: AboutPageContent = {
  heroEyebrow: "Artist profile",
  heroTitle: "A visual, musical, and cultural world built with intention.",
  heroIntro:
    "Britney Chierra blends performance, style, and storytelling into a platform that feels cinematic, personal, and sharp. The About page is designed as a living editorial profile that can evolve with new eras, collaborations, and releases.",
  heroQuote: "Every release should feel like a world, not just a post.",
  heroImageUrl: "/placeholder.svg?height=1200&width=960",
  missionTitle: "Creative direction with range",
  missionBody:
    "This space can explain the brand voice, the creative process, and the purpose behind the work. Use it for biography, vision, press framing, partnership context, or the story behind the platform itself.",
  stats: [
    { value: "10+", label: "Years shaping visual identity" },
    { value: "25+", label: "Campaign and content concepts developed" },
    { value: "3", label: "Core lanes: music, style, community" },
  ],
  timeline: [
    {
      year: "2019",
      title: "Independent brand build",
      description: "Defined the first cohesive aesthetic language across music, visuals, and online presence.",
    },
    {
      year: "2022",
      title: "Audience expansion",
      description: "Shifted into broader content, stronger recurring formats, and deeper community engagement.",
    },
    {
      year: "2026",
      title: "Marketplace era",
      description: "Connected music, products, and editorial storytelling inside one direct-to-audience platform.",
    },
  ],
  services: [
    {
      title: "Music and release storytelling",
      description: "Frame songs, visuals, and launches with consistent narrative direction across channels.",
    },
    {
      title: "Style and product curation",
      description: "Translate aesthetic taste into shoppable drops, recommendations, and branded looks.",
    },
    {
      title: "Collaborative campaigns",
      description: "Create partnership-ready brand language for sponsors, interviews, features, and joint projects.",
    },
  ],
  team: [
    {
      name: "Britney Chierra",
      role: "Founder / Creative Lead",
      bio: "Sets the voice, aesthetic direction, and overall editorial point of view.",
      imageUrl: "/placeholder.svg?height=800&width=640",
    },
    {
      name: "Brand Studio",
      role: "Design + Production",
      bio: "Supports content systems, visuals, campaign execution, and digital experience.",
      imageUrl: "/placeholder.svg?height=800&width=640",
    },
  ],
  ctaTitle: "Build the next era",
  ctaBody: "Use this section for booking, collaborations, partnerships, or a clean invitation to connect.",
  ctaLabel: "Start a conversation",
  ctaHref: "/community",
}
