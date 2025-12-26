import ArchivePage from "@/components/archive/ArchivePage"
import { getAllPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"
import { getAdsConfig, getCategories, getEditorPicks, getSocialLinks } from "@/lib/content/data"
import type { AdsConfig } from "@/lib/content/data"

export async function getStaticProps() {
  const posts = getAllPosts()

  const latest = posts.slice(0, 6)
  const breaking = posts.filter((p) => p.fm.breaking === true).slice(0, 6)

  return {
    props: {
      title: "آخر الأخبار",
      kicker: "أرشيف",
      posts: posts.slice(0, 24),
      sidebar: {
        latest,
        breaking,
        editorPicks: getEditorPicks(posts),
        categories: getCategories(),
        social: getSocialLinks(),
      },
      ads: getAdsConfig(),
    },
  }
}

export default function LatestNewsArchive({
  title,
  kicker,
  posts,
  sidebar,
  ads,
}: {
  title: string
  kicker?: string
  posts: Post[]
  sidebar: {
    latest: Post[]
    breaking: Post[]
    editorPicks: { title: string; slug: string }[]
    categories: { title: string; slug: string }[]
    social: { facebook?: string; instagram?: string; youtube?: string; x?: string }
  }
  ads?: AdsConfig
}) {
  return <ArchivePage title={title} kicker={kicker} posts={posts} sidebar={sidebar} ads={ads} />
}
