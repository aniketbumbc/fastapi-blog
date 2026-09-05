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
export const STARTER_MARKDOWN = `# Start Here

Welcome. This entry is a quick tour of how writing works here. Read it once, then delete everything and make the page your own.

## Just start typing

Anything you type becomes a paragraph, like this one. Get the thought down first, tidy it later.

To stress a word, wrap it in **double asterisks**. To run a highlighter across a phrase, use ==double equals==.

## Headings keep it organized

Use one \`#\` for the page title and two \`##\` for the sections under it. Short headings double as your table of contents.

===

# The Building Blocks

The lone \`===\` line above turned the page. Use it whenever you want the reader to flip to a fresh leaf.

## Quotes

> A note is a conversation with your future self.

## Lists

1. Number your steps when the sequence counts.
2. Keep each item to a single idea.

- Or use a dash for a plain bullet.
- Loose, unpolished notes are fine.

## Code

\`\`\`python
print("hello, margin")  # your first note
\`\`\`

That is the whole toolkit. ==Now clear this entry and write your first real one.==
`;
