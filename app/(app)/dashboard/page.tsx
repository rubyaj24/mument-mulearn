import RoleGate from "@/components/layout/RoleGate"
import { createClient } from "@/lib/supabase/server"
import { UserProfile } from "@/types/user"
import ProfileCard from "./components/ProfileCard"
import StatsCards from "./components/StatsCards"
import { getDistrictName } from "@/lib/district"



export default async function DashboardPage() {
  const supabaseServer = await createClient()

  const { data: { user } } = await supabaseServer.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabaseServer
    .from("profiles")
    .select("id, full_name, role, district_id, campus_id, created_at")
    .eq("id", user.id)
    .single()

  if (!profile) return null

  const typedProfile = profile as UserProfile
  const role = typedProfile.role

  const districtName = await getDistrictName(supabaseServer, typedProfile.district_id)
  console.log("District Name:", districtName)
  const typedProfileWithDistrict = {...typedProfile, district_name: districtName ?? undefined}

  return (
    <div className="space-y-6">

      <ProfileCard profile={typedProfileWithDistrict} />

      <StatsCards />

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
      </div>

    </div>
  )
}


// import RoleGate from "@/components/layout/RoleGate"
// import { createClient } from "@/lib/supabase/server"
// import { UserProfile } from "@/types/user"

// export default async function DashboardPage() {
//   const supabaseServer = await createClient()

//   // 1️⃣ Auth & Profile Fetching
//   const { data: { user } } = await supabaseServer.auth.getUser()
//   if (!user) return null

//   const { data: profile } = await supabaseServer
//     .from("profiles")
//     .select("id, full_name, role, district_id, campus_id, created_at, total_points")
//     .eq("id", user.id)
//     .single()

//   if (!profile) return null
//   const typedProfile = profile as UserProfile
//   const role = typedProfile.role

//   // 2️⃣ Fetch Rankings (with fallback)
//   const { data: campusRankData } = await supabaseServer
//     .from("profiles")
//     .select("id")
//     .eq("campus_id", typedProfile.campus_id)
//     .order("total_points", { ascending: false })

//   const campusRank = campusRankData?.findIndex(p => p.id === user.id) ?? -1

//   const { data: keralaRankData } = await supabaseServer
//     .from("profiles")
//     .select("id")
//     .order("total_points", { ascending: false })

//   const keralaRank = keralaRankData?.findIndex(p => p.id === user.id) ?? -1

//   // 3️⃣ Mock stats as fallback
//   const mockStats = {
//     total_points: 1000,
//     campus_rank: 12,
//     kerala_rank: 50,
//   }

//   const totalPoints = mockStats.total_points
//   const campusRankDisplay =
//     campusRank >= 0 ? `#${campusRank + 1}` : `#${mockStats.campus_rank}`
//   const keralaRankDisplay =
//     keralaRank >= 0 ? `#${keralaRank + 1}` : `#${mockStats.kerala_rank}`

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <header className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold font-redhat">Dashboard</h1>
//         <p className="text-sm text-slate-500">Welcome back!</p>
//       </header>

//       {/* Profile Card */}
//       <div className="relative bg-brand-blue rounded-3xl p-8 text-white overflow-hidden shadow-xl">
//         <div className="absolute top-0 left-0 bg-black text-white text-[10px] px-6 py-1 rounded-br-2xl uppercase tracking-widest font-bold">
//           {role}
//         </div>
//         <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-4">
//           <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-white/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
//             <div className="text-brand-blue font-bold text-4xl uppercase">
//               {typedProfile.full_name?.charAt(0) || "U"}
//             </div>
//           </div>
//           <div className="flex-1 space-y-4 text-center md:text-left">
//             <h2 className="text-3xl font-bold font-redhat bg-gradient-to-r from-brand-yellow to-yellow-200 bg-clip-text text-transparent">
//               {typedProfile.full_name}
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-white/80">
//               <div className="flex gap-4">
//                 <span className="font-semibold w-16">Campus :</span>
//                 <span>{typedProfile.campus_id || "Not Assigned"}</span>
//               </div>
//               <div className="flex gap-4">
//                 <span className="font-semibold w-16">District :</span>
//                 <span>{typedProfile.district_id || "Not Assigned"}</span>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
//               <span className="bg-white text-brand-blue px-4 py-1 rounded-full text-xs font-bold">
//                 Member since {typedProfile.created_at ? new Date(typedProfile.created_at).getFullYear() : "N/A"}
//               </span>

//               <span className="bg-brand-yellow text-black px-4 py-1 rounded-full text-xs font-bold shadow-sm">
//                 Active Member
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white border-2 border-brand-yellow rounded-2xl p-6 text-center shadow-sm">
//           <p className="text-xs text-slate-500 uppercase font-bold">Total Points</p>
//           <p className="text-3xl font-bold text-brand-blue">{totalPoints}</p>
//         </div>
//         <div className="bg-white border-2 border-brand-yellow rounded-2xl p-6 text-center shadow-sm">
//           <p className="text-xs text-slate-500 uppercase font-bold">Campus Rank</p>
//           <p className="text-3xl font-bold text-brand-blue">{campusRankDisplay}</p>
//         </div>
//         <div className="bg-white border-2 border-brand-yellow rounded-2xl p-6 text-center shadow-sm">
//           <p className="text-xs text-slate-500 uppercase font-bold">Kerala Rank</p>
//           <p className="text-3xl font-bold text-brand-blue">{keralaRankDisplay}</p>
//         </div>
//       </div>

