"use client";

import { useEffect, useState, type ReactNode } from "react";

type Mode = "login" | "signup";

function AccountModal({
  mode,
  onModeChange,
  onClose,
}: {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const isLogin = mode === "login";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#22221c]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="notebook-paper book-shell relative w-full max-w-md overflow-hidden rounded-md border border-neutral-300/70"
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden className="notebook-margin-rule left-12" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 font-display text-2xl leading-none text-ink-soft hover:text-marker"
        >
          ×
        </button>

        {/* tabs */}
        <div className="flex gap-6 border-b border-neutral-300/70 pl-16 pr-14 pt-5">
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`pb-3 font-body text-sm font-medium ${
              isLogin ? "border-b-2 border-marker text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => onModeChange("signup")}
            className={`pb-3 font-body text-sm font-medium ${
              !isLogin ? "border-b-2 border-marker text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            Create account
          </button>
        </div>

        <div className="px-14 py-7 pl-16">
          <h2 className="font-display text-3xl font-bold text-marker">
            {isLogin ? "Welcome back" : "Start your notebook"}
          </h2>
          <p className="mt-1 font-body text-sm text-ink-soft">
            {isLogin ? "Pick up where you left off." : "Jot down your details to claim a page."}
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col gap-4">
            {!isLogin && (
              <label className="flex flex-col gap-1">
                <span className="font-body text-xs uppercase tracking-wide text-ink-soft">
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  className="border-b border-grid-strong bg-transparent py-1.5 font-body text-ink outline-none placeholder:text-ink-soft/50 focus:border-marker"
                />
              </label>
            )}
            <label className="flex flex-col gap-1">
              <span className="font-body text-xs uppercase tracking-wide text-ink-soft">
                Email
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="border-b border-grid-strong bg-transparent py-1.5 font-body text-ink outline-none placeholder:text-ink-soft/50 focus:border-marker"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-body text-xs uppercase tracking-wide text-ink-soft">
                Password
              </span>
              <input
                type="password"
                name="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="••••••••"
                className="border-b border-grid-strong bg-transparent py-1.5 font-body text-ink outline-none placeholder:text-ink-soft/50 focus:border-marker"
              />
            </label>

            {isLogin && (
              <button
                type="button"
                className="self-end font-body text-xs text-ink-soft underline decoration-margin-line hover:text-marker"
              >
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              className="mt-2 rounded-md bg-[#5fa32b] px-5 py-2.5 font-body font-medium text-white hover:brightness-95"
            >
              {isLogin ? "Log in" : "Create an account"}
            </button>
          </form>

          <p className="mt-5 font-body text-xs italic text-ink-soft">
            Just a preview — accounts aren&apos;t wired up to anything yet.
          </p>

          <p className="mt-4 font-body text-sm text-ink-soft">
            {isLogin ? "New to Marginalia?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => onModeChange(isLogin ? "signup" : "login")}
              className="font-medium text-marker underline decoration-margin-line hover:text-marker-soft"
            >
              {isLogin ? "Create an account" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AccountModalTrigger({
  mode,
  className,
  children,
}: {
  mode: Mode;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<Mode>(mode);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setActiveMode(mode);
          setOpen(true);
        }}
      >
        {children}
      </button>
      {open && (
        <AccountModal mode={activeMode} onModeChange={setActiveMode} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
