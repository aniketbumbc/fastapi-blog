"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useToast } from "@/store/toast";
import { rules, check } from "@/lib/validation";

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
  const { signIn, register } = useAuth();
  const push = useToast((s) => s.push);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const switchMode = (next: Mode) => {
    setError(null);
    setPassword("");
    onModeChange(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      if (!username || !password) return setError("Incorrect username or password.");
      setLoading(true);
      const result = await signIn(username, password);
      setLoading(false);
      if (!result.ok) return setError(result.error);
      push("Welcome back");
      onClose();
      return;
    }

    const uErr = check(username, rules.username);
    const eErr = check(email, rules.email);
    const pErr = check(password, rules.password);
    if (uErr || eErr || pErr) return setError(uErr || eErr || pErr);

    setLoading(true);
    const ok = await register({ username, email, password });
    setLoading(false);
    if (!ok) return setError(useAuth.getState().registerError ?? "Registration failed. Please try again.");
    push("Account created");
    onClose();
  };

  const forgotPassword = () => {
    onClose();
    router.push("/forgot-password");
  };

  return createPortal(
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
            onClick={() => switchMode("login")}
            className={`pb-3 font-body text-sm font-medium ${
              isLogin ? "border-b-2 border-marker text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
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

          {error && (
            <div className="mt-4 rounded-md border border-marker/30 bg-marker/10 px-3 py-2 font-body text-sm text-marker">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-body text-xs uppercase tracking-wide text-ink-soft">
                Username
              </span>
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="ada"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-b border-grid-strong bg-transparent py-1.5 font-body text-ink outline-none placeholder:text-ink-soft/50 focus:border-marker"
              />
            </label>
            {!isLogin && (
              <label className="flex flex-col gap-1">
                <span className="font-body text-xs uppercase tracking-wide text-ink-soft">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-b border-grid-strong bg-transparent py-1.5 font-body text-ink outline-none placeholder:text-ink-soft/50 focus:border-marker"
                />
              </label>
            )}
            <label className="flex flex-col gap-1">
              <span className="font-body text-xs uppercase tracking-wide text-ink-soft">
                Password
              </span>
              <input
                type="password"
                name="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-b border-grid-strong bg-transparent py-1.5 font-body text-ink outline-none placeholder:text-ink-soft/50 focus:border-marker"
              />
            </label>

            {isLogin && (
              <button
                type="button"
                onClick={forgotPassword}
                className="self-end font-body text-xs text-ink-soft underline decoration-margin-line hover:text-marker"
              >
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-md bg-[#5fa32b] px-5 py-2.5 font-body font-medium text-white hover:brightness-95 disabled:opacity-60"
            >
              {loading ? (isLogin ? "Logging in…" : "Creating account…") : isLogin ? "Log in" : "Create an account"}
            </button>
          </form>

          <p className="mt-4 font-body text-sm text-ink-soft">
            {isLogin ? "New to The Dev Journal?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "signup" : "login")}
              className="font-medium text-marker underline decoration-margin-line hover:text-marker-soft"
            >
              {isLogin ? "Create an account" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
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
