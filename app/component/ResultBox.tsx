"use client"

import { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { toast } from "react-hot-toast" // Optional: for toast notifications

// Define TypeScript interface for props
interface ResultBoxProps {
  result: string
  confidence: number
  ariaLabel?: string // Optional aria-label for customization
  category?: "text" | "image" | "audio" | "video" // Optional category for styling
}

export const ResultBox: React.FC<ResultBoxProps> = ({
  result,
  confidence,
  ariaLabel = "Detection result",
  category = "text",
}) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [detailsVisible, setDetailsVisible] = useState(false)

  // Scroll into view and announce result
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [result])

  // Color mapping based on category
  const colorMap = {
    text: { border: "border-cyan-400", text: "text-cyan-400" },
    image: { border: "border-purple-500", text: "text-purple-500" },
    audio: { border: "border-pink-500", text: "text-pink-500" },
    video: { border: "border-yellow-500", text: "text-yellow-500" },
  }

  const handleCopy = () => {
    setIsCopied(true)
    toast.success("Result copied to clipboard!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const toggleDetails = () => setDetailsVisible(!detailsVisible)

  return (
    <>
      {/* Schema Markup for Result Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AnalysisResult",
            name: `NeuroScope ${category.charAt(0).toUpperCase() + category.slice(1)} Detection Result`,
            description: `${result} with ${confidence}% confidence.`,
            url: `https://www.neuroscope.com/detect/${category}`,
          }),
        }}
      />

      <div
        ref={boxRef}
        className={`mt-6 p-6 bg-black rounded-xl text-center space-y-4 shadow-lg transition-all duration-300 hover:shadow-${colorMap[category].border.replace("border-", "")}/50 ${
          colorMap[category].border
        }`}
        aria-label={ariaLabel}
        role="region"
        aria-live="polite"
      >
        <h2 className={`text-2xl font-bold ${colorMap[category].text}`}>
          Result: <span>{result}</span>
        </h2>
        <p className="text-gray-300">Confidence: {confidence.toFixed(2)}%</p>
        <button
          onClick={toggleDetails}
          className={`mt-2 text-sm ${colorMap[category].text} hover:underline focus:outline-none focus:ring-2 focus:ring-${colorMap[category].text.replace(
            "text-",
            ""
          )}`}
          aria-expanded={detailsVisible}
          aria-controls="result-details"
        >
          {detailsVisible ? "Hide Details" : "Show Details"}
        </button>
        {detailsVisible && (
          <div id="result-details" className="text-gray-400 text-sm mt-2">
            <p>Analysis performed at: {new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" })}</p>
            <p>Confidence range: {confidence > 75 ? "High" : confidence > 50 ? "Moderate" : "Low"}</p>
          </div>
        )}
        <CopyToClipboard text={`${result} (Confidence: ${confidence}%)`} onCopy={handleCopy}>
          <button
            className={`mt-4 px-4 py-2 bg-${colorMap[category].text.replace("text-", "")}-600 hover:bg-${colorMap[category].text.replace(
              "text-",
              ""
            )}-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-${colorMap[category].text.replace("text-", "")}`}
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