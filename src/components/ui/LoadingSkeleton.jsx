export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-surface-200 ${className}`} />;
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`card-surface rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-3 w-10" />
      </div>
      <Skeleton className="mt-5 h-6 w-16" />
      <Skeleton className="mt-2 h-3 w-24" />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card-surface flex items-center gap-4 rounded-xl p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
