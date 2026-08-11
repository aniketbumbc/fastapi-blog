"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "@/lib/types";
import  {FilpPage} from "@/components/filpbook/FilpPage";
import { BlockList } from "@/components/block/BlockList";
import { BlockRenderer } from "@/components/block/BlockRenderer";
import { useBookMode } from "@/app/hooks/Usebookmode";
import { useMeasuredHeights } from "@/app/hooks/Usemeasuredheights";
import { paginate } from "@/lib/paginate";

// Trim a few px off capacity so rounding never causes a one-line overflow.
const SAFETY_PX = 4;

/**
 * STEP 4: pagination verification. Renders the resulting pages STACKED
 * (no flip yet) so the cuts can be checked. The flip goes on top in step 5.
 *
 * Flow: an invisible probe page gives the real content-box size for the
 * current mode; an invisible column renders every block at that width so we
 * can measure heights; `paginate` cuts; we render the groups as pages.
 */
export function PaginatedBook({
  post,
  startNumber = 1,
}: {
  post: Post;
  startNumber?: number;
}) {
  const mode = useBookMode();
  const probeRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  // Measure the real page content box. Its size depends only on page width
  // (aspect ratio fixes height), not on content, so a blank probe is exact.
  useEffect(() => {
    const el = probeRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  const heights = useMeasuredHeights(measureRef, post.blocks, [box?.w, mode]);
  const pages =
    box && heights ? paginate(post.blocks, heights, box.h - SAFETY_PX) : null;

  return (
    <div className="w-full">
      {/* Probe: one blank reference page, sized like the real thing. */}
      <div
        aria-hidden
        className="pointer-events-none invisible fixed left-0 top-0 -z-50 w-full"
      >
        {mode === "single" ? (
          <div className="mx-auto w-full max-w-[560px]">
            <FilpPage bindingSide="left" pageNumber={1} contentRef={probeRef} />
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-[1120px]">
            <div className="flex-1">
              <FilpPage bindingSide="right" pageNumber={1} contentRef={probeRef} />
            </div>
            <div className="flex-1">
              <FilpPage bindingSide="left" pageNumber={1} />
            </div>
          </div>
        )}
      </div>

      {/* Measurement column: every block at the real content width. */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible fixed left-0 top-0 -z-50"
        style={{ width: box?.w ?? 560 }}
      >
        {post.blocks.map((b) => (
          <div key={b.id} data-block-id={b.id} style={{ display: "flow-root" }}>
            <BlockRenderer block={b} />
          </div>
        ))}
      </div>

      {/* Result: stacked pages (step 4 verification view). */}
      {!pages ? (
        <p className="text-center font-body text-white/80">Paginating…</p>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <p className="font-body text-sm text-white/70">
            {pages.length} pages · {mode}
          </p>
          {pages.map((group, i) => (
            <div key={i} className="w-full max-w-[560px]">
              <FilpPage bindingSide="left" pageNumber={startNumber + i}>
                <BlockList blocks={group} />
              </FilpPage>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}