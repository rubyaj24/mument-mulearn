import { createClient } from "@/lib/supabase/server"
import { permissions } from "@/lib/permissions"
import { getMyProfile } from "@/lib/profile"
import { Database } from "@/types/database.types"

export type CheckpointScope = "global" | "campus" | "team" | "participant"

export type Checkpoint = Database["public"]["Tables"]["checkpoints"]["Row"]

export async function getCheckpoints() {
    const supabase = await createClient()
    const user = await getMyProfile()

    if (!user) return []

    let query = supabase.from("checkpoints").select("id, summary, week_number, scope, created_at, team_id, participant_id, buddy_id")

    // Admin sees everything
    if (user.role === "admin") {
        return (await query.order("created_at", { ascending: false }).limit(50)).data || []
    }

    // Role-based filtering logic: obtain teams
    const { data: teamMembers } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)

    const teamIds = teamMembers?.map((tm: { team_id: string }) => tm.team_id) || []

    const orParts = [`scope.eq.global`]

    if (teamIds.length > 0) {
        orParts.push(`and(scope.eq.team,team_id.in.(${teamIds.join(",")}))`)
    }

    orParts.push(`and(scope.eq.participant,participant_id.eq.${user.id})`)

    if (permissions.canManageCheckpoints(user.role)) {
        orParts.push(`buddy_id.eq.${user.id}`)
    }

    query = query.or(orParts.join(","))

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

export async function getBuddyTeams(userId: string) {
    const supabase = await createClient()

    // Fetch teams where user is a member
    const { data: members, error: memberError } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", userId)

    if (memberError || !members || members.length === 0) return []

    const teamIds = members.map((m: { team_id: string }) => m.team_id)

    const { data: teams, error: teamError } = await supabase
        .from("teams")
        .select("id, team_name")
        .in("id", teamIds)

    if (teamError) return []

    return teams
}
