import Skeleton from "@/components/Skeleton"

export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
}
