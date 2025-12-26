import Image from "next/image"

export default function ArticleHero({
  title,
  description,
  image,
  category,
  categorySlug,
  author,
  dateText,
  readMins,
}: {
  title: string
  description?: string
  image: string
  category?: string
  categorySlug?: string
  author?: string
  dateText?: string
  readMins?: number
}) {
  return (
    <section className="bt-container pt-4 md:pt-6">
      <div className="bt-rail bt-edge overflow-hidden">
        <div className="relative">
          {/* Background image */}
          <div className="relative h-[520px] w-full md:h-[620px]">
            <Image
              src={image}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
            {/* Curvea-style overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
            <div className="absolute inset-0 bt-noise opacity-30" />
          </div>

          {/* ✅ MOBILE HERO: title only (no heavy card) */}
          <div className="absolute inset-x-4 bottom-4 md:hidden">
            {category ? (
              <div className="mb-2 flex items-center gap-2">
                {categorySlug ? (
                  <a
                    href={`/category/${categorySlug}`}
                    className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] font-extrabold text-white backdrop-blur"
                  >
                    {category}
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[12px] font-extrabold text-white backdrop-blur">
                    {category}
                  </span>
                )}
              </div>
            ) : null}

            <h1 className="line-clamp-3 text-[24px] font-extrabold leading-snug text-white">
              {title}
            </h1>
          </div>

          {/* ✅ DESKTOP HERO: keep your original card design */}
          <div className="absolute inset-x-4 bottom-4 hidden md:block md:inset-x-7 md:bottom-7">
            <div className="bt-edge rounded-[28px] border border-white/10 bg-black/35 p-5 backdrop-blur-xl md:p-7">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/80">
                {categorySlug ? (
                  <a
                    href={`/category/${categorySlug}`}
                    className="rounded-full bg-white/10 px-3 py-1 text-white/90 hover:bg-white/15"
                  >
                    {category}
                  </a>
                ) : category ? (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-white/90">
                    {category}
                  </span>
                ) : null}

                {dateText ? <span className="text-white/55">{dateText}</span> : null}

                {typeof readMins === "number" ? (
                  <span className="text-white/55">• {readMins} دقائق</span>
                ) : null}

                {author ? <span className="ms-auto text-white/70">• {author}</span> : null}
              </div>

              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white md:text-4xl">
                {title}
              </h1>

              {description ? (
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
