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
    .select("id, full_name, role, district_id, campus_id, created_at")
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
    .from("campuses")
    .select("name")
    .eq("id", data.campus_id)
    .maybeSingle()

  if (campusErr) {
    console.error("Error fetching campus name:", campusErr)
  }

  return { ...(data as UserProfile), district_name: districtRow?.name ?? undefined, campus_name: campusRow?.name ?? undefined }
}
