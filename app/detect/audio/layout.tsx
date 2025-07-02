// app/detect/audio/layout.tsx

import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "AI Audio Detection | NeuroScope",
  description: "Upload audio to detect whether it's AI-generated or human-recorded.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}
export default function AudioDetectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
