"use client";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

const base = "inline-flex items-center justify-center gap-2 h-[42px] px-4 rounded-md font-body text-sm font-medium transition-colors disabled:opacity-45 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-marker/40";

const variants: Record<Variant, string> = {
  primary:   "bg-[#5fa32b] text-white hover:brightness-95",
  secondary: "bg-white text-ink border border-neutral-300 hover:bg-neutral-100",
  ghost:     "text-ink-soft hover:text-ink hover:bg-neutral-100",
  danger:    "bg-marker text-white hover:brightness-95",
};

export default function Button({ variant = "primary", className, ...rest }: Props) {
  return <button className={cn(base, variants[variant], className)} {...rest} />;
}
