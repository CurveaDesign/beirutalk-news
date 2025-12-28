import type { GetStaticPaths, GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"
import SeoHead from "@/components/seo/SeoHead"
import { getAllPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"
import {
  getAdsConfig,
  getAuthors,
  getEditorPicks,
  getMenusConfig,
  type AdsConfig,
  type MenusConfig,
} from "@/lib/content/data"
import { siteContact, type SiteContactConfig } from "@/lib/siteConfig"

function buildSidebar(all: Post[]) {
  const latest = all.slice(0, 8)
  const breaking = all.filter((p) => p.fm.breaking).slice(0, 6)

  const categoriesMap = new Map<string, string>()
  for (const p of all) {
    if (p.fm.category && p.fm.category_slug) {
      categoriesMap.set(p.fm.category, p.fm.category_slug)
    }
  }
  const categories = Array.from(categoriesMap.entries()).map(([title, slug]) => ({ title, slug }))

  const editorPicks = getEditorPicks(all)

  return {
    latest,
    breaking,
    editorPicks,
    categories,
    contact: siteContact as SiteContactConfig,
  }
}

// Author slug is stored directly in taxonomy files (content/data/authors/<slug>.json)

export default function AuthorArchive({
  authorName,
  authorSlug,
  posts,
  sidebar,
  ads,
  menus,
}: {
  authorName: string
  authorSlug: string
  posts: Post[]
  sidebar: ReturnType<typeof buildSidebar>
  ads?: AdsConfig
  menus: MenusConfig
}) {
  return (
    <>
      <SeoHead
        title={authorName}
        description={`مقالات وأخبار الكاتب ${authorName} مع أحدث التحليلات والتقارير على BeiruTalk.`}
        path={`/author/${authorSlug}`}
      />
      <ArchivePage
        title={authorName}
        kicker="أرشيف الكاتب"
        posts={posts}
        sidebar={sidebar}
        ads={ads}
        menus={menus}
      />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const list = getAuthors()
  return {
    paths: list.filter((a) => a?.slug).map((a) => ({ params: { slug: a.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "").trim().toLowerCase()
  const authors = getAuthors()
  const author = authors.find((a) => String(a.slug).trim().toLowerCase() === slug)
  const menus = getMenusConfig()
  if (!author) return { notFound: true }

  const all = getAllPosts()
  const posts = all.filter((p) => String(p.fm.author || "").trim().toLowerCase() === slug)

  return {
    props: {
      authorName: author.display_name || author.slug,
      authorSlug: author.slug,
      posts,
      sidebar: buildSidebar(all),
      ads: getAdsConfig(),
      menus,
    },
  }
}
