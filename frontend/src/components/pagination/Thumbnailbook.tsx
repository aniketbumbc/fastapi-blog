"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "@/lib/types";
import { FilpPage } from "@/components/filpbook/FilpPage";
import { BlockList } from "@/components/block/BlockList";
import { BlockRenderer, ListItem } from "@/components/block/BlockRenderer";
import { useMeasuredHeights } from "@/app/hooks/Usemeasuredheights";
import { paginate, listItemKey } from "@/lib/paginate";

const RATIO = 80 / 62; // page height / width
const MAX_PAGE_W = 600;
const MIN_PAGE_W = 220;
const SAFETY_PX = 6;
const RAIL_W = 96; // thumbnail width, px
const RAIL_GAP = 16; // px, matches gap-4

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/**
 * Preview surface for the editor: a scrollable thumbnail rail on the left, one
 * full-size page on the right (the "canvas"). Switching pages is a click (or
 * arrow keys) on the canvas — never a scroll — because each page is already
 * paginated to fit its own box. Only the rail scrolls, and only when there
 * are more thumbnails than fit its height.
 */
export function ThumbnailBook({
  post,
  startNumber = 1,
}: {
  post: Post;
  startNumber?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [rawCurrent, setCurrent] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const read = () => setContainerW(el.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pageW = containerW
    ? clamp(containerW - RAIL_W - RAIL_GAP, MIN_PAGE_W, MAX_PAGE_W)
    : 0;
  const pageH = Math.round(pageW * RATIO);

  useEffect(() => {
    const el = probeRef.current;
    if (!el || !pageW) return;
    const r = el.getBoundingClientRect();
    setBox({ w: r.width, h: r.height });
  }, [pageW]);

  const heights = useMeasuredHeights(measureRef, post.blocks, [box?.w]);
  const pages =
    box && heights ? paginate(post.blocks, heights, box.h - SAFETY_PX) : null;
  // Clamp at read time (rather than in an effect) so a re-pagination that
  // shrinks the page count never leaves `current` pointing past the end.
  const current = pages ? clamp(rawCurrent, 0, pages.length - 1) : 0;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!pages) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      setCurrent((c) => Math.min(pages.length - 1, c + 1));
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      setCurrent((c) => Math.max(0, c - 1));
    }
  };

  const thumbScale = pageW ? RAIL_W / pageW : 0;
  const thumbH = Math.round(pageH * thumbScale);

  return (
    <div ref={containerRef} className="flex h-full w-full gap-4">
      {/* Probe: one blank reference page, sized like the real thing. */}
      {pageW > 0 && (
        <div
          aria-hidden
          className="pointer-events-none invisible fixed left-0 top-0 -z-50"
          style={{ width: pageW, height: pageH }}
        >
          <FilpPage fill bindingSide="left" pageNumber={1} contentRef={probeRef} />
        </div>
      )}

      {/* Measurement column: every block at the real content width. */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible fixed left-0 top-0 -z-50"
        style={{ width: box?.w ?? pageW ?? 560 }}
      >
        {post.blocks.map((b) => (
          <div key={b.id}>
            <div data-block-id={b.id} style={{ display: "flow-root" }}>
              <BlockRenderer block={b} />
            </div>
            {b.type === "list" &&
              b.items.map((item, i) => (
                <div
                  key={`${b.id}-item-${i}`}
                  data-block-id={listItemKey(b.id, i)}
                  style={{ display: "flow-root" }}
                >
                  <ListItem item={item} index={i} ordered={b.ordered} />
                </div>
              ))}
          </div>
        ))}
      </div>

      {!pages || !pageW ? (
        <p className="flex-1 py-10 text-center font-body text-white/80">
          Preparing book…
        </p>
      ) : (
        <>
          {/* Thumbnail rail */}
          <div className="shrink-0 overflow-y-auto" style={{ width: RAIL_W }}>
            <div className="flex flex-col items-center gap-3 py-1">
              {pages.map((group, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-current={i === current}
                  aria-label={`Page ${startNumber + i}`}
                  className={`block shrink-0 overflow-hidden rounded-sm border-0 bg-transparent p-0 ring-2 transition ${
                    i === current
                      ? "ring-white"
                      : "ring-transparent hover:ring-white/40"
                  }`}
                  style={{ width: RAIL_W, height: thumbH }}
                >
                  <div
                    style={{
                      width: pageW,
                      height: pageH,
                      transform: `scale(${thumbScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <FilpPage fill bindingSide="left" pageNumber={startNumber + i}>
                      <BlockList blocks={group} />
                    </FilpPage>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas: the current page, full size, never scrolls. */}
          <div
            role="region"
            aria-label="Current page. Use the left and right arrow keys to change pages."
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="flex flex-1 items-center justify-center overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <div style={{ width: pageW, height: pageH }} className="shadow-lg">
              <FilpPage fill bindingSide="left" pageNumber={startNumber + current}>
                <BlockList blocks={pages[current]} />
              </FilpPage>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
