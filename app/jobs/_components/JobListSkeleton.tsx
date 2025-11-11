export default function JobListSkeleton({ count = 12 }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-xl shadow-md border">
          <div className="flex gap-4 mb-4">
            <div className="w-12 h-12 bg-sky-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-5 bg-sky-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-sky-200 rounded w-1/2" />
            </div>
          </div>
          <div className="h-4 bg-sky-200 rounded mb-2" />
          <div className="h-4 bg-sky-200 rounded w-5/6" />
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-sky-100 rounded-full w-20" />
            <div className="h-6 bg-green-100 rounded-full w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
