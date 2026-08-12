"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useToast } from "@/store/toast";
import Avatar from "@/components/ui/Avatar";
import { AccountModalTrigger } from "@/components/accountmodal/accountmodal";

const NAV_LINKS = [
  { label: "Latest", href: "/blog" },
  { label: "System Design", href: "/blog" },
  { label: "Notebooks", href: "/blog" },
];

export default function Header() {
  const { currentUser, logout } = useAuth();
  const push = useToast((s) => s.push);
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-300/70 bg-[#faf7ee]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-2xl font-bold text-ink">
            Marginalia
          </Link>
          <div className="hidden gap-6 font-body text-[15px] text-ink-soft md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={pathname === l.href ? "text-ink" : "hover:text-ink"}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <Link
                href="/blog/new"
                className="rounded-md bg-[#5fa32b] px-4 py-2 font-body text-sm font-medium text-white hover:brightness-95"
              >
                Start writing
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="focus-ring rounded-full"
                  aria-label="Account menu"
                >
                  <Avatar src={currentUser.avatarUrl} size={36} />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="notebook-paper book-shell absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-md border border-neutral-300/70 p-1.5">
                      <div className="px-3 py-2">
                        <p className="font-body text-sm font-medium text-ink">{currentUser.username}</p>
                        <p className="font-body text-xs text-ink-soft">@{currentUser.handle}</p>
                      </div>
                      <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-md px-3 py-2 font-body text-sm text-ink hover:bg-grid"
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                          push("Signed out");
                          router.push("/");
                        }}
                        className="w-full rounded-md px-3 py-2 text-left font-body text-sm text-marker hover:bg-grid"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <AccountModalTrigger
                mode="login"
                className="rounded-md border border-neutral-400 px-4 py-2 font-body text-sm text-ink hover:bg-neutral-100"
              >
                Log in
              </AccountModalTrigger>
              <AccountModalTrigger
                mode="signup"
                className="rounded-md bg-[#5fa32b] px-4 py-2 font-body text-sm font-medium text-white hover:brightness-95"
              >
                Create an account
              </AccountModalTrigger>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
