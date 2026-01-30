import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { awardPoints, getUserPoints } from "@/lib/points"

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { ruleKey, targetUserId, related_type, related_id, reason, metadata } = body || {}

  if (!ruleKey) return NextResponse.json({ error: "Missing ruleKey" }, { status: 400 })

  try {
    // fetch actor profile to check role if awarding to others
    const { data: actorProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    const actorRole = actorProfile?.role
    const target = targetUserId ?? user.id

    if (target !== user.id && actorRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const tx = await awardPoints(target, ruleKey, {
      related_type,
      related_id,
      reason,
      awarded_by: user.id,
      metadata,
    })

    const points = await getUserPoints(target)
    return NextResponse.json({ transaction: tx, points }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 400 })
  }
}
