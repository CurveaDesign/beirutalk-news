import type { GetStaticPaths, GetStaticProps } from "next"

import SiteLayout from "@/components/layout/SiteLayout"
import ArticleHero from "@/components/article/ArticleHero"
import ShareRail from "@/components/article/ShareRail"
import ArticleSidebar from "@/components/article/ArticleSidebar"
import ArticleBody from "@/components/article/ArticleBody"
import CurveaMetaRail from "@/components/article/CurveaMetaRail"
import SeoHead from "@/components/seo/SeoHead"

import { getAdsConfig, getSiteContact } from "@/lib/content/data"
import type { AdsConfig } from "@/lib/content/data"
import type { SiteContactConfig } from "@/lib/siteConfig"

import { getAllPins, getAllPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"

import { getMenusConfig } from "@/lib/content/data"
import type { MenusConfig } from "@/lib/content/data"
import { resolvePostImage } from "@/lib/content/media"

/* ======================
   Helpers
====================== */
function stripMarkdown(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function estimateReadMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

function formatArabicDate(dateISO?: string) {
  if (!dateISO) return ""
  const d = new Date(dateISO)
  if (Number.isNaN(d.getTime())) return ""
  try {
    return new Intl.DateTimeFormat("ar-LB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Beirut",
    }).format(d)
  } catch {
    return d.toLocaleDateString()
  }
}

function absoluteUrl(pathname: string) {
  if (typeof window !== "undefined") {
    return new URL(pathname, window.location.origin).toString()
  }
  return pathname
}

function findBySlug(list: Post[], slug: string) {
  const s = String(slug || "").trim().toLowerCase()
  if (!s) return null
  return (
    list.find((p) => String(p.fm.slug || "").trim().toLowerCase() === s) || null
  )
}

/* ======================
   Static paths
====================== */
export const getStaticPaths: GetStaticPaths = async () => {
  const pins = getAllPins()
  return {
    paths: pins.map((p) => ({ params: { slug: p.fm.slug } })),
    fallback: false,
  }
}

/* ======================
   Static props
====================== */
export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "")
  const pins = getAllPins()
  const menus = getMenusConfig()

  const post = findBySlug(pins, slug)
  if (!post) return { notFound: true }

  // ✅ Global sidebar like /news/[slug]
  const posts = getAllPosts()

  const latest = posts.slice(0, 6)

  const breaking = posts
    .filter((p) => p.fm.breaking === true)
    .slice(0, 8)

  const mostRead = posts
    .filter((p) => p.fm.most_read === true)
    .sort((a, b) => {
      const ao = a.fm.most_read_order ?? 9999
      const bo = b.fm.most_read_order ?? 9999
      if (ao !== bo) return ao - bo

      const ad = a.fm.date ? new Date(a.fm.date).getTime() : 0
      const bd = b.fm.date ? new Date(b.fm.date).getTime() : 0
      return bd - ad
    })
    .slice(0, 6)

  const contact = getSiteContact() as SiteContactConfig

  return {
    props: {
      post,
      latest,
      breaking,
      mostRead,
      contact,
      ads: getAdsConfig(),
      menus,
    },
  }
}

/* ======================
   Page
====================== */
export default function PinSlugPage({
  post,
  latest,
  mostRead,
  contact,
  ads,
  breaking,
  menus,
}: {
  post: Post
  latest: Post[]
  mostRead: Post[]
  contact: SiteContactConfig
  ads?: AdsConfig
  breaking?: Post[]
  menus: MenusConfig
}) {
  const clean = stripMarkdown(post.content || "")
  const readMins = estimateReadMinutes(clean)
  const dateText = formatArabicDate(post.fm.date)
  const url = absoluteUrl(`/pin/${post.fm.slug}`)

  const heroImg = resolvePostImage(post.fm)

  return (
    <SiteLayout ads={ads} breaking={breaking} menus={menus}>
      <SeoHead
        title={post.fm.title}
        description={post.fm.description || "دبوس BeiruTalk"}
        path={`/pin/${post.fm.slug}`}
        image={heroImg}
        type="article"
        publishedTime={post.fm.date}
      />

      <ArticleHero
        title={post.fm.title}
        description={post.fm.description}
        category="دبوس"
        categorySlug={undefined}
        image={heroImg}
        authorName={undefined}
        authorSlug={undefined}
        dateText={dateText}
        readMins={readMins}
      />

      <div className="bt-container">
        <div className="mt-4 bt-rail">
          <CurveaMetaRail
            authorName={undefined}
            authorSlug={undefined}
            date={dateText}
            readMins={readMins}
            authorAvatar={undefined}
          />
        </div>
      </div>

      <div className="bt-container mt-4">
        <ShareRail title={post.fm.title} url={url} />
      </div>

      <div className="bt-container py-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <main className="min-w-0">
            <article className="bt-rail bt-edge overflow-hidden">
              <div className="p-5 md:p-7">
                <ArticleBody markdown={post.content || ""} />
              </div>
            </article>
          </main>

          <aside className="xl:sticky xl:top-[110px]">
            <ArticleSidebar
              latest={latest}
              mostRead={mostRead}
              contact={contact}
              ads={ads}
            />
          </aside>
        </div>
      </div>
    </SiteLayout>
  )
}
