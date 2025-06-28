"use client"

import { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { toast } from "react-hot-toast"
import clsx from "clsx"

interface ResultBoxProps {
  result: string
  confidence: number
  ariaLabel?: string
  category?: "text" | "image" | "audio" | "video"
  className?: string
}

const COLOR_MAP = {
  text: {
    border: "border-cyan-400",
    text: "text-cyan-400",
    bg: "bg-cyan-600",
    hoverBg: "hover:bg-cyan-700",
    ring: "focus:ring-cyan-400",
  },
  image: {
    border: "border-purple-500",
    text: "text-purple-500",
    bg: "bg-purple-600",
    hoverBg: "hover:bg-purple-700",
    ring: "focus:ring-purple-400",
  },
  audio: {
    border: "border-pink-500",
    text: "text-pink-500",
    bg: "bg-pink-600",
    hoverBg: "hover:bg-pink-700",
    ring: "focus:ring-pink-400",
  },
  video: {
    border: "border-yellow-500",
    text: "text-yellow-500",
    bg: "bg-yellow-600",
    hoverBg: "hover:bg-yellow-700",
    ring: "focus:ring-yellow-400",
  },
}

export const ResultBox: React.FC<ResultBoxProps> = ({
  result,
  confidence,
  ariaLabel = "Detection result",
  category = "text",
  className = "",
}) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [detailsVisible, setDetailsVisible] = useState(false)

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [result])

  const handleCopy = () => {
    setIsCopied(true)
    toast.success("Result copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const toggleDetails = () => setDetailsVisible((prev) => !prev)

  const color = COLOR_MAP[category]

  return (
    <>
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AnalysisResult",
            name: `NeuroScope ${category[0].toUpperCase() + category.slice(1)} Detection Result`,
            description: `${result} with ${confidence}% confidence.`,
            url: `https://www.neuroscope.com/detect/${category}`,
          }),
        }}
      />

      <div
        ref={boxRef}
        className={clsx(
          "mt-6 p-6 bg-black rounded-xl text-center space-y-4 shadow-lg transition-all duration-300",
          color.border,
          className
        )}
        aria-label={ariaLabel}
        role="region"
        aria-live="polite"
      >
        <h2 className={clsx("text-2xl font-bold", color.text)}>
          Result: <span>{result}</span>
        </h2>
        <p className="text-gray-300">Confidence: {confidence.toFixed(2)}%</p>

        <button
          onClick={toggleDetails}
          className={clsx("mt-2 text-sm hover:underline focus:outline-none", color.text, color.ring)}
          aria-expanded={detailsVisible}
          aria-controls="result-details"
        >
          {detailsVisible ? "Hide Details" : "Show Details"}
        </button>

        {detailsVisible && (
          <div id="result-details" className="text-gray-400 text-sm mt-2">
            <p>
              Analysis performed at:{" "}
              {new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" })}
            </p>
            <p>
              Confidence range:{" "}
              {confidence > 75 ? "High" : confidence > 50 ? "Moderate" : "Low"}
            </p>
          </div>
        )}

        <CopyToClipboard
          text={`${result} (Confidence: ${confidence}%)`}
          onCopy={handleCopy}
        >
          <button
            className={clsx(
              "mt-4 px-4 py-2 rounded-lg text-white focus:outline-none",
              color.bg,
              color.hoverBg,
              color.ring
            )}
            aria-label={`Copy ${result} result to clipboard`}
          >
            {isCopied ? "Copied!" : "Copy Result"}
          </button>
        </CopyToClipboard>
      </div>
    </>
  )
}

export default ResultBox
