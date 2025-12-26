import Link from "next/link"
import type { Post } from "@/lib/content/types"

function postHref(slug: string) {
  return `/news/${slug}`
}
function fmt(dateISO?: string) {
  if (!dateISO) return ""
  try {
    return new Date(dateISO).toLocaleDateString("ar-LB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateISO
  }
}

export default function AnalysisList({
  title,
  href,
  posts = [],
}: {
  title: string
  href: string
  posts: Post[]
}) {
  const items = posts.slice(0, 3)
  if (!items.length) return null

  return (
    <section className="bt-container mt-10">
      <div className="bt-rail bt-edge overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-extrabold text-black/70">
            {title}
          </span>

          <Link
            href={href}
            className="group inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-extrabold text-black/70 transition hover:bg-black/5"
          >
            <span>عرض المزيد</span>
            <span className="text-black/45 transition group-hover:translate-x-[-2px]">←</span>
          </Link>
        </div>

        <div className="divide-y divide-black/10 px-5 pb-3 pt-5">
          {items.map((p) => {
            const m = p.fm
            return (
              <article key={m.slug} className="py-4">
                <div className="text-[11px] font-semibold text-black/45">
                  {m.author ? <span>{m.author}</span> : null}
                  {m.author ? <span className="mx-2 text-black/25">•</span> : null}
                  {m.date ? <span>{fmt(m.date)}</span> : null}
                </div>

                <h3 className="mt-2 line-clamp-2 text-[15px] font-extrabold leading-snug text-[color:var(--bt-headline)]">
                  <Link href={postHref(m.slug)} className="transition hover:text-black/85">
                    {m.title}
                  </Link>
                </h3>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
