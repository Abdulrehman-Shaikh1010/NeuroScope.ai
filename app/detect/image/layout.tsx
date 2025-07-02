// app/detect/image/layout.tsx

import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "AI Image Detection | NeuroScope",
  description: "Detect whether an image is AI-generated or real using NeuroScope's detection engine.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}
export default function ImageDetectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
