"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useToast } from "@/store/toast";
import { usePostHeaderActions } from "@/store/postHeaderActions";
import { useTheme } from "@/store/theme";
import Avatar from "@/components/ui/Avatar";
import { AccountModalTrigger } from "@/components/accountmodal/accountmodal";

function ThemeToggle() {
  const mode = useTheme((s) => s.mode);
  const toggle = useTheme((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-grid text-ink-soft hover:bg-grid-strong hover:text-ink"
      aria-label={mode === "dark" ? "Switch to day mode" : "Switch to night mode"}
    >
      {mode === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

export default function Header() {
  const { currentUser, logout } = useAuth();
  const push = useToast((s) => s.push);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { slug: postSlug, owner: postOwner, onDelete: onDeletePost } = usePostHeaderActions();

  return (
    <header className="sticky top-0 z-30 border-b border-grid-strong/70 bg-paper/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-2xl font-bold text-ink">
            The Dev Journal
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {postOwner && postSlug && (
                <>
                  <Link
                    href={`/blog/${postSlug}/edit`}
                    className="cursor-pointer rounded-md bg-accent px-4 py-2 font-body text-sm font-medium text-white hover:brightness-95"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDeletePost?.()}
                    className="cursor-pointer rounded-md bg-marker px-4 py-2 font-body text-sm font-medium text-white hover:brightness-95"
                  >
                    Delete
                  </button>
                </>
              )}
              <Link
                href="/blog/new"
                className="cursor-pointer rounded-md bg-accent px-4 py-2 font-body text-sm font-medium text-white hover:brightness-95"
              >
                Start writing
              </Link>
              <ThemeToggle />
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
                    <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-grid-strong/70 bg-highlight shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)]">
                      <span aria-hidden className="absolute inset-y-0 left-5 w-px bg-margin-line/70" />
                      <div className="relative py-3 pl-8 pr-3">
                        <p className="relative w-fit font-display text-lg font-bold leading-none text-marker">
                          {currentUser.username}
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 left-0 right-0 h-[4px] rotate-[-0.5deg] rounded-[40%_60%_55%_45%] bg-marker/70"
                          />
                        </p>
                        <p className="mt-1.5 font-body text-xs text-ink-soft">@{currentUser.handle}</p>
                        <div className="mt-3 -mx-3 border-t border-grid-strong/70 pt-1.5">
                          <Link
                            href="/settings"
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-md px-3 py-2 font-body text-sm text-ink hover:bg-paper/40"
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
                            className="w-full rounded-md px-3 py-2 text-left font-body text-sm text-marker hover:bg-paper/40"
                          >
                            Log out
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <ThemeToggle />
              <AccountModalTrigger
                mode="login"
                className="rounded-md border border-ink-soft/40 px-4 py-2 font-body text-sm text-ink hover:bg-grid"
              >
                Log in
              </AccountModalTrigger>
              <AccountModalTrigger
                mode="signup"
                className="rounded-md bg-accent px-4 py-2 font-body text-sm font-medium text-white hover:brightness-95"
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
