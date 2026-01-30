import { submitFeedback } from "@/lib/feedback"
import { redirect } from "next/navigation"

export default function FeedbackSubmitPage() {

    async function action(formData: FormData) {
        "use server"
        const subject = formData.get("subject") as string
        const description = formData.get("description") as string
        const category = formData.get("category") as string

        if (!subject || !description || !category) return

        await submitFeedback({ subject, description, category })
        redirect("/dashboard")
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-brand-blue">Submit Feedback</h1>
                <p className="text-sm text-slate-500">Share your thoughts, report issues, or suggest improvements.</p>
            </header>

            <form action={action} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select name="category" className="w-full p-3 rounded-xl border border-gray-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue">
                        <option value="general">General</option>
                        <option value="bug">Report a Bug</option>
                        <option value="feature">Feature Request</option>
                        <option value="complaint">Complaint</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <input name="subject" required placeholder="Brief summary" className="w-full p-3 rounded-xl border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea name="description" required rows={5} placeholder="Detailed explanation..." className="w-full p-3 rounded-xl border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue" />
                </div>

                <button type="submit" className="w-full bg-brand-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                    Submit Feedback
                </button>
            </form>
        </div>
    )
}