import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/content/types"
import { resolvePostImage } from "@/lib/content/media"

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

function hrefFor(p: Post) {
  return `/news/${p.fm.slug}`
}

export default function LatestBlock({ posts }: { posts?: Post[] }) {
  const items = (posts ?? []).slice(0, 5)
  if (!items.length) return null

  const lead = items[0]
  const list = items.slice(1)

  return (
    <section className="relative mx-auto mt-10 max-w-[1560px] px-4">
      <div className="rounded-[32px] border border-black/10 bg-white/70 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-extrabold tracking-wide text-black/45">
              تغطية مستمرة
            </div>
            <h2 className="mt-1 text-lg font-extrabold text-[color:var(--bt-headline)] md:text-xl">
              آخر الأخبار
            </h2>
          </div>

          <Link
            href="/latest"
            className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-extrabold text-black/70 transition hover:bg-black/5"
          >
            عرض كل الأخبار
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
          {/* lead */}
          <article className="overflow-hidden rounded-[26px] border border-black/10 bg-white/80">
            <Link href={hrefFor(lead)} className="block">
              <div className="relative aspect-[16/9] bg-black/5">
                <Image
                  src={resolvePostImage(lead.fm, "/assets/placeholders/placeholder.jpg")}
                  alt={lead.fm.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                {/* bottom glass strip */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between gap-3 rounded-full border border-white/15 bg-black/25 px-3 py-2 backdrop-blur-[6px]">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold text-white/90">
                      {lead.fm.category ? (
                        <span className="rounded-full bg-white/15 px-3 py-1">
                          {lead.fm.category}
                        </span>
                      ) : null}
                      {lead.fm.date ? (
                        <span className="text-white/75">{fmt(lead.fm.date)}</span>
                      ) : null}
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold text-white/90">
                      اقرأ
                      <span className="text-white/70">‹</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <div className="p-4 md:p-5">
              <h3 className="bt-clamp-2 text-[20px] font-extrabold leading-snug text-[color:var(--bt-headline)] md:text-[22px]">
                <Link href={hrefFor(lead)} className="hover:underline underline-offset-4">
                  {lead.fm.title}
                </Link>
              </h3>
            </div>
          </article>

          {/* list */}
          <div className="overflow-hidden rounded-[26px] border border-black/10 bg-white/60">
            <div className="px-4 py-4 md:px-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-black/70">العناوين</div>
                <div className="text-[11px] font-semibold text-black/45">
                  {list.length} أخبار
                </div>
              </div>
            </div>

            <div className="divide-y divide-black/10">
              {list.map((p) => (
                <Link
                  key={p.fm.slug}
                  href={hrefFor(p)}
                  className="group block px-4 py-3 transition hover:bg-black/[0.03] md:px-5 md:py-3.5"
                >
                  {/* meta row (RTL-friendly: dot near start/right) */}
                  <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-black/50">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full opacity-70 group-hover:opacity-100"
                        style={{ background: "var(--bt-primary)" }}
                      />
                      {p.fm.category ? (
                        <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 font-extrabold text-black/60">
                          {p.fm.category}
                        </span>
                      ) : null}
                      {p.fm.date ? <span>{fmt(p.fm.date)}</span> : null}
                    </div>

                    <span className="text-black/35 transition group-hover:text-black/55">
                      ‹
                    </span>
                  </div>

                  <div className="mt-2 bt-clamp-2 text-[14px] font-extrabold leading-snug text-black/80">
                    {p.fm.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
