import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function ButtonLink({
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  const hasDisplayOverride =
    /\b(hidden|block|inline-block|flex|inline-flex|grid|inline-grid)\b/.test(
      className,
    ) ||
    /\b(?:sm|md|lg|xl|2xl):(hidden|block|inline-block|flex|inline-flex|grid|inline-grid)\b/.test(
      className,
    );
  const variants = {
    primary: "bg-stone-950 text-white hover:bg-stone-800",
    secondary:
      "border border-stone-300 bg-white/70 text-stone-950 hover:bg-white",
    ghost: "text-stone-700 hover:bg-stone-200/70",
  };

  return (
    <Link
      className={`${hasDisplayOverride ? "" : "inline-flex"} h-11 items-center justify-center whitespace-nowrap rounded-md px-4 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
