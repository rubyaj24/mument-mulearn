function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white border-2 border-brand-yellow rounded-2xl p-6 text-center shadow-sm">
            <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
            <p className="text-3xl font-bold text-brand-blue">{value}</p>
        </div>
    )
}

export default function StatsCards({ points }: { points?: number }) {
    const pts = typeof points === 'number' ? points : 0
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Total Points" value={`${pts}`} />
            <StatCard label="Campus Rank" value="#—" />
            <StatCard label="Kerala Rank" value="#—" />
        </div>
    )
}
