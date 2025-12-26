import SiteLayout from "@/components/layout/SiteLayout"
import Link from "next/link"
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MessageCircle,
  Mail,
  Linkedin,
  Music2,
} from "lucide-react"
import { siteContact } from "@/lib/siteConfig"

function Icon({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href || !href.trim()) return null
  const external = /^https?:\/\//i.test(href) || /^mailto:/i.test(href)
  const cls =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/70 backdrop-blur hover:bg-black/[0.04]"
  if (external) {
    return (
      <a href={href} aria-label={label} title={label} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} aria-label={label} title={label} className={cls}>
      {children}
    </Link>
  )
}

export default function ContactPage() {
  const email = siteContact.email?.trim()
  const whatsapp = siteContact.whatsapp?.trim()

  const mailHref = email ? `mailto:${email}` : ""
  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}` : ""

  const s = siteContact.socials || {}

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(0,0,0,0.06),transparent)]" />
        <div className="absolute inset-0 bt-noise opacity-25" />

        <div className="relative bt-container py-10 sm:py-14">
          <div className="bt-rail">
            <div className="rounded-[32px] border border-black/10 bg-white/85 backdrop-blur">
              <div className="px-6 pt-10 md:px-10 md:pt-14">
                <div className="text-[12px] font-extrabold tracking-wide text-black/50">
                  BeiruTalk
                </div>
                <h1 className="mt-3 max-w-3xl text-[34px] font-extrabold leading-tight text-[color:var(--bt-headline)] md:text-[44px]">
                  تواصل معنا
                </h1>
                <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                  للتصحيح، الإبلاغ عن خطأ، الاستفسارات العامة، أو طلبات الإعلانات.
                  نقرأ الرسائل ونرد حسب الأولوية.
                </p>
              </div>

              <div className="mt-12 h-px w-full bg-black/5" />

              <div className="px-6 py-10 md:px-10 md:py-14">
                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    البريد الإلكتروني
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    {email ? (
                      <a
                        href={mailHref}
                        className="font-extrabold text-black/70 underline underline-offset-4"
                      >
                        {email}
                      </a>
                    ) : (
                      <span className="text-black/60">
                        سيتم إضافة البريد الرسمي عبر إعدادات الموقع.
                      </span>
                    )}
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    الإبلاغ عن خطأ
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    أرسل رسالة بعنوان <span className="font-extrabold">تصحيح</span> مرفقة
                    برابط الخبر والجملة الخاطئة والتوضيح المطلوب. هذا يساعدنا على
                    التصحيح بسرعة وشفافية.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    الإعلانات والشراكات
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    للتواصل بشأن الإعلانات (AdSense أو بنرات مباشرة)، أرسل رسالة
                    بعنوان <span className="font-extrabold">إعلانات</span> مع نوع
                    الإعلان والمدة المقترحة.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    واتساب
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    {whatsapp ? (
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noreferrer"
                        className="font-extrabold text-black/70 underline underline-offset-4"
                      >
                        {whatsapp}
                      </a>
                    ) : (
                      <span className="text-black/60">
                        سيتم تحديد رقم واتساب عبر إعدادات الموقع.
                      </span>
                    )}
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                      السوشيال
                    </h2>
                    <div className="text-[12px] font-semibold text-black/45">
                      تظهر الأيقونات عند إضافة الروابط
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Icon href={mailHref} label="Email">
                      <Mail size={18} />
                    </Icon>
                    <Icon href={waHref} label="WhatsApp">
                      <MessageCircle size={18} />
                    </Icon>
                    <Icon href={s.facebook} label="Facebook">
                      <Facebook size={18} />
                    </Icon>
                    <Icon href={s.instagram} label="Instagram">
                      <Instagram size={18} />
                    </Icon>
                    <Icon href={s.x} label="X">
                      <Twitter size={18} />
                    </Icon>
                    <Icon href={s.youtube} label="YouTube">
                      <Youtube size={18} />
                    </Icon>
                    <Icon href={s.tiktok} label="TikTok">
                      <Music2 size={18} />
                    </Icon>
                    <Icon href={s.linkedin} label="LinkedIn">
                      <Linkedin size={18} />
                    </Icon>
                  </div>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    ملاحظة تحريرية
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    حاليًا لا تقبل BeiruTalk مقالات أو مواد من مساهمين خارجيين.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
