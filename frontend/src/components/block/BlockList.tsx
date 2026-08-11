import type { Block } from "@/lib/types";
import { BlockRenderer } from "./BlockRenderer";

/**
 * Renders blocks in document order. This is the SEO/no-JS layer: the full
 * post exists as server-rendered HTML here, before any pagination runs.
 */
export function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
}