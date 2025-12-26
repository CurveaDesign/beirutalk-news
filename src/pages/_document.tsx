import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-white text-neutral-950">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
