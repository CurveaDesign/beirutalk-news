import Image from "next/image"
import type { Post } from "@/lib/content/types"
import AdSlot from "@/components/ads/AdSlot"
import type { AdsConfig } from "@/lib/content/data"
import { resolvePostImage } from "@/lib/content/media"

function formatArabicDate(dateISO?: string) {
  if (!dateISO) return ""
  const d = new Date(dateISO)
  if (Number.isNaN(d.getTime())) return ""
  try {
    return new Intl.DateTimeFormat("ar-LB", {
      month: "short",
      day: "numeric",
      timeZone: "Asia/Beirut",
    }).format(d)
  } catch {
    return d.toLocaleDateString()
  }
}


export default function ArticleSidebar({
  latest,
  related,
  ads,
}: {
  latest: Post[]
  related: Post[]
  ads?: AdsConfig
}) {
  const topRelated = related?.slice(0, 4) || []
  const topLatest = latest?.slice(0, 6) || []

  return (
    <div className="space-y-6">
      {/* Ad 300x250 */}
      <AdSlot id="sidebar_top" ads={ads} />
      {/* Related */}
      {topRelated.length ? (
        <div className="bt-rail bt-edge overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="text-sm font-extrabold text-[color:var(--bt-headline)]">مواضيع ذات صلة</div>
            <span className="text-xs font-semibold text-black/40">{topRelated.length}</span>
          </div>

          <div className="p-4 space-y-3">
            {topRelated.map((p) => (
              <a
                key={p.fm.slug}
                href={`/news/${p.fm.slug}`}
                className="group flex gap-3 rounded-2xl border border-black/10 bg-white/70 p-3 transition hover:bg-black/[0.03]"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03]">
                  <Image
                    src={resolvePostImage(p.fm, "/assets/placeholder-article.jpg")}
                    alt={p.fm.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-black/45">
                    {p.fm.category || "BeiruTalk"} • {formatArabicDate(p.fm.date)}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm font-extrabold text-[color:var(--bt-headline)]">
                    {p.fm.title}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {/* Ad 300x600 */}
      <AdSlot id="sidebar_mid" ads={ads} />
      {/* Latest */}
      {topLatest.length ? (
        <div className="bt-rail bt-edge overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="text-sm font-extrabold text-[color:var(--bt-headline)]">آخر الأخبار</div>
            <a
              href="/latest"
              className="rounded-xl border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-black/60 transition hover:bg-black/[0.03]"
            >
              عرض الكل
            </a>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {topLatest.map((p) => (
                <a
                  key={p.fm.slug}
                  href={`/news/${p.fm.slug}`}
                  className="group block rounded-2xl border border-black/10 bg-white/70 px-3 py-3 transition hover:bg-black/[0.03]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-black/45">
                        {p.fm.category || "BeiruTalk"} • {formatArabicDate(p.fm.date)}
                      </div>
                      <div className="mt-1 line-clamp-1 text-sm font-extrabold text-[color:var(--bt-headline)]">
                        {p.fm.title}
                      </div>
                    </div>
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--bt-primary)] opacity-70" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
