// components/archive/ArchivePage.tsx

import Link from "next/link"
import Image from "next/image"
import SiteLayout from "@/components/layout/SiteLayout"
import AfterHeroGrid from "@/components/layout/AfterHeroGrid"
import Sidebar from "@/components/sidebar/Sidebar"
import AdSlot from "@/components/ads/AdSlot"
import type { Post } from "@/lib/content/types"
import type { AdsConfig, MenusConfig } from "@/lib/content/data"
import type { SiteContactConfig } from "@/lib/siteConfig"
import { resolvePostImage } from "@/lib/content/media"

function postHref(slug: string) {
  return `/news/${slug}`
}

function formatArabicDate(dateISO?: string) {
  if (!dateISO) return ""
  const d = new Date(dateISO)
  if (Number.isNaN(d.getTime())) return ""
  try {
    return new Intl.DateTimeFormat("ar-LB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Beirut",
    }).format(d)
  } catch {
    return d.toLocaleDateString()
  }
}

/**
 * Interleave ads into a post list.
 * Example: every=5 => ad after posts 5,10,15...
 * maxAds prevents spam on long lists.
 */
function buildStream(items: Post[], every: number, maxAds: number) {
  const out: Array<{ type: "post"; post: Post } | { type: "ad"; id: string }> = []
  let adCount = 0

  for (let i = 0; i < items.length; i++) {
    out.push({ type: "post", post: items[i] })

    const pos = i + 1
    if (pos % every === 0 && adCount < maxAds) {
      adCount += 1
      out.push({ type: "ad", id: `archive-inline-${adCount}` })
    }
  }

  return out
}

function Header({
  title,
  kicker,
  count,
}: {
  title: string
  kicker?: string
  count: number
}) {
  return (
    <section className="bt-container py-4 sm:py-6">
      <div className="bt-rail p-5">
        {kicker ? <div className="text-[12px] font-extrabold text-black/45">{kicker}</div> : null}

        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-[color:var(--bt-headline)] sm:text-3xl">
            {title}
          </h1>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-[12px] font-extrabold text-black/60 hover:bg-black/[0.03]"
            >
              الرئيسية
            </Link>
            <Link
              href="/latest"
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-[12px] font-extrabold text-black/60 hover:bg-black/[0.03]"
            >
              آخر الأخبار
            </Link>
          </div>
        </div>

        <div className="mt-2 text-[13px] font-bold text-black/45">{count} خبر</div>

        <div className="mt-4 h-px w-full bg-black/10" />
      </div>
    </section>
  )
}

function LeadStory({ post }: { post: Post }) {
  const img = resolvePostImage(post.fm)
  const date = formatArabicDate(post.fm.date)

  return (
    <article className="overflow-hidden rounded-[22px] border border-black/10 bg-white">
      <Link href={postHref(post.fm.slug)} className="block">
        <div className="relative aspect-[4/3] bg-black/5 sm:aspect-[16/9]">
          <Image
            src={img}
            alt={post.fm.title}
            fill
            sizes="(max-width: 640px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-extrabold text-black/45">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-[color:var(--bt-primary)]" />
              <span>{post.fm.category || "BeiruTalk"}</span>
            </span>
            {date ? <span className="text-black/35">{date}</span> : null}
          </div>

          <h2 className="mt-3 text-[18px] font-extrabold leading-snug text-[color:var(--bt-headline)] sm:text-[20px]">
            {post.fm.title}
          </h2>

          {post.fm.description ? (
            <p className="mt-2 hidden line-clamp-3 text-[14px] leading-relaxed text-black/60 sm:block">
              {post.fm.description}
            </p>
          ) : null}

          <div className="mt-4 hidden items-center justify-between text-[12px] font-bold text-black/45 sm:flex">
            <span>{post.fm.author || "BeiruTalk"}</span>
            <span className="font-extrabold text-black/55">
              اقرأ الخبر <span className="inline-block translate-y-[1px]">←</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function ListRow({ post }: { post: Post }) {
  const img = resolvePostImage(post.fm)
  const date = formatArabicDate(post.fm.date)

  return (
    <article>
      <Link href={postHref(post.fm.slug)} className="group block py-5 sm:py-4">
        <div className="flex items-start gap-4">
          <div className="relative h-[102px] w-[102px] flex-none overflow-hidden rounded-[14px] border border-black/10 bg-black/5 sm:h-[78px] sm:w-[78px]">
            <Image
              src={img}
              alt={post.fm.title}
              fill
              sizes="(max-width: 640px) 102px, 78px"
              className="object-cover transition group-hover:scale-[1.02]"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold text-black/45">
              <span className="rounded-full border border-black/10 bg-white px-2 py-0.5">
                {post.fm.category || "BeiruTalk"}
              </span>
              {date ? <span className="text-black/35">{date}</span> : null}
            </div>

            <h3 className="mt-2 line-clamp-2 text-[15px] font-extrabold leading-snug text-[color:var(--bt-headline)] sm:text-[16px]">
              {post.fm.title}
            </h3>

            {post.fm.description ? (
              <p className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-black/55 sm:line-clamp-2 sm:text-[13px]">
                {post.fm.description}
              </p>
            ) : null}

            <div className="mt-2 text-[11px] font-bold text-black/40">{post.fm.author || "BeiruTalk"}</div>
          </div>
        </div>
      </Link>

      <div className="h-px w-full bg-black/10" />
    </article>
  )
}

export default function ArchivePage({
  title,
  kicker,
  posts,
  sidebar,
  ads,
  menus,
}: {
  title: string
  kicker?: string
  posts: Post[]
  sidebar: {
    latest: Post[]
    breaking: Post[]
    categories: { title: string; slug: string }[]
    contact: SiteContactConfig
    mostRead: Post[]
    pins: Post[]
    backstage: Post[]
  }
  ads?: AdsConfig
  menus?: MenusConfig
}) {
  const lead = posts[0]
  const rest = posts.slice(1)

  // Insert ads into the list (after every 5 posts), max 2 ads
  const stream = buildStream(rest, 5, 2)

  return (
    <SiteLayout ads={ads} breaking={sidebar.breaking} menus={menus}>
      <Header title={title} kicker={kicker} count={posts.length} />

      <AfterHeroGrid
        main={
          <section className="bt-container pb-10 sm:pb-14">
            <div className="bt-rail">
              {lead ? (
                <div className="mb-6 sm:mb-8">
                  <LeadStory post={lead} />
                </div>
              ) : null}

              <div className="bg-white sm:overflow-hidden sm:rounded-[22px] sm:border sm:border-black/10">
                <div className="px-4 sm:px-5">
                  {stream.map((x, idx) => {
                    if (x.type === "ad") {
                      return <AdSlot key={x.id} id={x.id} ads={ads} />
                    }
                    return <ListRow key={x.post.fm.slug ?? idx} post={x.post} />
                  })}
                </div>
              </div>
            </div>
          </section>
        }
        aside={
          <Sidebar
            breaking={sidebar.breaking}
            mostRead={sidebar.mostRead}
            pins={sidebar.pins}
            backstage={sidebar.backstage}
            categories={sidebar.categories}
            contact={sidebar.contact}
            ads={ads}
          />
        }
      />
    </SiteLayout>
  )
}
