import type { Block } from "@/lib/types";

/**
 * Renders one block. Pure/server component.
 *
 * SECURITY NOTE: paragraph/quote/list HTML is injected via
 * dangerouslySetInnerHTML. This is safe ONLY because that HTML is produced
 * server-side from our own markdown pipeline and sanitized there. Never pipe
 * untrusted / user-submitted HTML through these blocks.
 */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      if (block.level === 1) {
        return (
          <h1 className="relative mb-1 w-fit font-display text-[52px] font-bold leading-[0.9] text-marker">
            {block.text}
            <span
              aria-hidden
              className="absolute -bottom-1.5 -left-0.5 -right-1.5 h-[7px] rotate-[-0.6deg] rounded-[40%_60%_55%_45%] bg-marker/80"
            />
          </h1>
        );
      }
      if (block.level === 2) {
        return (
          <h2 className="mb-2.5 mt-3 font-display text-[30px] font-bold text-marker">
            {block.text}
          </h2>
        );
      }
      return (
        <h3 className="mb-2 mt-3 font-display text-[24px] font-semibold text-marker-soft">
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <p
          className="nb-inline mb-4 font-body text-[18px] leading-[1.55] text-ink"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case "code":
      // Plain <pre> for now. Syntax highlighting (Shiki/Prism) added later.
      // max-h-full: inside a fixed-height flip page this clamps a too-tall
      // snippet and lets it scroll; in the auto-height linear fallback the
      // percentage max-height is ignored, so the whole snippet shows.
      return (
        <pre className="mb-5 mt-1.5 max-h-full overflow-auto rounded-md border-[1.5px] border-ink-soft bg-white/55 px-3.5 py-3 font-mono text-[13.5px] leading-[1.5] text-ink shadow-[2px_2px_0_rgba(78,107,140,0.18)]">
          <code>{block.code}</code>
        </pre>
      );

    case "list":
      if (block.ordered) {
        return (
          <ol className="mb-4 ml-1 list-none font-body text-[18px] leading-[1.5] text-ink">
            {block.items.map((item, i) => (
              <li key={i} className="nb-inline relative mb-2.5 pl-8">
                <span
                  aria-hidden
                  className="absolute left-0 font-display font-bold text-marker"
                >
                  {i + 1}.
                </span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="mb-4 ml-1 list-none font-body text-[18px] leading-[1.5] text-ink">
          {block.items.map((item, i) => (
            <li key={i} className="nb-inline relative mb-2.5 pl-[22px]">
              <span
                aria-hidden
                className="absolute left-0.5 top-[-2px] text-[20px] text-marker"
              >
                •
              </span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote
          className="nb-inline my-4 border-l-[3px] border-marker/60 pl-4 font-display text-[22px] leading-snug text-marker-soft"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    default:
      return null;
  }
}