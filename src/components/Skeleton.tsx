export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg dark:bg-slate-700 ${className}`} />;
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonLine className="w-12 h-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-4 w-1/3" />
          <SkeletonLine className="h-3 w-1/2" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonKPI() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex justify-between">
        <SkeletonLine className="w-12 h-12 rounded-2xl" />
        <SkeletonLine className="w-16 h-6 rounded-lg" />
      </div>
      <SkeletonLine className="h-8 w-24" />
      <SkeletonLine className="h-4 w-32" />
      <SkeletonLine className="h-3 w-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="p-6 space-y-2">
        <SkeletonLine className="h-5 w-40" />
        <SkeletonLine className="h-3 w-64" />
      </div>
      <div className="border-t border-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
            <SkeletonLine className="w-10 h-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="h-4 w-1/3" />
              <SkeletonLine className="h-3 w-1/4" />
            </div>
            <SkeletonLine className="w-20 h-6 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-enter">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <SkeletonCard lines={6} />
        </div>
        <SkeletonCard lines={4} />
      </div>
    </div>
  );
}
