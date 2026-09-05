"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { rules, check } from "@/lib/validation";
import { useAuth } from "@/store/auth";
import { useToast } from "@/store/toast";

export default function SignupPage() {
  const [f, setF] = useState({ username: "", email: "", password: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const { register, registerStatus, registerError } = useAuth();
  const push = useToast((s) => s.push);
  const router = useRouter();

  const uErr = f.username ? check(f.username, rules.username) : null;
  const eErr = f.email ? check(f.email, rules.email) : null;
  const pErr = f.password ? check(f.password, rules.password) : null;
  const valid = !uErr && !eErr && !pErr && f.username && f.email && f.password;

  const submit = async () => {
    if (!valid) return;
    const ok = await register(f);
    if (ok) {
      push("Account created");
      router.push("/");
    }
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
            Create account
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 right-0 h-[5px] rotate-[-0.5deg] rounded-[40%_60%_55%_45%] bg-marker/70"
            />
          </h1>
          {registerError && (
            <div className="mt-4 rounded-md border border-marker/30 bg-marker/10 px-3 py-2 font-body text-sm text-marker">
              {registerError}
            </div>
          )}
          <div className="mt-6 space-y-4">
            <Input label="Username" value={f.username} onChange={set("username")} error={uErr} valid={!!f.username && !uErr} hint="1–50 characters" />
            <Input label="Email" type="email" value={f.email} onChange={set("email")} error={eErr} valid={!!f.email && !eErr} />
            <Input label="Password" type="password" value={f.password} onChange={set("password")} error={pErr} hint="At least 5 characters" />
            <Button className="w-full" onClick={submit} disabled={!valid || registerStatus === "loading"}>
              {registerStatus === "loading" ? "Creating account…" : "Create account"}
            </Button>
          </div>
          <p className="mt-4 font-body text-sm text-ink-soft text-center">
            Already have one? <Link href="/login" className="text-marker font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}