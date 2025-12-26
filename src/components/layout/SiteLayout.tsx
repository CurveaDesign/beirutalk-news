import { ReactNode } from "react"
import TopSystem from "./TopSystem"
import Footer from "./Footer"
import type { AdsConfig } from "@/lib/content/data"
import type { Post } from "@/lib/content/types"

export default function SiteLayout({
  children,
  ads,
   breaking = [],
}: {
  children: React.ReactNode
  ads?: AdsConfig
   breaking?: Post[]
}) {  return (
    <div className="min-h-dvh bg-[color:var(--bt-bg)] text-[color:var(--bt-text)]">
      <TopSystem  ads={ads} breaking={breaking}/>

      <main className="bt-container py-10">
        {children}
      </main>

      <Footer />
    </div>
  )
}
