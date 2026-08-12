"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/blog/types";
import { listPosts, deletePost } from "@/lib/postStore";
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
    <main className="min-h-screen bg-neutral-50 p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900">Published posts</h1>
          <Link
            href="/blog/new"
            className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            New post
          </Link>
        </div>

        {posts === null ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-neutral-500">
            Nothing published yet.{" "}
            <Link href="/blog/new" className="underline">
              Write your first post
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
            {posts.map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-4 p-4">
                <Link href={`/blog/${p.slug}`} className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-neutral-900">
                    {p.title}
                  </span>
                  <span className="block truncate text-sm text-neutral-500">
                    /blog/{p.slug} · {p.blocks.length} blocks · {p.sectionCount} sections
                  </span>
                </Link>
                <button
                  onClick={() => remove(p.slug)}
                  className="shrink-0 text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}