export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse"
        >
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-slate-200 rounded w-16"></div>
              <div className="h-6 bg-slate-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            <div className="h-2 bg-slate-200 rounded w-full"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-slate-200 rounded w-20"></div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
