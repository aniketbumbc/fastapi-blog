import type { Post } from './types';

/** Strip our sanitized inline HTML down to plain text. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** First paragraph as a short plain-text preview. */
export function previewText(post: Post, max = 150): string {
  const p = post.blocks.find((b) => b.type === 'paragraph');
  if (!p || p.type !== 'paragraph') return '';
  const text = stripHtml(p.html);
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

/** Rough reading time across all text content (~200 wpm). */
export function readingTime(post: Post): string {
  let words = 0;
  const count = (s: string) => (s ? s.split(/\s+/).filter(Boolean).length : 0);
  for (const b of post.blocks) {
    if (b.type === 'paragraph' || b.type === 'quote')
      words += count(stripHtml(b.html));
    else if (b.type === 'heading') words += count(b.text);
    else if (b.type === 'list')
      words += b.items.reduce((n, it) => n + count(stripHtml(it)), 0);
    else if (b.type === 'code') words += count(b.code);
  }
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/** First tag (without '#'), or null. */
export function primaryTag(post: Post): string | null {
  return post.tags?.[0] ?? null;
}
