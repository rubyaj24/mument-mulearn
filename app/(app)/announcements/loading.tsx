import Skeleton from "@/components/Skeleton"

export default function AnnouncementsLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  )
}
