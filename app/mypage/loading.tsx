export default function MyPageLoading() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="flex flex-col gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm sm:p-6 animate-pulse">
        <div className="h-4 w-16 rounded bg-stone-200" />
        <div className="h-8 w-40 rounded bg-stone-200" />
        <div className="h-7 w-36 rounded bg-stone-200" />
      </div>

      {/* Tab bar skeleton */}
      <div className="flex gap-1 rounded-lg border border-stone-200 bg-stone-100/80 p-1 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-md py-2.5 ${
              i === 0 ? "bg-white shadow-sm" : "bg-transparent"
            }`}
          >
            <div className="mx-auto h-4 w-16 rounded bg-stone-200" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-4 animate-pulse">
        <div className="flex items-end justify-between">
          <div>
            <div className="h-6 w-40 rounded bg-stone-200" />
            <div className="mt-2 h-4 w-64 rounded bg-stone-200" />
          </div>
          <div className="h-11 w-36 rounded-md bg-stone-200" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-stone-200 bg-white/82 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-16 rounded-md bg-stone-200" />
              <div className="h-4 flex-1 rounded bg-stone-200" />
              <div className="h-4 w-12 rounded bg-stone-200" />
            </div>
            <div className="mt-3 h-4 w-3/4 rounded bg-stone-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
