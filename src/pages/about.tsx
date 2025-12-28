import SiteLayout from "@/components/layout/SiteLayout"
import Link from "next/link"
import { getMenusConfig } from "@/lib/content/data"
import type { MenusConfig } from "@/lib/content/data"

export const getStaticProps = async () => {
  const menus = getMenusConfig()
  return { props: { menus } }
}
export default function AboutPage({ menus }: { menus: MenusConfig }) {
  return (
    <SiteLayout menus={menus}>
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
                  منصة أخبار تُقدّم الواقع كما هو
                </h1>

                <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                  BeiruTalk منصة أخبار عربية بتركيز لبناني وروح عالمية. ننشر الأخبار
                  والتحليلات والمواد التفسيرية عبر مجالات متعددة تشمل السياسة،
                  الاقتصاد، المال، المجتمع، علم النفس، التقنية، والثقافة. هدفنا
                  واضح: محتوى يُقرأ بثقة، ويُفهم بسرعة، ويُحترم فيه عقل القارئ.
                </p>
              </div>

              <div className="mt-12 h-px w-full bg-black/5" />

              <div className="px-6 py-10 md:px-10 md:py-14">
                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    المنهج التحريري
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    نميّز بوضوح بين الخبر والرأي. الأخبار اليومية قد تُنشر باسم
                    <span className="font-extrabold"> BeiruTalk </span>
                    كمنصة تحريرية. أما المقالات التحليلية أو الآراء الشخصية،
                    فتُنشر باسم الكاتب الحقيقي. هذا الفصل أساسي للحفاظ على
                    الشفافية والمصداقية.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    نطاق التغطية
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    نهتم بكل ما يؤثر على فهم القارئ للواقع من حوله. من الأخبار
                    اللبنانية اليومية، إلى التطورات الإقليمية والدولية، إلى
                    مواضيع المال والسلوك الإنساني والتغيرات الاجتماعية. المعيار
                    الوحيد هو القيمة التحريرية، لا الضجيج.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    التصحيح والشفافية
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    في حال وجود خطأ في معلومة أو سياق، نلتزم بتصحيحه عند التحقق.
                    يمكن الإبلاغ عن أي ملاحظة عبر صفحة{" "}
                    <Link
                      href="/contact"
                      className="font-extrabold text-black/70 underline underline-offset-4"
                    >
                      تواصل معنا
                    </Link>
                    ، مع إرفاق رابط الخبر والتوضيح المطلوب.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    المساهمات
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    في الوقت الحالي، لا تقبل BeiruTalk مقالات أو مواد من مساهمين
                    خارجيين. أي تغيير في هذه السياسة سيتم الإعلان عنه بشكل رسمي
                    وواضح.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    لماذا BeiruTalk
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    لأن الأخبار لا يجب أن تكون مرهقة أو فوضوية. BeiruTalk صُممت
                    لتكون تجربة قراءة هادئة، واضحة، ومباشرة. منصة تحترم الوقت،
                    وتحترم القارئ، وتُقدّم الخبر دون ضجيج.
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
