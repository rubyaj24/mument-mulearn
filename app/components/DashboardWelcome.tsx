"use client"

import React, { useEffect, useState } from "react"
import { UserProfile } from "@/types/user"
import { useToast } from "@/components/ToastProvider"

export default function DashboardWelcome({ profile }: { profile: UserProfile }) {
  const [open, setOpen] = useState(false)
  const { show } = useToast()

  useEffect(() => {
    try {
      const seen = typeof window !== "undefined" ? window.sessionStorage.getItem("dashboard_welcome_shown") : null
      if (!seen) {
        if (typeof window !== "undefined") window.sessionStorage.setItem("dashboard_welcome_shown", "1")
        // schedule open after the current render to avoid cascading renders warning
        setTimeout(() => setOpen(true), 0)
      }
    } catch {
      // Vittek
    }
  }, [])

  function close() {
    try {
      if (typeof window !== "undefined") window.sessionStorage.setItem("dashboard_welcome_shown", "1")
    } catch {}
    setOpen(false)
    show({ title: `Welcome, ${profile.full_name.split(" ")[0] || "there"}!`, description: "Let it be a great start." })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={close} />
      <div className="relative z-10 max-w-xl w-full mx-4 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-blue-500 mb-2">Welcome, {profile.full_name.split(" ")[0] || "User"}</h3>
        <p className="text-sm text-slate-700 mb-4">Here are a few quick tips to get started:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 mb-4">
          <li>Create daily updates.</li>
          <li>Attend checkpoints.</li>
          <li>Reach out to your campus coordinator for local guidance.</li>
        </ul>
        <div className="flex justify-end">
          <button onClick={close} className="px-4 py-2 bg-brand-blue text-white rounded-md">Get started</button>
        </div>
      </div>
    </div>
  )
}
