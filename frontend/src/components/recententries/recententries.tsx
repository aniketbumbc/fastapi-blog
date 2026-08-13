"use client";

import { useEffect, useRef, useState } from "react";
import type { BlogSummary } from "@/lib/blog/types";
import { fetchBlogSummaries } from "@/lib/blog/api";
import { PostCard } from "@/components/postcard/PostCard";
import Loader from "@/components/ui/Loader";

export function RecentEntries() {
  const [feed, setFeed] = useState<BlogSummary[] | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchBlogSummaries(100)
      .then(setFeed)
      .catch(() => setFeed([]));
  }, []);

  if (feed === null) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {feed.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
