'use client';

import { useEffect, useState } from 'react';

export type BookMode = 'spread' | 'single';

const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Spread on tablet/desktop, single page on phones.
 * Starts as "spread" to match the server render, then corrects after mount.
 * (Content is identical in both modes, so this only affects layout, not SEO.)
 */
export function useBookMode(): BookMode {
  const [mode, setMode] = useState<BookMode>('spread');

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setMode(mq.matches ? 'single' : 'spread');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return mode;
}