//       {/* Role-Specific Actions */}
//       <div className="flex gap-4">
//         <RoleGate role={role} allow={['buddy', 'campus_coordinator', 'admin']}>
//           <button className="bg-brand-blue text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:brightness-110 transition-all">
//             Create Checkpoint
//           </button>
//         </RoleGate>
//         <RoleGate role={role} allow={['qa_foreman', 'qa_watcher', 'admin']}>
//           <button className="bg-slate-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-slate-700 transition-all">
//             Feedback Inbox
//           </button>
//         </RoleGate>
//       </div>




// import RoleGate from "@/components/layout/RoleGate"
// import { createClient } from "@/lib/supabase/server"
// import { UserProfile } from "@/types/user"

// export default async function DashboardPage() {
//   const supabaseServer = await createClient()

//   // 1. Auth & Profile Fetching
//   const { data: { user } } = await supabaseServer.auth.getUser()
//   if (!user) return null

//   const { data: profile } = await supabaseServer
//     .from("profiles")
//     .select("id, full_name, role, district_id, campus_id, created_at")
//     .eq("id", user.id)
//     .single()

//   if (!profile) return null
//   const typedProfile = profile as UserProfile
//   const role = typedProfile.role

//   return (
//     <div className="space-y-6">
//       {/* 1. Header Section */}
//       <header className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold font-redhat">Dashboard</h1>
//         <p className="text-sm text-slate-500">Welcome back!</p>
//       </header>

//       {/* 2. Profile Card (Real Data) */}
//       <div className="relative bg-brand-blue rounded-3xl p-8 text-white overflow-hidden shadow-xl">
//         {/* Role Tag */}
//         <div className="absolute top-0 left-0 bg-black text-white text-[10px] px-6 py-1 rounded-br-2xl uppercase tracking-widest font-bold">
//           {role}
//         </div>

//         <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-4">
//           {/* Avatar based on Full Name */}
//           <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-white/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
//             <div className="text-brand-blue font-bold text-4xl uppercase">
//               {typedProfile.full_name?.charAt(0) || "U"}
//             </div>
//           </div>

//           {/* User Details Fields */}
//           <div className="flex-1 space-y-4 text-center md:text-left">
//             <div>
//               <h2 className="text-3xl font-bold font-redhat bg-gradient-to-r from-brand-yellow to-yellow-200 bg-clip-text text-transparent">
//                 {typedProfile.full_name}
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-white/80">
//               <div className="flex gap-4">
//                 <span className="font-semibold w-16">Campus :</span>
//                 <span>{typedProfile.campus_id || "Not Assigned"}</span>
//               </div>
//               <div className="flex gap-4">
//                 <span className="font-semibold w-16">District :</span>
//                 <span>{typedProfile.district_id || "Not Assigned"}</span>
//               </div>
//             </div>

//             {/* Tags Section */}
//             <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
//               <span className="bg-white text-brand-blue px-4 py-1 rounded-full text-xs font-bold">
//                 Member since {typedProfile.created_at ? new Date(typedProfile.created_at).getFullYear() : "N/A"}
//               </span>
//               <span className="bg-brand-yellow text-black px-4 py-1 rounded-full text-xs font-bold shadow-sm">
//                 Active Member
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 3. Stats Section (Static for now, but ready for data) */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white border-2 border-brand-yellow rounded-2xl p-6 text-center shadow-sm">
//           <p className="text-xs text-slate-500 uppercase font-bold">Total Points</p>
//           <p className="text-3xl font-bold text-brand-blue">1000</p>
//         </div>
//         <div className="bg-white border-2 border-brand-yellow rounded-2xl p-6 text-center shadow-sm">
//           <p className="text-xs text-slate-500 uppercase font-bold">Campus Rank</p>
//           <p className="text-3xl font-bold text-brand-blue">#12</p>
//         </div>
//         <div className="bg-white border-2 border-brand-yellow rounded-2xl p-6 text-center shadow-sm">
//           <p className="text-xs text-slate-500 uppercase font-bold">Kerala Rank</p>
//           <p className="text-3xl font-bold text-brand-blue">#50</p>
//         </div>
//       </div>

//       {/* 4. Role-Specific Actions */}
//       <div className="flex gap-4">
//         <RoleGate role={role} allow={['buddy', 'campus_coordinator', 'admin']}>
//           <button className="bg-brand-blue text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:brightness-110 transition-all">
//             Create Checkpoint
//           </button>
//         </RoleGate>

//         <RoleGate role={role} allow={['qa_foreman', 'qa_watcher', 'admin']}>
//           <button className="bg-slate-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-slate-700 transition-all">
//             Feedback Inbox
//           </button>
//         </RoleGate>
//       </div>
//     </div>
//   )
// }

