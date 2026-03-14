import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function maskEndpoint(endpoint: string) {
  if (!endpoint) return ""
  if (endpoint.length <= 16) return endpoint
  return `${endpoint.slice(0, 10)}...${endpoint.slice(-6)}`
}

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
  }

  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch push subscriptions",
        details: error.message,
      },
      { status: 500 }
    )
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""

  return NextResponse.json(
    {
      userId: user.id,
      diagnostics: {
        vapidPublicKeyPresent: vapidPublicKey.length > 0,
        vapidPublicKeyLength: vapidPublicKey.length,
      },
      subscriptionCount: subscriptions?.length ?? 0,
      subscriptions:
        subscriptions?.map((sub) => ({
          id: sub.id,
          created_at: sub.created_at,
          endpoint_masked: maskEndpoint(sub.endpoint),
        })) ?? [],
      hint:
        "If subscriptionCount is 0 while browser permission is granted, pushManager.subscribe() is failing before DB save.",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}
