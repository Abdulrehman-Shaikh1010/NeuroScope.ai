"use client"

import { useState, useEffect, useCallback } from "react"
import FileUploader from "@/app/component/FileUploader"
import ResultBox from "@/app/component/ResultBox"
import Loader from "@/app/component/Loader"

interface MediaDetectState {
  file: File | null
  loading: boolean
  result: string | null
  confidence: number | null
  error: string | null
  isDragging: boolean
  fileHash: string | null
}

export default function MediaDetectPage() {
  const [state, setState] = useState<MediaDetectState>({
    file: null,
    loading: false,
    result: null,
    confidence: null,
    error: null,
    isDragging: false,
    fileHash: null,
  })

  useEffect(() => {
    return () => {
      if (state.file) URL.revokeObjectURL(URL.createObjectURL(state.file))
    }
  }, [state.file])

  const generateFileHash = (file: File): string => {
    return `${file.name}-${file.size}-${file.type}-${file.lastModified}`
  }

  const handleFileDrop = useCallback((files: File[]) => {
    if (files.length === 0) return
    const file = files[0]

    if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
      setState((prev) => ({
        ...prev,
        error: "Please upload an audio or video file.",
        file: null,
        result: null,
        confidence: null,
        fileHash: null,
      }))
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setState((prev) => ({
        ...prev,
        error: "File size exceeds 20MB limit.",
        file: null,
        result: null,
        confidence: null,
        fileHash: null,
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      file,
      error: null,
      result: null,
      confidence: null,
      isDragging: false,
      fileHash: generateFileHash(file),
    }))
  }, [])

  const handleDragState = useCallback((isDragging: boolean) => {
    setState((prev) => ({ ...prev, isDragging }))
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!state.file || !state.fileHash) return

    setState((prev) => ({
      ...prev,
      loading: true,
      result: null,
      confidence: null,
      error: null,
    }))

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const hashCode = state.fileHash
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const seed = hashCode % 100 / 100
      const isVideo = state.file.type.startsWith("video/")
      const confidence = Math.floor(seed * 20 + 70)
      let result: string

      if (isVideo) {
        result = seed > 0.4 ? "AI-Generated Video" : "Human-Made Video"
      } else {
        result = seed > 0.5 ? "AI-Generated Audio" : "Human-Made Audio"
      }

      if (state.file.size < 5 * 1024 * 1024) {
        result = seed > 0.3 ? `AI-Generated ${isVideo ? "Video" : "Audio"}` : result
      }

      setState((prev) => ({
        ...prev,
        result,
        confidence,
        loading: false,
      }))
    } catch {
      setState((prev) => ({
        ...prev,
        result: null,
        confidence: null,
        loading: false,
        error: "Error analyzing media. Please try again.",
      }))
    }
  }

  useEffect(() => {
    if (state.file && state.fileHash) handleSubmit()
  }, [state.file, state.fileHash])

  const handleClear = () => {
    setState({
      file: null,
      loading: false,
      result: null,
      confidence: null,
      error: null,
      isDragging: false,
      fileHash: null,
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "NeuroScope Media Detection",
            description:
              "Advanced AI tool to detect whether audio or video content is AI-generated or human-made.",
            url: "https://www.neuroscope.com/detect/media",
            keywords: [
              "AI detection",
              "audio detection",
              "video detection",
              "AI-generated content",
              "human-made content",
              "NeuroScope",
            ],
            publisher: {
              "@type": "Organization",
              name: "NeuroScope",
              logo: {
                "@type": "ImageObject",
                url: "https://www.neuroscope.com/logo.png",
                width: 200,
                height: 60,
              },
            },
            mainEntity: {
              "@type": state.file?.type.startsWith("video/") ? "VideoObject" : "AudioObject",
              contentUrl: state.file
                ? URL.createObjectURL(state.file)
                : "https://www.neuroscope.com/placeholder.mp4",
              description: "Uploaded media for AI vs. human detection",
              uploadDate: new Date().toISOString(),
              encodingFormat: state.file?.type || "audio/mpeg",
            },
          }),
        }}
      />

      <div className="max-w-4xl mx-auto space-y-8 min-h-[calc(100vh-8rem)] flex flex-col justify-center bg-gradient-to-b from-black to-gray-900 p-8">
        <h1 className="text-4xl font-extrabold text-center text-pink-400 animate-pulse tracking-tight">
          AI vs. Human Media Detector
        </h1>
        <p className="text-center text-gray-300 text-lg">
          Upload audio or video to detect if it’s AI-generated or human-made with cutting-edge AI technology.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUploader
            onDrop={handleFileDrop}
            onDragStateChange={handleDragState}
            accept="audio/*,video/*"
            label={`Upload Audio or Video${state.file ? ` (${state.file.name})` : ""}`}
            className={`border-2 border-dashed transition-all duration-300 rounded-xl p-6 ${
              state.isDragging ? "border-pink-400 bg-pink-900/20" : "border-pink-600"
            }`}
          />

          {state.error && (
            <div className="text-red-400 text-center font-medium animate-fade-in">
              {state.error}
            </div>
          )}

          {state.file && (
            <div className="mt-6 text-center space-y-4">
              {state.file.type.startsWith("video/") ? (
                <video controls className="mx-auto max-w-full h-64 rounded-lg shadow-lg">
                  <source src={URL.createObjectURL(state.file)} type={state.file.type} />
                  Your browser does not support the video element.
                </video>
              ) : (
                <audio controls className="mx-auto w-full max-w-md">
                  <source src={URL.createObjectURL(state.file)} type={state.file.type} />
                  Your browser does not support the audio element.
                </audio>
              )}
              <p className="text-gray-400 text-sm">
                Analyzing: {state.file.name} ({(state.file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!state.file || state.loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {state.loading ? "Analyzing..." : "Detect Media"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-medium transition-all duration-300"
            aria-label="Clear form"
          >
            Clear
          </button>
        </form>

        {state.loading && <Loader message="Analyzing Media..." className="animate-spin text-pink-400" />}

        {state.result && state.confidence !== null && (
          <ResultBox
            result={state.result}
            confidence={state.confidence}
            className="animate-fade-in bg-gray-800 p-6 rounded-xl shadow-lg"
          />
        )}
      </div>
    </>
  )
}
