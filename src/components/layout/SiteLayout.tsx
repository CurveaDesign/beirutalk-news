import { ReactNode } from "react"
import TopSystem from "./TopSystem"
import Footer from "./Footer"
import type { AdsConfig, MenusConfig } from "@/lib/content/data"
import type { Post } from "@/lib/content/types"

export default function SiteLayout({
  children,
  ads,
   breaking = [],
  menus,
}: {
  children: React.ReactNode
  ads?: AdsConfig
   breaking?: Post[]
  menus?: MenusConfig
}) {  return (
    <div className="min-h-dvh bg-[color:var(--bt-bg)] text-[color:var(--bt-text)]">
      <TopSystem ads={ads} breaking={breaking} menus={menus} />

      <main className="bt-container py-10">
        {children}
      </main>

      <Footer menus={menus} />
    </div>
  )
}
