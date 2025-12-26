import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/content/types"

function safeImg(src?: string) {
  return src && src.trim().length ? src : "/assets/placeholders/hero2.jpg"
}

export default function RelatedPosts({
  title = "مواضيع ذات صلة",
  moreHref,
  posts,
}: {
  title?: string
  moreHref?: string
  posts: Post[]
}) {
  if (!posts?.length) return null

  return (
    <section className="mt-8">
      <div className="rounded-[26px] border border-black/10 bg-white/80 p-4 backdrop-blur md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[16px] font-extrabold text-[color:var(--bt-headline)] md:text-[18px]">
            {title}
          </h3>

          {moreHref ? (
            <Link
              href={moreHref}
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-[12px] font-extrabold text-black/60 hover:bg-black/[0.03]"
            >
              عرض المزيد
            </Link>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {posts.slice(0, 4).map((p) => (
            <Link
              key={p.fm.slug}
              href={`/news/${p.fm.slug}`}
              className="group flex items-start gap-3 rounded-[18px] border border-black/10 bg-white px-3 py-3 hover:bg-black/[0.02]"
            >
              <div className="relative h-[64px] w-[64px] flex-none overflow-hidden rounded-[14px] border border-black/10 bg-black/5">
                <Image
                  src={safeImg(p.fm.featured_image)}
                  alt={p.fm.title}
                  fill
                  sizes="64px"
                  className="object-cover transition group-hover:scale-[1.03]"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-extrabold text-black/45">
                  {p.fm.category || "BeiruTalk"}
                </div>

                <div className="mt-1 line-clamp-2 text-[13px] font-extrabold leading-snug text-[color:var(--bt-headline)] md:text-[14px]">
                  {p.fm.title}
                </div>

                {p.fm.description ? (
                  <div className="mt-1 line-clamp-1 text-[12px] text-black/55">
                    {p.fm.description}
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
