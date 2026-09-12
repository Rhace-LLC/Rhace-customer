import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton shown while the restaurant profile is loading. */
export function HomeLoading() {
  return (
    <div className="animate-in fade-in w-full space-y-8 duration-700">
      <div className="space-y-4">
        <Skeleton className="h-4 w-24 rounded-full bg-gray-100" />
        <Skeleton className="h-10 w-3/4 rounded-2xl bg-gray-100" />
      </div>
      <Skeleton className="h-64 w-full rounded-[2.5rem] bg-gray-100/80" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full rounded-full bg-gray-50" />
        <Skeleton className="h-4 w-5/6 rounded-full bg-gray-50" />
      </div>
    </div>
  );
}
