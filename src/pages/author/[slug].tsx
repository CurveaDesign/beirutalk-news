import type { GetStaticPaths, GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"
import { getAllPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"
import { getAdsConfig, getAuthors, getEditorPicks } from "@/lib/content/data"
import type { AdsConfig } from "@/lib/content/data"

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
    social: { facebook: "", instagram: "", youtube: "", x: "" },
  }
}

// Author slug is stored directly in taxonomy files (content/data/authors/<slug>.json)

export default function AuthorArchive({
  authorName,
  posts,
  sidebar,
  ads,
}: {
  authorName: string
  posts: Post[]
  sidebar: ReturnType<typeof buildSidebar>
  ads?: AdsConfig
}) {

  return (
    <ArchivePage
      title={authorName}
      kicker="أرشيف الكاتب"
      posts={posts}
      sidebar={sidebar}
      ads={ads}
    />
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
  if (!author) return { notFound: true }

  const all = getAllPosts()
  const posts = all.filter((p) => String(p.fm.author || "").trim().toLowerCase() === slug)

  return {
    props: {
      authorName: author.display_name || author.slug,
      posts,
      sidebar: buildSidebar(all),
      ads: getAdsConfig(),
    },
  }
}
