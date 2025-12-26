import type { GetStaticProps } from "next"
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

export default function AllNewsPage({
  posts,
  sidebar,
  ads,
}: {
  posts: Post[]
  sidebar: ReturnType<typeof buildSidebar>
  ads?: AdsConfig
}) {
  return <ArchivePage title="كل الأخبار" kicker="الأرشيف" posts={posts} sidebar={sidebar} ads={ads} />
}

export const getStaticProps: GetStaticProps = async () => {
  const all = getAllPosts()
  return {
    props: {
      posts: all,
      sidebar: buildSidebar(all),
      ads: getAdsConfig(),
    },
  }
}
