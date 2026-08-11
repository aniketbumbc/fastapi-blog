import type { ReactNode } from "react";

interface BookPageProps {
  children?: ReactNode;
  /** Which edge the binding/gutter is on. In a spread the left page binds
   *  right and the right page binds left. */
  bindingSide?: "left" | "right";
  pageNumber?: number;
}

/** One notebook sheet inside a spread. Pure/server component — no state. */
export function BookPage({
  children,
  bindingSide = "left",
  pageNumber,
}: BookPageProps) {
  const pad =
    bindingSide === "left" ? "pl-[92px] pr-11" : "pr-[92px] pl-11";

  return (
    <article className="notebook-paper relative w-full aspect-[62/80] overflow-hidden">
      <span
        aria-hidden
        className={`notebook-margin-rule ${
          bindingSide === "right" ? "right-[66px]" : "left-[66px]"
        }`}
      />

      <div className={`relative z-[2] flex h-full flex-col py-10 ${pad}`}>
        <div className="min-h-0 flex-1">{children}</div>
        {pageNumber != null && (
          <div className="mt-auto pt-4 text-center font-body text-[15px] text-folio">
            — {pageNumber} —
          </div>
        )}
      </div>
    </article>
  );
}
