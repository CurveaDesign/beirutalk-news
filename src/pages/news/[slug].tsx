import type { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"

import SiteLayout from "@/components/layout/SiteLayout"
import ArticleHero from "@/components/article/ArticleHero"
import ShareRail from "@/components/article/ShareRail"
import ArticleSidebar from "@/components/article/ArticleSidebar"
import ArticleBody from "@/components/article/ArticleBody"
import CurveaMetaRail from "@/components/article/CurveaMetaRail"
import { getAdsConfig, getAuthorsMap, getTagsMap } from "@/lib/content/data"
import type { AdsConfig } from "@/lib/content/data"

import { getAllPosts, getPostBySlug, pickCategoryPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"
import { getMenusConfig } from "@/lib/content/data"
import type { MenusConfig } from "@/lib/content/data"

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
  const wpm = 220
  return Math.max(1, Math.round(words / wpm))
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
  if (typeof window !== "undefined") return new URL(pathname, window.location.origin).toString()
  return pathname
}

function safeImg(src?: string) {
  return src && src.trim().length ? src : "/assets/placeholders/hero2.jpg"
}

type TagChip = { slug: string; label: string }

function TagsSection({ tags }: { tags?: TagChip[] }) {
  if (!tags?.length) return null

  return (
    <section className="mt-8">
      <div className="rounded-[22px] border border-black/10 bg-white/80 p-4 backdrop-blur md:p-5">
        <div className="mb-3 text-[13px] font-extrabold text-black/70">الوسوم</div>

        <div className="flex flex-wrap gap-2">
          {tags.map((t) => {
            const href = `/tag/${encodeURIComponent(t.slug)}`
            return (
              <Link
                key={t.slug}
                href={href}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-extrabold text-black/60 hover:bg-black/[0.03]"
              >
                {t.label}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function RelatedGrid({
  posts,
  moreHref,
}: {
  posts: Post[]
  moreHref?: string
}) {
  if (!posts?.length) return null

  return (
    <section className="mt-8 bt-rail bt-edge overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 md:px-7 md:pt-7">
        <h2 className="text-lg font-extrabold text-[color:var(--bt-headline)]">
          مواضيع ذات صلة
        </h2>

        {moreHref ? (
          <Link
            href={moreHref}
            className="rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5"
          >
            عرض المزيد
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-2 md:gap-4 md:p-7">
        {posts.slice(0, 4).map((p) => (
          <Link
            key={p.fm.slug}
            href={`/news/${p.fm.slug}`}
            className="group flex items-start gap-3 rounded-[22px] border border-black/10 bg-white/70 p-4 transition hover:bg-black/[0.03]"
          >
            <div className="relative h-[70px] w-[70px] flex-none overflow-hidden rounded-[16px] border border-black/10 bg-black/5">
              <Image
                src={safeImg(p.fm.featured_image)}
                alt={p.fm.title}
                fill
                sizes="70px"
                className="object-cover transition duration-500 group-hover:scale-[1.05]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-extrabold text-black/45">
                {p.fm.category || "BeiruTalk"}{" "}
                <span className="mx-2 text-black/25">•</span>
                {formatArabicDate(p.fm.date)}
              </div>

              <div className="mt-2 line-clamp-2 text-[14px] font-extrabold leading-snug text-[color:var(--bt-headline)] md:text-[15px]">
                {p.fm.title}
              </div>

              {p.fm.description ? (
                <div className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-black/60 md:text-[13px]">
                  {p.fm.description}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts()
  return {
    paths: posts.map((p) => ({ params: { slug: p.fm.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "")
  const posts = getAllPosts()
  const menus = getMenusConfig()
  // ✅ correct usage from your zip
  const post = getPostBySlug(posts, slug)
  if (!post) return { notFound: true }

  const latest = posts.slice(0, 6).filter((p) => p.fm.slug !== slug)
  const breaking = posts.filter((p) => p.fm.breaking === true).slice(0, 8)

  const related =
    post.fm.category_slug
      ? pickCategoryPosts(posts, post.fm.category_slug, 10).filter((p) => p.fm.slug !== slug)
      : posts.slice(0, 10).filter((p) => p.fm.slug !== slug)

  return {
    props: {
      post,
      latest,
      related: related.slice(0, 6),
      breaking,
      ads: getAdsConfig(),
      authorsMap: getAuthorsMap(),
      tagsMap: getTagsMap(),
       menus,
    },
  }
  
}

export default function NewsArticlePage({
  post,
  latest,
  related,
  ads,
  breaking,
  authorsMap,
  tagsMap,
  menus,
}: {
  post: Post
  latest: Post[]
  related: Post[]
   ads?: AdsConfig
  breaking?: Post[]
  authorsMap: Record<string, { slug: string; display_name: string }>
  tagsMap: Record<string, { slug: string; display_name: string }>
  menus: MenusConfig
}) {
  const clean = stripMarkdown(post.content || "")
  const readMins = estimateReadMinutes(clean)
  const dateText = formatArabicDate(post.fm.date)
  const url = absoluteUrl(`/news/${post.fm.slug}`)

  const authorSlug = (post.fm.author || "").trim()
  const authorName = authorSlug ? authorsMap?.[authorSlug]?.display_name || authorSlug : undefined

  const tagChips: TagChip[] = (post.fm.tags || [])
    .map((t) => String(t || "").trim())
    .filter(Boolean)
    .map((slug) => ({ slug, label: tagsMap?.[slug]?.display_name || slug }))

  return (
    <SiteLayout ads={ads} breaking={breaking} menus={menus}>
      <Head>
        <title>{`${post.fm.title} | BeiruTalk`}</title>
        {post.fm.description ? <meta name="description" content={post.fm.description} /> : null}
      </Head>

      <ArticleHero
        title={post.fm.title}
        description={post.fm.description}
        category={post.fm.category}
        categorySlug={post.fm.category_slug}
        image={post.fm.featured_image || "/assets/placeholder-article.jpg"}
        authorName={authorName}
        authorSlug={authorSlug}
        dateText={dateText}
        readMins={readMins}
      />

      {/* ✅ fixed meta bar (your first screenshot issue) */}
      <div className="bt-container">
        <div className="bt-rail">
          <CurveaMetaRail authorName={authorName} authorSlug={authorSlug} date={dateText} readMins={readMins} />
        </div>
      </div>

      <div className="bt-container py-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <main className="min-w-0">
            <article className="bt-rail bt-edge overflow-hidden">
              <div className="p-5 md:p-7">
                {/* Remove the old meta row (was duplicated / messy) */}

                <div className="mt-2">
                  <ArticleBody markdown={post.content || ""} />
                </div>

                {/* ✅ tags at bottom (as you want) */}
                <TagsSection tags={tagChips} />
              </div>
            </article>

            {/* ✅ redesigned related section (your second screenshot issue) */}
            <RelatedGrid
              posts={related}
              moreHref={post.fm.category_slug ? `/category/${post.fm.category_slug}` : undefined}
            />

            <ShareRail title={post.fm.title} url={url} />
          </main>

          <aside className="sticky top-[110px]">
            <div className="hidden xl:block space-y-6">
              <ArticleSidebar latest={latest} related={related} ads={ads}/>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  )
}
