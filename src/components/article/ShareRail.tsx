import { useMemo, useState } from "react"
import {
  Facebook,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react"

function safeEncode(s: string) {
  return encodeURIComponent(s || "")
}

export default function ShareRail({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const links = useMemo(() => {
    const u = safeEncode(url)
    const t = safeEncode(title)

    return [
      {
        label: "فيسبوك",
        href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        icon: Facebook,
      },
      {
        label: "واتساب",
        href: `https://wa.me/?text=${t}%20${u}`,
        icon: MessageCircle,
      },
      {
        label: "تيليغرام",
        href: `https://t.me/share/url?url=${u}&text=${t}`,
        icon: Send,
      },
      {
        label: "إيميل",
        href: `mailto:?subject=${t}&body=${u}`,
        icon: Mail,
      },
    ]
  }, [title, url])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      {/* Desktop floating (right side) */}
      <div className="hidden xl:block">
        <div className="fixed right-6 top-[220px] z-40">
          <div className="bt-edge rounded-[22px] border border-black/10 bg-white/75 p-2 backdrop-blur-xl">
            <div className="flex flex-col gap-2">
              {links.map((it) => {
                const Icon = it.icon
                return (
                  <a
                    key={it.label}
                    href={it.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-white/80 transition hover:bg-black/[0.04]"
                    aria-label={it.label}
                    title={it.label}
                  >
                    <Icon className="h-5 w-5 text-black/70 transition group-hover:text-black" />
                  </a>
                )
              })}

              <button
                type="button"
                onClick={copy}
                className="group grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-white/80 transition hover:bg-black/[0.04]"
                aria-label="نسخ الرابط"
                title="نسخ الرابط"
              >
                <LinkIcon className="h-5 w-5 text-black/70 transition group-hover:text-black" />
              </button>

              {copied ? (
                <div className="mt-1 rounded-xl bg-black px-2 py-1 text-center text-[11px] font-semibold text-white">
                  تم النسخ
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile inline */}
      <div className="mt-6 xl:hidden">
        <div className="bt-rail bt-edge overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="text-sm font-extrabold text-[color:var(--bt-headline)]">مشاركة</div>

            <div className="flex items-center gap-2">
              {links.slice(0, 3).map((it) => {
                const Icon = it.icon
                return (
                  <a
                    key={it.label}
                    href={it.href}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white/70"
                    aria-label={it.label}
                    title={it.label}
                  >
                    <Icon className="h-5 w-5 text-black/70" />
                  </a>
                )
              })}

              <button
                type="button"
                onClick={copy}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white/70"
                aria-label="نسخ الرابط"
                title="نسخ الرابط"
              >
                <LinkIcon className="h-5 w-5 text-black/70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
