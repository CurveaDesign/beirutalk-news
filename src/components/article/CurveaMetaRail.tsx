export default function CurveaMetaRail({
  author,
  date,
  readMins,
}: {
  author?: string
  date?: string
  readMins?: number
}) {
  return (
    <div className="mt-4 rounded-[22px] border border-black/10 bg-white/80 px-4 py-3 backdrop-blur md:mt-5 md:px-5 md:py-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Right side (RTL): author/date */}
        <div className="text-right text-[12px] font-bold text-black/55">
          {author ? <span className="font-extrabold text-black/70">{author}</span> : null}
          {author && date ? <span className="mx-2 text-black/25">•</span> : null}
          {date ? <span>{date}</span> : null}
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
