import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Post, PostFrontmatter } from "./types"
import { getCategories } from "@/lib/content/data"

const POSTS_DIR = path.join(process.cwd(), "content", "posts")

function safeReadDir(dir: string) {
  try {
    return fs.readdirSync(dir)
  } catch {
    return []
  }
}

export function getAllPosts(): Post[] {
  const files = safeReadDir(POSTS_DIR).filter((f) => f.endsWith(".md"))
  const categoryList = getCategories()
  const posts: Post[] = files.map((file) => {
    const fullPath = path.join(POSTS_DIR, file)
    const raw = fs.readFileSync(fullPath, "utf8")
    const parsed = matter(raw)

    const fm = parsed.data as PostFrontmatter

    // fallback slug from filename
    if (!fm.slug) fm.slug = file.replace(/\.md$/, "")

    const category = (fm.category || "").trim()
    const categorySlug = (fm.category_slug || "").trim()

    if (!categorySlug && category) {
      fm.category_slug = category
      const match = categoryList.find((c) => c.slug === fm.category_slug)
      if (match) fm.category = match.title
    }

    if (fm.category_slug) {
      const match = categoryList.find((c) => c.slug === fm.category_slug)
      if (!category && match) fm.category = match.title
      if (category && category === fm.category_slug && match) fm.category = match.title
    }


    return {
      fm,
      content: parsed.content ?? "",
    }
  })

  // newest first
  posts.sort((a, b) => {
    const ad = new Date(a.fm.date).getTime() || 0
    const bd = new Date(b.fm.date).getTime() || 0
    return bd - ad
  })

  return posts
}

export function pickHeroPosts(posts: Post[], limit = 4) {
  const flagged = posts.filter((p) => p.fm.hero === true)
  const base = flagged.length ? flagged : posts
  return base.slice(0, limit)
}

export function pickEditorialPosts(posts: Post[], limit = 4) {
  return posts
    .filter((p) => p.fm.category_slug === "editorial")
    .slice(0, limit)
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