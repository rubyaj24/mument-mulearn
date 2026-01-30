import { getCheckpoints } from "@/lib/checkpoints"
// import { CheckpointList } from "./components/CheckpointList" // Assuming we might refactor to components later, but for now inline is fine or create new.
import { Calendar, User, Users } from "lucide-react"

export default async function CheckpointsPage() {
    const checkpoints = await getCheckpoints()

    return (
        <div className="py-8 px-6">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brand-blue">Checkpoints</h1>
                    <p className="text-sm text-slate-500">Your assigned checkpoints and tasks</p>
                </div>
                {/* <CreateCheckpointButton /> - To be implemented for Coordinators/Buddies */}
            </header>

            {checkpoints.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No checkpoints found for you yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {checkpoints.map((c) => (
                        <article key={c.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex gap-2 mb-2">
                                    {/* Badges for Scope */}
                                    {c.scope === 'global' && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">Global</span>}
                                    {c.scope === 'campus' && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Campus</span>}
                                    {c.scope === 'team' && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">Team</span>}
                                    {c.scope === 'participant' && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Personal</span>}
                                </div>
                                <span className="text-xs text-slate-400 font-mono">#{c.week_number}</span>
                            </div>

                            <h2 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
                                {/* Title is missing in provided schema for Checkpoints table, using Summary as main content */}
                                Checkpoint W{c.week_number}
                            </h2>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-3">{c.summary}</p>

                            <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-gray-50 pt-3">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{new Date(c.created_at || "").toLocaleDateString()}</span>
                                </div>
                                {/* If we had creator info, we'd show it here */}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}