"use client"

import { useState, useEffect } from "react"

interface LoaderProps {
  message?: string
  className?: string // ✅ Add this line
}

export const Loader: React.FC<LoaderProps> = ({
  message = "Processing...",
  className = "", // ✅ Default empty string
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 30000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isVisible && (
        <div
          className={`flex justify-center items-center mt-6 ${className}`} // ✅ Append user className
          aria-live="polite"
          aria-label={`Loading ${message.toLowerCase()}`}
          role="alert"
        >
          <div
            className="h-12 w-12 border-4 border-cyan-400 border-t-transparent animate-spin rounded-full"
            aria-hidden="true"
          />
          <span className="ml-4 text-gray-300 text-lg font-medium">{message}</span>
        </div>
      )}
    </>
  )
}

export default Loader
