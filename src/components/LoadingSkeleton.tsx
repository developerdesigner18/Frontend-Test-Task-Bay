export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse"
        >
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-5 bg-slate-200 rounded w-16"></div>
            <div className="h-5 bg-slate-200 rounded w-20"></div>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-slate-200 rounded-full w-12"></div>
            <div className="h-6 bg-slate-200 rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-2 bg-slate-200 rounded w-full mb-2"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-slate-200 rounded w-20"></div>
            <div className="h-6 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
