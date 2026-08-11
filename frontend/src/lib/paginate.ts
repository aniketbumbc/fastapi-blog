import type { Block } from '@/lib/types';

/**
 * Pure cut logic — no DOM. Given measured block heights and a page capacity,
 * groups blocks into pages.
 *
 * Rules:
 *  - A block is atomic: it never splits. If it's taller than a whole page it
 *    gets its own page and overflows (the code-block edge case).
 *  - A change in `section` is a hard page break (authored boundary).
 *  - Otherwise a new page starts when the next block won't fit.
 */
export function paginate(
  blocks: Block[],
  heights: Map<string, number>,
  capacity: number,
): Block[][] {
  if (blocks.length === 0) return [];

  const pages: Block[][] = [];
  let current: Block[] = [];
  let used = 0;
  let section = blocks[0].section;

  for (const block of blocks) {
    const h = heights.get(block.id) ?? 0;
    const sectionChanged = block.section !== section;
    const overflows = used + h > capacity;

    if (current.length > 0 && (sectionChanged || overflows)) {
      pages.push(current);
      current = [];
      used = 0;
    }

    current.push(block);
    used += h;
    section = block.section;
  }

  if (current.length > 0) pages.push(current);
  return pages;
}
