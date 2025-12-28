import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/assets/beiruTalk-192x192.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className="bg-white text-neutral-950">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
