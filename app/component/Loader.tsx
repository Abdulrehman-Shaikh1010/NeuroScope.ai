"use client"

import { useState, useEffect } from "react"

// Define TypeScript props (optional, as no props are currently used)
interface LoaderProps {
  message?: string // Optional message to display with the loader
}

export const Loader: React.FC<LoaderProps> = ({ message = "Processing..." }) => {
  const [isVisible, setIsVisible] = useState(true)

  // Hide loader after 30 seconds to prevent infinite display (optional safeguard)
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 30000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isVisible && (
        <div
          className="flex justify-center items-center mt-6"
          aria-live="polite"
          aria-label={`Loading ${message.toLowerCase()}`}
          role="alert"
        >
          <div
            className="h-12 w-12 border-4 border-cyan-400 border-t-transparent animate-spin rounded-full"
            aria-hidden="true" // Hide spinner from screen readers, rely on message
          />
          <span className="ml-4 text-gray-300 text-lg font-medium">{message}</span>
        </div>
      )}
    </>
  )
}

export default Loader