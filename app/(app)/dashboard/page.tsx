import RoleGate from "@/components/layout/RoleGate"
import { UserProfile } from "@/types/user"
import ProfileCard from "./components/ProfileCard"
import StatsCards from "./components/StatsCards"
import { getMyProfile } from "@/lib/profile"
import DashboardWelcome from "@/components/DashboardWelcome"
import { getUserPoints } from "@/lib/points"



export default async function DashboardPage() {
  const profile = await getMyProfile()
  if (!profile) return null

  const typedProfile = profile as UserProfile
  const role = typedProfile.role
  const points = await getUserPoints(typedProfile.id)

  return (
    <>
    <div className="space-y-6">

      <DashboardWelcome profile={typedProfile} />

      <ProfileCard profile={typedProfile} />

      <StatsCards points={points} />

      {/* <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-black">Quick Actions</h1>
        <div className="flex gap-4">
        <RoleGate role={role} allow={['buddy', 'campus_coordinator', 'admin']}>
          <button className="bg-brand-blue text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:brightness-110 transition-all">
            Create Checkpoint
          </button>
        </RoleGate>
        <RoleGate role={role} allow={['qa_foreman', 'qa_watcher', 'admin']}>
          <button className="bg-slate-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-slate-700 transition-all">
            Feedback Inbox
          </button>
        </RoleGate>
        <RoleGate role={role} allow={['admin']}>
          <button className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-red-500 transition-all">
            Admin Panel
          </button>
        </RoleGate>
        </div>
      </div> */}
      <div>
        <h1 className="text-2xl font-bold text-black">Team details</h1>
      </div>

    </div>
    </>

  )
}

