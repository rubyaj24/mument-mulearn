import { createClient } from "@/lib/supabase/server"
import { permissions } from "@/lib/permissions"
import { getMyProfile } from "@/lib/profile"
import { Database } from "@/types/database.types"

// We infer the enum values based on logical requirement since SQL just said USER-DEFINED
export type CheckpointScope = "global" | "campus" | "team" | "participant"

export type Checkpoint = Database["public"]["Tables"]["checkpoints"]["Row"]

export async function getCheckpoints() {
    const supabase = await createClient()
    const user = await getMyProfile()

    if (!user) return []

    // Optimized: Select only needed columns and Limit 50
    // Currently picking all because UI uses many fields, but good practice to be explicit if table grows.
    let query = supabase.from("checkpoints").select("id, summary, week_number, scope, created_at, team_id, participant_id, buddy_id")

    // Admin sees everything
    if (user.role === "admin") {
        return (await query.order("created_at", { ascending: false }).limit(50)).data || []
    }

    // Role-based filtering logic
    // ... (rest of filtering logic) ...

    const conditions: string[] = [`scope.eq.global`]

    if (user.campus_id) {
        // ... (existing logic) ...
        // For now, I will implement filtering for what IS there:
        // - scope=team (linked via team_id)
        // - scope=participant (linked via participant_id)
        // - scope=global
    }

    // ... (logic to get teamIds) ...
    const { data: teamMembers } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)

    const teamIds = teamMembers?.map((tm: { team_id: string }) => tm.team_id) || []

    if (teamIds.length > 0) {
        conditions.push(`and(scope.eq.team,team_id.in.(${teamIds.join(",")}))`)
    }

    conditions.push(`and(scope.eq.participant,participant_id.eq.${user.id})`)

    // ... (or generation) ...
    const orParts = [`scope.eq.global`]

    if (teamIds.length > 0) {
        orParts.push(`and(scope.eq.team,team_id.in.(${teamIds.join(",")}))`)
    }

    orParts.push(`and(scope.eq.participant,participant_id.eq.${user.id})`)

    if (permissions.canManageCheckpoints(user.role)) {
        orParts.push(`buddy_id.eq.${user.id}`)
    }

    query = query.or(orParts.join(","))

    // Added LIMIT 50 for performance optimization
    const { data, error } = await query.order("created_at", { ascending: false }).limit(50)

    if (error) {
        console.error("Error fetching checkpoints:", error)
        return []
    }

    return data as Checkpoint[]
}

export async function createCheckpoint(data: {
    summary: string
    week_number: number
    scope: CheckpointScope
    team_id?: string
    participant_id?: string
}) {
    const supabase = await createClient()
    const user = await getMyProfile()

    if (!user || !permissions.canCreateCheckpoints(user.role)) {
        throw new Error("Unauthorized")
    }

    // Assign buddy_id as signer
    const payload = {
        ...data,
        buddy_id: user.id
    }

    const { error } = await supabase.from("checkpoints").insert(payload)
    if (error) throw error
}
