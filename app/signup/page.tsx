"use client"

import { useState, useEffect, useCallback, FormEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

interface SignupState {
  email: string
  password: string
  confirmPassword: string
  error: string | null
  loading: boolean
  isFormValid: boolean
  passwordStrength: "weak" | "medium" | "strong" | null
}

export default function SignupPage() {
  const [state, setState] = useState<SignupState>({
    email: "",
    password: "",
    confirmPassword: "",
    error: null,
    loading: false,
    isFormValid: false,
    passwordStrength: null,
  })

  const router = useRouter()

  const validateForm = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(state.email)
    const isPasswordValid = state.password.length >= 8
    const isConfirmValid =
      state.password === state.confirmPassword && state.confirmPassword.length >= 8
    return isEmailValid && isPasswordValid && isConfirmValid
  }, [state.email, state.password, state.confirmPassword])

  const calculatePasswordStrength = useCallback((password: string) => {
    if (!password) return null
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLong = password.length >= 12
    if (isLong && hasUpperCase && hasLowerCase && hasNumber && hasSymbol) return "strong"
    if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber) return "medium"
    return "weak"
  }, [])

  useEffect(() => {
    const isValid = validateForm()
    const strength = calculatePasswordStrength(state.password)
    setState((prev) => ({ ...prev, isFormValid: isValid, passwordStrength: strength }))
  }, [state.email, state.password, state.confirmPassword, validateForm, calculatePasswordStrength])

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!state.isFormValid) {
      setState((prev) => ({
        ...prev,
        error: "Please enter a valid email and matching passwords (8+ characters).",
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const { error } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`,
        },
      })

      if (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }))
        return
      }

      setState((prev) => ({
        ...prev,
        email: "",
        password: "",
        confirmPassword: "",
        error: null,
        loading: false,
      }))

      router.push("/login")
    } catch {
      setState((prev) => ({
        ...prev,
        error: "An unexpected error occurred. Please try again.",
        loading: false,
      }))
    }
  }

  const handleInputChange =
    (field: "email" | "password" | "confirmPassword") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        [field]: e.target.value,
        error: null,
      }))
    }

  const passwordStrengthConfig = {
    weak: { color: "text-red-400", label: "Weak" },
    medium: { color: "text-yellow-400", label: "Medium" },
    strong: { color: "text-green-400", label: "Strong" },
    null: { color: "text-gray-400", label: "" },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white p-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-6 p-8 bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-cyan-500/20 animate-fade-in"
        noValidate
      >
        <h2 className="text-3xl font-extrabold text-center text-cyan-400 animate-pulse">Join NeuroScope</h2>
        <p className="text-center text-gray-300 text-sm">
          Create an account to access AI-powered content detection tools.
        </p>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={state.email}
              onChange={handleInputChange("email")}
              required
              className="w-full mt-1 p-3 bg-gray-900 border border-cyan-500 rounded-xl placeholder-gray-500 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={state.password}
              onChange={handleInputChange("password")}
              required
              className="w-full mt-1 p-3 bg-gray-900 border border-cyan-500 rounded-xl placeholder-gray-500 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
            {state.passwordStrength && (
              <p className={`text-sm mt-1 ${passwordStrengthConfig[state.passwordStrength].color}`}>
                Password Strength: {passwordStrengthConfig[state.passwordStrength].label}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={state.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              required
              className="w-full mt-1 p-3 bg-gray-900 border border-cyan-500 rounded-xl placeholder-gray-500 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          {/* Error */}
          {state.error && (
            <p className="text-red-400 text-sm text-center animate-fade-in" role="alert" aria-live="polite">
              {state.error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={state.loading || !state.isFormValid}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {state.loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        {/* Links */}
        <div className="text-center text-sm text-gray-400 space-y-2">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-cyan-400 hover:text-cyan-300 underline">
              Log in
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
  )
}
