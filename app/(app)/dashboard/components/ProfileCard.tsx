import { UserProfile } from "@/types/user"

export default function ProfileCard({ profile }: { profile: UserProfile }) {
    console.log("ProfileCard profile:", profile)
    return (
        <div className="relative bg-brand-blue rounded-3xl p-8 text-white overflow-hidden shadow-xl">

            {/* Role Tag */}
            <div className="absolute top-0 left-0 bg-black text-white text-[10px] px-6 py-1 rounded-br-2xl uppercase tracking-widest font-bold">
                {profile.role}
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-4">

                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-white/20 flex items-center justify-center">
                    <div className="text-brand-blue font-bold text-4xl uppercase">
                        {profile.full_name?.charAt(0) || "U"}
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <h2 className="text-3xl font-bold bg-linear-to-r from-brand-yellow to-yellow-200 bg-clip-text text-transparent">
                        {profile.full_name}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-white/80">
                        <div><b>Campus:</b> {profile.campus_id || "Not Assigned"}</div>
                        <div><b>District:</b> {profile.district_name || "Not Assigned"}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <span className="bg-white text-brand-blue px-4 py-1 rounded-full text-xs font-bold">
                            Member since{" "}
                            {profile.created_at
                                ? new Date(profile.created_at).getFullYear()
                                : "N/A"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
