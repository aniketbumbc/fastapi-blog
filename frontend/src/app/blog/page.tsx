"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/blog/types";
import { listPosts, deletePost } from "@/lib/postStore";
import { previewText, readingTime } from "@/lib/postSummary";
import { PostCard } from "@/components/postcard/PostCard";
import Loader from "@/components/ui/Loader";

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  const refresh = () => setPosts(listPosts());
  useEffect(refresh, []);

  const remove = (slug: string) => {
    deletePost(slug);
    refresh();
  };

  return (
    <main className="min-h-screen bg-[#ece8dd] p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-marker">Write-Ups</h1>
            <p className="font-body text-ink-soft">Notes from the notebook.</p>
          </div>
          <Link
            href="/blog/new"
            className="rounded-md bg-[#5fa32b] px-4 py-2 text-sm font-medium text-white hover:brightness-95"
          >
            New post
          </Link>
        </div>

        {posts === null ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : posts.length === 0 ? (
          <p className="font-body text-ink-soft">
            Nothing published yet.{" "}
            <Link href="/blog/new" className="underline">
              Write your first post
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((p) => (
              <PostCard
                key={p.slug}
                post={{
                  slug: p.slug,
                  title: p.title,
                  subtitle: p.subtitle,
                  kicker: p.kicker,
                  tags: p.tags,
                  publishedAt: p.publishedAt,
                  preview: previewText(p),
                  readingTime: readingTime(p),
                }}
                onDelete={remove}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}