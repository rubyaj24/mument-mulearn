import Skeleton from "@/components/Skeleton"

export default function FeedbackInboxLoading() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <div className="space-y-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </div>
  )
}
