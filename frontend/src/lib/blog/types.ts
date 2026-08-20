// The contract. Whatever the FastAPI backend returns later must match these types.
// Frontend is built entirely against this shape using mock data first.

// ---- Blocks --------------------------------------------------------------
// Every block is atomic to the reflow engine: it either fits on the current
// page or gets pushed whole to the next one. A block is never split mid-way.
//
// Inline formatting (bold, inline code, links, the highlighter) lives INSIDE a
// block as a pre-rendered HTML string produced server-side. Allowed inline
// tags: <strong> <em> <code> <mark> <a>. `<mark>` is the yellow highlighter.
// Block-level structure stays typed so pagination can reason about it.

export type BlockType = 'heading' | 'paragraph' | 'code' | 'list' | 'quote';

interface BlockBase {
  /** Stable id. Used for React keys and for tracking reading position
   *  across re-pagination (we track a block id, not a page number). */
  id: string;
  /** Which authored section this block belongs to. A change in this value
   *  is a hard page boundary for the reflow engine. Zero-based. */
  section: number;
}

export interface HeadingBlock extends BlockBase {
  type: 'heading';
  level: 1 | 2 | 3;
  /** Plain text. Headings don't carry inline HTML. */
  text: string;
}

export interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  /** Inline HTML: <strong> <em> <code> <mark> <a>. Already sanitized server-side. */
  html: string;
}

export interface CodeBlock extends BlockBase {
  type: 'code';
  /** Language hint for syntax highlighting, e.g. 'bash', 'python', 'ts'. */
  language: string;
  /** Raw source, rendered verbatim. The overflow-on-mobile edge case lives here. */
  code: string;
}

export interface ListBlock extends BlockBase {
  type: 'list';
  ordered: boolean;
  /** Each item is inline HTML (same allowed tags as ParagraphBlock). */
  items: string[];
}

export interface QuoteBlock extends BlockBase {
  type: 'quote';
  /** Inline HTML. Rendered as a margin note / callout in the notebook style. */
  html: string;
}

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | CodeBlock
  | ListBlock
  | QuoteBlock;

// ---- Post ----------------------------------------------------------------

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  /** Small margin label at the top of the page, e.g. "System Design · Entry 07". */
  kicker?: string;
  author: string;
  /** Id of the user who owns this post — lets the frontend show edit/delete
   *  controls only to the owner. Absent on posts created before this existed. */
  userId?: string;
  /** ISO 8601. */
  publishedAt: string;
  updatedAt?: string;
  /** Flags the book/flip treatment. Non-book posts render as normal scroll. */
  isBook: true;
  /** Optional tags, stored without the leading '#'. */
  tags?: string[];
  /** Raw markdown source — the editable form of `blocks`. Always present on
   *  posts fetched from the backend; absent on locally-built draft posts. */
  markdown?: string;
  /** Ordered content. Document order IS reading order. */
  blocks: Block[];
  /** Number of authored sections. Derived from the max `section` + 1;
   *  stored for convenience. NOTE: this is NOT the page count — page count
   *  only exists once a viewport is known and is always computed at render. */
  sectionCount: number;
}

/** Lightweight shape for the homepage feed and /blog index — no blocks.
 *  Mirrors the backend's BlogSummary (GET /api/blogs/). */
export interface BlogSummary {
  slug: string;
  title: string;
  subtitle?: string;
  kicker?: string;
  tags?: string[];
  publishedAt: string;
  preview: string;
  readingTime: string;
  author: string;
  authorAvatarUrl?: string;
}

/** Aggregate counts for the homepage hero. Mirrors the backend's BlogStats
 *  (GET /api/blogs/stats). */
export interface BlogStats {
  total: number;
  since?: number;
}
