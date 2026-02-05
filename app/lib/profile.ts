"use server"

import { createClient } from "@/lib/supabase/server"
import { UserProfile } from "@/types/user"

export async function getMyProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, email, district_id, campus_id, team_id, created_at")
    .eq("id", user.id)
    .single()

  if (error || !data) return null

  const { data: districtRow, error: districtErr } = await supabase
    .from("districts")
    .select("name")
    .eq("id", data.district_id)
    .maybeSingle()

  if (districtErr) {
    console.error("Error fetching district name:", districtErr)
  }

  const { data: campusRow, error: campusErr } = await supabase
    .from("colleges")
    .select("name")
    .eq("id", data.campus_id)
    .maybeSingle()

  if (campusErr) {
    console.error("Error fetching campus name:", campusErr)
  }


  const { data: teamRow, error: teamErr } = await supabase
      .from("teams")
      .select("team_name, team_code")
      .eq("id", data.team_id)
      .maybeSingle()

    if (teamErr) {
      console.error("Error fetching team name:", teamErr)
    }

  return { ...(data as UserProfile), district_name: districtRow?.name ?? undefined, campus_name: campusRow?.name ?? undefined, team_name: teamRow?.team_name ?? undefined, team_code: teamRow?.team_code ?? undefined }
}

export async function getTeamMembers(teamId: string): Promise<Array<{ id: string; full_name: string }>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("team_members")
    .select("user_id")
    .eq("team_id", teamId)

  if (error || !data) return []


  console.log(data)


  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", data?.map(item => item.user_id) || [])
  if (userError) {
    console.error("Error fetching user details for team members:", userError)
    return []
  }

  return userData || []
}

export async function getTeamMembersDailyUpdateStatus(teamId: string): Promise<Array<{ id: string; full_name: string; hasUpdatedToday: boolean }>> {
  const supabase = await createClient()

  // Get team members
  const { data: teamData, error: teamError } = await supabase
    .from("team_members")
    .select("user_id")
    .eq("team_id", teamId)

  if (teamError || !teamData) return []

  const userIds = teamData.map(item => item.user_id)

  // Get member profiles
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds)

  if (userError || !userData) return []

  // Get today's daily updates for these users
  const today = new Date().toISOString().split('T')[0]
  
  const { data: updatesData } = await supabase
    .from("daily_updates")
    .select("user_id")
    .in("user_id", userIds)
    .gte("created_at", `${today}T00:00:00`)
    .lt("created_at", `${today}T23:59:59`)

  const updatedUserIds = new Set(updatesData?.map(u => u.user_id) || [])

  return userData.map(user => ({
    id: user.id,
    full_name: user.full_name,
    hasUpdatedToday: updatedUserIds.has(user.id)
  })) || []
}

export async function getDistricts(): Promise<Array<{ id: string; name: string }>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("districts")
    .select("id, name")

  if (error) {
    console.error("Error fetching districts:", error)
    return []
  }

  return data || []
}

export async function getColleges(): Promise<Array<{ id: string; name: string }>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("colleges")
    .select("id, name")

  if (error) {
    console.error("Error fetching colleges:", error)
    return []
  }

  return data || []
}
