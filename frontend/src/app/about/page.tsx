export const metadata = {
  title: "About · Learn Stack",
  description: "About Learn Stack, a content-first publishing platform.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[720px] mx-auto py-10">
      <h1 className="font-serif text-[32px] font-bold text-ink">About Learn Stack</h1>
      <p className="text-muted mt-2">
        Learn Stack is a content-first publishing platform for writers and readers who want a
        clean, distraction-free space to share ideas.
      </p>
      <p className="text-muted mt-2">
            We believe good writing deserves a home that stays out of its way. No pop-ups, no
            noisy feeds competing for attention — just a fast, focused reading and writing
            experience built around the words themselves.
          </p>
           <p className="text-muted mt-2">
            Learn Stack started side project with a simple goal: make it easy to
            write and share ideas without fighting a cluttered interface. Every design decision,
            from typography to layout, is made to keep the focus on content over chrome.
          </p>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">Technical stack</h2>
          <p className="text-muted mt-2">
            The frontend is built with Next.js, React, and TypeScript, styled with Tailwind CSS
            and using Zustand for lightweight client state. The backend is a FastAPI service
            backed by PostgreSQL through SQLAlchemy, with Alembic managing schema migrations and
            JWT-based authentication handling sessions.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">How it flows</h2>
          <ol className="text-muted mt-2 list-decimal list-inside space-y-1">
            <li>The Next.js frontend calls the FastAPI backend over a REST API.</li>
            <li>Requests are authenticated with JWTs.</li>
            <li>Payloads are validated against Pydantic schemas.</li>
            <li>Routers for users and posts handle the request.</li>
            <li>SQLAlchemy translates that into queries against PostgreSQL.</li>
            <li>The response flows back to render the page you&apos;re reading.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">Get in touch</h2>
          <p className="text-muted mt-2">
            Have feedback, a feature request, or just want to say hi? We&apos;d love to hear from
            you — reach out aniket.umbc@gmail.com
          </p>
        </section>
      </div>
  );
}
