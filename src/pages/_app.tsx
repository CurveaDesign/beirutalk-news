import "@/styles/globals.css"
import type { AppProps } from "next/app"
import HeadInject from "@/components/seo/HeadInject"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadInject />
      <Component {...pageProps} />
    </>
  )
}
