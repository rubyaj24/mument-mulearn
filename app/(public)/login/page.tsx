"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeClosed } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const supabase = createClient()

  const redirectToDashboard = () => router.replace("/dashboard")

  // If already logged in, skip login page
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) redirectToDashboard()
    }
    checkSession()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    function mapAuthError(err: any) {
      const msg = (err?.message || "").toString().toLowerCase()
      const status = err?.status

      if (typeof navigator !== "undefined" && !navigator.onLine) return "No internet connection. Please check your network."
      if (status >= 500) return "Server error — please try again later."
      if (msg.includes("invalid") || msg.includes("invalid login") || msg.includes("invalid password") || msg.includes("incorrect") || msg.includes("wrong")) return "Incorrect email or password."
      if (msg.includes("user") && msg.includes("not found") || msg.includes("not registered") || msg.includes("no user")) return "Account not found. Please sign up."
      if (msg.includes("password")) return "Incorrect password."
      return err?.message || "An unexpected error occurred. Please try again."
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        const friendly = mapAuthError(error)
        setError(friendly)
        setLoading(false)
        return
      }

      // success
      if (data?.session) {
        redirectToDashboard()
        return
      }

      // fallback
      redirectToDashboard()
    } catch (err: any) {
      console.error("Login error:", err)
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch")) setError("Network error. Check your connection and try again.")
        else setError(err.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Illustration - shown on md+ as a visually-rich panel */}
        <div className="order-1">
          <div className="hidden md:block relative rounded-3xl overflow-hidden shadow-2xl h-[70vh] w-full">
            <Image
              src="/penguin-image.jpeg"
              alt="µment 2.0 - Penguin Illustration"
              fill
              className="object-cover rounded-4xl"
              priority
            />
          </div>
          {/* small-screen illustration (above form) */}
          <div className="md:hidden relative overflow-hidden rounded-4xl shadow mb-4">
            <Image
              src="/penguin-image.jpeg"
              alt="µment 2.0 - Penguin Illustration"
              height={100}
              width={400}
              className="object-cover rounded-4xl"
              priority
            />
          </div>
        </div>

        {/* Form */}
        <div className="order-2 flex items-center">
          <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow relative z-10">
            <h1 className="text-blue-700 text-2xl font-bold mb-4 text-center">Login</h1>

            <form onSubmit={handleLogin} className="space-y-4" aria-describedby="login-error">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-700">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="mt-1 block w-full rounded-md border-blue-500 p-2 bg-blue-50 text-blue-700 placeholder-blue-700"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-700">Password</label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-blue-500 p-2 pr-10 text-blue-700 bg-blue-50 placeholder-blue-700"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-700"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="px-4 py-2 bg-brand-blue text-white rounded w-full"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {error && (
              <p id="login-error" className="text-sm text-red-600 mt-2">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
