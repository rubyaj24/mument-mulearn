"use client"

import Image from "next/image"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ToastProvider"
import ConditionsModal from "@/components/ConditionsModal"
import LoginForm from "./components/LoginForm"

export default function LoginPage() {
  const router = useRouter()
  // const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])
  const { show } = useToast()
  const [showConditions, setShowConditions] = useState(false)

  const redirectToDashboard = useCallback(() => router.replace("/dashboard"), [router])

  // If already logged in, skip login page
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) redirectToDashboard()
    }
    checkSession()
  }, [redirectToDashboard, supabase.auth])

  // handleSignedIn is called by LoginForm after successful signin
  function handleSignedIn() {
    const seen = typeof window !== "undefined" ? sessionStorage.getItem("conditions_shown") : null
    if (!seen) {
      setShowConditions(true)
      show({ title: "Signed in", description: "Welcome — please review the rules." })
      return
    }

    show({ title: "Signed in", description: "Redirecting to dashboard..." })
    redirectToDashboard()
  }
    function handleCloseConditions() {
      try {
        if (typeof window !== "undefined") sessionStorage.setItem("conditions_shown", "1")
      } finally {
        setShowConditions(false)
        redirectToDashboard()
      }
    }

    return (
    <>
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
          <LoginForm onSignedIn={handleSignedIn} />
        </div>
      </div>
        <ConditionsModal open={showConditions} onClose={handleCloseConditions} />
      </div>
    </>
  )
}
