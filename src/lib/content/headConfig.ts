import raw from "../../../content/data/head.json"

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

export const headConfig = raw as HeadConfig
