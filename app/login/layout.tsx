// app/login/layout.tsx

import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Login | NeuroScope",
  description: "Log in to your NeuroScope AI detection account.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}


export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
