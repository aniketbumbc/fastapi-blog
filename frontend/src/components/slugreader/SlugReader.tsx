"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/blog/types";
import { fetchBlogBySlug, deleteBlog } from "@/lib/blog/api";
import { BookReader } from "@/components/filpbook/BookReader";
import { useAuth } from "@/store/auth";
import { useToast } from "@/store/toast";
import { usePostHeaderActions } from "@/store/postHeaderActions";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";

type State = { status: "loading" } | { status: "found"; post: Post } | { status: "missing" };

export function SlugReader({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { currentUser, isOwner, token } = useAuth();
  const push = useToast((s) => s.push);
  const router = useRouter();
  const setPostHeaderActions = usePostHeaderActions((s) => s.setPostHeaderActions);
  const clearPostHeaderActions = usePostHeaderActions((s) => s.clearPostHeaderActions);

  useEffect(() => {
    let cancelled = false;

    fetchBlogBySlug(slug)
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

  const owner = state.status === "found" && !!currentUser && isOwner(state.post.userId ?? "");

  useEffect(() => {
    if (owner) {
      setPostHeaderActions({ slug, owner: true, onDelete: () => setConfirmDelete(true) });
    } else {
      clearPostHeaderActions();
    }

    return () => clearPostHeaderActions();
  }, [owner, slug, setPostHeaderActions, clearPostHeaderActions]);

  if (state.status === "loading") {
    return <Loader />;
  }

  if (state.status === "missing") {
    return (
      <div className="text-center font-body text-white">
        <p className="text-2xl">No post found for “{slug}”.</p>
        <div className="mt-4 flex justify-center gap-4 text-sm underline">
          <Link href="/">All posts</Link>
          <Link href="/blog/new">Write one</Link>
        </div>
      </div>
    );
  }

  const confirmDeletePost = async () => {
    setDeleting(true);
    const result = await deleteBlog(slug, token);
    setDeleting(false);
    if (!result.ok) {
      push(result.error, "error");
      return;
    }
    setConfirmDelete(false);
    push("Post deleted");
    router.push("/blog");
  };

  return (
    <>
      <BookReader post={state.post} startNumber={1} />

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        icon="🗑"
        title="Delete this post?"
        description="This permanently removes the post. This can't be undone."
        confirmLabel={deleting ? "Deleting…" : "Delete post"}
        confirmDisabled={deleting}
        onConfirm={confirmDeletePost}
      />
    </>
  );
}
