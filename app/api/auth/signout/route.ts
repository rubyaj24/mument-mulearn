import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await createClient()
  try {
    // This will clear server-side cookies via the server client
    await supabase.auth.signOut()
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Sign out failed" }, { status: 500 })
  }
}
