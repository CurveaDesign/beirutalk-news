import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/content/types"

function postHref(slug: string) {
  return `/news/${slug}`
}

export default function VideoStrip({
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

        <div className="grid gap-4 px-5 pb-6 pt-5 md:grid-cols-3">
          {items.map((p) => {
            const m = p.fm
            const img = m.featured_image || "/assets/placeholder/video.jpg"

            return (
              <article
                key={m.slug}
                className="group overflow-hidden rounded-[26px] border border-black/10 bg-white/70 transition hover:-translate-y-[2px] hover:bg-black/[0.03]"
              >
                <Link href={postHref(m.slug)} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={img}
                      alt={m.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                      ▶
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug text-[color:var(--bt-headline)]">
                      {m.title}
                    </h3>
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
