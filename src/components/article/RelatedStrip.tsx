import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/content/types"

function postHref(slug: string) {
  return `/news/${slug}`
}

export default function RelatedStrip({ posts }: { posts: Post[] }) {
  const items = posts.slice(0, 6)
  if (!items.length) return null

  return (
    <section className="mt-10">
      <div className="bt-rail bt-edge overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-sm font-extrabold text-black/70">مقالات ذات صلة</h2>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto overflow-y-hidden px-5 pb-6 pt-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
          {items.map((p) => {
            const m = p.fm
            const img = m.featured_image || "/assets/placeholders/cover-1.jpg"
            return (
              <Link
                key={m.slug}
                href={postHref(m.slug)}
                className="group shrink-0 overflow-hidden rounded-[26px] border border-black/10 bg-white/75 transition hover:-translate-y-[2px] hover:bg-black/[0.03]"
                style={{ width: 260 }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={img}
                    alt={m.title}
                    fill
                    sizes="260px"
                    className="object-cover transition duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[11px] font-semibold text-black/45">
                    {m.category || ""}
                  </div>
                  <div className="mt-2 line-clamp-2 text-[14px] font-extrabold leading-snug text-[color:var(--bt-headline)]">
                    {m.title}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
