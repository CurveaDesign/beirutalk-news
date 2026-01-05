import ArchivePage from "@/components/archive/ArchivePage"
import SeoHead from "@/components/seo/SeoHead"

import { getAllPosts, getAllPins, getAllBackstage } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"

import {
  getAdsConfig,
  getCategories,
  getMenusConfig,
  getSiteContact,
  type AdsConfig,
  type MenusConfig,
} from "@/lib/content/data"

import type { SiteContactConfig } from "@/lib/siteConfig"

export async function getStaticProps() {
  const posts = getAllPosts()

  const latest = posts.slice(0, 6)
  const breaking = posts.filter((p) => p.fm.breaking === true).slice(0, 6)

  const mostRead = posts
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
    props: {
      title: "آخر الأخبار",
      kicker: "أرشيف",
      posts: posts.slice(0, 24),
      sidebar: {
        latest,
        breaking,
        categories: getCategories(),
        contact,
        mostRead,
        pins,
        backstage,
      },
      ads: getAdsConfig(),
      menus: getMenusConfig(),
    },
  }
}

export default function LatestNewsArchive({
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
    categories: { title: string; slug: string }[]
    contact: SiteContactConfig
    mostRead: Post[]
    pins: Post[]
    backstage: Post[]
  }
  ads?: AdsConfig
  menus: MenusConfig
}) {
  return (
    <>
      <SeoHead
        title={title}
        description="آخر الأخبار العاجلة والمحدثة من لبنان والعالم مع تغطية لحظية على BeiruTalk."
        path="/latest"
      />

      <ArchivePage title={title} kicker={kicker} posts={posts} sidebar={sidebar} ads={ads} menus={menus} />
    </>
  )
}
