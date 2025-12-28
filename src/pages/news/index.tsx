import type { GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"
import SeoHead from "@/components/seo/SeoHead"
import { getAllPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"
import { getAdsConfig, getEditorPicks } from "@/lib/content/data"
import type { AdsConfig } from "@/lib/content/data"
import { getMenusConfig } from "@/lib/content/data"
import type { MenusConfig } from "@/lib/content/data"
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
