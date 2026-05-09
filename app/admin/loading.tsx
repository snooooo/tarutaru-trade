export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-6xl animate-pulse gap-4 px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-9 w-64 rounded bg-stone-200" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-md border border-stone-200 bg-white/82"
          />
        ))}
      </div>
    </div>
  );
}
