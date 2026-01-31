import { redirect } from "next/navigation"
import { getMyProfile } from "@/lib/profile"

export default async function ProfilePage() {
  const profile = await getMyProfile()
  if (!profile) redirect("/login")

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-brand-blue flex items-center justify-center text-4xl font-medium text-white shrink-0">
            {profile.full_name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-medium text-slate-900">{profile.full_name}</h1>
            <p className="text-slate-500 text-sm">{profile.role}</p>
            <p className="text-slate-400 text-sm pt-1">
              Joined: {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Details Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          <div>
            <label className="block text-sm text-slate-500 mb-1">Campus</label>
            <p className="text-lg font-normal text-slate-800 uppercase">
              {profile.campus_name ?? profile.campus_id ?? "Not assigned"}
            </p>
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">Contact</label>
            <p className="text-lg font-normal text-slate-800">Not provided</p>
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">District</label>
            <p className="text-lg font-normal text-slate-800">
              {profile.district_name ?? "Not assigned"}
            </p>
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">Role</label>
            <p className="text-lg font-normal text-slate-800 lowercase">
              {profile.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}