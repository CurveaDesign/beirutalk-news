import SiteLayout from "@/components/layout/SiteLayout"

export default function TermsPage() {
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
                  الشروط والأحكام
                </h1>

                <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                  باستخدامك لموقع BeiruTalk، فإنك توافق على الالتزام بالشروط
                  والأحكام التالية. في حال عدم الموافقة، يرجى التوقف عن استخدام
                  الموقع.
                </p>
              </div>

              <div className="mt-12 h-px w-full bg-black/5" />

              <div className="px-6 py-10 md:px-10 md:py-14">
                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    استخدام المحتوى
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    جميع المواد المنشورة على BeiruTalk مخصصة للاطلاع العام.
                    نسمح بإعادة نشر مقتطفات من المحتوى بشرط ذكر المصدر بوضوح
                    ووضع رابط مباشر للمقال الأصلي. لا يجوز نسخ المقال كاملًا أو
                    إعادة نشره بشكل آلي أو تجاري دون موافقة مسبقة.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    الدقة والمسؤولية
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    تسعى BeiruTalk إلى تقديم معلومات دقيقة وحديثة، إلا أننا لا
                    نضمن خلو المحتوى من الأخطاء أو السهو. لا تتحمل المنصة أي
                    مسؤولية عن قرارات أو إجراءات يتم اتخاذها بناءً على ما ورد
                    في الموقع دون تحقق إضافي.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    الآراء والتحليلات
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    الآراء والتحليلات المنشورة تعبر عن وجهة نظر كاتبها ولا تمثل
                    بالضرورة موقف BeiruTalk. يتم الفصل بوضوح بين المحتوى
                    الخبري والمحتوى التحليلي أو الرأيي.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    التعليقات والمشاركة
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    التعليقات غير متاحة حاليًا على الموقع. في حال تفعيلها
                    مستقبلًا، تحتفظ BeiruTalk بحق حذف أي محتوى مسيء أو مخالف
                    أو خارج عن سياق النقاش دون إشعار مسبق.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    الروابط الخارجية
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    قد يحتوي الموقع على روابط لمواقع خارجية. لا تتحمل BeiruTalk
                    أي مسؤولية عن محتوى هذه المواقع أو دقة المعلومات الواردة
                    فيها.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    التعديلات
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    تحتفظ BeiruTalk بحق تعديل هذه الشروط والأحكام في أي وقت.
                    استمرار استخدام الموقع بعد نشر التعديلات يعني الموافقة
                    على النسخة المحدثة.
                  </p>
                </section>

                <div className="mt-10 text-[12px] font-semibold text-black/45">
                  آخر تحديث: {new Date().toLocaleDateString("ar-LB")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
