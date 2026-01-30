import { redirect } from "next/navigation"
import { getMyProfile } from "@/lib/profile"

export default async function ProfilePage() {
  const profile = await getMyProfile()
  if (!profile) redirect("/login")

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
          {profile.full_name?.charAt(0) ?? "?"}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-black">{profile.full_name}</h1>
          <p className="text-sm text-slate-600">{profile.role}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-black bg-blue-200 p-4 rounded-lg">
        <p><strong>Campus:</strong> {profile.campus_name ?? profile.campus_id ?? "Not assigned"}</p>
        <p><strong>District:</strong> {profile.district_name ?? profile.district_id ?? "Not assigned"}</p>
        <p><strong>Joined:</strong> {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</p>
      </div>
    </div>
  )
}