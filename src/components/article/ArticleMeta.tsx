import Link from "next/link"

export default function ArticleMeta({
  category,
  categorySlug,
  author,
  date,
  tags,
}: {
  category?: string
  categorySlug?: string
  author?: string
  date?: string
  tags?: string[]
}) {
  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {category && categorySlug ? (
          <Link
            href={`/category/${categorySlug}`}
            className="rounded-full border border-black/10 bg-white/75 px-3 py-1 text-xs font-extrabold text-black/70 transition hover:bg-black/[0.03]"
          >
            {category}
          </Link>
        ) : category ? (
          <span className="rounded-full border border-black/10 bg-white/75 px-3 py-1 text-xs font-extrabold text-black/70">
            {category}
          </span>
        ) : null}

        {author ? (
          <span className="text-sm font-semibold text-black/60">{author}</span>
        ) : null}

        {author && date ? <span className="text-black/25">•</span> : null}

        {date ? <span className="text-sm font-semibold text-black/50">{date}</span> : null}
      </div>

      {tags?.length ? (
        <div className="flex flex-wrap items-center gap-2">
          {tags.slice(0, 6).map((t) => (
            <span
              key={t}
              className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-bold text-black/60"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-2xl border border-black/10 bg-white/75 px-4 py-2 text-sm font-extrabold text-black/70 transition hover:bg-black/[0.03]"
        >
          مشاركة
        </button>
        <button
          type="button"
          className="rounded-2xl border border-black/10 bg-white/75 px-4 py-2 text-sm font-extrabold text-black/70 transition hover:bg-black/[0.03]"
        >
          نسخ الرابط
        </button>
      </div>
    </div>
  )
}
