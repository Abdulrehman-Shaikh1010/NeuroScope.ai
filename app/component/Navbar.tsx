"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/", label: "Home", title: "NeuroScope Homepage" },
  { href: "/dashboard", label: "Dashboard", title: "You Dashboard of NeuroScope" },
  { href: "/detect/text", label: "Text", title: "Text Detection with NeuroScope" },
  { href: "/detect/image", label: "Image", title: "Image Detection with NeuroScope" },
  { href: "/detect/audio", label: "Audio", title: "Audio Detection with NeuroScope" },
  { href: "/detect/video", label: "Video", title: "Video Detection with NeuroScope" },

]

export const Navbar = () => {
  const path = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Schema Markup for Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: navLinks.map((link, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: link.label,
              item: `https://www.neuroscope.com${link.href}`,
            })),
          }),
        }}
      />

      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg">
        <nav
          className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            title="NeuroScope Homepage"
            className="text-xl font-bold tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            NeuroScope
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-6">
            {navLinks.map(({ href, label, title }) => (
              <li key={href}>
                <Link
                  href={href}
                  title={title}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-cyan-300",
                    path === href
                      ? "text-cyan-400 font-semibold"
                      : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-gray-800">
            <ul className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map(({ href, label, title }) => (
                <li key={href}>
                  <Link
                    href={href}
                    title={title}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-cyan-300",
                      path === href
                        ? "text-cyan-400 font-semibold"
                        : "text-gray-600 dark:text-gray-300"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </>
  )
}