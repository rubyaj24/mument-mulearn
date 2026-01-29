export default function DashboardHeader() {
    return (
        <header className="relative space-y-2">
            {/* Accent bar */}
            <div className="absolute -left-1 top-1 h-10 w-1 rounded-full bg-brand-yellow" />

            <h1 className="text-3xl font-extrabold font-redhat tracking-tight text-brand-blue">
                Dashboard
            </h1>

            <p className="text-sm text-slate-500">
                Welcome back!
            </p>

            {/* Divider */}
            <div className="pt-2">
                <div className="h-px w-full bg-gradient-to-r from-brand-blue/40 via-brand-yellow/60 to-transparent" />
            </div>
        </header>
    )
}
