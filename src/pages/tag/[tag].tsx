import type { GetStaticPaths, GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"

import { getAllPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"

import {
  getAdsConfig,
  getEditorPicks,
  getTags,
  getMenusConfig,
  type AdsConfig,
  type MenusConfig,
} from "@/lib/content/data"

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

  const categories = Array.from(categoriesMap.entries()).map(
    ([title, slug]) => ({ title, slug })
  )

  const editorPicks = getEditorPicks(all)

  return {
    latest,
    breaking,
    editorPicks,
    categories,
    social: {
      facebook: "",
      instagram: "",
      youtube: "",
      x: "",
    },
  }
}

/* ======================
   Page Component
====================== */
export default function TagArchive({
  tagName,
  posts,
  sidebar,
  ads,
  menus,
}: {
  tagName: string
  posts: Post[]
  sidebar: ReturnType<typeof buildSidebar>
  ads?: AdsConfig
  menus: MenusConfig
}) {
  return (
    <ArchivePage
      title={tagName}
      kicker="أرشيف الوسم"
      posts={posts}
      sidebar={sidebar}
      ads={ads}
      menus={menus}
    />
  )
}

/* ======================
   Static paths
====================== */
export const getStaticPaths: GetStaticPaths = async () => {
  const tags = getTags()

  return {
    paths: tags
      .filter((t) => t?.slug)
      .map((t) => ({ params: { tag: t.slug } })),
    fallback: false,
  }
}

/* ======================
   Static props
====================== */
export const getStaticProps: GetStaticProps = async (ctx) => {
  const tagSlug = String(ctx.params?.tag || "").trim().toLowerCase()

  const tags = getTags()
  const tag = tags.find(
    (t) => String(t.slug).trim().toLowerCase() === tagSlug
  )

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
      posts,
      sidebar: buildSidebar(allPosts),
      ads: getAdsConfig(),
      menus: getMenusConfig(),
    },
  }
}
