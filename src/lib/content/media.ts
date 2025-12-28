import type { PostFrontmatter } from "@/lib/content/types"

export function youtubeId(url?: string) {
  const u = (url || "").trim()
  if (!u) return ""

  const m1 = u.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/i)
  if (m1?.[1]) return m1[1]

  const m2 = u.match(/[?&]v=([A-Za-z0-9_-]{6,})/i)
  if (m2?.[1]) return m2[1]

  const m3 = u.match(/\/embed\/([A-Za-z0-9_-]{6,})/i)
  if (m3?.[1]) return m3[1]

  const m4 = u.match(/\/shorts\/([A-Za-z0-9_-]{6,})/i)
  if (m4?.[1]) return m4[1]

  return ""
}

export function youtubeThumb(url?: string, quality: "hq" | "max" = "hq") {
  const id = youtubeId(url)
  if (!id) return ""
  return quality === "max"
    ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

export function resolvePostImage(
  fm: Pick<PostFrontmatter, "featured_image" | "type" | "youtube">,
  fallback = "/assets/placeholders/placeholder.jpg"
) {
  const manual = (fm.featured_image || "").trim()
  if (manual) return manual

  if (fm.type === "tv") {
    const yt = (fm.youtube || "").trim()
    const thumb = yt ? youtubeThumb(yt, "hq") : ""
    if (thumb) return thumb
  }

  return fallback
}
