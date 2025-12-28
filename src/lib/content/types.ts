export type PostFrontmatter = {
  title: string
  slug: string
  date: string
  description?: string
  category?: string
  category_slug?: string
  author?: string
  featured_image?: string
  breaking?: boolean
  breaking_text?: string
  hero?: boolean
  tags?: string[]
  editor_pick?: boolean
  editor_pick_order?: number

  // ✅ NEW: content type + video source
  type?: "article" | "tv"
  youtube?: string
}

export type Post = {
  fm: PostFrontmatter
  content: string
}
