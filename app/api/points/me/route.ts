import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserPoints, getRecentTransactions } from "@/lib/points"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

  try {
    const points = await getUserPoints(user.id)
    const recent = await getRecentTransactions(user.id)
    return NextResponse.json({ points, recent })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 })
  }
}
