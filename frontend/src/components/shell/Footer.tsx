import Link from "next/link";

const links = [
  { label: "About", href: "/about" },
  { label: "API docs", href: "https://api.aniketdev.blog/docs", external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-divider bg-surface">
      <div className="max-w-[1120px] mx-auto px-5 py-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted">
          <span className="font-serif font-bold text-ink">Learn Stack</span> · © {new Date().getFullYear()}
        </span>
        <nav className="flex gap-4 text-sm text-muted">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="hover:text-text"
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}