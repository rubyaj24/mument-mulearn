function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white border-2 border-brand-yellow rounded-2xl p-6 text-center shadow-sm">
            <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
            <p className="text-3xl font-bold text-brand-blue">{value}</p>
        </div>
    )
}

export default function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Total Points" value="1000" />
            <StatCard label="Campus Rank" value="#12" />
            <StatCard label="Kerala Rank" value="#50" />
        </div>
    )
}
