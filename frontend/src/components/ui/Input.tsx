"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { EyeIcon } from "@/components/ui/EyeIcon";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  valid?: boolean;
  hint?: string;
  labelRight?: React.ReactNode;
};

export default function Input({ label, error, valid, hint, labelRight, className, id, type, ...rest }: Props) {
  const inputId = id ?? rest.name;
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="font-body text-xs uppercase tracking-wide text-ink-soft">{label}</label>
          {labelRight}
        </div>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={isPassword ? (visible ? "text" : "password") : type}
          className={cn(
            "h-11 w-full rounded-md border bg-white px-3 font-body text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-marker",
            isPassword && "pr-10",
            error ? "border-marker" : valid ? "border-emerald-600" : "border-grid-strong",
            className
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-soft hover:text-ink"
          >
            <EyeIcon open={visible} />
          </button>
        )}
      </div>
      {error ? <p className="font-body text-xs text-marker">{error}</p>
        : valid ? <p className="font-body text-xs text-emerald-700">✓ Looks good</p>
        : hint ? <p className="font-body text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
