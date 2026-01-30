import { createClient } from "@/lib/supabase/server"
import { getMyProfile } from "@/lib/profile"
import { permissions } from "@/lib/permissions"
import { Database } from "@/types/database.types"

export type Feedback = Database["public"]["Tables"]["feedback"]["Row"]

export async function submitFeedback(data: {
    subject: string
    description: string
    category: string
}) {
    const supabase = await createClient()
    const user = await getMyProfile()

    if (!user) throw new Error("Unauthorized")

    const payload = {
        ...data,
        created_by: user.id,
        status: 'new',
        campus_id: user.campus_id || null
    }

    const { error } = await supabase.from("feedback").insert(payload)
    if (error) throw error
}

export async function getFeedbackInbox() {
    const supabase = await createClient()
    const user = await getMyProfile()

    if (!user || !permissions.canViewFeedbackInbox(user.role)) {
        return []
    }

    // Optimized: Limit 50 items
    // Selecting specific columns is good, but for inbox we need most of them.
    // Keeping * for now as schema is still in flux/mocked, but adding limit is crucial.
    let query = supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(50)

    // Role-based filtering
    if (permissions.canViewAllFeedback(user.role)) {
        // Watcher, Zonal Lead, Admin -> See ALL (Limited to 50 recent)
    } else if (permissions.canViewGroupedFeedback(user.role)) {
        // Foreman logic (placeholder)
    } else if (user.role === "campus_coordinator") {
        if (user.campus_id) {
            query = query.eq("campus_id", user.campus_id)
        } else {
            return []
        }
    }

    const { data, error } = await query

    if (error) {
        console.error("Error fetching feedback:", error)
        return []
    }

    return data as Feedback[]
}
