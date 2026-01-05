import type { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link"
import Image from "next/image"

import SiteLayout from "@/components/layout/SiteLayout"
import ArticleHero from "@/components/article/ArticleHero"
import ShareRail from "@/components/article/ShareRail"
import ArticleSidebar from "@/components/article/ArticleSidebar"
import ArticleBody from "@/components/article/ArticleBody"
import CurveaMetaRail from "@/components/article/CurveaMetaRail"
import SeoHead from "@/components/seo/SeoHead"

import {
  getAdsConfig,
  getAuthorsMap,
  getTagsMap,
  getSiteContact,
} from "@/lib/content/data"
import type { AdsConfig } from "@/lib/content/data"
import type { SiteContactConfig } from "@/lib/siteConfig"

import {
  getAllPosts,
  getPostBySlug,
  pickCategoryPosts,
} from "@/lib/content/posts"
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

/* ======================
   Static paths
====================== */
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts()
  return {
    paths: posts.map((p) => ({ params: { slug: p.fm.slug } })),
    fallback: false,
  }
}

/* ======================
   Static props
====================== */
export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "")
  const posts = getAllPosts()
  const menus = getMenusConfig()

  const post = getPostBySlug(posts, slug)
  if (!post) return { notFound: true }

  const latest = posts
    .filter((p) => p.fm.slug !== slug)
    .slice(0, 6)

  const breaking = posts
    .filter((p) => p.fm.breaking === true)
    .slice(0, 8)

  const related = post.fm.category_slug
    ? pickCategoryPosts(posts, post.fm.category_slug, 10).filter(
        (p) => p.fm.slug !== slug
      )
    : posts.filter((p) => p.fm.slug !== slug).slice(0, 10)

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
      related: related.slice(0, 6),
      breaking,
      mostRead,
      contact,
      ads: getAdsConfig(),
      authorsMap: getAuthorsMap(),
      tagsMap: getTagsMap(),
      menus,
    },
  }
}

/* ======================
   Page
====================== */
export default function NewsArticlePage({
  post,
  latest,
  related,
  mostRead,
  contact,
  ads,
  breaking,
  authorsMap,
  tagsMap,
  menus,
}: {
  post: Post
  latest: Post[]
  related: Post[]
  mostRead: Post[]
  contact: SiteContactConfig
  ads?: AdsConfig
  breaking?: Post[]
  authorsMap: Record<string, { slug: string; display_name: string; avatar?: string }>
  tagsMap: Record<string, { slug: string; display_name: string }>
  menus: MenusConfig
}) {
  const clean = stripMarkdown(post.content || "")
  const readMins = estimateReadMinutes(clean)
  const dateText = formatArabicDate(post.fm.date)
  const url = absoluteUrl(`/news/${post.fm.slug}`)

  const authorSlug = (post.fm.author || "").trim()
  const authorName = authorSlug
    ? authorsMap?.[authorSlug]?.display_name || authorSlug
    : undefined
  const author = authorSlug ? authorsMap?.[authorSlug] : undefined

  const tags = (post.fm.tags || [])
    .map((t) => String(t || "").trim())
    .filter(Boolean)

  const heroImg = resolvePostImage(post.fm)

  return (
    <SiteLayout ads={ads} breaking={breaking} menus={menus}>
      <SeoHead
        title={post.fm.title}
        description={post.fm.description}
        path={`/news/${post.fm.slug}`}
        image={heroImg}
        type="article"
        publishedTime={post.fm.date}
        authorName={authorName}
        tags={tags}
      />

      <ArticleHero
        title={post.fm.title}
        description={post.fm.description}
        category={post.fm.category}
        categorySlug={post.fm.category_slug}
        image={heroImg}
        authorName={authorName}
        authorSlug={authorSlug}
        dateText={dateText}
        readMins={readMins}
      />

      <div className="bt-container">
        <div className="mt-4 bt-rail">
          <CurveaMetaRail
            authorName={authorName}
            authorSlug={authorSlug}
            date={dateText}
            readMins={readMins}
            authorAvatar={author?.avatar}
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

          {/* ✅ Sidebar now visible on mobile + desktop */}
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
