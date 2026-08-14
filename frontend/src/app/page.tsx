import Link from "next/link";
import { RecentEntries } from "@/components/recententries/recententries";
import { AccountModalTrigger } from "@/components/accountmodal/accountmodal";

export default function HomePage() {
  return (
    <div className="bg-[#f3efe6]">
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
              {/* <Link
                href="/blog"
                className="rounded-md border border-neutral-400 bg-[#faf7ee] px-5 py-3 font-body text-ink hover:bg-neutral-100"
              >
                Read the Latest
              </Link> */}
            </div>

            {/* sticky note */}
            <div className="pointer-events-none absolute right-0 top-25 hidden w-64 rotate-2 bg-highlight p-4 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.4)] lg:block">
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
    </div>
  );
}