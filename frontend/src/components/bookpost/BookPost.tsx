"use client";

import type { Post } from "@/lib/types";
import { mockPost } from "@/lib/mockPost";
import { BookReader } from "@/components/filpbook/BookReader";

/**
 * The single public component a blog route renders. Picks spread vs single,
 * paginates, and renders the flip — all inside BookReader.
 *
 * TEMPORARY: defaults to mockPost so the existing route works with no data.
 * When the backend lands, the server route fetches the post and passes it here.
 */
export function BookPost({
  post = mockPost,
  startNumber = 24,
}: {
  post?: Post;
  startNumber?: number;
}) {
  return <BookReader post={post} startNumber={startNumber} />;
}