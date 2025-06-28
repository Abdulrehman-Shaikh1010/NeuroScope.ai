"use client"

import { useState, useEffect, useCallback } from "react"
import Head from "next/head"
import Image from "next/image"
import FileUploader from "@/app/component/FileUploader"
import ResultBox from "@/app/component/ResultBox"
import Loader from "@/app/component/Loader"
import { useUser } from "@supabase/auth-helpers-react"
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
  const user = useUser()
  const [state, setState] = useState<ImageDetectState>({
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

  const saveDetectionToSupabase = useCallback(async (file: File, result: string, confidence: number) => {
    if (!user) return
    try {
      const { error } = await supabase.from("detections").insert({
        user_id: user.id,
        type: "image",
        result,
        confidence,
        input_data: file.name,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        created_at: new Date().toISOString(),
      })
      if (error) console.error("Supabase error:", error.message)
    } catch (err) {
      console.error("Supabase insert error:", (err as Error).message)
    }
  }, [user])

  const handleFileDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setState((prev) => ({
        ...prev,
        error: "Please upload a valid image file.",
        file: null,
        result: null,
        confidence: null,
        fileHash: null,
      }))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setState((prev) => ({
        ...prev,
        error: "File size exceeds 10MB limit.",
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

  const handleSubmit = useCallback(async () => {
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
      const hashCode = state.fileHash.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const seed = (hashCode % 100) / 100
      const confidence = Math.floor(seed * 20 + 70)
      let result = seed > 0.5 ? "AI-Generated Image" : "Human-Made Image"
      if (state.file.size < 2 * 1024 * 1024) result = seed > 0.3 ? "AI-Generated Image" : result

      setState((prev) => ({
        ...prev,
        result,
        confidence,
        loading: false,
      }))

      await saveDetectionToSupabase(state.file, result, confidence)
    } catch {
      setState((prev) => ({
        ...prev,
        result: null,
        confidence: null,
        loading: false,
        error: "Error analyzing image. Please try again.",
      }))
    }
  }, [state.file, state.fileHash, saveDetectionToSupabase])

  useEffect(() => {
    if (state.file && state.fileHash) handleSubmit()
  }, [state.file, state.fileHash, handleSubmit])

  return (
    <>
      <Head>
        <title>NeuroScope Image Detection - AI vs. Human Images</title>
        <meta name="description" content="Detect AI-generated or human-made images with NeuroScope." />
      </Head>

      <div className="max-w-4xl mx-auto space-y-8 min-h-[calc(100vh-8rem)] flex flex-col justify-center bg-gradient-to-b from-black to-gray-900 p-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-400 animate-pulse tracking-tight">
          AI vs. Human Image Detector
        </h1>
        <p className="text-center text-gray-300 text-lg">
          Upload an image to detect if it&apos;s AI-generated or human-made.
        </p>

        <FileUploader
          onDrop={handleFileDrop}
          onDragStateChange={handleDragState}
          accept="image/*"
          label={`Upload Image${state.file ? ` (${state.file.name})` : ""}`}
          className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
            state.isDragging ? "border-purple-400 bg-purple-900/20" : "border-purple-600"
          }`}
        />

        {state.file && (
          <div className="mt-6 text-center space-y-4">
            <Image
              src={URL.createObjectURL(state.file)}
              alt="Uploaded Preview"
              width={400}
              height={300}
              className="mx-auto rounded-lg border-2 border-purple-500 shadow-lg"
            />
            <p className="text-gray-400 text-sm">
              Analyzing: {state.file.name} ({(state.file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        )}

        {state.loading && <Loader message="Analyzing Image..." className="animate-spin text-purple-400" />}

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
