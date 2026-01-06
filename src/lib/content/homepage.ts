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
const BLOCK_TYPES: HomeBlockType[] = [
  "categorySpotlight",
  "threeCards",
  "horizontal",
  "textList",
  "videoStrip",
]

function normalizeBlock(b: Partial<HomeBlock>): HomeBlock | null {
  // required fields
  const rawType = typeof b.type === "string" ? b.type.trim() : ""
  if (!BLOCK_TYPES.includes(rawType as HomeBlockType)) return null

  const title = typeof b.title === "string" ? b.title.trim() : ""
  if (!title) return null

  // optional fields (only keep if valid)
  const slug = typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : undefined
  const href = typeof b.href === "string" && b.href.trim() ? b.href.trim() : undefined
  const limit = typeof b.limit === "number" && Number.isFinite(b.limit) ? b.limit : undefined

  // IMPORTANT: omit undefined keys (Next 16 strict serialization)
  return {
    type: rawType as HomeBlockType,
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
      .filter((b): b is HomeBlock => Boolean(b))

    return { blocks }
  } catch {
    return { blocks: [] }
  }
}
