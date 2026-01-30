import Skeleton from "@/components/Skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">

      {/* Profile card skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="md:col-span-1">
          <Skeleton className="h-80 w-full p-6" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  )
}
