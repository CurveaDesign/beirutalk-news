import Head from "next/head"
import { siteMetadata } from "@/lib/siteMetadata"

type SeoHeadProps = {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: "website" | "article"
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  authorName?: string
  tags?: string[]
}

const normalizedSiteUrl = siteMetadata.url.replace(/\/$/, "")

function toAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value
  return `${normalizedSiteUrl}${value.startsWith("/") ? value : `/${value}`}`
}

export default function SeoHead({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authorName,
  tags,
}: SeoHeadProps) {
  const pageTitle = title ? `${title} | ${siteMetadata.name}` : siteMetadata.name
  const metaDescription = description || siteMetadata.description
  const canonicalUrl = path ? toAbsoluteUrl(path) : normalizedSiteUrl
  const ogImage = toAbsoluteUrl(image || siteMetadata.defaultImage)
  const robots = noIndex ? "noindex, nofollow" : "index, follow"

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteMetadata.name,
    url: normalizedSiteUrl,
    logo: toAbsoluteUrl(siteMetadata.defaultImage),
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMetadata.name,
    url: normalizedSiteUrl,
    inLanguage: "ar-LB",
  }

  const jsonLd: Record<string, unknown>[] = [organizationSchema, websiteSchema]

  if (type === "article") {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: title || siteMetadata.name,
      description: metaDescription,
      image: [ogImage],
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: {
        "@type": "Person",
        name: authorName || siteMetadata.name,
      },
      publisher: {
        "@type": "Organization",
        name: siteMetadata.name,
        logo: {
          "@type": "ImageObject",
          url: toAbsoluteUrl(siteMetadata.defaultImage),
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    })
  }

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="ar-LB" href={canonicalUrl} />

      <meta property="og:site_name" content={siteMetadata.name} />
      <meta property="og:locale" content={siteMetadata.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      {siteMetadata.twitterHandle ? (
        <meta name="twitter:site" content={siteMetadata.twitterHandle} />
      ) : null}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
      {authorName ? <meta property="article:author" content={authorName} /> : null}
      {tags?.length
        ? tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))
        : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  )
}
