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
  const categories = Array.from(categoriesMap.entries()).map(([title, slug]) => ({
    title,
    slug,
  }))

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

export default function TagArchive({
  tag,
  posts,
  sidebar,
  ads,
}: {
  tag: string
  posts: Post[]
  sidebar: ReturnType<typeof buildSidebar>
  ads?: AdsConfig
}) {
  return <ArchivePage title={tag} kicker="أرشيف الوسم" posts={posts} sidebar={sidebar} ads={ads} />
}


export const getStaticPaths: GetStaticPaths = async () => {
  const all = getAllPosts()

  const tagsSet = new Set<string>()
  for (const p of all) {
    const tags = p.fm.tags || []
    for (const t of tags) {
      if (typeof t === "string" && t.trim()) tagsSet.add(t.trim())
    }
  }

  return {
    // ✅ IMPORTANT: raw tag value here (NOT encoded)
    paths: Array.from(tagsSet).map((t) => ({ params: { tag: t } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const raw = String(ctx.params?.tag || "")
  // ✅ Safe decode (works whether Next gives encoded or decoded)
  let tag = raw
  try {
    tag = decodeURIComponent(raw)
  } catch {
    tag = raw
  }
  tag = tag.trim()

  const all = getAllPosts()

  const posts = all.filter((p) => (p.fm.tags || []).map((x) => String(x).trim()).includes(tag))

  return {
    props: {
      tag,
      posts,
      sidebar: buildSidebar(all),
      ads: getAdsConfig(),
    },
  }
}
