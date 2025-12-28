import { useMemo, useState } from "react"
import Link from "next/link"
import SiteLayout from "@/components/layout/SiteLayout"
import { getAllPosts } from "@/lib/content/posts"
import type { Post } from "@/lib/content/types"
import { getAdsConfig, getMenusConfig } from "@/lib/content/data"
import type { AdsConfig, MenusConfig } from "@/lib/content/data"

const DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g
const PUNCTUATION = /[^\p{L}\p{N}\s]/gu

function normalizeArabic(value: string) {
  return value
    .toLowerCase()
    .replace(DIACRITICS, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ـ/g, "")
    .replace(PUNCTUATION, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function formatArabicDate(dateISO?: string) {
  if (!dateISO) return ""
  const d = new Date(dateISO)
  if (Number.isNaN(d.getTime())) return ""
  try {
    return new Intl.DateTimeFormat("ar-LB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Beirut",
    }).format(d)
  } catch {
    return d.toLocaleDateString()
  }
}

type SearchItem = {
  slug: string
  title: string
  description?: string
  category?: string
  date?: string
  tags: string[]
  text: string
}

type SearchProps = {
  items: SearchItem[]
  breaking: Post[]
  ads?: AdsConfig
  menus: MenusConfig
}

function scoreMatch(text: string, query: string) {
  if (!query) return 0
  const terms = query.split(" ").filter(Boolean)
  if (!terms.length) return 0

  let score = 0
  if (text.includes(query)) score += query.length * 2

  for (const term of terms) {
    if (text.includes(term)) {
      score += term.length
    }
  }

  return score
}

export default function SearchPage({ items, breaking, ads, menus }: SearchProps) {
  const [query, setQuery] = useState("")
  const normalizedQuery = useMemo(() => normalizeArabic(query), [query])

  const results = useMemo(() => {
    if (!normalizedQuery) return []
    return items
      .map((item) => ({ item, score: scoreMatch(item.text, normalizedQuery) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item)
  }, [items, normalizedQuery])

  const showEmptyPrompt = !query.trim()
  const showNoResults = !showEmptyPrompt && results.length === 0

  return (
    <SiteLayout ads={ads} breaking={breaking} menus={menus}>
      <section className="bt-rail bt-edge rounded-[28px] border border-black/10 bg-white/80 p-6 sm:p-8">
        <div className="text-[12px] font-extrabold tracking-wide text-black/50">BeiruTalk</div>
        <h1 className="mt-2 text-2xl font-extrabold text-[color:var(--bt-headline)] sm:text-3xl">
          البحث في الأخبار
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-black/60">
          اكتب كلمة أو عبارة للعثور على الأخبار والمواضيع ذات الصلة.
        </p>

        <div className="mt-6">
          <input
            type="search"
            dir="rtl"
            placeholder="ابحث عن خبر، وسم، أو قسم..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] font-semibold text-black/80 placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--bt-primary)]"
          />
        </div>
      </section>

      <section className="mt-8 space-y-4">
        {showEmptyPrompt ? (
          <div className="bt-rail bt-edge rounded-[22px] border border-black/10 bg-white/70 p-6 text-center text-[14px] font-semibold text-black/50">
            ابدأ الكتابة للبحث عن الأخبار.
          </div>
        ) : null}

        {showNoResults ? (
          <div className="bt-rail bt-edge rounded-[22px] border border-black/10 bg-white/70 p-6 text-center text-[14px] font-semibold text-black/50">
            لا توجد نتائج مطابقة لبحثك.
          </div>
        ) : null}

        {!showEmptyPrompt && results.length > 0 ? (
          <div className="bt-rail bt-edge overflow-hidden rounded-[24px] border border-black/10 bg-white/80">
            <div className="divide-y divide-black/10">
              {results.map((item) => {
                const dateText = formatArabicDate(item.date)
                return (
                  <article key={item.slug} className="p-5 sm:p-6">
                    <Link href={`/news/${item.slug}`} className="block">
                      <div className="flex flex-wrap items-center gap-2 text-[12px] font-extrabold text-black/45">
                        {item.category ? (
                          <span className="rounded-full border border-black/10 bg-white px-2 py-1">
                            {item.category}
                          </span>
                        ) : null}
                        {dateText ? <span className="text-black/35">{dateText}</span> : null}
                      </div>

                      <h2 className="mt-3 text-[17px] font-extrabold leading-snug text-[color:var(--bt-headline)] sm:text-[18px]">
                        {item.title}
                      </h2>

                      {item.description ? (
                        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-black/60">
                          {item.description}
                        </p>
                      ) : null}
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        ) : null}
      </section>
    </SiteLayout>
  )
}

export const getStaticProps = async () => {
  const all = getAllPosts()

  const items: SearchItem[] = all.map((post) => {
    const title = post.fm.title || ""
    const description = post.fm.description || ""
    const category = post.fm.category || ""
    const tags = (post.fm.tags || []).map((tag) => String(tag || "").trim()).filter(Boolean)
    const text = normalizeArabic([title, description, category, tags.join(" ")].join(" "))

    return {
      slug: post.fm.slug,
      title,
      description,
      category,
      date: post.fm.date,
      tags,
      text,
    }
  })

  return {
    props: {
      items,
      breaking: all.filter((p) => p.fm.breaking === true).slice(0, 8),
      ads: getAdsConfig(),
      menus: getMenusConfig(),
    },
  }
}