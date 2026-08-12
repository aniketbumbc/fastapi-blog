import Link from "next/link";
import type { BlogSummary } from "@/lib/blog/types";

interface PostCardProps {
  post: BlogSummary;
  /** When provided, shows a delete control (used by the manage/index view). */
  onDelete?: (slug: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const tag = post.tags?.[0] ?? null;
  return (
    <div className="group relative overflow-hidden rounded-xl border border-neutral-300/70 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)] transition-shadow hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.45)]">
      {/* tape strip */}
      <span
        aria-hidden
        className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rotate-[-1.5deg] bg-white/45 shadow-sm"
      />
      <Link href={`/blog/${post.slug}`} className="notebook-lined block">
        <span aria-hidden className="absolute inset-y-0 left-7 w-px bg-margin-line/70" />
        <div className="relative py-6 pl-11 pr-6 bg-highlight p-4 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.4)]">
          {post.kicker && (
            <p className="font-body text-[13px] italic text-ink-soft">{post.kicker}</p>
          )}

          <h2 className="relative mt-1 w-fit font-display text-[27px] font-bold leading-[1.05] text-marker">
            {post.title}
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 right-0 h-[5px] rotate-[-0.5deg] rounded-[40%_60%_55%_45%] bg-marker/70"
            />
          </h2>

          {post.subtitle && (
            <p className="mt-4 font-body text-[15px] font-bold text-marker-soft">
              {post.subtitle}
            </p>
          )}

          <p className="mt-2 line-clamp-3 font-body text-[15px] leading-snug text-ink">
            {post.preview}
          </p>

          <div className="mt-5 flex items-center justify-between">
            {tag ? (
              <span className="rounded-full border border-ink-soft/40 px-3 py-1 font-body text-[13px] text-ink-soft">
                #{tag}
              </span>
            ) : (
              <span />
            )}
            <span className="font-body text-[13px] text-ink-soft">
              {new Date(post.publishedAt).toLocaleDateString()} · {post.readingTime}
            </span>
          </div>
        </div>
      </Link>

      {onDelete && (
        <button
          onClick={() => onDelete(post.slug)}
          className="absolute right-3 top-3 z-20 rounded bg-white/70 px-2 py-0.5 text-xs text-red-600 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
        >
          Delete
        </button>
      )}
    </div>
  );
}