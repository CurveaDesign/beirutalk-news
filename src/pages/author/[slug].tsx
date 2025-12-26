import type { GetStaticPaths, GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"
import { getAllPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"
import { getAdsConfig, getEditorPicks } from "@/lib/content/data"
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

function authorSlug(name: string) {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-]+/gu, "") // keep letters/numbers (Arabic ok) + dash
    .toLowerCase()
}

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
  const all = getAllPosts()

  const map = new Map<string, string>() // slug -> authorName
  for (const p of all) {
    const a = (p.fm.author || "").trim()
    if (!a) continue
    map.set(authorSlug(a), a)
  }

  return {
    paths: Array.from(map.keys()).map((slug) => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const raw = String(ctx.params?.slug || "")
  const slug = raw.trim().toLowerCase()

  const all = getAllPosts()

  // Find the exact author name that matches this slug
  let authorName = ""
  for (const p of all) {
    const a = (p.fm.author || "").trim()
    if (!a) continue
    if (authorSlug(a) === slug) {
      authorName = a
      break
    }
  }

  if (!authorName) return { notFound: true }

  const posts = all.filter((p) => (p.fm.author || "").trim() === authorName)

  return {
    props: {
      authorName,
      posts,
      sidebar: buildSidebar(all),
      ads: getAdsConfig(),
    },
  }
}
