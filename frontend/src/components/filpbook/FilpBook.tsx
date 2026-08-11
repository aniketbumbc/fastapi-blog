"use client";

import { forwardRef, useRef, type ReactNode } from "react";
import HTMLFlipBook from "react-pageflip";
import type { Block } from "@/lib/types";
import { FilpPage as FilpPageComponent } from "./FilpPage";
import { BlockList } from "@/components/block/BlockList";
import { BindingHoles } from "@/components/bookpost/Bindingholes";

// Each flip page must accept a ref so the library can control it.
const FilpPage = forwardRef<HTMLDivElement, { children: ReactNode }>(
  function FilpPage({ children }, ref) {
    return (
      <div ref={ref} className="h-full w-full">
        {children}
      </div>
    );
  },
);

/** Which page group currently contains a given block. Falls back to 0. */
function pageIndexForBlock(pages: Block[][], blockId: string | null): number {
  if (!blockId) return 0;
  const idx = pages.findIndex((group) => group.some((b) => b.id === blockId));
  return idx < 0 ? 0 : idx;
}

interface FilpBookProps {
  pages: Block[][];
  mode: "spread" | "single";
  startNumber: number;
  anchorId: string | null;
  onAnchorChange: (id: string) => void;
  reducedMotion: boolean;
  pageW: number;
  pageH: number;
}

export function FilpBook({
  pages,
  mode,
  startNumber,
  anchorId,
  onAnchorChange,
  reducedMotion,
  pageW,
  pageH,
}: FilpBookProps) {
  const portrait = mode === "single";
  const startPage = pageIndexForBlock(pages, anchorId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  const controller = () => bookRef.current?.pageFlip?.();

  const next = () => {
    const pf = controller();
    if (!pf) return;
    reducedMotion ? pf.turnToNextPage() : pf.flipNext();
  };
  const prev = () => {
    const pf = controller();
    if (!pf) return;
    reducedMotion ? pf.turnToPrevPage() : pf.flipPrev();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    }
  };

  // When the reader turns a page, remember the first block now on screen.
  const handleFlip = (e: { data: number }) => {
    const group = pages[e.data];
    if (group && group[0]) onAnchorChange(group[0].id);
  };

  return (
    <div
      role="region"
      aria-roledescription="flip book"
      aria-label="Post pages. Use the left and right arrow keys to turn pages."
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="rounded outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <div aria-hidden="true" className="relative">
        {!portrait && <BindingHoles className="book-gutter" />}
        <HTMLFlipBook
          ref={bookRef}
          // Remount on mode change OR when the page count changes (a re-layout).
          // On remount, startPage reopens the book at the anchor block.
          key={`${mode}:${pages.length}`}
          startPage={startPage}
          width={pageW}
          height={pageH}
          minWidth={pageW}
          maxWidth={pageW}
          minHeight={pageH}
          maxHeight={pageH}
          size="fixed"
          usePortrait={portrait}
          showCover={false}
          drawShadow={!reducedMotion}
          maxShadowOpacity={0.3}
          flippingTime={reducedMotion ? 0 : 700}
          mobileScrollSupport
          useMouseEvents
          startZIndex={0}
          autoSize
          clickEventForward
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false}
          onFlip={handleFlip}
          className="book-flip"
          style={{}}
        >
          {pages.map((group, i) => (
            <FilpPage key={i}>
              <FilpPageComponent
                fill
                pageNumber={startNumber + i}
                bindingSide={portrait ? "left" : i % 2 === 0 ? "right" : "left"}
              >
                <BlockList blocks={group} />
              </FilpPageComponent>
            </FilpPage>
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}