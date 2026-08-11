"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/blog/types";
import { listPosts } from "@/lib/postStore";
import { sampleFeed } from "@/lib/sampleFeed";
import { PostCard } from "@/components/postcard/PostCard";

export function RecentEntries() {
  const [feed, setFeed] = useState<Post[] | null>(null);

  useEffect(() => {
    const stored = listPosts();
    setFeed(stored.length ? stored.slice(0, 3) : sampleFeed);
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {(feed ?? sampleFeed).map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}