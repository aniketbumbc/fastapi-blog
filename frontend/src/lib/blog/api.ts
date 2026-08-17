import type { BlogStats, BlogSummary, Post } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export type BlogCreateInput = {
  slug: string;
  title: string;
  subtitle?: string;
  kicker?: string;
  author: string;
  tags?: string[];
  markdown: string;
};

export async function fetchBlogSummaries(limit = 20): Promise<BlogSummary[]> {
  const res = await fetch(`${API_BASE}/blogs/?limit=${limit}`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function fetchBlogStats(): Promise<BlogStats> {
  const res = await fetch(`${API_BASE}/blogs/stats`);
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function fetchBlogBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/blogs/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

async function apiErrorMessage(res: Response, fallback: string) {
  const body = await res.json().catch(() => null);
  if (typeof body?.detail === 'string') return body.detail;
  if (res.status === 422) return 'Please check your details and try again.';
  return fallback;
}

export async function createBlog(
  input: BlogCreateInput,
  token: string | null,
): Promise<{ ok: true; post: Post } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/blogs/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const fallback = res.status === 409 ? `Slug '${input.slug}' already exists` : 'Could not publish post';
      return { ok: false, error: await apiErrorMessage(res, fallback) };
    }
    return { ok: true, post: await res.json() };
  } catch {
    return { ok: false, error: 'Could not publish post. Please try again.' };
  }
}

export async function updateBlog(
  slug: string,
  input: BlogCreateInput,
  token: string | null,
): Promise<{ ok: true; post: Post } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/blogs/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const fallback = res.status === 409 ? `Slug '${input.slug}' already exists` : 'Could not save changes';
      return { ok: false, error: await apiErrorMessage(res, fallback) };
    }
    return { ok: true, post: await res.json() };
  } catch {
    return { ok: false, error: 'Could not save changes. Please try again.' };
  }
}

export async function deleteBlog(
  slug: string,
  token: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/blogs/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { ok: false, error: await apiErrorMessage(res, 'Could not delete post') };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not delete post. Please try again.' };
  }
}
