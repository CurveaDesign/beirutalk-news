import Link from "next/link"
import SiteLayout from "@/components/layout/SiteLayout"
import { getMenusConfig } from "@/lib/content/data"
import type { MenusConfig } from "@/lib/content/data"

export const getStaticProps = async () => {
  const menus = getMenusConfig()
  return { props: { menus } }
}

export default function NotFoundPage({ menus }: { menus: MenusConfig }) {
  return (
    <SiteLayout menus={menus}>
      <section className="bt-container py-12 sm:py-14">
        <div className="bt-rail">
          <div className="bt-edge rounded-[28px] border border-black/10 bg-white/80 p-7 text-center backdrop-blur md:p-10">
            <div className="text-[48px] font-extrabold text-black/20">404</div>
            <h1 className="mt-2 text-2xl font-extrabold text-[color:var(--bt-headline)]">
              الصفحة غير موجودة
            </h1>
            <p className="mt-3 text-[14px] leading-relaxed text-black/65">
              الرابط الذي فتحته غير صحيح أو تم نقل الصفحة.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="rounded-[18px] border border-black/10 bg-white px-5 py-3 text-[13px] font-extrabold text-black/70 hover:bg-black/[0.03]"
              >
                العودة للرئيسية
              </Link>
              <Link
                href="/latest"
                className="rounded-[18px] border border-black/10 bg-white px-5 py-3 text-[13px] font-extrabold text-black/70 hover:bg-black/[0.03]"
              >
                آخر الأخبار
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
