import { submitFeedback } from "@/lib/feedback"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const subject = String(body?.subject ?? "").trim()
    const description = String(body?.description ?? "").trim()
    const category = String(body?.category ?? "").trim()

    if (!subject || !description || !category) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    }

    await submitFeedback({ subject, description, category })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
