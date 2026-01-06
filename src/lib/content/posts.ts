import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Post, PostFrontmatter } from "./types"
import { getCategories } from "@/lib/content/data"

const POSTS_DIR = path.join(process.cwd(), "content", "posts")
const PINS_DIR = path.join(process.cwd(), "content", "pins")
const BACKSTAGE_DIR = path.join(process.cwd(), "content", "backstage")

function safeReadDir(dir: string) {
  try {
    return fs.readdirSync(dir)
  } catch {
    return []
  }
}

function parseMarkdownDir(dir: string): Post[] {
  const files = safeReadDir(dir).filter((f) => f.endsWith(".md"))
  const categoryList = getCategories()
  const categoriesBySlug = new Map<string, string>()
  const categoriesByTitle = new Map<string, string>()
  for (const category of categoryList) {
    const slug = typeof category.slug === "string" ? category.slug.trim() : ""
    const title = typeof category.title === "string" ? category.title.trim() : ""
    if (!slug || !title) continue
    categoriesBySlug.set(slug, title)
    categoriesByTitle.set(title, slug)
  }

  const items: Post[] = files.map((file) => {
    const fullPath = path.join(dir, file)
    const raw = fs.readFileSync(fullPath, "utf8")
    const parsed = matter(raw)
    const fm = parsed.data as PostFrontmatter

    // fallback slug from filename
    if (!fm.slug) fm.slug = file.replace(/\.md$/, "")

    const category =
      typeof fm.category === "string"
        ? fm.category.trim()
        : ""
    const categorySlug =
      typeof fm.category_slug === "string"
        ? fm.category_slug.trim()
        : ""

    let resolvedSlug = categorySlug
    let resolvedTitle = category

    if (!resolvedSlug && category) {
      const titleFromSlug = categoriesBySlug.get(category)
      if (titleFromSlug) {
        resolvedSlug = category
        resolvedTitle = titleFromSlug
      } else {
        const slugFromTitle = categoriesByTitle.get(category)
        if (slugFromTitle) {
          resolvedSlug = slugFromTitle
          const mappedTitle = categoriesBySlug.get(slugFromTitle)
          if (mappedTitle) resolvedTitle = mappedTitle
        }
      }
    }

    if (resolvedSlug) {
      const titleFromSlug = categoriesBySlug.get(resolvedSlug)
      if (titleFromSlug && (!resolvedTitle || resolvedTitle === resolvedSlug)) {
        resolvedTitle = titleFromSlug
      }
      fm.category_slug = resolvedSlug
    }

    if (resolvedTitle) {
      fm.category = resolvedTitle
    }

    return {
      fm,
      content: parsed.content ?? "",
    }
  })

  // newest first
  items.sort((a, b) => {
    const ad = new Date(a.fm.date).getTime() || 0
    const bd = new Date(b.fm.date).getTime() || 0
    return bd - ad
  })

  return items
}

export function getAllPosts(): Post[] {
  return parseMarkdownDir(POSTS_DIR)
}

export function getAllPins(): Post[] {
  return parseMarkdownDir(PINS_DIR)
}

export function getAllBackstage(): Post[] {
  return parseMarkdownDir(BACKSTAGE_DIR)
}

export function pickHeroPosts(posts: Post[], limit = 4) {
  const flagged = posts.filter((p) => p.fm.hero === true)
  const base = flagged.length ? flagged : posts
  return base.slice(0, limit)
}

export function pickEditorialPosts(posts: Post[], limit = 4) {
  return posts.filter((p) => p.fm.category_slug === "editorial").slice(0, limit)
}

export function pickCategoryPosts(posts: Post[], slug: string, limit = 4) {
  return posts.filter((p) => p.fm.category_slug === slug).slice(0, limit)
}

export function getPostBySlug(posts: Post[], slug: string) {
  return posts.find((p) => p.fm.slug === slug) || null
}

export function pickRelatedPosts(posts: Post[], current: Post, limit = 6) {
  const cat = current.fm.category_slug
  const related = posts
    .filter((p) => p.fm.slug !== current.fm.slug)
    .filter((p) => (cat ? p.fm.category_slug === cat : true))

  return related.slice(0, limit)
}

export function getAllPostSlugs() {
  const posts = getAllPosts()
  return posts.map((p) => p.fm.slug)
}

export function getAllPinSlugs() {
  const pins = getAllPins()
  return pins.map((p) => p.fm.slug)
}

export function getAllBackstageSlugs() {
  const items = getAllBackstage()
  return items.map((p) => p.fm.slug)
}
