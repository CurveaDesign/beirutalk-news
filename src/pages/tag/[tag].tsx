import type { GetStaticPaths, GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"
import SeoHead from "@/components/seo/SeoHead"

import { getAllPosts, getAllPins, getAllBackstage } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"

import {
  getAdsConfig,
  getTags,
  getMenusConfig,
  getSiteContact,
  type AdsConfig,
  type MenusConfig,
} from "@/lib/content/data"

import type { SiteContactConfig } from "@/lib/siteConfig"

/* ======================
   Sidebar builder
====================== */
function buildSidebar(all: Post[]) {
  const latest = all.slice(0, 8)
  const breaking = all.filter((p) => p.fm.breaking).slice(0, 6)

  const categoriesMap = new Map<string, string>()
  for (const p of all) {
    if (p.fm.category && p.fm.category_slug) {
      categoriesMap.set(p.fm.category, p.fm.category_slug)
    }
  }

  const categories = Array.from(categoriesMap.entries()).map(([title, slug]) => ({
    title,
    slug,
  }))

  const mostRead = all
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

  const pins = getAllPins().slice(0, 6)
  const backstage = getAllBackstage().slice(0, 6)

  const contact = getSiteContact() as SiteContactConfig

  return {
    latest,
    breaking,
    categories,
    contact,
    mostRead,
    pins,
    backstage,
  }
}

/* ======================
   Page Component
====================== */
export default function TagArchive({
  tagName,
  tagSlug,
  posts,
  sidebar,
  ads,
  menus,
}: {
  tagName: string
  tagSlug: string
  posts: Post[]
  sidebar: ReturnType<typeof buildSidebar>
  ads?: AdsConfig
  menus: MenusConfig
}) {
  return (
    <>
      <SeoHead
        title={tagName}
        description={`أرشيف الوسم ${tagName} لأبرز الأخبار والمواضيع المتداولة على BeiruTalk.`}
        path={`/tag/${tagSlug}`}
      />

      <ArchivePage
        title={tagName}
        kicker="أرشيف الوسم"
        posts={posts}
        sidebar={sidebar}
        ads={ads}
        menus={menus}
      />
    </>
  )
}

/* ======================
   Static paths
====================== */
export const getStaticPaths: GetStaticPaths = async () => {
  const tags = getTags()

  return {
    paths: tags.filter((t) => t?.slug).map((t) => ({ params: { tag: t.slug } })),
    fallback: false,
  }
}

/* ======================
   Static props
====================== */
export const getStaticProps: GetStaticProps = async (ctx) => {
  const tagSlug = String(ctx.params?.tag || "").trim().toLowerCase()

  const tags = getTags()
  const tag = tags.find((t) => String(t.slug).trim().toLowerCase() === tagSlug)

  if (!tag) {
    return { notFound: true }
  }

  const allPosts = getAllPosts()

  const posts = allPosts.filter((p) =>
    (p.fm.tags || [])
      .map((x) => String(x).trim().toLowerCase())
      .includes(tagSlug)
  )

  return {
    props: {
      tagName: tag.display_name || tag.slug,
      tagSlug: tag.slug,
      posts,
      sidebar: buildSidebar(allPosts),
      ads: getAdsConfig(),
      menus: getMenusConfig(),
    },
  }
}
