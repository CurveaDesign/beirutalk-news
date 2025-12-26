import Image from "next/image"
import type { AdsConfig } from "@/lib/content/data"

function getSlot(ads: AdsConfig | undefined, id: string) {
  return ads?.slots?.find((s) => s.id === id)
}

export default function AdSlot({
  id,
  ads,
  className = "",
}: {
  id: string
  ads?: AdsConfig
  className?: string
}) {
  const slot = getSlot(ads, id)
  if (!slot || !slot.enabled) return null

  // ✅ Custom banner
  if (slot.type === "custom") {
    const img = slot.custom?.image
    if (!img) return null

    const href = slot.custom?.href || "#"
    const alt = slot.custom?.alt || "Ad"
    const openNew = slot.custom?.openInNewTab ?? true
    const w = slot.custom?.width ?? 900
    const h = slot.custom?.height ?? 500

    return (
      <div className={className}>
        <a
          href={href}
          target={openNew ? "_blank" : undefined}
          rel={openNew ? "noreferrer noopener" : undefined}
          aria-label={alt}
        >
          <div className="relative w-full overflow-hidden rounded-2xl border border-black/10 bg-white/60">
            <Image
              src={img}
              alt={alt}
              width={w}
              height={h}
              className="h-auto w-full"
            />
          </div>
        </a>
      </div>
    )
  }

  // ✅ AdSense (placeholder UI for now)
  // When you want real AdSense rendering, tell me and I’ll give you the <ins class="adsbygoogle"> version.
  if (slot.type === "adsense") {
    if (!ads?.adsense?.enabled || !ads?.adsense?.client) return null

    return (
      <div className={className}>
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm font-semibold text-black/70">
          AdSense Slot: {slot.adsense?.slot || "(missing slot id)"}
        </div>
      </div>
    )
  }

  return null
}
