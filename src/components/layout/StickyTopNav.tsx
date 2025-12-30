import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

type NavItem = {
  href: string
  label: string
}

export default function StickyTopNav({
  nav,
  show,
}: {
  nav: NavItem[]
  show: boolean
}) {
  return (
    <div
      className={[
        "fixed inset-x-0 top-0 z-[60]",
        // smoother show/hide (slide + fade)
        "transition-all duration-300 ease-out",
        show
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!show}
    >
      {/* subtle separation from content */}
      <div className="bg-[color:var(--bt-bg)]/88 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bt-bg)]/72">
        <div className="bt-container py-2">
          {/* premium compact surface */}
          <div className="bt-edge rounded-2xl border border-black/10 bg-white/70 shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 px-3 py-2">
              {/* Brand */}
              <Link href="/" aria-label="BeiruTalk" className="shrink-0">
                <Image
                  src="/assets/beirutalk-logo.png"
                  alt="BeiruTalk"
                  width={116}
                  height={28}
                  className="h-7 w-auto"
                  priority={false}
                />
              </Link>

              {/* Scrollable nav */}
              <div className="bt-scroll-fade relative min-w-0 flex-1">
                <div className="no-scrollbar flex items-center gap-1 overflow-x-auto whitespace-nowrap [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
                  {nav.map((it) => (
                    <Link
                      key={`sticky-${it.href}`}
                      href={it.href}
                      className={[
                        "relative shrink-0 rounded-2xl px-3 py-2",
                        "text-[14px] font-semibold text-[color:var(--bt-headline)]",
                        "transition hover:bg-black/5 active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
                      ].join(" ")}
                    >
                      <span className="bt-clamp-1">{it.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Search (always visible) */}
              <Link
                href="/search"
                className={[
                  "shrink-0",
                  "inline-flex h-10 w-10 items-center justify-center",
                  "rounded-2xl border border-black/10 bg-white/80 text-black/70",
                  "transition hover:bg-black/5 active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
                ].join(" ")}
                aria-label="بحث"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            {/* tiny signature line (optional but feels premium) */}
            <div className="h-px w-full bg-black/5" />
            <div className="bt-grad-rule opacity-60" />
          </div>
        </div>
      </div>
    </div>
  )
}
