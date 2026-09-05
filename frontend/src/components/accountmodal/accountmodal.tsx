"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useToast } from "@/store/toast";
import { rules, check } from "@/lib/validation";
import { EyeIcon } from "@/components/ui/EyeIcon";
import Avatar from "@/components/ui/Avatar";

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
  const [showPassword, setShowPassword] = useState(false);
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
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-grid-strong/70 bg-highlight shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 font-display text-2xl leading-none text-ink-soft hover:text-marker"
        >
          ×
        </button>

        <span aria-hidden className="absolute inset-y-0 left-7 w-px bg-margin-line/70" />
        <div className="absolute left-3 top-6 z-10 -rotate-6 rounded-full ring-2 ring-paper shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4)]">
          <Avatar size={36} />
        </div>

        <div className="relative py-6 pl-16 pr-7">
          {/* tabs */}
          <div className="flex gap-5">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`font-body text-[13px] font-medium ${
                isLogin ? "text-marker" : "text-ink-soft hover:text-ink"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`font-body text-[13px] font-medium ${
                !isLogin ? "text-marker" : "text-ink-soft hover:text-ink"
              }`}
            >
              Create account
            </button>
          </div>

          <h2 className="relative mt-1 w-fit font-display text-[27px] font-bold leading-[1.05] text-marker">
            {isLogin ? "Welcome back" : "Start your notebook"}
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 right-0 h-[5px] rotate-[-0.5deg] rounded-[40%_60%_55%_45%] bg-marker/70"
            />
          </h2>
          <p className="mt-4 font-body text-[15px] leading-snug text-ink">
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-grid-strong bg-transparent py-1.5 pr-8 font-body text-ink outline-none placeholder:text-ink-soft/50 focus:border-marker"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-ink-soft hover:text-ink"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
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
              className="mt-2 rounded-md bg-accent px-5 py-2.5 font-body font-medium text-white hover:brightness-95 disabled:opacity-60"
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
