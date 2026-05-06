export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 px-4 py-10 sm:px-6 lg:px-8 animate-pulse">
      <div className="rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
        <div className="h-4 w-20 rounded bg-stone-200" />
        <div className="mt-2 h-8 w-48 rounded bg-stone-200" />
        <div className="mt-3 h-4 w-80 rounded bg-stone-200" />
      </div>
      <div className="rounded-md border border-rose-200 bg-rose-50/50 p-5">
        <div className="h-4 w-64 rounded bg-rose-200" />
        <div className="mt-3 h-10 w-40 rounded bg-rose-200" />
      </div>
    </div>
  );
}
