import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Twitter, Linkedin, Music2 } from "lucide-react"
import { siteContact } from "@/lib/siteConfig"
import type { MenuLink, MenusConfig } from "@/lib/content/data"

function linkToHref(it: MenuLink): string {
  if (it.type === "home") return it.href || "/"
  if (it.type === "category") return `/category/${it.slug}`
  return it.href || "/"
}

function SocialIcon({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href || !href.trim()) return null
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black/70 transition hover:bg-black/5"
    >
      {children}
    </a>
  )
}

export default function Footer({ menus }: { menus?: MenusConfig }) {
  const s = siteContact.socials || {}

  const sectionLinks = (menus?.footerSections || [])
    .filter((x) => (x.enabled ?? true) && !!(x.label || "").trim())
    .map((x) => ({ href: linkToHref(x), label: x.label }))

  const FALLBACK = [
    { href: "/latest", label: "آخر الأخبار" },
    { href: "/news", label: "كل الأخبار" },
    { href: "/category/lebanon", label: "لبنان" },
    { href: "/category/world", label: "العالم" },
    { href: "/category/economy", label: "اقتصاد" },
  ]

  const LINKS = sectionLinks.length ? sectionLinks : FALLBACK

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-black/10 bg-white/85 backdrop-blur">
      <div className="absolute inset-0 bt-noise opacity-20" />

      <div className="relative mx-auto px-6 py-14" style={{ maxWidth: "var(--bt-container)" }}>
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" aria-label="BeiruTalk" className="inline-flex items-center">
              <Image
                src="/assets/beirutalk-logo.png"
                alt="BeiruTalk"
                width={220}
                height={52}
                className="h-10 w-auto"
              />
            </Link>

            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-black/70">
              منصة أخبار عربية بتركيز لبناني وروح عالمية. نغطي السياسة، الاقتصاد، المال، المجتمع،
              وعناوين تهم القارئ دون ضجيج أو مبالغة.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <SocialIcon href={s.facebook} label="Facebook">
                <Facebook size={18} />
              </SocialIcon>
              <SocialIcon href={s.instagram} label="Instagram">
                <Instagram size={18} />
              </SocialIcon>
              <SocialIcon href={s.x} label="X">
                <Twitter size={18} />
              </SocialIcon>
              <SocialIcon href={s.youtube} label="YouTube">
                <Youtube size={18} />
              </SocialIcon>
              <SocialIcon href={s.tiktok} label="TikTok">
                <Music2 size={18} />
              </SocialIcon>
              <SocialIcon href={s.linkedin} label="LinkedIn">
                <Linkedin size={18} />
              </SocialIcon>
            </div>
          </div>

          <div>
            <div className="text-[13px] font-extrabold tracking-wide text-black/60">الأقسام</div>
            <ul className="mt-4 space-y-2 text-[14px] text-black/65">
              {LINKS.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} className="hover:text-black">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[13px] font-extrabold tracking-wide text-black/60">عن الموقع</div>
            <ul className="mt-4 space-y-2 text-[14px] text-black/65">
              <li>
                <Link href="/about" className="hover:text-black">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-black">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black">
                  الشروط والأحكام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-black/5" />

        <div className="flex flex-col gap-3 text-[13px] text-black/55 md:flex-row md:items-center md:justify-between">
          <div>© BeiruTalk {new Date().getFullYear()} — جميع الحقوق محفوظة</div>
          <div>
            Design & Development by{" "}
            <a
              href="https://curveadesign.com"
              target="_blank"
              rel="noreferrer"
              className="font-extrabold text-black/65 underline underline-offset-4 hover:text-black"
            >
              Curvea Design
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
