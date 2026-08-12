"use client";
import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  valid?: boolean;
  hint?: string;
  labelRight?: React.ReactNode;
};

export default function Input({ label, error, valid, hint, labelRight, className, id, ...rest }: Props) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="font-body text-xs uppercase tracking-wide text-ink-soft">{label}</label>
          {labelRight}
        </div>
      )}
      <input
        id={inputId}
        className={cn(
          "h-11 rounded-md border bg-white px-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-marker",
          error ? "border-marker" : valid ? "border-emerald-600" : "border-grid-strong",
          className
        )}
        {...rest}
      />
      {error ? <p className="font-body text-xs text-marker">{error}</p>
        : valid ? <p className="font-body text-xs text-emerald-700">✓ Looks good</p>
        : hint ? <p className="font-body text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
