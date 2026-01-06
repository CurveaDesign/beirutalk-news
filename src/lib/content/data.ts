import fs from "fs"
import path from "path"
import type { Post } from "@/lib/content/types"
import type { SiteContactConfig } from "@/lib/siteConfig"

const DATA_DIR = path.join(process.cwd(), "content", "data")

function readJson<T>(file: string, fallback: T): T {
  try {
    const p = path.join(DATA_DIR, file)
    const raw = fs.readFileSync(p, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export type EditorPick = { title: string; slug: string }
export type CategoryItem = { title: string; slug: string }
export type SocialLinks = Partial<
  Record<"facebook" | "instagram" | "x" | "youtube" | "tiktok" | "linkedin", string>
>

export type AdsConfig = {
  adsense: { enabled: boolean; client?: string }
  slots: Array<{
    id: string
    enabled: boolean
    label?: string
    type: "custom" | "adsense"
    custom?: {
      image?: string
      href?: string
      alt?: string
      openInNewTab?: boolean
      width?: number
      height?: number
    }
    adsense?: { slot?: string; format?: string; responsive?: boolean }
  }>
}

export function getAdsConfig() {
  return readJson<AdsConfig>("ads.json", { adsense: { enabled: false }, slots: [] })
}

export type MenuLink = {
  type: "home" | "category" | "custom"
  label: string
  href?: string
  slug?: string
  enabled?: boolean
}

export type MenusConfig = {
  header: MenuLink[]
  footerSections: MenuLink[]
}

export function getMenusConfig(): MenusConfig {
  const fallback: MenusConfig = {
    header: [
      { type: "home", label: "الرئيسية", href: "/", enabled: true },
      { type: "category", label: "لبنان", slug: "lebanon", enabled: true },
      { type: "category", label: "العالم", slug: "world", enabled: true },
      { type: "category", label: "اقتصاد", slug: "economy", enabled: true },
      { type: "category", label: "تحليلات", slug: "analysis", enabled: true },
      { type: "category", label: "زاوية المحرّر", slug: "editorial", enabled: true },
      { type: "custom", label: "BeiruTalk TV", href: "/videos", enabled: true },
    ],
    footerSections: [
      { type: "custom", label: "آخر الأخبار", href: "/latest", enabled: true },
      { type: "custom", label: "كل الأخبار", href: "/news", enabled: true },
      { type: "category", label: "لبنان", slug: "lebanon", enabled: true },
      { type: "category", label: "العالم", slug: "world", enabled: true },
      { type: "category", label: "اقتصاد", slug: "economy", enabled: true },
    ],
  }

  const cfg = readJson<Partial<MenusConfig>>("menus.json", fallback)

  const normalize = (items?: MenuLink[]) =>
    (items || [])
      .filter((x) => (x?.enabled ?? true) && !!(x?.label || "").trim())
      .map((x) => ({ ...x, enabled: x.enabled ?? true }))

  return {
    header: normalize(cfg.header ?? fallback.header),
    footerSections: normalize(cfg.footerSections ?? fallback.footerSections),
  }
}

/**
 * OLD: editor picks (will be removed later once you remove from YAML + UI)
 * Keeping it here temporarily because your project still imports it in some places.
 */
export function getEditorPicks(allPosts: Post[] = []): EditorPick[] {
  const picks = allPosts
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

  if (picks.length) return picks

  const data = readJson<{ picks: Array<Partial<EditorPick> & { slug: string }> }>("editor_picks.json", { picks: [] })
  const fromJson = (data.picks || [])
    .map((p) => {
      const slug = (p.slug || "").trim()
      if (!slug) return null
      const post = allPosts.find((x) => x.fm.slug === slug)
      return {
        slug,
        title: post?.fm.title || (p.title || "").trim() || slug,
      } as EditorPick
    })
    .filter(Boolean) as EditorPick[]

  if (fromJson.length) return fromJson

  return allPosts.slice(0, 5).map((p) => ({ title: p.fm.title, slug: p.fm.slug }))
}

/** ✅ Source of truth: PageCMS file content/data/siteContact.json */
export function getSiteContact(): SiteContactConfig {
  return readJson<SiteContactConfig>("siteContact.json", { email: "", whatsapp: "", socials: {} })
}

/** ✅ Social links should come from the same source as Sidebar */
export function getSocialLinks(): SocialLinks {
  const c = getSiteContact()
  return (c?.socials || {}) as SocialLinks
}

// -------------------------
// Authors & Tags taxonomies
// -------------------------

export type TaxonomyItem = {
  slug: string
  display_name: string
  [key: string]: unknown
}

function readJsonDir<T extends Record<string, unknown>>(dirName: string, fallback: T[] = [] as T[]): T[] {
  try {
    const dir = path.join(DATA_DIR, dirName)
    if (!fs.existsSync(dir)) return fallback
    const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".json")).sort()

    const out: T[] = []
    for (const f of files) {
      try {
        const raw = fs.readFileSync(path.join(dir, f), "utf8")
        const obj = JSON.parse(raw) as T
        out.push(obj)
      } catch {
        // ignore bad entry
      }
    }
    return out
  } catch {
    return fallback
  }
}

export function getCategories(): CategoryItem[] {
  const items = readJsonDir<CategoryItem>("categories", [])
  return items.filter(
    (item) => typeof item?.slug === "string" && item.slug.trim() && typeof item?.title === "string" && item.title.trim(),
  )
}

export function getAuthors(): TaxonomyItem[] {
  return readJsonDir<TaxonomyItem>("authors", [])
}

export function getTags(): TaxonomyItem[] {
  return readJsonDir<TaxonomyItem>("tags", [])
}

export function getAuthorsMap(): Record<string, TaxonomyItem> {
  const list = getAuthors()
  const map: Record<string, TaxonomyItem> = {}
  for (const a of list) {
    if (a?.slug) map[a.slug] = a
  }
  return map
}

export function getTagsMap(): Record<string, TaxonomyItem> {
  const list = getTags()
  const map: Record<string, TaxonomyItem> = {}
  for (const t of list) {
    if (t?.slug) map[t.slug] = t
  }
  return map
}
