import type { GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"
import SeoHead from "@/components/seo/SeoHead"
import { getAllPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"
import { getAdsConfig, getCategories, getEditorPicks, getMenusConfig } from "@/lib/content/data"
import type { AdsConfig, MenusConfig } from "@/lib/content/data"
import { siteContact } from "@/lib/siteConfig"

export const getStaticProps: GetStaticProps = async () => {
  const all = getAllPosts()
  const menus = getMenusConfig()

  const tvPosts = all.filter((p) => String(p.fm.type || "").toLowerCase() === "tv")
  const latest = all.slice(0, 6)
  const breaking = all.filter((p) => p.fm.breaking === true).slice(0, 6)

  return {
    props: {
      title: "BeiruTalk TV",
      kicker: "فيديو",
      posts: tvPosts,
      sidebar: {
        latest,
        breaking,
        editorPicks: getEditorPicks(all),
        categories: getCategories(),
        contact: siteContact,
      },
      ads: getAdsConfig(),
      menus,
    },
  }
}

export default function VideosPage({
  title,
  kicker,
  posts,
  sidebar,
  ads,
  menus,
}: {
  title: string
  kicker?: string
  posts: Post[]
  sidebar: {
    latest: Post[]
    breaking: Post[]
    editorPicks: { title: string; slug: string }[]
    categories: { title: string; slug: string }[]
    contact: typeof siteContact
  }
  ads?: AdsConfig
  menus: MenusConfig
}) {
  return (
    <>
      <SeoHead
        title={title}
        description="حلقات BeiruTalk TV وروابط الفيديوهات الرسمية."
        path="/videos"
      />
      <ArchivePage
        title={title}
        kicker={kicker}
        posts={posts}
        sidebar={sidebar}
        ads={ads}
        menus={menus}
      />
    </>
  )
}
