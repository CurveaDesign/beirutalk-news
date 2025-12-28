import Link from "next/link"
import Image from "next/image"
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

function isExternal(href?: string) {
  if (!href) return false
  return href.startsWith("http://") || href.startsWith("https://")
}

function normalizeSrc(src?: string) {
  if (!src) return ""
  const s = String(src).trim()

  // remote
  if (isExternal(s)) return s

  // already absolute
  if (s.startsWith("/")) return s

  // common: "assets/..." or "images/..." etc -> make it absolute from /public
  return `/${s}`
}

// react-markdown v9 typing: `inline` is not in the declared props,
// but it is still passed at runtime. We type it ourselves.
type CodeProps = React.ComponentPropsWithoutRef<"code"> & {
  inline?: boolean
  node?: unknown
}

type ImgProps = React.ComponentPropsWithoutRef<"img"> & {
  src?: string
  alt?: string
}

export default function ArticleBody({ markdown }: { markdown: string }) {
  return (
    <div className="bt-article">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-[color:var(--bt-headline)] md:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-9 text-xl font-extrabold tracking-tight text-[color:var(--bt-headline)] md:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 text-lg font-extrabold tracking-tight text-[color:var(--bt-headline)]">
              {children}
            </h3>
          ),

          // ✅ Fix hydration mismatch:
          p: ({ node, children }) => {
            const n: any = node
            const only = n?.children?.length === 1 ? n.children[0] : null

            // ![alt](src)
            if (only?.tagName === "img") return <>{children}</>

            // [![alt](src)](link)
            if (
              only?.tagName === "a" &&
              only?.children?.length === 1 &&
              only.children[0]?.tagName === "img"
            ) {
              return <>{children}</>
            }

            return (
              <p className="mt-4 text-[15px] leading-8 text-black/75 md:text-[16px]">
                {children}
              </p>
            )
          },

          ul: ({ children }) => (
            <ul className="mt-5 space-y-2 pr-6 text-[15px] leading-8 text-black/75 md:text-[16px]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-5 space-y-2 pr-6 text-[15px] leading-8 text-black/75 md:text-[16px]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="relative">
              <span
                className="absolute -right-5 top-[0.9em] h-2 w-2 rounded-full"
                style={{ background: "var(--bt-primary)" }}
                aria-hidden="true"
              />
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="mt-7 overflow-hidden rounded-3xl border border-black/10 bg-white/70">
              <div className="px-5 py-4">
                <div
                  className="mb-3 h-[2px] w-16 rounded-full opacity-90"
                  style={{ background: "var(--bt-primary)" }}
                />
                <div className="text-[15px] leading-8 text-black/75 md:text-[16px]">
                  {children}
                </div>
              </div>
            </blockquote>
          ),

          a: ({ href, children }) => {
            const url = href || ""
            if (!url) return <span>{children}</span>

            const cls =
              "font-extrabold text-[color:var(--bt-primary)] underline decoration-black/15 underline-offset-4 transition hover:decoration-black/35"

            if (isExternal(url)) {
              return (
                <a href={url} target="_blank" rel="noreferrer" className={cls}>
                  {children}
                </a>
              )
            }

            return (
              <Link href={url} className={cls}>
                {children}
              </Link>
            )
          },

          img: (props) => {
            const src = typeof props.src === "string" ? props.src : undefined
            const alt = typeof props.alt === "string" ? props.alt : undefined

            const finalSrc = normalizeSrc(src)
            if (!finalSrc) return null

            const caption = alt ? String(alt) : ""
            const remote = isExternal(finalSrc)

            return (
              <figure className="mt-7">
                <div className="overflow-hidden rounded-3xl border border-black/10 bg-black/[0.02]">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={finalSrc}
                      alt={caption || "image"}
                      fill
                      sizes="(max-width: 768px) 100vw, 760px"
                      className="object-cover"
                      unoptimized={remote}
                    />
                  </div>
                </div>

                {caption ? (
                  <figcaption className="mt-2 text-xs font-semibold text-black/50">
                    {caption}
                  </figcaption>
                ) : null}
              </figure>
            )
          },
          code: (props: CodeProps) => {
            const { inline, className, children, ...rest } = props
            const txt = String(children ?? "")
            const isInline = Boolean(inline) || !String(className || "").includes("language-")

            if (isInline) {
              return (
                <code
                  {...rest}
                  className="rounded-xl border border-black/10 bg-black/[0.03] px-2 py-1 text-[0.9em] font-extrabold text-black/75"
                >
                  {txt}
                </code>
              )
            }

            return (
              <code {...rest} className={className ? className : ""}>
                {txt}
              </code>
            )
          },

          pre: ({ children }) => (
            <pre className="mt-7 overflow-x-auto rounded-3xl border border-black/10 bg-[#0b0f19] p-5 text-sm leading-7 text-white/85">
              {children}
            </pre>
          ),

          hr: () => (
            <div className="my-8">
              <div className="h-px w-full bg-black/10" />
              <div
                className="mt-3 h-[2px] w-24 rounded-full opacity-80"
                style={{ background: "var(--bt-primary)" }}
              />
            </div>
          ),

          table: ({ children }) => (
            <div className="mt-7 overflow-x-auto">
              <div className="min-w-[520px] overflow-hidden rounded-3xl border border-black/10 bg-white/70">
                <table className="w-full border-collapse">{children}</table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-black/[0.03] text-black/70">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-black/10 px-4 py-3 text-right text-sm font-extrabold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-black/10 px-4 py-3 text-right text-sm text-black/75">
              {children}
            </td>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>

      <style jsx>{`
        /* Keeps it “Curvea editorial” without relying on prose plugin */
        .bt-article :global(p:first-of-type) {
          font-weight: 700;
          color: rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </div>
  )
}
