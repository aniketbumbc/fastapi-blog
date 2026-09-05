"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/store/auth";
import { useToast } from "@/store/toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const push = useToast((s) => s.push);
  const router = useRouter();

  const submit = async () => {
    setError(null);
    if (!username || !password) return setError("Incorrect username or password.");
    setLoading(true);
    const result = await signIn(username, password);
    setLoading(false);
    if (!result.ok) return setError(result.error);
    push("Welcome back");
    router.push("/");
  };

  return (
    <div className="max-w-[420px] mx-auto py-8">
      <div className="relative overflow-hidden rounded-xl border border-grid-strong/70 bg-highlight shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)]">
        <span aria-hidden className="absolute inset-y-0 left-7 w-px bg-margin-line/70" />
        <div className="absolute left-3 top-6 z-10 -rotate-6 rounded-full ring-2 ring-paper shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4)]">
          <Avatar size={36} />
        </div>
        <div className="relative py-6 pl-16 pr-7">
          <h1 className="relative w-fit font-display text-[27px] font-bold leading-[1.05] text-marker">
            Log in
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 right-0 h-[5px] rotate-[-0.5deg] rounded-[40%_60%_55%_45%] bg-marker/70"
            />
          </h1>
          {error && (
            <div className="mt-4 rounded-md border border-marker/30 bg-marker/10 px-3 py-2 font-body text-sm text-marker">
              {error}
            </div>
          )}
          <div className="mt-6 space-y-4">
            <Input label="Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input
              label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
              labelRight={<Link href="/forgot-password" className="text-xs text-accent">Forgot password?</Link>}
            />
            <Button className="w-full" onClick={submit} disabled={loading}>{loading ? "Logging in…" : "Log in"}</Button>
          </div>
          <p className="mt-4 font-body text-sm text-ink-soft text-center">
            No account? <Link href="/signup" className="text-marker font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}