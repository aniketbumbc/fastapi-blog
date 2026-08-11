import type { Post } from './types';

// Option A stopgap: posts live in the browser's localStorage. This is the ONLY
// file the real backend replaces later — everything else calls these helpers.

const PREFIX = 'post:';
const hasWindow = () => typeof window !== 'undefined';

export function savePost(post: Post): void {
  if (!hasWindow()) return;
  window.localStorage.setItem(PREFIX + post.slug, JSON.stringify(post));
}

export function loadPost(slug: string): Post | null {
  if (!hasWindow()) return null;
  const raw = window.localStorage.getItem(PREFIX + slug);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Post;
  } catch {
    return null;
  }
}

export function listPosts(): Post[] {
  if (!hasWindow()) return [];
  const posts: Post[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      posts.push(JSON.parse(raw) as Post);
    } catch {
      // skip corrupt entries
    }
  }
  return posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function deletePost(slug: string): void {
  if (!hasWindow()) return;
  window.localStorage.removeItem(PREFIX + slug);
}
