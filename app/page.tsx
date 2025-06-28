"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

// Define TypeScript interface for navigation links
interface NavLink {
  href: string
  label: string
  title: string
  color: string
  hoverColor: string
}

// Define navigation links with types and colors matching the image
const navLinks: NavLink[] = [
  { href: "/detect/text", label: "Try Text", title: "Try Text Detection with NeuroScope", color: "#22d3ee", hoverColor: "#06b6d4" },
  { href: "/detect/image", label: "Try Image", title: "Try Image Detection with NeuroScope", color: "#a855f7", hoverColor: "#9333ea" },
  { href: "/detect/audio", label: "Try Audio", title: "Try Audio Detection with NeuroScope", color: "#34d399", hoverColor: "#10b981" },
  { href: "/detect/video", label: "Try Video", title: "Try Video Detection with NeuroScope", color: "#f472b6", hoverColor: "#ec4899" },
]

const Home: React.FC = () => {
  return (
    <>
      {/* Schema Markup for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "NeuroScope Homepage",
            description:
              "NeuroScope: Detect AI or human-generated text, images, audio, and video with advanced AI-powered tools.",
            url: "https://www.neuroscope.com",
            image: "https://www.neuroscope.com/hero-image.jpg",
            publisher: {
              "@type": "Organization",
              name: "NeuroScope",
              logo: {
                "@type": "ImageObject",
                url: "https://www.neuroscope.com/logo.png",
              },
            },
            mainEntity: {
              "@type": "WebApplication",
              name: "NeuroScope AI Detector",
              url: "https://www.neuroscope.com",
              applicationCategory: "Utility",
              operatingSystem: "All",
              description:
                "A futuristic AI detector for analyzing text, images, audio, and video to determine if content was created by AI or humans.",
            },
          }),
        }}
      />

      <section
        className="text-center space-y-6 py-12 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-black"
        aria-labelledby="hero-heading"
      >
        <h1
          id="hero-heading"
          className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        >
          NeuroScope
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          A futuristic AI detector for analyzing text, images, audio, and video. Instantly know if content was created by AI or humans.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} title={link.title}>
              <Button
                className={`px-6 py-3 rounded-full text-white shadow-md text-base`}
                style={{ backgroundColor: link.color, transition: "background-color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = link.hoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = link.color)}
                aria-label={link.title}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home