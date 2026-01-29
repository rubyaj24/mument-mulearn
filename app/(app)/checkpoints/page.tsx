export default function CheckpointsPage() {
    const startDate = new Date(2026, 0, 31) // Jan 31, 2026

    const checkpoints = Array.from({ length: 5 }).map((_, i) => {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        return {
            id: i,
            title: `Checkpoint ${i}`,
            date: date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
            description: `Tasks and goals for checkpoint ${i}.`
        }
    })

    return (
        <div className="py-8 px-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-brand-blue">Checkpoints</h1>
                <p className="text-sm text-slate-500">Upcoming checkpoints and their dates</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {checkpoints.map((c) => (
                    <article key={c.id} className="bg-white rounded-2xl shadow p-4 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">{c.title}</h2>
                                <p className="text-sm text-slate-500 mt-1">{c.description}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-400">Date</span>
                                <div className="text-sm font-medium text-slate-800">{c.date}</div>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button className="px-3 py-1 bg-brand-blue text-white rounded-md text-sm">View</button>
                            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-slate-700">Details</button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}