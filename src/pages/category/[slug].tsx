import type { GetStaticPaths, GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"
import { getAllPosts, pickCategoryPosts } from "@/lib/content/posts"
import { getAdsConfig, getCategories, getEditorPicks, getSocialLinks } from "@/lib/content/data"
import type { Post } from "@/lib/content/types"
import type { AdsConfig } from "@/lib/content/data" 
export const getStaticPaths: GetStaticPaths = async () => {
  const categories = getCategories()
  return {
    paths: categories.map((c) => ({ params: { slug: c.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "")
  const posts = getAllPosts()

  const categories = getCategories()
  const title = categories.find((c) => c.slug === slug)?.title || slug

  const items = pickCategoryPosts(posts, slug, 24)

  const latest = posts.slice(0, 6)
  const breaking = posts.filter((p) => p.fm.breaking === true).slice(0, 6)

  return {
    props: {
      title,
      kicker: "أرشيف القسم",
      posts: items,
      sidebar: {
        latest,
        breaking,
        editorPicks: getEditorPicks(posts),
        categories,
        social: getSocialLinks(),
      },
      ads: getAdsConfig(),
    },
  }
}

export default function CategoryArchive({
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

