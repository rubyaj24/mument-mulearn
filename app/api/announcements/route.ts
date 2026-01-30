import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient()

    try {
        const { data: announcements, error } = await supabase
            .from("announcements")
            .select("id, content, created_at")
            .order("created_at", { ascending: false })

        if (error) throw error

        return NextResponse.json({ announcements: announcements || [] })
    } catch (err: unknown) {
        const e = err as { message?: string }
        return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 })
    }
}
