export default function MyPageLoading() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm sm:p-6 animate-pulse">
        <div className="h-4 w-16 rounded bg-stone-200" />
        <div className="h-8 w-40 rounded bg-stone-200" />
        <div className="h-4 w-80 rounded bg-stone-200" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="grid gap-3 rounded-md border border-stone-200 bg-white/82 p-4 shadow-sm animate-pulse"
          >
            <div className="h-9 w-9 rounded-md bg-stone-200" />
            <div className="h-4 w-24 rounded bg-stone-200" />
            <div className="h-8 w-12 rounded bg-stone-200" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 animate-pulse">
        <div className="h-6 w-32 rounded bg-stone-200" />
        <div className="rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
          <div className="h-4 w-full rounded bg-stone-200" />
          <div className="mt-3 h-4 w-3/4 rounded bg-stone-200" />
        </div>
      </div>
    </div>
  );
}
