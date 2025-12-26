import SiteLayout from "@/components/layout/SiteLayout"

export default function PrivacyPage() {
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
                  سياسة الخصوصية
                </h1>

                <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                  توضح هذه السياسة كيفية تعامل BeiruTalk مع بيانات الزوار عند استخدام
                  الموقع. باستخدامك للموقع، فإنك توافق على ما ورد أدناه.
                </p>
              </div>

              <div className="mt-12 h-px w-full bg-black/5" />

              <div className="px-6 py-10 md:px-10 md:py-14">
                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    جمع البيانات
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    قد نجمع معلومات تقنية أساسية مثل نوع المتصفح، نوع الجهاز،
                    الصفحات التي تمت زيارتها، ووقت الزيارة. تُستخدم هذه البيانات
                    لتحليل الأداء وتحسين تجربة القراءة.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    أدوات التحليل
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    يستخدم الموقع Google Analytics لفهم كيفية تفاعل الزوار مع
                    المحتوى. قد تتضمن هذه الأدوات ملفات تعريف الارتباط (Cookies)
                    وتقنيات مشابهة. يمكنك التحكم في إعدادات الكوكيز من متصفحك.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    الإعلانات
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    قد تعرض BeiruTalk إعلانات عبر Google AdSense أو إعلانات مباشرة
                    (Custom Banners). قد يستخدم مزودو الإعلانات تقنيات تتبع لعرض
                    محتوى إعلاني أكثر ملاءمة. لا نتحكم بشكل مباشر في سياسات الجهات
                    الإعلانية الخارجية.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    النشرة البريدية
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    في حال الاشتراك في النشرة البريدية، يتم استخدام عنوان البريد
                    الإلكتروني فقط لإرسال تحديثات BeiruTalk. يمكن إلغاء الاشتراك
                    في أي وقت عبر رابط الإلغاء داخل الرسائل.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    الروابط الخارجية
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    قد يحتوي الموقع على روابط لمواقع خارجية. BeiruTalk غير مسؤولة
                    عن محتوى تلك المواقع أو سياسات الخصوصية الخاصة بها.
                  </p>
                </section>

                <div className="my-12 h-px w-full bg-black/5" />

                <section className="max-w-3xl">
                  <h2 className="text-[13px] font-extrabold tracking-widest text-black/55">
                    تحديثات السياسة
                  </h2>

                  <p className="mt-4 text-[15px] leading-relaxed text-black/75 md:text-[16px]">
                    قد يتم تحديث سياسة الخصوصية عند الحاجة. استمرار استخدامك
                    للموقع بعد أي تعديل يعني موافقتك على النسخة المحدثة.
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
