import Link from "next/link";

const links = [
  { label: "All posts", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "API docs", href: "https://api.aniketdev.blog/docs", external: true },
];

export default function Footer() {
  return (
    <footer className="bg-[#333a2c] text-[#d7dccb]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 font-body text-sm sm:flex-row sm:items-center sm:justify-between">
        <span>
          <span className="font-display text-base font-bold text-white">Marginalia</span>
          {" "}— written by hand, served over HTTP. © {new Date().getFullYear()}
        </span>
        <nav className="flex gap-5">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="hover:text-white"
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
