// app/signup/layout.tsx

import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Sign Up | NeuroScope",
  description: "Create a NeuroScope account to use powerful AI detection tools.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}
export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
