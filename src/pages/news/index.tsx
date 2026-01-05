import type { GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"
import SeoHead from "@/components/seo/SeoHead"

import { getAllPosts, getAllPins, getAllBackstage } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"

import { getAdsConfig, getCategories, getMenusConfig, getSiteContact } from "@/lib/content/data"
import type { AdsConfig, MenusConfig } from "@/lib/content/data"
import type { SiteContactConfig } from "@/lib/siteConfig"

function buildSidebar(all: Post[]) {
  const latest = all.slice(0, 8)
  const breaking = all.filter((p) => p.fm.breaking === true).slice(0, 6)

  const categories = getCategories()
  const contact = getSiteContact() as SiteContactConfig

  const mostRead = all
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

  return {
    latest,
    breaking,
    categories,
    contact,
    mostRead,
    pins,
    backstage,
  }
}

export default function AllNewsPage({
  posts,
  sidebar,
  ads,
  menus,
}: {
  posts: Post[]
  sidebar: ReturnType<typeof buildSidebar>
  ads?: AdsConfig
  menus: MenusConfig
}) {
  return (
    <>
      <SeoHead
        title="كل الأخبار"
        description="آخر الأخبار والتقارير المحلية من بيروت ولبنان مع تحديثات مستمرة."
        path="/news"
      />
      <ArchivePage
        title="كل الأخبار"
        kicker="الأرشيف"
        posts={posts}
        sidebar={sidebar}
        ads={ads}
        menus={menus}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const all = getAllPosts()
  const menus = getMenusConfig()

  return {
    props: {
      posts: all,
      sidebar: buildSidebar(all),
      ads: getAdsConfig(),
      menus,
    },
  }
}
