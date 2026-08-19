import Tag from "@/components/ui/Tag";

export const metadata = {
  title: "About",
  description:
    "The Dev Journal is a notebook-styled blog for engineers who work things out on paper before they publish.",
};

const FRONTEND_STACK = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand"];
const BACKEND_STACK = ["FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "JWT auth"];

const FLOW = [
  "The Next.js frontend calls the FastAPI backend over a REST API.",
  "Requests carry a JWT issued at login.",
  "Payloads are validated against Pydantic schemas.",
  "Routers for users and blogs handle the request.",
  "SQLAlchemy translates that into queries against PostgreSQL.",
  "The response flows back to render the page you're reading.",
];

export default function AboutPage() {
  return (
    <div className="notebook-lined min-h-screen">
      {/* ---- Hero ---- */}
      <section className="relative">
        <span aria-hidden className="absolute inset-y-0 left-[90px] w-px bg-margin-line/70" />
        <div className="mx-auto max-w-3xl px-6 py-16 pl-[120px]">
          <p className="font-body text-[17px] italic text-ink-soft">About this notebook</p>
          <h1 className="mt-2 font-display text-5xl font-bold leading-[0.95] text-marker md:text-6xl">
            The Dev Journal
          </h1>
          <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-ink">
            A blog for engineers who work things out longhand — requirements in the margin,
            diagrams on graph paper, no slide deck in sight. Every entry starts as a page in
            someone&apos;s notebook before it ever becomes a post.
          </p>
        </div>
      </section>

      {/* ---- Body ---- */}
      <section className="mx-auto max-w-3xl space-y-12 px-6 py-12">
        <div>
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            What it is
          </p>
          <p className="font-body text-[15px] leading-relaxed text-ink">
            The Dev Journal is a content-first publishing space for write-ups on system
            design, debugging war stories, and the kind of thinking that usually happens on scrap
            paper. No pop-ups, no noisy feed competing for attention — just ruled pages, a pen,
            and the words themselves.
          </p>
        </div>

        <div>
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Built with
          </p>
          <div className="flex flex-wrap gap-2">
            {[...FRONTEND_STACK, ...BACKEND_STACK].map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <p className="mt-3 font-body text-[15px] leading-relaxed text-ink">
            The frontend is a Next.js and TypeScript app styled with Tailwind CSS, with Zustand
            holding the small bits of client state — auth, toasts, drafts. The backend is a
            FastAPI service backed by PostgreSQL through SQLAlchemy, with Alembic managing schema
            migrations and JWTs handling sessions.
          </p>
        </div>

        <div>
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            How a page loads
          </p>
          <ol className="list-decimal space-y-2 pl-5 font-body text-[15px] leading-relaxed text-ink">
            {FLOW.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        {/* sticky note */}
        <div className="w-fit max-w-sm rotate-1 bg-highlight p-5 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.4)]">
          <p className="font-display text-xl font-bold text-marker">Say hi</p>
          <p className="mt-1 font-body text-[15px] leading-snug text-ink">
            Feedback, a feature request, or just want to talk shop? Reach out at{" "}
            <a href="mailto:aniket.umbc@gmail.com" className="underline">
              aniket.umbc@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
