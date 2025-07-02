import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Navbar } from "./component/Navbar"

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] })

export const metadata: Metadata = {
  title: {
    default: "NeuroScope – AI Content Detector",
    template: "%s | NeuroScope",
  },
  description:
    "Detect AI or human-generated text, images, audio, and video with NeuroScope's advanced AI-powered tools. Ensure authenticity and accuracy in content analysis.",
  keywords: [
    "AI content detector",
    "text detection",
    "image detection",
    "audio detection",
    "video detection",
    "NeuroScope",
    "AI vs human content",
  ],
  authors: [{ name: "NeuroScope Team", url: "https://www.neuroscope.com" }],
  openGraph: {
    title: "NeuroScope – AI Content Detector",
    description:
      "Use NeuroScope to detect AI or human-generated text, images, audio, and video with cutting-edge AI technology.",
    url: "https://www.neuroscope.com",
    siteName: "NeuroScope",
    images: [
      {
        url: "https://www.neuroscope.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NeuroScope AI Content Detector",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroScope – AI Content Detector",
    description:
      "Detect AI or human-generated content with NeuroScope's advanced tools for text, images, audio, and video.",
    images: ["https://www.neuroscope.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.neuroscope.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical third-party domains */}
        <link rel="preconnect" href="https://www.neuroscope.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.neuroscope.com" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Schema Markup for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NeuroScope",
              url: "https://www.neuroscope.com",
              logo: "https://www.neuroscope.com/logo.png",
              sameAs: [
                "https://x.com/neuroscope",
                "https://www.linkedin.com/company/neuroscope",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-[#0e0e10] text-white min-h-screen flex flex-col`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-cyan-400 focus:text-black focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="px-6 py-8 flex-1">
          {children}
        </main>
        <footer className="border-t border-gray-800 py-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} NeuroScope. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}