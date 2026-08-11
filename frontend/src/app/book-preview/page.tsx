import { mockSpreadPost } from "@/lib/mockPost";
import { BlockList } from "@/components/block/BlockList";
import { BookSpread } from "@/components/bookpost/BookSpread";

// PREVIEW ONLY. Renders BookSpread (bookpost/) directly with mockSpreadPost
// so the two-page notebook layout can be checked in isolation, without
// touching the real /blog/[slug] route or its BookReader/FilpReader tree.
export default function BookSpreadPreviewPage() {
  const left = mockSpreadPost.blocks.filter((b) => b.section === 0);
  const right = mockSpreadPost.blocks.filter((b) => b.section === 1);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#636f64] p-6 md:p-10">
      <BookSpread
        left={<BlockList blocks={left} />}
        right={<BlockList blocks={right} />}
        leftNumber={1}
        rightNumber={2}
      />
    </main>
  );
}
