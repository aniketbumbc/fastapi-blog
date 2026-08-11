"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import { BlockList } from "@/components/block/BlockList";
import { FilpReader } from "./FilpReader";

/**
 * The linear version of the post: full semantic HTML in document order.
 * This is what ships in the server render — SEO, no-JS, and the screen-reader
 * experience all read this. The flip is a progressive enhancement on top.
 */
function LinearPost({ post, hidden }: { post: Post; hidden: boolean }) {
  return (
    <article
      className={
        hidden
          ? "sr-only"
          : "notebook-paper mx-auto w-full max-w-[640px] rounded-md px-8 py-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] md:px-12 md:py-10"
      }
    >
      {post.kicker && !hidden && (
        <p className="mb-3.5 font-body text-[15px] text-ink-soft">
          {post.kicker}
        </p>
      )}
      <BlockList blocks={post.blocks} />
    </article>
  );
}

/**
 * Public reading component. Renders the linear post for SSR/SEO/no-JS, then
 * mounts the interactive flip after hydration and keeps the linear copy in the
 * DOM (visually hidden) for screen readers.
 */
export function BookReader({
  post,
  startNumber = 1,
}: {
  post: Post;
  startNumber?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#6b6f63]">
      <LinearPost post={post} hidden={mounted} />
      {mounted && <FilpReader post={post} startNumber={startNumber} />}
    </div>
  );
}