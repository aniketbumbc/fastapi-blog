import type { Block, ListBlock } from './types';

/** Key used in the heights map for the standalone measurement of item `index`
 *  of the list block `blockId`. Shared with FilpReader's measuring pass. */
export const listItemKey = (blockId: string, index: number) =>
  `${blockId}::item${index}`;

/** Slice a list block into a continuation chunk covering items
 *  [start, start + count). Chunks after the first carry a suffixed id
 *  (so React keys stay unique across pages) and `startIndex` so ordered
 *  numbering resumes correctly. */
function splitList(block: ListBlock, start: number, count: number): ListBlock {
  return {
    ...block,
    id: start === 0 ? block.id : `${block.id}__cont${start}`,
    items: block.items.slice(start, start + count),
    startIndex: start,
  };
}

/**
 * Pure cut logic — no DOM. Given measured block heights and a page capacity,
 * groups blocks into pages.
 *
 * Rules:
 *  - A block is atomic: it never splits. If it's taller than a whole page it
 *    gets its own page and overflows (the code-block edge case).
 *  - Exception: a `list` block may be split at an item boundary, so a long
 *    list flows across a page break instead of jumping whole to the next
 *    page and leaving a gap behind. A single item that's taller than a whole
 *    page still overflows, same as any other oversized atomic content.
 *  - A change in `section` is a hard page break (authored boundary).
 *  - Otherwise a new page starts when the next block (or list item) won't fit.
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
    const sectionChanged = block.section !== section;
    section = block.section;

    if (block.type === 'list' && block.items.length > 0) {
      if (sectionChanged && current.length > 0) {
        pages.push(current);
        current = [];
        used = 0;
      }

      const itemHeights = block.items.map(
        (_, i) => heights.get(listItemKey(block.id, i)) ?? 0,
      );
      const fullHeight =
        heights.get(block.id) ?? itemHeights.reduce((a, h) => a + h, 0);
      // Height contributed by the <ol>/<ul> wrapper itself (its margin),
      // on top of its items — derived, not hardcoded, so it stays correct
      // if the list's own styling changes.
      const overhead = Math.max(
        0,
        fullHeight - itemHeights.reduce((a, h) => a + h, 0),
      );

      let idx = 0;
      while (idx < block.items.length) {
        if (
          current.length > 0 &&
          used + overhead + itemHeights[idx] > capacity
        ) {
          pages.push(current);
          current = [];
          used = 0;
        }

        let count = 0;
        let chunkH = overhead;
        for (; idx + count < block.items.length; count++) {
          const nextH = chunkH + itemHeights[idx + count];
          if (count > 0 && used + nextH > capacity) break;
          chunkH = nextH;
        }

        current.push(splitList(block, idx, count));
        used += chunkH;
        idx += count;

        if (idx < block.items.length) {
          pages.push(current);
          current = [];
          used = 0;
        }
      }
      continue;
    }

    const h = heights.get(block.id) ?? 0;
    const overflows = used + h > capacity;

    if (current.length > 0 && (sectionChanged || overflows)) {
      pages.push(current);
      current = [];
      used = 0;
    }

    current.push(block);
    used += h;
  }

  if (current.length > 0) pages.push(current);
  return pages;
}
