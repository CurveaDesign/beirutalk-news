import fs from "fs"
import path from "path"

export type HomeBlockType =
  | "categorySpotlight"
  | "threeCards"
  | "horizontal"
  | "textList"
  | "videoStrip"

export type HomeBlock = {
  type: HomeBlockType
  title: string
  slug?: string
  limit?: number
  href?: string
}

export type HomeConfig = {
  blocks: HomeBlock[]
}

const HOMEPAGE_PATH = path.join(process.cwd(), "content", "data", "homepage.json")

function normalizeBlock(b: Partial<HomeBlock>): HomeBlock {
  // required fields
  const type = b.type as HomeBlockType
  const title = String(b.title || "").trim()

  // optional fields (only keep if valid)
  const slug = typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : undefined
  const href = typeof b.href === "string" && b.href.trim() ? b.href.trim() : undefined
  const limit = typeof b.limit === "number" && Number.isFinite(b.limit) ? b.limit : undefined

  // IMPORTANT: omit undefined keys (Next 16 strict serialization)
  return {
    type,
    title,
    ...(slug ? { slug } : {}),
    ...(href ? { href } : {}),
    ...(typeof limit === "number" ? { limit } : {}),
  }
}

export function getHomepageConfig(): HomeConfig {
  try {
    const raw = fs.readFileSync(HOMEPAGE_PATH, "utf8")
    const parsed = JSON.parse(raw) as Partial<HomeConfig>

    const blocksRaw = Array.isArray(parsed?.blocks) ? parsed.blocks : []
    const blocks = blocksRaw
      .map((b) => normalizeBlock(b))
      .filter((b) => b.type && b.title) // keep only valid

    return { blocks }
  } catch {
    return { blocks: [] }
  }
}
