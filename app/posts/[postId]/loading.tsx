export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 px-4 py-10 sm:px-6 lg:px-8 animate-pulse">
      <div className="rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
        <div className="h-4 w-20 rounded bg-stone-200" />
        <div className="mt-2 h-8 w-64 rounded bg-stone-200" />
        <div className="mt-3 h-4 w-48 rounded bg-stone-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
          <div className="h-4 w-16 rounded bg-stone-200" />
          <div className="mt-3 h-6 w-48 rounded bg-stone-200" />
          <div className="mt-2 h-4 w-32 rounded bg-stone-200" />
        </div>
        <div className="rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
          <div className="h-4 w-16 rounded bg-stone-200" />
          <div className="mt-3 h-6 w-48 rounded bg-stone-200" />
          <div className="mt-2 h-4 w-32 rounded bg-stone-200" />
        </div>
      </div>
      <div className="rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
        <div className="h-4 w-32 rounded bg-stone-200" />
        <div className="mt-3 h-16 w-full rounded bg-stone-200" />
      </div>
    </div>
  );
}
