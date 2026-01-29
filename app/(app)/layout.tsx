import { redirect } from "next/navigation"
import { ReactNode } from "react"
import Sidebar from "@/components/layout/Sidebar"
import { createClient } from "@/lib/supabase/server"
import { UserProfile } from "@/types/user"

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabaseServer = await createClient()

  // 1️⃣ Auth check (server-side)
  const {
    data: { user },
  } = await supabaseServer.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 2️⃣ Fetch profile with role (RLS enforced)
  const { data: profile, error } = await supabaseServer
    .from("profiles")
    .select("id, full_name, role, district_id, campus_id, created_at")
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("❌ Profile fetch error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      userId: user.id,
    })
    redirect("/login")
  }

  if (!profile) {
    console.error("❌ No profile row found for user:", user.id)
    redirect("/login")
  }

  const typedProfile = profile as UserProfile

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role={typedProfile.role} />

      <main style={{ flex: 1, padding: "1rem" }}>
        <p>User: {typedProfile.full_name} | Role: {typedProfile.role}</p>
        {children}
      </main>
    </div>
  )
}
