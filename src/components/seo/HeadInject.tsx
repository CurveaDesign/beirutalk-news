import Head from "next/head"
import Script from "next/script"
import { headConfig } from "@/lib/content/headConfig"
import type { HeadConfig } from "@/lib/content/headConfig"

function uniqById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>()
  const out: T[] = []
  for (const it of items) {
    const id = (it?.id || "").trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(it)
  }
  return out
}

export default function HeadInject({ config }: { config?: HeadConfig }) {
  const cfg = config ?? headConfig
  if (!cfg?.enabled) return null

  const meta = (cfg.meta || []).filter((m) => (m.enabled ?? true) && !!m.name)
  const scripts = uniqById((cfg.scripts || []).filter((s) => (s.enabled ?? true) && !!s.src && !!s.id))
  const inlineScripts = uniqById((cfg.inlineScripts || []).filter((s) => (s.enabled ?? true) && !!s.code && !!s.id))

  return (
    <>
      <Head>
        {meta.map((m) => (
          <meta key={`meta-${m.name}`} name={m.name} content={m.content || ""} />
        ))}
      </Head>

      {scripts.map((s) => (
        <Script
          key={`ext-${s.id}`}
          id={s.id}
          src={s.src}
          strategy={s.strategy || "afterInteractive"}
          {...(s.crossOrigin ? { crossOrigin: s.crossOrigin } : {})}
        />
      ))}

      {inlineScripts.map((s) => (
        <Script
          key={`inl-${s.id}`}
          id={s.id}
          strategy={s.strategy || "afterInteractive"}
          dangerouslySetInnerHTML={{ __html: s.code }}
        />
      ))}
    </>
  )
}
