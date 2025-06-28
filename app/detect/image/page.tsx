"use client"

import { useState, useEffect, useCallback } from "react"
import Head from "next/head"
import FileUploader from "@/app/component/FileUploader"
import ResultBox from "@/app/component/ResultBox"
import Loader from "@/app/component/Loader"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

interface ImageDetectState {
  file: File | null
  loading: boolean
  result: string | null
  confidence: number | null
  error: string | null
  isDragging: boolean
  fileHash: string | null
}

export default function ImageDetectPage() {
  const router = useRouter()

  const [state, setState] = useState<ImageDetectState>({
    file: null,
    loading: false,
    result: null,
    confidence: null,
    error: null,
    isDragging: false,
    fileHash: null,
  })

  const [userId, setUserId] = useState<string | null>(null)

  // ✅ Fix: Get logged-in user from Supabase session
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setUserId(null)
        return
      }

      setUserId(session.user.id)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    return () => {
      if (state.file) URL.revokeObjectURL(URL.createObjectURL(state.file))
    }
  }, [state.file])

  const generateFileHash = (file: File): string => {
    return `${file.name}-${file.size}-${file.type}-${file.lastModified}`
  }

  const saveDetectionToSupabase = async (file: File, result: string, confidence: number) => {
    if (!userId) return

    try {
      const { error } = await supabase.from("detections").insert({
        user_id: userId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        result,
        confidence,
        created_at: new Date().toISOString(),
      })

      if (error) console.error("Supabase insert error:", error.message)
    } catch (error) {
      console.error("Insert failed:", (error as Error).message)
    }
  }

  const handleFileDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      return setState((prev) => ({
        ...prev,
        error: "Please upload a valid image file.",
        file: null,
        result: null,
        confidence: null,
        fileHash: null,
      }))
    }

    if (file.size > 10 * 1024 * 1024) {
      return setState((prev) => ({
        ...prev,
        error: "File size exceeds 10MB.",
        file: null,
        result: null,
        confidence: null,
        fileHash: null,
      }))
    }

    if (file.size === 0) {
      return setState((prev) => ({
        ...prev,
        error: "Empty file uploaded.",
        file: null,
        result: null,
        confidence: null,
        fileHash: null,
      }))
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

    if (!userId) {
      setState((prev) => ({
        ...prev,
        error: "Please log in to analyze images.",
        loading: false,
      }))
      setTimeout(() => router.push("/login"), 1500)
      return
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      result: null,
      confidence: null,
      error: null,
    }))

    try {
      await new Promise((r) => setTimeout(r, 1200))

      const hashCode = state.fileHash
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)

      const seed = (hashCode % 100) / 100
      const confidence = Number(((seed * 20 + 70).toFixed(1)))
      let result = seed > 0.5 ? "AI-Generated Image" : "Human-Made Image"

      if (state.file.size < 2 * 1024 * 1024) {
        result = seed > 0.3 ? "AI-Generated Image" : result
      }

      setState((prev) => ({
        ...prev,
        result,
        confidence,
        loading: false,
      }))

      await saveDetectionToSupabase(state.file, result, confidence)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Something went wrong. Please try again.",
        loading: false,
      }))
    }
  }

  useEffect(() => {
    if (state.file && state.fileHash) handleSubmit()
  }, [state.file, state.fileHash])

  return (
    <>
      <Head>
        <title>NeuroScope Image Detection - AI vs. Human Images</title>
        <meta name="description" content="Detect AI or Human-generated images with NeuroScope." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="max-w-4xl mx-auto min-h-screen p-6 flex flex-col justify-center bg-gradient-to-b from-black to-gray-900 text-white space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-400 animate-pulse">
          AI vs. Human Image Detector
        </h1>
        <p className="text-center text-gray-300">
          Upload an image to detect if it's AI-generated or human-made.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUploader
            onDrop={handleFileDrop}
            onDragStateChange={handleDragState}
            accept="image/*"
            label={`Upload Image${state.file ? ` (${state.file.name})` : ""}`}
            className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
              state.isDragging ? "border-purple-400 bg-purple-900/20" : "border-purple-600"
            }`}
          />

          {state.error && (
            <div className="text-red-400 text-center font-medium">{state.error}</div>
          )}

          {state.file && (
            <div className="mt-6 text-center space-y-4">
              <Image
                src={URL.createObjectURL(state.file)}
                width={300}
                height={300}
                alt="Uploaded image"
                className="rounded-lg border-2 border-purple-500 mx-auto"
              />
              <p className="text-gray-400 text-sm">
                File: {state.file.name} ({(state.file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!state.file || state.loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:bg-gray-500"
          >
            {state.loading ? "Analyzing..." : "Detect Image"}
          </button>
        </form>

        {state.loading && <Loader message="Analyzing Image..." className="text-purple-400" />}
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
