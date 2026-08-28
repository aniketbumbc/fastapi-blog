"use client";
import { cn } from "@/lib/cn";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; counter?: React.ReactNode; error?: string | null };

export default function Textarea({ label, counter, error, className, id, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="font-body text-xs uppercase tracking-wide text-ink-soft">{label}</label>}
      <textarea
        id={id}
        className={cn(
          "min-h-[220px] resize-y rounded-md border bg-paper p-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-marker",
          error ? "border-marker" : "border-grid-strong",
          className
        )}
        {...rest}
      />
      {counter && <div className="font-mono text-xs text-ink-soft">{counter}</div>}
      {error && <p className="font-body text-xs text-marker">{error}</p>}
    </div>
  );
}
