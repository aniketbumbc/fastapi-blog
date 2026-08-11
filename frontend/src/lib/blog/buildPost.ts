import type { Post } from './types';
import { compileMarkdown } from '../Compilemarkdown';

export interface PostMeta {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  kicker?: string;
  author: string;
  publishedAt?: string;
  tags?: string[];
}

/** Combine metadata + compiled markdown into the Post contract. */
export function buildPost(meta: PostMeta, markdown: string): Post {
  const { blocks, sectionCount } = compileMarkdown(markdown);
  return {
    id: meta.id?.trim() || Date.now().toString(),
    slug: meta.slug.trim(),
    title: meta.title.trim(),
    subtitle: meta.subtitle?.trim() || undefined,
    kicker: meta.kicker?.trim() || undefined,
    author: meta.author.trim(),
    publishedAt: meta.publishedAt || new Date().toISOString(),
    isBook: true,
    sectionCount,
    blocks,
  };
}

/** Render a Post as a drop-in mock-post.ts file. */
export function toMockFile(post: Post): string {
  return `import type { Post } from './types';\n\nexport const mockPost: Post = ${JSON.stringify(
    post,
    null,
    2,
  )};\n`;
}

/** Pre-filled draft so the form works on first load. Shows === and ==mark==. */
export const STARTER_MARKDOWN = `# The Read Path Test

Every redirect is one lookup. Make that lookup cheap, and the whole system stays fast under load.

A redirect only needs one thing: the long URL for a given key. So keep the hot keys in **memory** and the database out of the critical path.

In practice the flow is a single cache read that almost always hits. ==Cache hit ratio is the metric that matters most here== — everything else is a consequence of it.

## The request, step by step

\`\`\`bash
GET /aX9kP2q
# hit  -> return 301 to the long URL
# miss -> read KV store, warm cache, return
\`\`\`

1. Client requests the short key.
2. Redirect service checks the in-memory cache first.
3. On a hit, respond immediately with a redirect.

## Trade-offs to mention

- **301 vs 302** — 301 caches in the browser, which kills analytics.
- **LRU eviction** — ~20% of keys serve most of the traffic.
- **SQL vs KV store** — no joins needed, so KV wins.

===

# The Write Path

Writes are rarer and can afford to be slower. Turn a long URL into a short, unique key and persist it before anyone reads it back.

1. A long URL comes in.
2. An ID service issues a unique number and base62-encodes it.
3. The result is a short 7-character key.

Using a counter plus base62 avoids the birthday-collision problem you get from hashing and truncating.

> Writes need consistency; reads need speed. Design each path separately.
`;
