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
  slug: string
  limit?: number
  href?: string
}

export type HomeConfig = {
  blocks: HomeBlock[]
}

const HOMEPAGE_PATH = path.join(process.cwd(), "content", "data", "homepage.json")

export function getHomepageConfig(): HomeConfig {
  try {
    const raw = fs.readFileSync(HOMEPAGE_PATH, "utf8")
    const parsed = JSON.parse(raw) as HomeConfig
    if (!parsed?.blocks?.length) return { blocks: [] }
    return parsed
  } catch {
    return { blocks: [] }
  }
}
