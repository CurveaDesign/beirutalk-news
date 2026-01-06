import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/content/types"
import type { SiteContactConfig, SocialKey } from "@/lib/siteConfig"
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react"
import type { AdsConfig } from "@/lib/content/data"
import AdSlot from "@/components/ads/AdSlot"
import { resolvePostImage } from "@/lib/content/media"

type CategoryItem = { title: string; slug: string }

function postHref(slug: string) {
  return `/news/${slug}`
}
function pinHref(slug: string) {
  return `/pin/${slug}`
}
function backstageHref(slug: string) {
  return `/backstage/${slug}`
}

function cx(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(" ")
}

function fmt(dateISO?: string) {
  if (!dateISO) return ""
  try {
    return new Date(dateISO).toLocaleDateString("ar-LB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateISO
  }
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

/** thumb + meta rows */
function ListPostRows({
  posts,
  hrefOf,
}: {
  posts: Post[]
  hrefOf: (slug: string) => string
}) {
  return (
    <div className="divide-y divide-black/10">
      {posts.map((p) => {
        const img = resolvePostImage(p.fm, "/assets/placeholders/placeholder.jpg")
        return (
          <Link
            key={p.fm.slug}
            href={hrefOf(p.fm.slug)}
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
                    <span className="truncate">{fmt(p.fm.date)}</span>
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

/** lightweight text list (good for pins/backstage if you don't want thumbs) */
function TextRows({
  items,
  hrefOf,
}: {
  items: Post[]
  hrefOf: (slug: string) => string
}) {
  return (
    <div className="divide-y divide-black/10">
      {items.map((p) => (
        <Link
          key={p.fm.slug}
          href={hrefOf(p.fm.slug)}
          className="group block px-4 py-3 transition hover:bg-black/[0.03]"
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold text-black/45">
            {p.fm.date ? <span className="truncate">{fmt(p.fm.date)}</span> : <span />}
            <span className="ms-auto text-black/30 transition group-hover:text-black/55">‹</span>
          </div>

          <div className="mt-1 line-clamp-2 text-[13px] font-extrabold leading-snug text-[color:var(--bt-headline)]">
            {p.fm.title}
          </div>

          <div
            className="mt-2 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-10"
            style={{ background: "var(--bt-primary)" }}
          />
        </Link>
      ))}
    </div>
  )
}

function ListLinks({ items }: { items: Array<{ title: string; href: string }> }) {
  return (
    <div className="divide-y divide-black/10">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className="group flex items-center gap-3 px-4 py-3 text-[13px] font-extrabold text-black/70 transition hover:bg-black/[0.03]"
        >
          <span className="h-2 w-2 rounded-full bg-[color:var(--bt-primary)] opacity-30 transition group-hover:opacity-90" />
          <span className="min-w-0 flex-1 truncate">{it.title}</span>
          <span className="text-black/30 transition group-hover:text-black/55">‹</span>
        </Link>
      ))}
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

export default function Sidebar({
  mostRead = [],
  pins = [],
  backstage = [],
  categories = [],
  contact,
  ads,
}: {
  breaking: Post[]
  mostRead: Post[]
  pins: Post[]
  backstage: Post[]
  categories: CategoryItem[]
  contact: SiteContactConfig
  ads?: AdsConfig
}) {
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

  const socialItems = socialDefs.filter((i) => !!i.href && String(i.href).trim().length > 0)

  return (
    <div className="space-y-5">
      {/* Ad #1 */}
      <Card title="" kicker="Advertisement" className="p-0">
        <div className="p-4">
          <AdSlot id="sidebar_top" ads={ads} />
        </div>
      </Card>

      {/* Most Read */}
      {mostRead.length ? (
        <Card title="الأكثر قراءة" kicker="مختار يدويًا">
          <ListPostRows posts={mostRead.slice(0, 6)} hrefOf={postHref} />
        </Card>
      ) : null}
      {/* Pins */}
      {pins.length ? (
        <Card title="دبوس" kicker="مختصر">
          <TextRows items={pins.slice(0, 6)} hrefOf={pinHref} />
        </Card>
      ) : null}

      {/* Ad #2 */}
      <Card title="" kicker="Advertisement" className="p-0">
        <div className="p-4">
          <AdSlot id="sidebar_mid" ads={ads} />
        </div>
      </Card>


      {/* Backstage */}
      {backstage.length ? (
        <Card title="كواليس BeiruTalk" kicker="بدون أسماء">
          <TextRows items={backstage.slice(0, 6)} hrefOf={backstageHref} />
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

      {/* Categories */}
      {categories.length ? (
        <Card title="الأقسام" kicker="تنقّل">
          <ListLinks
            items={categories.map((c) => ({
              title: c.title,
              href: `/category/${c.slug}`,
            }))}
          />
        </Card>
      ) : null}

      {/* Ad #3 */}
      <Card title="" kicker="Advertisement" className="p-0">
        <div className="p-4">
          <AdSlot id="sidebar_bottom" ads={ads} />
        </div>
      </Card>

      {/* Newsletter */}
      <Card title="النشرة البريدية" kicker="بريد">
        <div className="p-4">
          <form className="space-y-3">
            <input
              type="email"
              dir="rtl"
              placeholder="البريد الإلكتروني"
              className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm font-semibold text-black/70 outline-none transition focus:border-black/20"
            />
            <button
              type="button"
              className="w-full rounded-2xl px-4 py-3 text-sm font-extrabold text-white transition hover:opacity-95"
              style={{ background: "var(--bt-primary)" }}
            >
              اشتراك
            </button>
          </form>
        </div>
      </Card>
    </div>
  )
}
