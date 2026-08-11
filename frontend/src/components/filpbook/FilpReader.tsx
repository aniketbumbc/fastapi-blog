"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "@/lib/types";
import { FilpPage } from "./FilpPage";
import { BlockRenderer } from "@/components/block/BlockRenderer";
import { useBookMode } from "@/app/hooks/Usebookmode";
import { useMeasuredHeights } from "@/app/hooks/Usemeasuredheights";
import { usePrefersReducedMotion } from "@/app/hooks/Useprefersreducedmotion";
import { paginate } from "@/lib/paginate";
import { FilpBook } from "./FilpBook";

const RATIO = 80 / 62; // page height / width
const MAX_PAGE_W = 600;
const MIN_PAGE_W = 260;
const SAFETY_PX = 6;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/**
 * Client-only reading surface: measures the flip-sized page box, paginates,
 * and renders the flip. Mounted by BookReader after hydration, so nothing here
 * runs on the server.
 */
export function FilpReader({
  post,
  startNumber = 1,
}: {
  post: Post;
  startNumber?: number;
}) {
  const mode = useBookMode();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  // Reading position as a block id — survives re-pagination and remount.
  const [anchorId, setAnchorId] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const read = () => setContainerW(el.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rawW = mode === "single" ? containerW : Math.floor(containerW / 2) - 8;
  const pageW = containerW ? clamp(rawW, MIN_PAGE_W, MAX_PAGE_W) : 0;
  const pageH = Math.round(pageW * RATIO);

  useEffect(() => {
    const el = probeRef.current;
    if (!el || !pageW) return;
    const r = el.getBoundingClientRect();
    setBox({ w: r.width, h: r.height });
  }, [pageW, mode]);

  const heights = useMeasuredHeights(measureRef, post.blocks, [box?.w, mode]);
  const pages =
    box && heights ? paginate(post.blocks, heights, box.h - SAFETY_PX) : null;

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center bg-[#6b6f63]">
      {pageW > 0 && (
        <div
          aria-hidden
          className="pointer-events-none invisible fixed left-0 top-0 -z-50"
          style={{ width: pageW, height: pageH }}
        >
          <FilpPage
            fill
            bindingSide={mode === "single" ? "left" : "right"}
            pageNumber={1}
            contentRef={probeRef}
          />
        </div>
      )}

      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible fixed left-0 top-0 -z-50"
        style={{ width: box?.w ?? pageW ?? 560 }}
      >
        {post.blocks.map((b) => (
          <div key={b.id} data-block-id={b.id} style={{ display: "flow-root" }}>
            <BlockRenderer block={b} />
          </div>
        ))}
      </div>

      {!pages || !pageW ? (
        <p className="py-10 font-body text-white/80">Preparing book…</p>
      ) : (
        <FilpBook
          pages={pages}
          mode={mode}
          startNumber={startNumber}
          anchorId={anchorId}
          onAnchorChange={setAnchorId}
          reducedMotion={reducedMotion}
          pageW={pageW}
          pageH={pageH}
        />
      )}
    </div>
  );
}