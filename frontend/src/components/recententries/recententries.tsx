"use client";

import { useEffect, useRef, useState } from "react";
import type { BlogSummary } from "@/lib/blog/types";
import { fetchBlogSummaries } from "@/lib/blog/api";
import { PostCard } from "@/components/postcard/PostCard";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";

const PAGE_SIZE = 6;

export function RecentEntries() {
  const [feed, setFeed] = useState<BlogSummary[] | null>(null);
  const [page, setPage] = useState(1);
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

  const totalPages = Math.max(1, Math.ceil(feed.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = feed.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Recent Blogs
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-8! px-3! text-xs!"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="font-body text-xs text-ink-soft">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              type="button"
              variant="ghost"
              className="h-8! px-3! text-xs!"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {pageItems.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}
