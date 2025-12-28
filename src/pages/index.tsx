import SiteLayout from "@/components/layout/SiteLayout"
import AfterHeroGrid from "@/components/layout/AfterHeroGrid"
import Sidebar from "@/components/sidebar/Sidebar"

import HeroStack from "@/components/home/HeroStack"
import EditorialReel from "@/components/home/EditorialReel"
import LatestBlock from "@/components/home/LatestBlock"

import CategoryHighlight from "@/components/home/CategoryHighlight"
import CategoryThreeCards from "@/components/home/CategoryThreeCards"
import CategoryHorizontal from "@/components/home/CategoryHorizontal"
import AnalysisList from "@/components/home/AnalysisList"
import VideoStrip from "@/components/home/VideoStrip"
import AdSlot from "@/components/ads/AdSlot"
import SeoHead from "@/components/seo/SeoHead"

import type { Post } from "@/lib/content/types"
import { getAllPosts, pickEditorialPosts, pickHeroPosts, pickCategoryPosts } from "@/lib/content/posts"
import { getAdsConfig, getCategories } from "@/lib/content/data"
import { getHomepageConfig, type HomeBlock } from "@/lib/content/homepage"
import type { AdsConfig } from "@/lib/content/data"
import { getMenusConfig } from "@/lib/content/data"
import type { MenusConfig } from "@/lib/content/data"
import { siteContact } from "@/lib/siteConfig"
import type { SiteContactConfig } from "@/lib/siteConfig"

function blockHref(block: HomeBlock) {
  if (block.href) return block.href
  if (block.type === "videoStrip") return "/videos"
  return `/category/${block.slug}`
}

function renderBlock(block: HomeBlock, posts: Post[]) {
  const title = block.title
  const href = blockHref(block)

  switch (block.type) {
    case "categorySpotlight":
      return <CategoryHighlight title={title} href={href} posts={posts} />
    case "threeCards":
      return <CategoryThreeCards title={title} href={href} posts={posts} />
    case "horizontal":
      return <CategoryHorizontal title={title} href={href} posts={posts} />
    case "textList":
      return <AnalysisList title={title} href={href} posts={posts} />
    case "videoStrip":
      return <VideoStrip title={title} href={href} posts={posts} />
    default:
      return null
  }
}

export async function getStaticProps() {
  const posts = getAllPosts()
  const menus = getMenusConfig()
  // Core homepage sections (locked)
  const hero = pickHeroPosts(posts, 6)
  const editorial = pickEditorialPosts(posts, 10)
  const latest = posts.slice(0, 5)

  // Sidebar data
  const editorPicks = posts
    .filter((p) => p.fm.editor_pick === true)
    .sort((a, b) => {
      const ao = a.fm.editor_pick_order ?? 9999
      const bo = b.fm.editor_pick_order ?? 9999
      if (ao !== bo) return ao - bo

      const ad = a.fm.date ? new Date(a.fm.date).getTime() : 0
      const bd = b.fm.date ? new Date(b.fm.date).getTime() : 0
      return bd - ad
    })
    .slice(0, 5)
    .map((p) => ({ title: p.fm.title, slug: p.fm.slug }))
  const categories = getCategories()
  const breaking = posts.filter((p) => p.fm.breaking === true).slice(0, 6)

  // Dynamic homepage config
  const cfg = getHomepageConfig()

  const blocks = cfg.blocks.map((b) => {
    const limit = b.limit ?? 4
    const list = pickCategoryPosts(posts, b.slug, limit)
    return { block: b, posts: list }
  })

  return {
    props: {
      hero,
      editorial,
      latest,
      blocks,
      sidebar: { editorPicks, categories, contact: siteContact, breaking },
      ads: getAdsConfig(),
      menus,
    },
  }
}

export default function HomePage({
  hero = [],
  editorial = [],
  latest = [],
  blocks = [],
  sidebar,
  ads,
  menus,
}: {
  hero: Post[]
  editorial: Post[]
  latest: Post[]
  blocks: Array<{ block: HomeBlock; posts: Post[] }>
  sidebar: {
    editorPicks: { title: string; slug: string }[]
    categories: { title: string; slug: string }[]
    contact: SiteContactConfig
    breaking: Post[]
  }
  ads: AdsConfig
  menus: MenusConfig
}) {
  return (
    <>
      <SeoHead
        title="الرئيسية"
        description="تابع أبرز أخبار لبنان والعالم وتحليلات BeiruTalk اليومية في صفحة واحدة."
        path="/"
      />
      <SiteLayout ads={ads} breaking={sidebar.breaking} menus={menus}>
        <HeroStack posts={hero} />

        <AfterHeroGrid
          main={
            <>
              <EditorialReel posts={editorial} />

              <div className="hidden lg:block pt-10">
                <AdSlot id="home-inline-1" ads={ads} />
              </div>

              <LatestBlock posts={latest} />

              {/* Blocks controlled by homepage.json */}
              {blocks.map(({ block, posts }, idx) => {
                if (!posts?.length) return null
                return (
                  <div key={`${block.type}:${block.slug}:${idx}`}>
                    <div className="hidden lg:block pt-10">
                      <AdSlot
                        id={["home-inline-2", "home-inline-3"][idx % 2]}
                        ads={ads}
                      />
                    </div>
                    {renderBlock(block, posts)}
                  </div>
                )
              })}
            </>
          }
          aside={
            <Sidebar
              latest={latest}
              breaking={sidebar.breaking}
              editorPicks={sidebar.editorPicks}
              categories={sidebar.categories}
              contact={sidebar.contact}

              ads={ads}
            />
          }
        />
      </SiteLayout>
    </>
  )
}
