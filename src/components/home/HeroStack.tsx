import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
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

export default function HeroStack({ posts }: { posts?: Post[] }) {
  const items = useMemo(() => (posts ?? []).slice(0, 3), [posts])
  const [active, setActive] = useState(0)

  // swipe
  const downX = useRef<number | null>(null)
  const dx = useRef(0)

  const next = () => setActive((v) => (v + 1) % items.length)
  const prev = () => setActive((v) => (v - 1 + items.length) % items.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (items.length <= 1) return
      if (e.key === "ArrowLeft") next()
      if (e.key === "ArrowRight") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [items.length])

  const onPointerDown = (e: React.PointerEvent) => {
    downX.current = e.clientX
    dx.current = 0
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (downX.current == null) return
    dx.current = e.clientX - downX.current
  }
  const onPointerUp = () => {
    if (downX.current == null) return
    const delta = dx.current
    downX.current = null
    dx.current = 0
    if (Math.abs(delta) < 48) return
    if (delta < 0) next()
    else prev()
  }

  if (!items.length) return null

  // front/mid/back order
  const order = items.map((_, idx) => (idx - active + items.length) % items.length)

  return (
    <section className="relative">
      <div className="relative min-h-[520px] md:min-h-[620px]">
        {items.map((p, idx) => {
          const pos = order[idx]
          const isFront = pos === 0

          const href = `/news/${p.fm.slug}`
          const img = p.fm.featured_image || "/assets/placeholders/placeholder.jpg"

          const t =
            pos === 0
              ? "translate3d(0,0,0) rotateY(0deg) scale(1)"
              : pos === 1
                ? "translate3d(-18px,16px,-40px) rotateY(-6deg) scale(0.98)"
                : "translate3d(-34px,30px,-80px) rotateY(-10deg) scale(0.96)"

          const z = pos === 0 ? "z-30" : pos === 1 ? "z-20" : "z-10"
          const shade = pos === 0 ? "opacity-100" : pos === 1 ? "opacity-75" : "opacity-55"

          return (
            <div
              key={p.fm.slug}
              className={`absolute inset-0 ${z} transition-[transform,opacity] duration-500 ease-out ${shade}`}
              style={{ transform: t }}
              onPointerDown={isFront ? onPointerDown : undefined}
              onPointerMove={isFront ? onPointerMove : undefined}
              onPointerUp={isFront ? onPointerUp : undefined}
              onPointerCancel={isFront ? onPointerUp : undefined}
              aria-hidden={!isFront}
            >
              <article className="relative h-full overflow-hidden rounded-[32px] border border-black/10 bg-[color:var(--bt-gray-light)] shadow-[0_30px_80px_rgba(0,0,0,0.14)]">
                {/* If image exists (or placeholder), we render it */}
                <Image
                  src={img}
                  alt={p.fm.title}
                  fill
                  priority={isFront}
                  sizes="100vw"
                  className="object-cover"
                />

                {/* Readability system */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent opacity-60" />

                {/* subtle brand glow, stays quiet */}
                <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_78%_14%,rgba(214,82,39,0.22),transparent_60%)]" />

                {/* content */}
                <div className="relative z-10 flex h-full items-end p-4 md:p-10">

                  <div className="w-full max-w-[58ch] rounded-[22px] bg-black/30 p-4 backdrop-blur-[6px] ring-1 ring-white/10 md:p-6 md:w-auto">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[11px] font-extrabold text-white/80">
                      <span className="h-2 w-2 rounded-full bg-[color:var(--bt-primary)]" />
                      أهم القصص
                    </div>

                    <h1 className="mt-5 text-[28px] font-extrabold leading-[1.12] line-clamp-2 tracking-tight text-white md:text-[54px] [text-shadow:0_10px_28px_rgba(0,0,0,0.45)]">
                      <Link href={href} className="hover:underline underline-offset-4" tabIndex={isFront ? 0 : -1}>
                        {p.fm.title}
                      </Link>
                    </h1>

{p.fm.description ? (
  <div className="hidden md:block">
    <p className="bt-clamp-2 mt-3 max-w-[60ch] text-sm leading-relaxed text-white/80 md:text-[15px]">
      {p.fm.description}
    </p>
  </div>
) : null}

                    {isFront ? (
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                          href={href}
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/95 px-5 py-3 text-sm font-extrabold text-black/80 transition hover:-translate-y-[1px] hover:bg-white"
                        >
                          اقرأ
                          <span className="text-black/35">‹</span>
                        </Link>

                        {items.length > 1 ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={prev}
                              className="rounded-full border border-white/15 bg-black/20 px-3 py-2 text-sm font-extrabold text-white/65 transition hover:-translate-y-[1px]"
                              aria-label="السابق"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              onClick={next}
                              className="rounded-full border border-white/15 bg-black/20 px-3 py-2 text-sm font-extrabold text-white/65 transition hover:-translate-y-[1px]"
                              aria-label="التالي"
                            >
                              ›
                            </button>
                          </div>
                        ) : null}

                        {/* bottom vertical stripe with title */}
                        <div className="ms-auto hidden items-end gap-3 md:flex">
                          <div className="h-16 w-[4px] rounded-full" style={{ background: "var(--curvea-grad)" }} />
                          <div className="max-w-[240px] pb-1">
                            <div className="text-[11px] font-extrabold uppercase tracking-wide text-white/70">
                              {p.fm.category || "—"}
                            </div>
                            <div className="mt-1 text-xs font-semibold text-white/75">
                              {p.fm.author ? p.fm.author : "BeiruTalk"} • {fmt(p.fm.date)}
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            </div>
          )
        })}
      </div>

    </section>
  )
}
