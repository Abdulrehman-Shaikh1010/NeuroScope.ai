// app/dashboard/layout.tsx

import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Dashboard | NeuroScope",
  description: "Your personal AI content detection dashboard.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
