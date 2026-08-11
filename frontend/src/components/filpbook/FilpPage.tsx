import type { ReactNode, Ref } from "react";

export type BindingSide = "left" | "right" | "none";

interface FilpPageProps {
  children?: ReactNode;
  /** Which edge the binding/gutter is on. In a spread the left page binds
   *  right and the right page binds left. Single page binds left. */
  bindingSide?: BindingSide;
  pageNumber?: number;
  /** Ref to the block content box. Used by the pagination engine to measure
   *  the real usable height/width of a page. Optional. */
  contentRef?: Ref<HTMLDivElement>;
  /** Fill the parent (h-full) instead of using the 62/80 aspect ratio.
   *  Used inside react-pageflip, which sizes each page in pixels. */
  fill?: boolean;
}

/**
 * One notebook sheet. Pure/server component — no state, no effects.
 * Content is passed in as children so it can be server-rendered upstream.
 */
export function FilpPage({
  children,
  bindingSide = "left",
  pageNumber,
  contentRef,
  fill = false,
}: FilpPageProps) {
  const pad =
    bindingSide === "left"
      ? "pl-[92px] pr-11"
      : bindingSide === "right"
        ? "pr-[92px] pl-11"
        : "px-11";

  return (
    <article
      className={`notebook-paper relative w-full overflow-hidden ${
        fill ? "h-full" : "aspect-[62/80]"
      }`}
    >
      {bindingSide !== "none" && (
        <span
          aria-hidden
          className={`notebook-margin-rule ${
            bindingSide === "right" ? "right-[66px]" : "left-[66px]"
          }`}
        />
      )}

      <div className={`relative z-[2] flex h-full flex-col py-10 ${pad}`}>
        <div ref={contentRef} className="min-h-0 flex-1">
          {children}
        </div>
        {pageNumber != null && (
          <div className="mt-auto pt-4 text-center font-body text-[15px] text-folio">
            — {pageNumber} —
          </div>
        )}
      </div>
    </article>
  );
}