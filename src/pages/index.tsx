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
import {
  getAllPosts,
  getAllPins,
  getAllBackstage,
  pickEditorialPosts,
  pickHeroPosts,
  pickCategoryPosts,
} from "@/lib/content/posts"

import {
  getAdsConfig,
  getCategories,
  getMenusConfig,
  getSiteContact,
  type AdsConfig,
  type MenusConfig,
} from "@/lib/content/data"

import { getHomepageConfig, type HomeBlock } from "@/lib/content/homepage"
import type { SiteContactConfig } from "@/lib/siteConfig"

function blockHref(block: HomeBlock) {
  if (block.href) return block.href
  if (block.type === "videoStrip") return "/videos"
  if (block.slug) return `/category/${block.slug}`
  return "/"
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

  const hero = pickHeroPosts(posts, 6)
  const editorial = pickEditorialPosts(posts, 10)
  const latest = posts.slice(0, 5)

  const categories = getCategories()
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

  const cfg = getHomepageConfig()

  const tvPosts = posts.filter((p) => String(p.fm.type || "").toLowerCase() === "tv")

  const blocks = cfg.blocks.map((b) => {
    const limit = b.limit ?? 4

    // ✅ videoStrip does NOT need slug, it uses TV posts
    if (b.type === "videoStrip") {
      return { block: b, posts: tvPosts.slice(0, limit) }
    }

    // ✅ category blocks must have slug, otherwise render nothing
    if (!b.slug) {
      return { block: b, posts: [] as Post[] }
    }

    const list = pickCategoryPosts(posts, b.slug, limit)
    return { block: b, posts: list }
  })
  return {
    props: {
      hero,
      editorial,
      latest,
      blocks,
      sidebar: {
        categories,
        contact,
        breaking,
        mostRead,
        pins,
        backstage,
      },
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
    categories: { title: string; slug: string }[]
    contact: SiteContactConfig
    breaking: Post[]
    mostRead: Post[]
    pins: Post[]
    backstage: Post[]
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

              <div className="pt-6 sm:pt-8 lg:pt-10">
                <div className="bt-noise overflow-hidden rounded-2xl border border-black/10 bg-white/70">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-[11px] font-semibold text-black/45">Advertisement</div>
                  </div>

                  <div className="p-3">
                    <div
                      className="mx-auto w-full max-w-[360px] sm:max-w-[520px] lg:max-w-none
                        [&_img]:h-auto [&_img]:w-full [&_img]:max-w-full
                        [&_iframe]:w-full [&_iframe]:max-w-full"
                    >
                      <AdSlot id="home-inline-1" ads={ads} />
                    </div>
                  </div>
                </div>
              </div>

              <LatestBlock posts={latest} />

              {blocks.map(({ block, posts }, idx) => {
                if (!posts?.length) return null
                return (
                  <div key={`${block.type}:${block.slug || "no-slug"}:${idx}`}>

                    <div className="pt-6 sm:pt-8 lg:pt-10">
                      <div className="bt-noise overflow-hidden rounded-2xl border border-black/10 bg-white/70">
                        <div className="flex items-center justify-between px-3 py-2">
                          <div className="text-[11px] font-semibold text-black/45">Advertisement</div>
                        </div>

                        <div className="p-3">
                          <div
                            className="mx-auto w-full max-w-[360px] sm:max-w-[520px] lg:max-w-none
                              [&_img]:h-auto [&_img]:w-full [&_img]:max-w-full
                              [&_iframe]:w-full [&_iframe]:max-w-full"
                          >
                            <AdSlot id={["home-inline-2", "home-inline-3"][idx % 2]} ads={ads} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {renderBlock(block, posts)}
                  </div>
                )
              })}
            </>
          }
          aside={
            <Sidebar
              breaking={sidebar.breaking}
              mostRead={sidebar.mostRead}
              pins={sidebar.pins}
              backstage={sidebar.backstage}
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
