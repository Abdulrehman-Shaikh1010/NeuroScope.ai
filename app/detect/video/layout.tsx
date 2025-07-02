// app/detect/video/layout.tsx

import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "AI Video Detection | NeuroScope",
  description: "Analyze uploaded videos to detect whether they are AI-generated or human-made.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}
export default function VideoDetectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
