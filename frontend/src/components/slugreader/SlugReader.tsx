"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/blog/types";
import { loadPost } from "@/lib/postStore";
import { fetchBlogBySlug } from "@/lib/blog/api";
import { BookReader } from "@/components/filpbook/BookReader";

type State = { status: "loading" } | { status: "found"; post: Post } | { status: "missing" };

export function SlugReader({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    // Local drafts (from /blog/new's "Publish → view") take priority since
    // they never reach the backend.
    Promise.resolve(loadPost(slug))
      .then((draft) => draft ?? fetchBlogBySlug(slug))
      .then((post) => {
        if (!cancelled) setState(post ? { status: "found", post } : { status: "missing" });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "missing" });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.status === "loading") {
    return <p className="font-body text-white/80">Loading…</p>;
  }

  if (state.status === "missing") {
    return (
      <div className="text-center font-body text-white">
        <p className="text-2xl">No post found for “{slug}”.</p>
        <div className="mt-4 flex justify-center gap-4 text-sm underline">
          <Link href="/blog">All posts</Link>
          <Link href="/blog/new">Write one</Link>
        </div>
      </div>
    );
  }

  return <BookReader post={state.post} startNumber={24} />;
}