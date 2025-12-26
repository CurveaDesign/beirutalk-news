import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/content/types"

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

export default function EditorialReel({ posts }: { posts?: Post[] }) {
  const items = (posts ?? []).slice(0, 7)
  if (items.length === 0) return null

  const featured = items[0]
  const rest = items.slice(1)

  return (
    <section className="relative mx-auto max-w-[1560px] px-4">
      {/* Softer wrapper: less “dashboard box” */}
      <div className="rounded-[32px] border border-black/10 bg-white/60 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.08)] backdrop-blur md:p-8">
        {/* header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-extrabold tracking-wide text-black/45">
              مختارات
            </div>
            <h2 className="mt-1 text-lg font-extrabold text-[color:var(--bt-headline)] md:text-xl">
              زاوية المحرّر
            </h2>
          </div>

          <Link
            href="/category/editorial"
            className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-extrabold text-black/70 transition hover:bg-black/5"
          >
            عرض المزيد
          </Link>
        </div>

        {/* layout */}
        <div className="mt-6 grid gap-5 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
          {/* FEATURED */}
          <article className="overflow-hidden rounded-[26px] border border-black/10 bg-white/80">
            <Link href={hrefFor(featured)} className="block">
              <div className="relative aspect-[16/9] bg-black/5">
                <Image
                  src={featured.fm.featured_image || "/assets/placeholders/hero.jpg"}
                  alt={featured.fm.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>
            </Link>

            <div className="p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-black/55">
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1">
                  <span className="h-2 w-2 rounded-full" style={{ background: "var(--bt-primary)" }} />
                  زاوية المحرّر
                </span>
                {featured.fm.date ? (
                  <>
                    <span className="text-black/30">•</span>
                    <span>{fmt(featured.fm.date)}</span>
                  </>
                ) : null}
              </div>

              <h3 className="mt-3 bt-clamp-2 text-[18px] font-extrabold leading-snug text-[color:var(--bt-headline)] md:text-[22px]">
                <Link href={hrefFor(featured)} className="hover:underline underline-offset-4">
                  {featured.fm.title}
                </Link>
              </h3>

              {featured.fm.description ? (
                <div className="hidden md:block">
                  <p className="bt-clamp-2 mt-2 text-[14px] leading-relaxed text-black/60">
                    {featured.fm.description}
                  </p>
                </div>
              ) : null}

              <div className="mt-4 flex items-center">
                <Link
                  href={hrefFor(featured)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/75 transition hover:-translate-y-[1px] hover:bg-black/5"
                >
                  اقرأ
                  <span className="text-black/35">‹</span>
                </Link>

                <div className="ms-auto hidden h-9 w-[4px] rounded-full md:block" style={{ background: "var(--curvea-grad)" }} />
              </div>
            </div>
          </article>

          {/* HIGHLIGHTS GRID (replaces “stories circles”) */}
          <div className="rounded-[26px] border border-black/10 bg-white/60 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-black/70">أبرز المختارات</div>
              <div className="text-[11px] font-semibold text-black/45">قصص قصيرة</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {rest.slice(0, 4).map((p) => (
                <Link
                  key={p.fm.slug}
                  href={hrefFor(p)}
                  className="group overflow-hidden rounded-[18px] border border-black/10 bg-white/80 transition hover:-translate-y-[2px]"
                >
                  <div className="relative aspect-[4/3] bg-black/5">
                    <Image
                      src={p.fm.featured_image || "/assets/placeholders/hero.jpg"}
                      alt={p.fm.title}
                      fill
                      sizes="260px"
                      className="object-cover transition duration-[900ms] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  </div>

                  <div className="p-3">
                    <div className="bt-clamp-2 text-[12px] font-extrabold leading-snug text-black/75">
                      {p.fm.title}
                    </div>
                    {p.fm.date ? (
                      <div className="mt-1 text-[10px] font-semibold text-black/45">
                        {fmt(p.fm.date)}
                      </div>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>

            {/* If you want more than 4, show a horizontal strip under grid */}
            {rest.length > 4 ? (
              <div className="mt-4 border-t border-black/10 pt-3">
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
                  {rest.slice(4).map((p) => (
                    <Link key={p.fm.slug} href={hrefFor(p)} className="group shrink-0">
                      <div className="w-[190px] overflow-hidden rounded-[16px] border border-black/10 bg-white/80">
                        <div className="relative h-[86px] bg-black/5">
                          <Image
                            src={p.fm.featured_image || "/assets/placeholders/hero.jpg"}
                            alt={p.fm.title}
                            fill
                            sizes="220px"
                            className="object-cover transition duration-[900ms] group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="p-3">
                          <div className="bt-clamp-2 text-[12px] font-extrabold leading-snug text-black/70">
                            {p.fm.title}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
