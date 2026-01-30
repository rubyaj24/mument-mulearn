import { getAnnouncements } from "@/lib/announcements"
import { Megaphone, Calendar } from "lucide-react"

export default async function AnnouncementsPage() {
    const announcements = await getAnnouncements()

    return (
        <div className="py-8 px-6">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brand-blue">Announcements</h1>
                    <p className="text-sm text-slate-500">Updates and notifications</p>
                </div>
            </header>

            {announcements.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No announcements yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((a) => (
                        <article key={a.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex gap-4">
                            <div className="bg-blue-50 p-2 rounded-lg h-fit text-brand-blue">
                                <Megaphone size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">Global</span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(a.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-700 whitespace-pre-wrap">{a.content}</p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}