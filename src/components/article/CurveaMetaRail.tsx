import Link from "next/link"
import Image from "next/image"

export default function CurveaMetaRail({
  authorName,
  authorSlug,
  authorAvatar,
  date,
  readMins,
}: {
  authorName?: string
  authorSlug?: string
  authorAvatar?: string
  date?: string
  readMins?: number
}) {
  const authorHref = authorSlug ? `/author/${encodeURIComponent(authorSlug)}` : ""

  return (
    <div className="rounded-[24px] border border-black/10 bg-white/80 px-4 py-3 backdrop-blur md:px-6 md:py-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Right side (RTL): author */}
        <div className="flex min-w-0 items-center justify-end gap-3 text-right">
          {authorAvatar ? (
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-black/10 bg-black/5 shadow-sm md:h-12 md:w-12">
              <Image
                src={authorAvatar}
                alt={authorName ?? "Author"}
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </span>
          ) : null}

          <div className="min-w-0 leading-tight">
            {authorName && authorSlug ? (
              <Link
                href={authorHref}
                className="block truncate text-[13px] font-extrabold text-black/80 hover:underline md:text-[14px]"
              >
                {authorName}
              </Link>
            ) : authorName ? (
              <span className="block truncate text-[13px] font-extrabold text-black/80 md:text-[14px]">
                {authorName}
              </span>
            ) : null}

            {date ? (
              <span className="mt-0.5 block text-[11px] font-bold text-black/45 md:text-[12px]">
                {date}
              </span>
            ) : null}
          </div>
        </div>

        <div />

        {/* Left side: reading time */}
        <div className="text-left">
          {typeof readMins === "number" ? (
            <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-extrabold text-black/55">
              {readMins} دقائق قراءة
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
