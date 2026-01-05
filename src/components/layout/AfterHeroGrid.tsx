export default function AfterHeroGrid({
  main,
  aside,
}: {
  main: React.ReactNode
  aside: React.ReactNode
}) {
  return (
    <div className="bt-container mt-[4.5rem]">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0">{main}</main>

        {/* STICKY LIVES HERE */}
        <aside className="lg:block">
          <div className="sticky top-[120px]">
            {aside}
          </div>
        </aside>
      </div>
    </div>
  )
}
