"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Post } from "@/lib/blog/types";
import { fetchBlogBySlug } from "@/lib/blog/api";
import { useAuth } from "@/store/auth";
import BlogEditor from "@/components/blog/BlogEditor";
import Loader from "@/components/ui/Loader";

type State =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "forbidden" }
  | { status: "ready"; post: Post };

export default function EditBlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const { currentUser, isOwner, hasHydrated } = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!hasHydrated) return;
    let cancelled = false;

    fetchBlogBySlug(slug)
      .then((post) => {
        if (cancelled) return;
        if (!post) return setState({ status: "missing" });
        if (!currentUser || !isOwner(post.userId ?? "")) return setState({ status: "forbidden" });
        setState({ status: "ready", post });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "missing" });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, currentUser, isOwner, hasHydrated]);

  if (state.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#6b6f63]">
        <Loader />
      </main>
    );
  }

  if (state.status === "missing") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#6b6f63] p-6">
        <div className="text-center font-body text-white">
          <p className="text-2xl">No post found for "{slug}".</p>
          <Link href="/blog" className="mt-4 inline-block text-sm underline">All posts</Link>
        </div>
      </main>
    );
  }

  if (state.status === "forbidden") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#6b6f63] p-6">
        <div className="text-center font-body text-white">
          <p className="text-2xl">You can't edit this post.</p>
          <p className="mt-1 text-white/70">Only the original author can make changes.</p>
          <Link href={`/blog/${slug}`} className="mt-4 inline-block text-sm underline">Back to post</Link>
        </div>
      </main>
    );
  }

  return <BlogEditor mode="edit" initial={state.post} />;
}
