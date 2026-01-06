import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/content/types"
import { resolvePostImage } from "@/lib/content/media"

function fmtDate(date?: string) {
  if (!date) return ""
  try {
    return new Intl.DateTimeFormat("ar-LB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Beirut",
    }).format(new Date(date))
  } catch {
    return date
  }
}

function postHref(p: Post) {
  // keep consistent with your site routes
  return `/news/${p.fm.slug}`
}

export default function CategoryHighlight({
  title,
  href,
  posts = [],
}: {
  title: string
  href: string
  posts: Post[]
}) {
  if (!posts.length) return null

  const feature = posts[0]
  const follow = posts.slice(1, 6) // list
  const quick = posts.slice(6, 9)  // small row

  const f = feature.fm
  const featureImg = resolvePostImage(f, "/assets/placeholders/placeholder.jpg")

  return (
    <section className="bt-container mt-10">
      <div className="bt-rail bt-edge overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-extrabold text-black/75 md:text-[15px]">
              {title}
            </span>
            <span className="hidden sm:inline text-xs font-semibold text-black/40">
              {posts.length} أخبار
            </span>
          </div>

          <Link
            href={href}
            className="group inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-extrabold text-black/70 transition hover:bg-black/5"
          >
            <span>عرض المزيد</span>
            <span className="text-black/45 transition group-hover:translate-x-[-2px]">←</span>
          </Link>
        </div>

        {/* Body */}
        <div className="grid gap-6 px-5 pb-6 pt-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          {/* FEATURED */}
          <article className="group overflow-hidden rounded-[28px] border border-black/10 bg-white/75">
            <Link href={postHref(feature)} className="block">
              <div className="relative aspect-[16/9] bg-black/5">
                <Image
                  src={featureImg}
                  alt={f.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 860px"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                {/* clean overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/12 to-transparent" />

                {/* bottom glass meta */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between gap-3 rounded-full border border-white/15 bg-black/25 px-3 py-2 backdrop-blur-[6px]">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold text-white/90">
                      <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--bt-primary)]" />
                      <span className="text-white/80">{f.category || title}</span>
                      {f.date ? (
                        <>
                          <span className="text-white/35">•</span>
                          <span className="text-white/75">{fmtDate(f.date)}</span>
                        </>
                      ) : null}
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold text-white/90">
                      اقرأ <span className="text-white/70">‹</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-4">
                <h3 className="mt-1 text-xl font-extrabold leading-snug tracking-tight text-[color:var(--bt-headline)] sm:text-2xl">
                  {f.title}
                </h3>

                {f.description ? (
                  <div className="hidden md:block">
                    <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-black/60">
                      {f.description}
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 h-[2px] w-10 rounded-full bg-[color:var(--bt-primary)] transition-all duration-300 group-hover:w-16" />
              </div>
            </Link>
          </article>

          {/* RIGHT: FOLLOW FEED (thumbnails integrated) */}
          <aside className="rounded-[28px] border border-black/10 bg-white/60 p-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[11px] font-extrabold tracking-wide text-black/45">المتابعة</div>
                <div className="mt-1 text-sm font-extrabold text-black/75">{title}</div>
              </div>
              <div className="text-xs font-semibold text-black/40">{follow.length} أخبار</div>
            </div>

            {/* List */}
            <div className="mt-4 space-y-2">
              {follow.map((p, idx) => {
                const m = p.fm
                const img = resolvePostImage(m, "/assets/placeholders/placeholder.jpg")
                const isFirst = idx === 0

                return (
                  <Link
                    key={m.slug}
                    href={postHref(p)}
                    className={[
                      "group flex items-start gap-3 rounded-2xl border border-transparent p-3 transition",
                      "hover:bg-black/[0.03] hover:border-black/10",
                      isFirst ? "bg-white/70 border-black/10" : "",
                    ].join(" ")}
                  >
                    {/* thumb */}
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-black/5">
                      <Image
                        src={img}
                        alt={m.title}
                        fill
                        sizes="120px"
                        className="object-cover transition duration-500 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-black/45">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: "var(--bt-primary)" }}
                        />
                        <span>{fmtDate(m.date)}</span>
                        <span className="text-black/25">•</span>
                        <span className="text-black/45">{m.category || title}</span>
                        <span className="ms-auto text-black/30 transition group-hover:text-black/55">
                          ‹
                        </span>
                      </div>

                      <div className="mt-1 line-clamp-2 text-sm font-extrabold leading-snug text-[color:var(--bt-headline)]">
                        {m.title}
                      </div>

                      <div
                        className="mt-2 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-10"
                        style={{ background: "var(--bt-primary)" }}
                      />
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Quick row (connected, not “random images”) */}
            {quick.length ? (
              <div className="mt-5 border-t border-black/10 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-xs font-extrabold text-black/60">مختارات سريعة</div>
                  <div className="text-[11px] font-semibold text-black/40">عرض سريع</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {quick.map((p) => {
                    const m = p.fm
                    const img = resolvePostImage(m, "/assets/placeholders/placeholder.jpg")
                    return (
                      <Link
                        key={m.slug}
                        href={postHref(p)}
                        className="group overflow-hidden rounded-2xl border border-black/10 bg-white/70 transition hover:-translate-y-[2px] hover:bg-black/[0.03]"
                      >
                        <div className="relative aspect-[1/1] bg-black/5">
                          <Image
                            src={img}
                            alt={m.title}
                            fill
                            sizes="(max-width: 1024px) 33vw, 160px"
                            className="object-cover transition duration-500 group-hover:scale-[1.05]"
                          />
                        </div>
                        <div className="p-2.5">
                          <div className="line-clamp-2 text-[12px] font-extrabold leading-snug text-black/75">
                            {m.title}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  )
}
