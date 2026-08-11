"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookReader } from "@/components/filpbook/BookReader";
import { savePost } from "@/lib/postStore";
import {
  buildPost,
  toMockFile,
  STARTER_MARKDOWN,
  type PostMeta,
} from "@/lib/blog/buildPost";

type View = "preview" | "json";

const field =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500";
const label = "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500";

export default function NewPostPage() {
  const [meta, setMeta] = useState<PostMeta>({
    slug: "the-read-path",
    title: "The Read Path Test",
    subtitle: "Where 99% of the traffic actually goes",
    kicker: "System Design · Entry 07",
    author: "Aniket Bhavsar",
  });
  const [markdown, setMarkdown] = useState(STARTER_MARKDOWN);
  const [tagsText, setTagsText] = useState("system-design");
  const [debounced, setDebounced] = useState(markdown);
  const [view, setView] = useState<View>("preview");
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  const publish = () => {
    if (!post.slug || post.blocks.length === 0) return;
    savePost(post);
    router.push(`/blog/${post.slug}`);
  };

  // Debounce compilation so typing doesn't remount the flip on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(markdown), 400);
    return () => clearTimeout(t);
  }, [markdown]);

  const post = useMemo(() => {
    const tags = tagsText
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);
    return buildPost({ ...meta, tags }, debounced);
  }, [meta, tagsText, debounced]);
  const json = useMemo(() => JSON.stringify(post, null, 2), [post]);

  const update = (k: keyof PostMeta) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setMeta((m) => ({ ...m, [k]: e.target.value }));

  const copy = async (text: string, tag: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(tag);
    setTimeout(() => setCopied(null), 1500);
  };

  const ready = post.slug && post.title && post.blocks.length > 0;

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* ---- Editor ---- */}
      <div className="flex flex-col gap-4 overflow-y-auto border-r border-neutral-200 bg-neutral-50 p-5">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">New book post</h1>
          <p className="text-sm text-neutral-500">
            Write markdown. Use a lone <code className="rounded bg-neutral-200 px-1">===</code> line
            for a section break, and <code className="rounded bg-neutral-200 px-1">==text==</code> for
            the highlighter.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={label}>Slug</span>
            <input className={field} value={meta.slug} onChange={update("slug")} />
          </div>
          <div>
            <span className={label}>Author</span>
            <input className={field} value={meta.author} onChange={update("author")} />
          </div>
          <div className="col-span-2">
            <span className={label}>Title</span>
            <input className={field} value={meta.title} onChange={update("title")} />
          </div>
          <div className="col-span-2">
            <span className={label}>Subtitle</span>
            <input className={field} value={meta.subtitle ?? ""} onChange={update("subtitle")} />
          </div>
          <div className="col-span-2">
            <span className={label}>Kicker</span>
            <input className={field} value={meta.kicker ?? ""} onChange={update("kicker")} />
          </div>
          <div className="col-span-2">
            <span className={label}>Tags (comma-separated)</span>
            <input
              className={field}
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="system-design, caching"
            />
          </div>
        </div>

        <div className="flex min-h-[320px] flex-1 flex-col">
          <span className={label}>Markdown</span>
          <textarea
            className="flex-1 resize-none rounded-md border border-neutral-300 bg-white p-3 font-mono text-[13px] leading-relaxed text-neutral-900 outline-none focus:border-neutral-500"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={publish}
            disabled={!ready}
            className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40"
          >
            Publish → view
          </button>
          <button
            onClick={() => copy(json, "json")}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            {copied === "json" ? "Copied!" : "Copy Post JSON"}
          </button>
          <button
            onClick={() => copy(toMockFile(post), "file")}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
          >
            {copied === "file" ? "Copied!" : "Copy as mock-post.ts"}
          </button>
          <Link
            href="/blog"
            className="self-center text-sm font-medium text-neutral-600 underline hover:text-neutral-900"
          >
            All posts
          </Link>
          <span className="self-center text-xs text-neutral-500">
            {post.blocks.length} blocks · {post.sectionCount} sections
          </span>
        </div>
      </div>

      {/* ---- Output ---- */}
      <div className="flex flex-col bg-[#6b6f63]">
        <div className="flex gap-1 border-b border-black/20 bg-black/10 p-2">
          {(["preview", "json"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded px-3 py-1 text-sm font-medium capitalize ${
                view === v ? "bg-white text-neutral-900" : "text-white/80 hover:text-white"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {!ready ? (
            <p className="p-8 text-center font-body text-white/80">
              Add a title, slug, and some content to see the book.
            </p>
          ) : view === "preview" ? (
            <BookReader post={post} startNumber={24} />
          ) : (
            <pre className="whitespace-pre-wrap break-words rounded-md bg-neutral-900 p-4 font-mono text-xs leading-relaxed text-neutral-100">
              {json}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}