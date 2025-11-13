import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieCardSkeletonProps {
  isMovieListPage?: boolean;
}

export default function MovieCardSkeleton({
  isMovieListPage = false,
}: MovieCardSkeletonProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col sm:flex-row">
        {/* Left Poster Skeleton */}
        <div
          className={`relative w-full max-w-48 h-64 ${
            isMovieListPage ? "sm:h-[17rem]" : "sm:h-[13rem]"
          } bg-muted`}
        >
          <Skeleton className="w-full h-full" />
        </div>

        {/* Right Details */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Title + Rating */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-10 rounded-md" />
          </div>

          {/* Language / Genre Row */}
          <Skeleton className="h-4 w-56" />

          {/* Description */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />

          {/* Cast */}
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-40" />

          {/* Button (only in list page) */}
          {isMovieListPage && <Skeleton className="h-10 w-28 mt-auto" />}
        </div>
      </div>
    </Card>
  );
}
