import Link from "next/link";
import { RecentEntries } from "@/components/recententries/recententries";
import { AccountModalTrigger } from "@/components/accountmodal/accountmodal";

const GREEN = "bg-[#5fa32b] hover:bg-[#54922568]";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3efe6]">
      {/* ---- Nav ---- */}
      <header className="sticky top-0 z-30 border-b border-neutral-300/70 bg-[#faf7ee]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display text-2xl font-bold text-ink">
              Marginalia
            </Link>
            <div className="hidden gap-6 font-body text-[15px] text-ink-soft md:flex">
              <Link href="/blog" className="hover:text-ink">Latest</Link>
              <Link href="/blog" className="hover:text-ink">System Design</Link>
              <Link href="/blog" className="hover:text-ink">Notebooks</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AccountModalTrigger
              mode="login"
              className="rounded-md border border-neutral-400 px-4 py-2 font-body text-sm text-ink hover:bg-neutral-100"
            >
              Log in
            </AccountModalTrigger>
            <Link
              href="/blog/new"
              className="rounded-md bg-[#5fa32b] px-4 py-2 font-body text-sm font-medium text-white hover:brightness-95"
            >
              Start writing
            </Link>
          </div>
        </nav>
      </header>

      {/* ---- Hero ---- */}
      <section className="notebook-lined relative border-b border-neutral-300/70">
        <span aria-hidden className="absolute inset-y-0 left-[90px] w-px bg-margin-line/70" />
        <div className="mx-auto max-w-6xl px-6 py-16 pl-[120px]">
          <div className="relative">
            <p className="font-body text-[17px] italic text-ink-soft">
              Since 2021 · 148 entries
            </p>
            <h1 className="mt-2 max-w-4xl font-display text-5xl font-bold leading-[0.95] text-marker md:text-7xl">
              Think on paper. Publish on the web.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-ink">
              A blog for engineers who work things out longhand — requirements in
              the margin, diagrams on graph paper, no slide deck in sight.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <AccountModalTrigger
                mode="signup"
                className="rounded-md bg-[#5fa32b] px-5 py-3 font-body font-medium text-white hover:brightness-95"
              >
                Create an account
              </AccountModalTrigger>
              <Link
                href="/blog"
                className="rounded-md border border-neutral-400 bg-[#faf7ee] px-5 py-3 font-body text-ink hover:bg-neutral-100"
              >
                Read the Latest
              </Link>
            </div>

            {/* sticky note */}
            <div className="pointer-events-none absolute right-0 top-0 hidden w-64 rotate-2 bg-highlight p-4 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.4)] lg:block">
              <p className="font-display text-xl font-bold text-marker">New</p>
              <p className="mt-1 font-body text-[15px] leading-snug text-ink">
                Entry 07 — URL shortener, start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Recent entries ---- */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Recent entries
        </p>
        <RecentEntries />
      </section>

      {/* ---- Footer ---- */}
      <footer className="bg-[#333a2c] text-[#d7dccb]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 font-body text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>Marginalia — written by hand, served over HTTP.</span>
          <div className="flex gap-5">
            <Link href="/blog" className="hover:text-white">RSS</Link>
            <Link href="/blog" className="hover:text-white">Archive</Link>
            <Link href="/blog" className="hover:text-white">Colophon</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}