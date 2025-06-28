"use client"

import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { supabase } from "@/lib/supabaseClient"

interface LoginState {
  email: string
  password: string
  error: string | null
  loading: boolean
  isFormValid: boolean
}

export default function LoginPage() {
  const [state, setState] = useState<LoginState>({
    email: "",
    password: "",
    error: null,
    loading: false,
    isFormValid: false,
  })

  const router = useRouter()

  const validateForm = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(state.email) && state.password.length >= 8
  }, [state.email, state.password])

  useEffect(() => {
    const isFormValid = validateForm()
    setState((prev) => ({ ...prev, isFormValid }))
  }, [validateForm])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!state.isFormValid) {
      setState((prev) => ({
        ...prev,
        error: "Please enter a valid email and a password (min. 8 characters).",
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: state.email,
        password: state.password,
      })

      if (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }))
        return
      }

    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: "An unexpected error occurred. Please try again.",
        loading: false,
      }))
    }
  }

  const handleInputChange =
    (field: "email" | "password") => (e: ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        [field]: e.target.value,
        error: null,
      }))
    }

  return (
    <>
      {/* SEO Head Tags */}
      <Head>
        <title>Login to NeuroScope - AI Content Detection</title>
        <meta
          name="description"
          content="Log in to NeuroScope to access advanced AI tools for detecting AI-generated or human-made content."
        />
        <meta
          name="keywords"
          content="NeuroScope login, AI detection, AI content tool, human-generated content, AI checker"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://www.neuroscope.com/login" />
        <meta property="og:title" content="NeuroScope Login" />
        <meta
          property="og:description"
          content="Securely log in to NeuroScope to analyze content with AI-powered detection tools."
        />
        <meta property="og:url" content="https://www.neuroscope.com/login" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.neuroscope.com/og-image.jpg" />
      </Head>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "NeuroScope Login",
            description:
              "Secure login page for NeuroScope's AI content detection platform.",
            url: "https://www.neuroscope.com/login",
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
              "@type": "WebForm",
              name: "Login Form",
              action: "https://www.neuroscope.com/login",
              potentialAction: {
                "@type": "Action",
                target: "https://www.neuroscope.com/dashboard",
                name: "Login to Dashboard",
              },
            },
          }),
        }}
      />

      {/* Login UI */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 p-8 bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-cyan-500/20 animate-fade-in"
          aria-labelledby="login-heading"
          noValidate
        >
          <h2
            id="login-heading"
            className="text-3xl font-extrabold text-center text-cyan-400 animate-pulse tracking-tight"
          >
            Welcome to NeuroScope
          </h2>
          <p className="text-center text-gray-300 text-sm">
            Log in to access AI-powered content detection tools.
          </p>

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={state.email}
                onChange={handleInputChange("email")}
                required
                autoComplete="email"
                className="w-full mt-1 p-3 bg-gray-900 border-2 border-cyan-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={state.password}
                onChange={handleInputChange("password")}
                required
                autoComplete="current-password"
                className="w-full mt-1 p-3 bg-gray-900 border-2 border-cyan-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
              />
            </div>

            {/* Error Message */}
            {state.error && (
              <p
                className="text-red-400 text-sm text-center animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                {state.error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={state.loading || !state.isFormValid}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {state.loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                "Log In"
              )}
            </button>
          </div>

          {/* Bottom Links */}
          <div className="text-center text-sm text-gray-400 space-y-2">
            <p>
              Don’t have an account?{" "}
              <a href="/signup" className="text-cyan-400 hover:text-cyan-300 underline">
                Sign up
              </a>
            </p>
            <p>
              Forgot password?{" "}
              <a href="/reset-password" className="text-cyan-400 hover:text-cyan-300 underline">
                Reset it
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  )
}
