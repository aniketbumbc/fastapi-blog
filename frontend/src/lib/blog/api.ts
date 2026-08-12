import type { BlogSummary, Post } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function fetchBlogSummaries(limit = 20): Promise<BlogSummary[]> {
  const res = await fetch(`${API_BASE}/blogs/?limit=${limit}`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function fetchBlogBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/blogs/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}
