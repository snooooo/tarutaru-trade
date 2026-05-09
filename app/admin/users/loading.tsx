export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-6xl animate-pulse gap-4 px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-9 w-56 rounded bg-stone-200" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-md border border-stone-200 bg-white/82"
          />
        ))}
      </div>
      <div className="h-11 w-full rounded bg-stone-200" />
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-md border border-stone-200 bg-white/82 p-4"
        >
          <div className="h-4 w-2/3 rounded bg-stone-200" />
          <div className="mt-3 h-4 w-1/2 rounded bg-stone-200" />
        </div>
      ))}
    </div>
  );
}
