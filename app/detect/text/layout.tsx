// app/detect/text/layout.tsx

import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "AI Text Detection | NeuroScope",
  description: "Paste any text to detect if it’s written by AI or a human.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}
export default function TextDetectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
