import type { Post } from './types';

// Demo entries shown on the homepage when localStorage has no real posts yet.
// Minimal blocks — enough for the card preview and reading-time estimate.
export const sampleFeed: Post[] = [
  {
    id: 's1',
    slug: 'url-shortener',
    title: 'URL Shortener',
    subtitle: 'Read-heavy, write-light',
    kicker: 'Entry 07 · 10 / 08 / 26',
    author: 'Aniket Bhavsar',
    tags: ['system-design'],
    publishedAt: '2026-08-10T09:00:00Z',
    isBook: true,
    sectionCount: 1,
    blocks: [
      {
        id: 'b1',
        section: 0,
        type: 'heading',
        level: 1,
        text: 'URL Shortener',
      },
      {
        id: 'b2',
        section: 0,
        type: 'paragraph',
        html: '100 M links a day is 1,150 writes/sec — and 115 K reads. That ratio decides the whole architecture.',
      },
    ],
  },
  {
    id: 's2',
    slug: 'rate-limiting',
    title: 'Rate Limiting',
    subtitle: 'Token bucket, in practice',
    kicker: 'Entry 06 · 02 / 08 / 26',
    author: 'Aniket Bhavsar',
    tags: ['backend'],
    publishedAt: '2026-08-02T09:00:00Z',
    isBook: true,
    sectionCount: 1,
    blocks: [
      {
        id: 'b1',
        section: 0,
        type: 'heading',
        level: 1,
        text: 'Rate Limiting',
      },
      {
        id: 'b2',
        section: 0,
        type: 'paragraph',
        html: 'Why the sliding window costs more memory than anyone budgets for at the start.',
      },
    ],
  },
  {
    id: 's3',
    slug: 'feed-fan-out',
    title: 'Feed Fan-out',
    subtitle: 'Push, pull, or both',
    kicker: 'Entry 05 · 24 / 07 / 26',
    author: 'Aniket Bhavsar',
    tags: ['scale'],
    publishedAt: '2026-07-24T09:00:00Z',
    isBook: true,
    sectionCount: 1,
    blocks: [
      { id: 'b1', section: 0, type: 'heading', level: 1, text: 'Feed Fan-out' },
      {
        id: 'b2',
        section: 0,
        type: 'paragraph',
        html: 'Celebrity accounts break push fan-out. The hybrid is less clever than it looks.',
      },
    ],
  },
];
