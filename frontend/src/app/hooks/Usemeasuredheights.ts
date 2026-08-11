'use client';

import { type RefObject, useEffect, useState } from 'react';
import type { Block } from '@/lib/types';

/**
 * Measures the rendered height of each block inside `ref`. The container must
 * render one element per block carrying `data-block-id`, each as its own
 * formatting context (display: flow-root) so vertical margins are included.
 *
 * Returns null until the first measurement completes. Re-measures on resize
 * and once web fonts are ready (handwriting faces shift heights noticeably).
 */
export function useMeasuredHeights(
  ref: RefObject<HTMLElement | null>,
  blocks: Block[],
  deps: unknown[],
): Map<string, number> | null {
  const [heights, setHeights] = useState<Map<string, number> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const measure = () => {
      if (cancelled || !ref.current) return;
      const map = new Map<string, number>();
      ref.current
        .querySelectorAll<HTMLElement>('[data-block-id]')
        .forEach((node) => {
          if (node.dataset.blockId)
            map.set(node.dataset.blockId, node.offsetHeight);
        });
      setHeights(map);
    };

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(measure).catch(measure);
    } else {
      measure();
    }

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return heights;
}
