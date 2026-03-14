import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 })
  }

  const probeEndpoint = `debug-probe://${user.id}/${Date.now()}`
  const probeP256dh = "debug-p256dh"
  const probeAuth = "debug-auth"

  const { data: inserted, error: insertError } = await supabase
    .from("push_subscriptions")
    .insert({
      user_id: user.id,
      endpoint: probeEndpoint,
      p256dh: probeP256dh,
      auth: probeAuth,
    })
    .select("id, user_id, endpoint")
    .single()

  if (insertError) {
    return NextResponse.json(
      {
        ok: false,
        stage: "insert",
        userId: user.id,
        error: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: "If insert fails here, this is a DB policy/FK issue, not a browser push subscribe issue.",
      },
      { status: 500 }
    )
  }

  const { error: deleteError } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("id", inserted.id)

  if (deleteError) {
    return NextResponse.json(
      {
        ok: false,
        stage: "delete",
        userId: user.id,
        inserted,
        error: deleteError.message,
        code: deleteError.code,
        details: deleteError.details,
        hint: "Insert works but delete failed; check delete policy for auth.uid() = user_id.",
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      ok: true,
      stage: "completed",
      userId: user.id,
      inserted,
      deleted: true,
      hint: "DB insert/delete policies are working for current user. Browser push subscribe is the failing layer.",
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  )
}
