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
                    <div className="notebook-paper book-shell absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-md border border-grid-strong/70 p-1.5">
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
