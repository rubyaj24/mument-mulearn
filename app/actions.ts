"use server"

import { createAnnouncement as serviceCreateAnnouncement } from "@/lib/announcements"
import { createCheckpoint as serviceCreateCheckpoint, CheckpointScope } from "@/lib/checkpoints"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createAnnouncementAction(formData: FormData) {
    const content = formData.get("content") as string
    if (!content) return

    await serviceCreateAnnouncement(content)
    revalidatePath("/announcements")
}

export async function createCheckpointAction(formData: FormData) {
    const summary = formData.get("summary") as string
    const week_number = parseInt(formData.get("week_number") as string)
    // Scope is now determined by logic or default to 'team' if team_id is present
    let scope = formData.get("scope") as CheckpointScope
    const team_id = formData.get("team_id") as string | null

    if (team_id) {
        scope = "team"
    }

    // Fallback or custom logic if scope not set (though UI should handle standard cases)
    if (!scope) scope = "global"

    if (!summary || isNaN(week_number)) return

    await serviceCreateCheckpoint({
        summary,
        week_number,
        scope,
        team_id: team_id || undefined
    })
    revalidatePath("/checkpoints")
}

import { getMyProfile } from "@/lib/profile"
import { createClient } from "@/lib/supabase/server"
import { Role } from "@/types/user"

export async function updateUserRoleAction(userId: string, newRole: Role) {
    const supabase = await createClient()
    const currentUser = await getMyProfile()

    if (currentUser?.role !== "admin") {
        throw new Error("Unauthorized")
    }

    const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId)

    if (error) throw error

    revalidatePath("/admin")
}

import { updateFeedbackStatus } from "@/lib/feedback"

export async function updateFeedbackStatusAction(id: string, status: string) {
    await updateFeedbackStatus(id, status)
    revalidatePath("/feedback/inbox")
    revalidatePath("/feedback/my-feedback")
    revalidatePath("/feedback/my-feedback")
}

export async function updateUserProfileAction(userId: string, data: { role: Role; district_id: string; campus_id: string; email: string }) {
    const supabase = await createClient()
    const currentUser = await getMyProfile()

    if (currentUser?.role !== "admin") {
        throw new Error("Unauthorized")
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            role: data.role,
            district_id: data.district_id,
            campus_id: data.campus_id || null, // Handle empty string as null
            email: data.email
        })
        .eq("id", userId)

    if (error) throw error

    revalidatePath("/admin")
}
