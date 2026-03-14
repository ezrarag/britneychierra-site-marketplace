import Link from "next/link"
import { getAboutPageContent } from "@/lib/about-server"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const content = await getAboutPageContent()
  const isExternalCta =
    content.ctaHref.startsWith("http://") ||
    content.ctaHref.startsWith("https://") ||
    content.ctaHref.startsWith("mailto:")

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="relative container mx-auto grid gap-10 px-6 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">{content.heroEyebrow}</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] md:text-7xl">
              {content.heroTitle}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/72 md:text-lg">{content.heroIntro}</p>
            <div className="max-w-xl border-l border-white/20 pl-5 text-lg italic text-white/86">
              "{content.heroQuote}"
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 border border-white/10" />
            <img
              src={content.heroImageUrl}
              alt={content.heroTitle}
              className="relative aspect-[4/5] w-full object-cover grayscale"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="container mx-auto grid gap-10 px-6 py-14 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">Mission</p>
            <h2 className="mt-4 text-3xl md:text-5xl">{content.missionTitle}</h2>
          </div>
          <div className="space-y-8">
            <p className="max-w-2xl text-base leading-7 text-white/72 md:text-lg">{content.missionBody}</p>
            <div className="grid gap-px bg-white/10 md:grid-cols-3">
              {content.stats.map((stat) => (
                <div key={`${stat.value}-${stat.label}`} className="bg-black px-5 py-6">
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="container mx-auto px-6 py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/55">Capabilities</p>
              <h2 className="mt-4 text-3xl md:text-5xl">What this platform can say clearly</h2>
            </div>
          </div>

          <div className="grid gap-px bg-white/10 md:grid-cols-3">
            {content.services.map((service) => (
              <article key={service.title} className="bg-black p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-white/40">Service</p>
                <h3 className="mt-4 text-2xl">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/68">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="container mx-auto grid gap-10 px-6 py-14 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">Timeline</p>
            <h2 className="mt-4 text-3xl md:text-5xl">Key milestones and shifts</h2>
          </div>

          <div className="space-y-6">
            {content.timeline.map((entry) => (
              <div key={`${entry.year}-${entry.title}`} className="grid gap-4 border-t border-white/10 pt-5 md:grid-cols-[140px_1fr]">
                <p className="text-sm uppercase tracking-[0.25em] text-white/42">{entry.year}</p>
                <div>
                  <h3 className="text-2xl">{entry.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/68">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="container mx-auto px-6 py-14">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">Team</p>
            <h2 className="mt-4 text-3xl md:text-5xl">The people shaping the work</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {content.team.map((member) => (
              <article key={`${member.name}-${member.role}`} className="grid gap-6 border border-white/10 p-5 md:grid-cols-[220px_1fr]">
                <img src={member.imageUrl} alt={member.name} className="aspect-[4/5] h-full w-full object-cover grayscale" />
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/42">{member.role}</p>
                    <h3 className="mt-3 text-2xl">{member.name}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/68">{member.bio}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-14 md:py-20">
        <div className="grid gap-8 border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[1fr_auto] md:items-end md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">Contact</p>
            <h2 className="mt-4 text-3xl md:text-5xl">{content.ctaTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">{content.ctaBody}</p>
          </div>
          {isExternalCta ? (
            <a
              href={content.ctaHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center border border-white bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-transparent hover:text-white"
            >
              {content.ctaLabel}
            </a>
          ) : (
            <Link
              href={content.ctaHref}
              className="inline-flex items-center justify-center border border-white bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-transparent hover:text-white"
            >
              {content.ctaLabel}
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}
