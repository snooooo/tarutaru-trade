import { Search } from "lucide-react";

export function SearchForm({
  action,
  placeholder,
  defaultValue,
  submitButton = "always",
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
  submitButton?: "always" | "desktop";
}) {
  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row">
      <label className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-500"
          aria-hidden="true"
        />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-12 w-full rounded-md border border-stone-300 bg-white/80 px-10 text-base outline-none transition placeholder:text-stone-400 focus:border-stone-950"
        />
      </label>
      <button
        type="submit"
        className={`h-12 items-center justify-center rounded-md bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 ${
          submitButton === "desktop" ? "hidden lg:inline-flex" : "inline-flex"
        }`}
      >
        検索
      </button>
    </form>
  );
}
