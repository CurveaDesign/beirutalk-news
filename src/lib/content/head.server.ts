import fs from "fs"
import path from "path"

export type HeadMetaTag = {
  enabled?: boolean
  name: string
  content: string
}

export type HeadExternalScript = {
  enabled?: boolean
  id: string
  src: string
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload"
  crossOrigin?: "anonymous" | "use-credentials"
}

export type HeadInlineScript = {
  enabled?: boolean
  id: string
  code: string
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload"
}

export type HeadConfig = {
  enabled?: boolean
  meta?: HeadMetaTag[]
  scripts?: HeadExternalScript[]
  inlineScripts?: HeadInlineScript[]
}

const DATA_DIR = path.join(process.cwd(), "content", "data")

export function getHeadConfig(): HeadConfig {
  try {
    const p = path.join(DATA_DIR, "head.json")
    const raw = fs.readFileSync(p, "utf8")
    const parsed = JSON.parse(raw) as HeadConfig
    return parsed ?? { enabled: false, meta: [], scripts: [], inlineScripts: [] }
  } catch {
    return { enabled: false, meta: [], scripts: [], inlineScripts: [] }
  }
}
