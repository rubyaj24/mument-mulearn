import { getFeedbackInbox } from "@/lib/feedback"
import { Inbox, User, Tag } from "lucide-react"

export default async function FeedbackInboxPage() {
    const feedback = await getFeedbackInbox()

    return (
        <div className="py-8 px-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-brand-blue">Feedback Inbox</h1>
                <p className="text-sm text-slate-500">Manage and review submitted feedback</p>
            </header>

            {feedback.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No feedback items found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {feedback.map((f) => (
                        <article key={f.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.status === 'new' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {f.status?.toUpperCase() || 'NEW'}
                                    </span>
                                    <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
                                        {f.category}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-400">
                                    {new Date(f.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="font-semibold text-slate-800 mb-1">{f.subject}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2">{f.description}</p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}