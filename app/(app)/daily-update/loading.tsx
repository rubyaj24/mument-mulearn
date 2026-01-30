import Skeleton from "@/components/Skeleton"

export default function DailyUpdateLoading() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  )
}
