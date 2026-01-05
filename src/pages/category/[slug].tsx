import type { GetStaticPaths, GetStaticProps } from "next"
import ArchivePage from "@/components/archive/ArchivePage"
import SeoHead from "@/components/seo/SeoHead"

import { getAllPosts, getAllPins, getAllBackstage, pickCategoryPosts } from "@/lib/content/posts"
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
  const menus = getMenusConfig()

  const categories = getCategories()
  const title = categories.find((c) => c.slug === slug)?.title || slug

  const items = pickCategoryPosts(posts, slug, 24)

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
      title,
      slug,
      kicker: "أرشيف القسم",
      posts: items,
      sidebar: {
        latest,
        breaking,
        categories,
        contact,
        mostRead,
        pins,
        backstage,
      },
      ads: getAdsConfig(),
      menus,
    },
  }
}

export default function CategoryArchive({
  title,
  slug,
  kicker,
  posts,
  sidebar,
  ads,
  menus,
}: {
  title: string
  slug: string
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
        description={`أرشيف أخبار قسم ${title} مع أحدث العناوين اليومية والتقارير على BeiruTalk.`}
        path={`/category/${slug}`}
      />

      <ArchivePage title={title} kicker={kicker} posts={posts} sidebar={sidebar} ads={ads} menus={menus} />
    </>
  )
}
