import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 })

  const supabase = await createClient()
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // On success, createServerClient will set auth cookies via the cookie helper
    return NextResponse.json({ session: data.session ?? null })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}
