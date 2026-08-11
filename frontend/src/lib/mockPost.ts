import type { Post } from './types';

// The fake FastAPI response. Nothing else in the frontend knows this is mock.
// When the backend is ready, it returns this exact shape and this file is
// swapped for a fetch — the reading experience doesn't change.

export const mockPost: Post = {
  slug: 'the-read-path',
  id: '1',
  title: 'The Read Path Test',
  subtitle: 'Where 99% of the traffic actually goes',
  kicker: 'System Design · Entry 07',
  author: 'Aniket Bhavsar',
  publishedAt: '2026-08-01T09:00:00Z',
  isBook: true,
  sectionCount: 2,
  blocks: [
    // ===== Section 0 — The Read Path =====
    {
      id: 'b01',
      section: 0,
      type: 'heading',
      level: 1,
      text: 'The Read Path Test',
    },
    {
      id: 'b02',
      section: 0,
      type: 'paragraph',
      html: 'Every redirect is one lookup. Make that lookup cheap, and the whole system stays fast under load. Make it expensive, and no amount of horizontal scaling saves you.',
    },
    {
      id: 'b03',
      section: 0,
      type: 'paragraph',
      html: 'A redirect only needs one thing: the long URL for a given key. So keep the hot keys in <strong>memory</strong> and the database out of the critical path. The database is the source of truth, not the thing you hit on every request.',
    },
    {
      id: 'b04',
      section: 0,
      type: 'paragraph',
      html: 'In practice the flow is a single cache read that almost always hits. <mark>Cache hit ratio is the metric that matters most here</mark> — everything else is a consequence of it.',
    },
    {
      id: 'b05',
      section: 0,
      type: 'heading',
      level: 2,
      text: 'The request, step by step',
    },
    {
      id: 'b06',
      section: 0,
      type: 'code',
      language: 'bash',
      code: 'GET /aX9kP2q\n# 1. look up "aX9kP2q" in Redis (LRU)\n# 2. hit  -> return 301 to the long URL\n# 3. miss -> read from KV store, warm the cache, then return',
    },
    {
      id: 'b07',
      section: 0,
      type: 'list',
      ordered: true,
      items: [
        'Client requests the short key.',
        'Redirect service checks the in-memory cache first.',
        'On a hit, respond immediately with a redirect.',
        'On a miss, fall back to the key-value store and repopulate the cache.',
      ],
    },
    {
      id: 'b08',
      section: 0,
      type: 'heading',
      level: 2,
      text: 'Trade-offs to mention',
    },
    {
      id: 'b09',
      section: 0,
      type: 'list',
      ordered: false,
      items: [
        '<strong>301 vs 302</strong> — 301 caches in the browser, which kills your analytics. 302 keeps every hit coming back to you.',
        '<strong>LRU eviction</strong> — roughly 20% of keys serve most of the traffic, so a modest cache covers the long tail well.',
        '<strong>SQL vs KV store</strong> — no joins are needed for a key lookup, so a KV store wins on both latency and cost.',
      ],
    },

    // ===== Section 1 — The Write Path =====
    {
      id: 'b10',
      section: 1,
      type: 'heading',
      level: 1,
      text: 'The Write Path',
    },
    {
      id: 'b11',
      section: 1,
      type: 'paragraph',
      html: 'Writes are rarer and can afford to be slower. The job is to turn a long URL into a short, unique, collision-free key and persist it durably before anyone tries to read it back.',
    },
    {
      id: 'b12',
      section: 1,
      type: 'list',
      ordered: true,
      items: [
        'A long URL comes in.',
        'An ID service issues a unique number and base62-encodes it.',
        'The result is a short 7-character key.',
        'Persist the key-to-URL mapping in the source-of-truth store.',
      ],
    },
    {
      id: 'b13',
      section: 1,
      type: 'paragraph',
      html: 'Using a counter plus base62 avoids the birthday-collision problem you get from hashing and truncating. You never have to retry on a collision because the ID service hands out each number exactly once.',
    },
    {
      id: 'b14',
      section: 1,
      type: 'quote',
      html: 'Writes need consistency; reads need speed. Design each path separately and don\u2019t let one\u2019s constraints leak into the other.',
    },
  ],
};

// Second mock post \u2014 used to preview the two-page BookSpread layout
// (bookpost/BookSpread.tsx) without touching the mockPost above.
export const mockSpreadPost: Post = {
  slug: 'the-cache-eviction-story',
  id: '2',
  title: 'The Cache Eviction Story',
  subtitle: 'What happens when the hot set stops fitting',
  kicker: 'System Design \u00b7 Entry 08',
  author: 'Aniket Bhavsar',
  publishedAt: '2026-08-10T09:00:00Z',
  isBook: true,
  sectionCount: 2,
  blocks: [
    // ===== Section 0 \u2014 left page =====
    {
      id: 's01',
      section: 0,
      type: 'heading',
      level: 1,
      text: 'The Cache Eviction Story',
    },
    {
      id: 's02',
      section: 0,
      type: 'paragraph',
      html: 'A cache is only as good as what it chooses to forget. Once the hot set outgrows memory, <strong>eviction policy</strong> becomes the whole ballgame.',
    },
    {
      id: 's03',
      section: 0,
      type: 'list',
      ordered: false,
      items: [
        '<strong>LRU</strong> \u2014 evict the least recently used key. Cheap, works well for skewed access patterns.',
        '<strong>LFU</strong> \u2014 evict the least frequently used key. Better for long-lived hot keys, costlier to track.',
        '<strong>TTL</strong> \u2014 expire on a timer regardless of access. Simple, but can evict hot data early.',
      ],
    },
    {
      id: 's04',
      section: 0,
      type: 'quote',
      html: 'Every eviction policy is a bet about what tomorrow\u2019s traffic will look like.',
    },
    // ===== Section 1 \u2014 right page =====
    {
      id: 's05',
      section: 1,
      type: 'heading',
      level: 1,
      text: 'Thundering Herd',
    },
    {
      id: 's06',
      section: 1,
      type: 'paragraph',
      html: 'When a hot key expires, every waiting request misses at once and slams the database in parallel. <mark>One eviction turns into thousands of duplicate reads.</mark>',
    },
    {
      id: 's07',
      section: 1,
      type: 'code',
      language: 'bash',
      code: '# request coalescing: only the first miss hits the DB\nlock(key)\nif not cache.has(key):\n    value = db.read(key)\n    cache.set(key, value)\nunlock(key)',
    },
    {
      id: 's08',
      section: 1,
      type: 'paragraph',
      html: 'Coalescing concurrent misses onto a single database read keeps eviction cheap even under load.',
    },
  ],
};
