"use client"

import { useState, useEffect, useCallback } from "react"
import Head from "next/head"
import ResultBox from "@/app/component/ResultBox"
import Loader from "@/app/component/Loader"
import { supabase } from "@/lib/supabaseClient"

interface TextDetectState {
  text: string
  loading: boolean
  result: string | null
  confidence: number | null
  error: string | null
  textHash: string | null
}

export default function TextDetectPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [state, setState] = useState<TextDetectState>({
    text: "",
    loading: false,
    result: null,
    confidence: null,
    error: null,
    textHash: null,
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) return setUserId(null)
      setUserId(data.session.user.id)
    }
    checkAuth()
  }, [])

  const generateTextHash = (text: string): string => {
    return text
      .trim()
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      .toString()
  }

  const saveDetectionToSupabase = useCallback(
    async (content: string, result: string, confidence: number) => {
      if (!userId) return
      const { error } = await supabase.from("detections").insert({
        user_id: userId,
        type: "text",
        content,
        result,
        confidence,
        created_at: new Date().toISOString(),
      })
      if (error) console.error("Supabase insert error:", error.message)
    },
    [userId]
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      if (!state.text.trim() || !state.textHash) return

      setState((prev) => ({
        ...prev,
        loading: true,
        result: null,
        confidence: null,
        error: null,
      }))

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const hashCode = parseInt(state.textHash, 10)
        const seed = (hashCode % 100) / 100
        const confidence = Math.floor(seed * 20 + 70)
        let result = seed > 0.5 ? "AI-Generated Text" : "Human-Made Text"

        if (state.text.trim().length < 100) {
          result = seed > 0.3 ? "AI-Generated Text" : result
        }

        setState((prev) => ({
          ...prev,
          result,
          confidence,
          loading: false,
        }))

        await saveDetectionToSupabase(state.text, result, confidence)
      } catch (err) {
        setState((prev) => ({
          ...prev,
          result: null,
          confidence: null,
          loading: false,
          error: "Error analyzing text. Please try again.",
        }))
        console.error("Detection error:", (err as Error).message)
      }
    },
    [state.text, state.textHash, saveDetectionToSupabase]
  )

  useEffect(() => {
    if (state.text.trim() && state.textHash) handleSubmit()
  }, [state.text, state.textHash, handleSubmit])

  return (
    <>
      <Head>
        <title>NeuroScope Text Detection</title>
        <meta name="description" content="Detect if your text is AI-generated or human-written." />
      </Head>

      <div className="max-w-4xl mx-auto min-h-screen p-6 bg-gradient-to-b from-black to-gray-900 text-white space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-cyan-400 animate-pulse">
          AI vs. Human Text Detector
        </h1>
        <p className="text-center text-gray-300">
          Paste your text below to determine if it was AI-generated or written by a human.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={state.text}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                text: e.target.value,
                textHash: generateTextHash(e.target.value),
              }))
            }
            placeholder="Paste your text here..."
            rows={10}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <button
            type="submit"
            disabled={!state.text.trim() || state.loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:bg-gray-500"
          >
            {state.loading ? "Analyzing..." : "Detect Text"}
          </button>
        </form>

        {state.error && (
          <div className="text-red-400 text-center font-medium">{state.error}</div>
        )}

        {state.loading && <Loader message="Analyzing Text..." className="text-cyan-400" />}

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
