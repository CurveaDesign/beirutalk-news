import fs from "fs"
import path from "path"
import { siteContact } from "@/lib/siteConfig"
import type { Post } from "@/lib/content/types"

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
export type SocialLinks = Partial<Record<"facebook" | "instagram" | "x" | "youtube" | "tiktok" | "linkedin", string>>

export type AdsConfig = {
  adsense: { enabled: boolean; client?: string }
  slots: Array<{
    id: string
    enabled: boolean
    label?: string
    type: "custom" | "adsense"
    custom?: { image?: string; href?: string; alt?: string; openInNewTab?: boolean; width?: number; height?: number }
    adsense?: { slot?: string; format?: string; responsive?: boolean }
  }>
}

export function getAdsConfig() {
  return readJson<AdsConfig>("ads.json", { adsense: { enabled: false }, slots: [] })
}

export function getEditorPicks(allPosts: Post[] = []): EditorPick[] {
  // Preferred: editor chooses directly inside each post frontmatter
  // editor_pick: true
  // editor_pick_order: number (optional)
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

  // Backward compatibility: if no posts are flagged, we fall back to editor_picks.json (if present)
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

  // Final fallback: most recent posts
  return allPosts.slice(0, 5).map((p) => ({ title: p.fm.title, slug: p.fm.slug }))
}

export function getCategories(): CategoryItem[] {
  const data = readJson<{ categories: CategoryItem[] }>("categories.json", { categories: [] })
  return data.categories || []
}

export function getSocialLinks(): SocialLinks {
  return siteContact.socials || {}
}

// -------------------------
// Authors & Tags taxonomies
// Stored as individual JSON files in:
// - content/data/authors/<slug>.json
// - content/data/tags/<slug>.json
// -------------------------

export type TaxonomyItem = {
  slug: string
  display_name: string
  [key: string]: unknown
}

function readJsonDir<T extends Record<string, unknown>>(
  dirName: string,
  fallback: T[] = [] as T[]
): T[] {
  try {
    const dir = path.join(DATA_DIR, dirName)
    if (!fs.existsSync(dir)) return fallback
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".json"))
      .sort()

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
