import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import AdSlot from "@/components/ads/AdSlot"
import type { AdsConfig, MenusConfig, MenuLink } from "@/lib/content/data"
import type { Post } from "@/lib/content/types"

/* =======================
   Beirut clock
======================= */
function useBeirutClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return useMemo(() => {
    if (!now) return ""
    try {
      return new Intl.DateTimeFormat("ar-LB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Beirut",
      }).format(now)
    } catch {
      return now.toLocaleString()
    }
  }, [now])
}

/* =======================
   Data
======================= */
const FALLBACK_NAV: Array<{ href: string; label: string }> = [
  { href: "/", label: "الرئيسية" },
]

function linkToHref(it: MenuLink): string {
  if (it.type === "home") return it.href || "/"
  if (it.type === "category") return `/category/${it.slug}`
  return it.href || "/"
}


/* =======================
   Component
======================= */
export default function TopSystem({
  ads,
  breaking = [],
  menus,
}: {
  ads?: AdsConfig
  breaking?: Post[]
  menus?: MenusConfig
}) {
  const clock = useBeirutClock()
  const hasHeaderAd = !!ads?.slots?.some((s) => s.id === "header_leaderboard" && s.enabled)

  const nav = (menus?.header || [])
    .filter((x) => (x.enabled ?? true) && !!(x.label || "").trim())
    .map((x) => ({ href: linkToHref(x), label: x.label }))

  const NAV = nav.length ? nav : FALLBACK_NAV

  return (
    <header className="relative z-50 bg-[color:var(--bt-bg)]">
      <div className="bt-container py-4">
        {/* ONE authored surface */}
        <div className="bt-rail bt-edge">
          {/* =================================================
              MASTHEAD (SCROLLS AWAY)
             ================================================= */}
          <div className="overflow-hidden">
            {/* top microbar */}
            <div className="flex flex-col gap-2 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs font-semibold text-black/60">
                {clock || " "}
              </div>

              <div className="flex items-center gap-2 text-xs text-black/55">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--bt-primary)]" />
                <span className="font-semibold text-black/70">BeiruTalk</span>
                <span className="text-black/45">الأخبار بوضوح</span>
              </div>
            </div>

            {/* ad band */}
            {hasHeaderAd ? (
              <div className="px-4 pt-3">
                <div className="bt-noise overflow-hidden rounded-2xl border border-black/10 bg-white/70">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-[11px] font-semibold text-black/45">Advertisement</div>
                  </div>

                  <div className="p-3">
                    <AdSlot id="header_leaderboard" ads={ads} />
                  </div>
                </div>
              </div>
            ) : null}
            {/* brand row */}
            <div className="px-4 pb-4 pt-4">
              <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                <div className="hidden md:flex items-center gap-2 text-xs text-black/50">
                  <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 font-semibold">
                    Live
                  </span>
                  <span className="text-black/40">Beirut, Lebanon</span>
                </div>

                <Link
                  href="/"
                  aria-label="BeiruTalk"
                  className="mx-auto bt-appear"
                >
                  <Image
                    src="/assets/beirutalk-logo.png"
                    alt="BeiruTalk"
                    width={240}
                    height={56}
                    priority
                    className="h-12 w-auto"
                  />
                </Link>

                <div className="hidden md:flex justify-end">
                  <button
                    type="button"
                    className="rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5"
                    aria-label="بحث"
                  >
                    بحث
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              STICKY NAVBAR (ONLY THIS STICKS)
             ================================================= */}
          <div className="sticky top-0 z-50 bg-[color:var(--bt-bg)]/95 backdrop-blur">
            {/* nav rail */}
            <div className="border-t border-black/10 px-4 py-3">
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
                {NAV.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className="bt-sweep relative shrink-0 rounded-2xl px-3 py-2 text-[15px] font-semibold text-[color:var(--bt-headline)] transition hover:bg-black/5"
                  >
                    {it.label}
                  </Link>
                ))}

                {/* search on mobile */}
                <button
                  type="button"
                  className="md:hidden shrink-0 rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5"
                  aria-label="بحث"
                >
                  بحث
                </button>
              </div>
            </div>

            {/* breaking ticker */}
            <div className="border-t border-black/10 bg-[color:var(--bt-breaking)] text-white">
              <div className="flex items-center gap-3 px-4 py-2">
                <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold">
                  عاجل
                </span>

                <div className="relative flex-1 overflow-hidden">
                  <div className="bt-marquee whitespace-nowrap text-sm font-semibold text-white/95">
                    {breaking.slice(0, 8).map((p) => (
                      <Link key={p.fm.slug} href={`/news/${p.fm.slug}`} className="mx-4 inline-block hover:underline">
                        {p.fm.title}
                        <span className="mx-4 text-white/40">•</span>
                      </Link>
                    ))}

                  </div>
                </div>

                <span className="hidden sm:block text-xs text-white/75">
                  تحديثات مباشرة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
