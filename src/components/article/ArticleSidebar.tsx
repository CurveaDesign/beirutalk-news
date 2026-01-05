import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/lib/content/types"
import AdSlot from "@/components/ads/AdSlot"
import type { AdsConfig } from "@/lib/content/data"
import type { SiteContactConfig, SocialKey } from "@/lib/siteConfig"
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react"
import { resolvePostImage } from "@/lib/content/media"

function formatArabicDate(dateISO?: string) {
  if (!dateISO) return ""
  const d = new Date(dateISO)
  if (Number.isNaN(d.getTime())) return ""
  try {
    return new Intl.DateTimeFormat("ar-LB", {
      month: "short",
      day: "numeric",
      timeZone: "Asia/Beirut",
    }).format(d)
  } catch {
    return d.toLocaleDateString()
  }
}

function cx(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(" ")
}

function Card({
  title,
  kicker,
  children,
  className,
}: {
  title: string
  kicker?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cx(
        "overflow-hidden rounded-[26px] border border-black/10 bg-white/65 shadow-[0_18px_55px_rgba(0,0,0,0.07)] backdrop-blur",
        className
      )}
    >
      <div className="px-4 py-4">
        {kicker ? (
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-extrabold tracking-wide text-black/45">{kicker}</div>
            <div className="h-[2px] w-10 rounded-full" style={{ background: "var(--curvea-grad)" }} />
          </div>
        ) : null}
        <h3 className="mt-2 text-sm font-extrabold text-black/80">{title}</h3>
      </div>
      <div className="border-t border-black/10">{children}</div>
    </section>
  )
}

function ListPostRows({ posts }: { posts: Post[] }) {
  return (
    <div className="divide-y divide-black/10">
      {posts.map((p) => {
        const img = resolvePostImage(p.fm, "/assets/placeholder-article.jpg")
        return (
          <Link
            key={p.fm.slug}
            href={`/news/${p.fm.slug}`}
            className="group flex gap-3 px-4 py-3 transition hover:bg-black/[0.03]"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-black/5">
              <Image
                src={img}
                alt={p.fm.title}
                fill
                sizes="120px"
                className="object-cover transition duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-black/45">
                {p.fm.category ? (
                  <span className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 font-extrabold text-black/60">
                    {p.fm.category}
                  </span>
                ) : null}
                {p.fm.date ? (
                  <>
                    {p.fm.category ? <span className="text-black/25">•</span> : null}
                    <span className="truncate">{formatArabicDate(p.fm.date)}</span>
                  </>
                ) : null}
                <span className="ms-auto text-black/30 transition group-hover:text-black/55">‹</span>
              </div>

              <div className="mt-1 line-clamp-2 text-[13px] font-extrabold leading-snug text-[color:var(--bt-headline)]">
                {p.fm.title}
              </div>

              <div
                className="mt-2 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-10"
                style={{ background: "var(--bt-primary)" }}
              />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function SocialPill({
  href,
  label,
  Icon,
  bg,
}: {
  href: string
  label: string
  Icon?: React.ComponentType<{ className?: string }>
  bg: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 p-3 transition hover:-translate-y-[1px] hover:bg-black/[0.03]"
    >
      <span
        className="grid h-10 w-10 place-items-center rounded-2xl text-white shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
        style={{ background: bg }}
        aria-hidden="true"
      >
        {Icon ? <Icon className="h-5 w-5" /> : <span className="text-[10px] font-extrabold">TikTok</span>}
      </span>

      <span className="text-sm font-extrabold text-black/75">{label}</span>
      <span className="ms-auto text-black/30 transition group-hover:text-black/55">‹</span>
    </a>
  )
}

export default function ArticleSidebar({
  latest,
  mostRead,
  ads,
  contact,
}: {
  latest: Post[]
  mostRead: Post[]
  ads?: AdsConfig
  contact: SiteContactConfig
}) {
  const topLatest = latest?.slice(0, 6) || []
  const topMostRead = mostRead?.slice(0, 6) || []

  const s = contact?.socials ?? {}

  const socialDefs: Array<{
    key: SocialKey
    label: string
    href?: string
    Icon?: React.ComponentType<{ className?: string }>
    bg: string
  }> = [
    { key: "facebook", label: "فيسبوك", href: s.facebook, Icon: Facebook, bg: "#1877F2" },
    {
      key: "instagram",
      label: "إنستغرام",
      href: s.instagram,
      Icon: Instagram,
      bg: "linear-gradient(135deg,#f58529,#feda77,#dd2a7b,#8134af,#515bd4)",
    },
    { key: "youtube", label: "يوتيوب", href: s.youtube, Icon: Youtube, bg: "#FF0000" },
    { key: "x", label: "X", href: s.x, Icon: Twitter, bg: "#111111" },
    { key: "linkedin", label: "لينكدإن", href: s.linkedin, Icon: Linkedin, bg: "#0A66C2" },
    { key: "tiktok", label: "تيك توك", href: s.tiktok, Icon: undefined, bg: "#000000" },
  ]

  const socialItems = socialDefs.filter((i) => i.href)

  return (
    <div className="space-y-5">
      {/* Ad #1 */}
      <Card title="" kicker="Advertisement" className="p-0">
        <div className="p-4">
          <AdSlot id="sidebar_top" ads={ads} />
        </div>
      </Card>

      {/* Latest (replaces "مواضيع ذات صلة") */}
      {topLatest.length ? (
        <Card title="آخر الأخبار" kicker="تغطية مباشرة">
          <ListPostRows posts={topLatest} />
        </Card>
      ) : null}

      {/* Ad #2 */}
      <Card title="" kicker="Advertisement" className="p-0">
        <div className="p-4">
          <AdSlot id="sidebar_mid" ads={ads} />
        </div>
      </Card>

      {/* Most read (replaces old "آخر الأخبار") */}
      {topMostRead.length ? (
        <Card title="الأكثر قراءة" kicker="الأكثر تداولاً">
          <ListPostRows posts={topMostRead} />
        </Card>
      ) : null}

      {/* Social */}
      {socialItems.length ? (
        <Card title="تابعونا" kicker="منصات">
          <div className="grid gap-3 p-4">
            {socialItems.map((it) => (
              <SocialPill key={it.key} href={it.href!} label={it.label} Icon={it.Icon} bg={it.bg} />
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  )
}
