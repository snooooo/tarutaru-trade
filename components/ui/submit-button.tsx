"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const base =
    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "primary"
      ? `${base} bg-stone-950 text-white hover:bg-stone-800`
      : `${base} border border-stone-300 bg-white/70 text-stone-950 hover:bg-white`;

  return (
    <button
      type="submit"
      disabled={pending}
      className={className ?? styles}
    >
      {pending && (
        <svg
          className="size-4 shrink-0 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
