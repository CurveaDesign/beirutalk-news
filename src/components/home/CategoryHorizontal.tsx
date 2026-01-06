import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/content/types"
import { resolvePostImage } from "@/lib/content/media"

function postHref(slug: string) {
  return `/news/${slug}`
}

export default function CategoryHorizontal({
  title,
  href,
  posts = [],
}: {
  title: string
  href: string
  posts: Post[]
}) {
  const items = posts.slice(0, 4)
  if (!items.length) return null

  return (
    <section className="bt-container mt-10">
      <div className="bt-rail bt-edge overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-extrabold text-black/75 md:text-[15px]">
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

        <div className="space-y-3 px-5 pb-6 pt-5">
          {items.map((p) => {
            const m = p.fm
            const img = resolvePostImage(m, "/assets/placeholder/thumb.jpg")

            return (
              <article
                key={m.slug}
                className="group overflow-hidden rounded-[26px] border border-black/10 bg-white/70 transition hover:bg-black/[0.03]"
              >
                <Link href={postHref(m.slug)} className="grid gap-0 md:grid-cols-[220px_1fr]">
                  <div className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden">
                    <Image
                      src={img}
                      alt={m.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 220px"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="text-[11px] font-semibold text-black/45">
                      {m.category || title}
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-[15px] font-extrabold leading-snug text-[color:var(--bt-headline)]">
                      {m.title}
                    </h3>
                    <div className="mt-3 h-[2px] w-10 rounded-full bg-[color:var(--bt-primary)] opacity-60 transition-all duration-300 group-hover:w-16" />
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
