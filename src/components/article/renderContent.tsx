import Image from "next/image"

function isImageLine(line: string) {
  // markdown image: ![alt](src)
  return /^!\[.*?\]\((.*?)\)\s*$/.test(line.trim())
}

function parseImageLine(line: string) {
  const m = line.trim().match(/^!\[(.*?)\]\((.*?)\)\s*$/)
  return {
    alt: (m?.[1] || "").trim(),
    src: (m?.[2] || "").trim(),
  }
}

function isHeading(line: string) {
  return /^(#{1,3})\s+/.test(line.trim())
}
function parseHeading(line: string) {
  const m = line.trim().match(/^(#{1,3})\s+(.*)$/)
  const level = m?.[1]?.length ?? 2
  const text = (m?.[2] || "").trim()
  return { level, text }
}

export function renderContent(content: string) {
  const lines = content.split("\n")
  const nodes: React.ReactNode[] = []

  let para: string[] = []
  const flushPara = (key: string) => {
    const text = para.join(" ").trim()
    if (!text) return
    nodes.push(
      <p key={key} className="bt-prose-p">
        {text}
      </p>
    )
    para = []
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trim()

    // empty line flushes paragraph
    if (!line) {
      flushPara(`p-${i}`)
      continue
    }

    // image line
    if (isImageLine(line)) {
      flushPara(`p-${i}-before`)
      const { src, alt } = parseImageLine(line)

      nodes.push(
        <figure key={`img-${i}`} className="bt-figure">
          <div className="bt-figureMedia">
            <Image
              src={src}
              alt={alt || "BeiruTalk"}
              fill
              sizes="(max-width: 900px) 100vw, 760px"
              className="object-cover"
              priority={false}
            />
          </div>

          {alt ? (
            <figcaption className="bt-figureCaption">{alt}</figcaption>
          ) : null}
        </figure>
      )
      continue
    }

    // headings (h1-h3)
    if (isHeading(line)) {
      flushPara(`p-${i}-before`)
      const { level, text } = parseHeading(line)

      if (level === 1) {
        nodes.push(
          <h2 key={`h-${i}`} className="bt-prose-h2">
            {text}
          </h2>
        )
      } else if (level === 2) {
        nodes.push(
          <h3 key={`h-${i}`} className="bt-prose-h3">
            {text}
          </h3>
        )
      } else {
        nodes.push(
          <h4 key={`h-${i}`} className="bt-prose-h4">
            {text}
          </h4>
        )
      }
      continue
    }

    // default: paragraph text
    para.push(line)
  }

  flushPara("p-end")
  return nodes
}
