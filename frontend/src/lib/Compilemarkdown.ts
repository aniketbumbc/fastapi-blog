import { marked, type Tokens } from 'marked';
import DOMPurify from 'dompurify';
import type { Block } from './types';

// Inline HTML whitelist — matches what BlockRenderer/nb-inline can style.
const ALLOWED_TAGS = ['strong', 'em', 'code', 'mark', 'a'];
const ALLOWED_ATTR = ['href'];

/** ==text== -> <mark>text</mark>. Runs before inline markdown parsing. */
function applyHighlight(md: string): string {
  return md.replace(/==(.+?)==/g, '<mark>$1</mark>');
}

/** Inline markdown -> sanitized HTML (for paragraph/quote/list items). */
function renderInline(md: string): string {
  const html = marked.parseInline(applyHighlight(md)) as string;
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR }).trim();
}

/** Inline markdown -> plain text (for headings, which carry no inline HTML). */
function toPlainText(md: string): string {
  const html = marked.parseInline(md) as string;
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compile a markdown post into the block contract.
 *
 * Section syntax: a line containing only `===` starts a new section (a hard
 * page break). Everything else is standard markdown. This mirrors what the
 * FastAPI backend will do server-side at save time.
 */
export function compileMarkdown(markdown: string): {
  blocks: Block[];
  sectionCount: number;
} {
  const sections = markdown.split(/^[ \t]*===[ \t]*$/m);
  const blocks: Block[] = [];
  let counter = 0;
  const nextId = () => `b${String(++counter).padStart(2, '0')}`;

  sections.forEach((sectionMd, section) => {
    const tokens = marked.lexer(sectionMd);

    for (const token of tokens) {
      switch (token.type) {
        case 'heading': {
          const h = token as Tokens.Heading;
          const level = Math.min(3, Math.max(1, h.depth)) as 1 | 2 | 3;
          blocks.push({
            id: nextId(),
            section,
            type: 'heading',
            level,
            text: toPlainText(h.text),
          });
          break;
        }
        case 'paragraph': {
          const p = token as Tokens.Paragraph;
          blocks.push({
            id: nextId(),
            section,
            type: 'paragraph',
            html: renderInline(p.text),
          });
          break;
        }
        case 'code': {
          const c = token as Tokens.Code;
          blocks.push({
            id: nextId(),
            section,
            type: 'code',
            language: c.lang ?? '',
            code: c.text,
          });
          break;
        }
        case 'list': {
          const l = token as Tokens.List;
          blocks.push({
            id: nextId(),
            section,
            type: 'list',
            ordered: Boolean(l.ordered),
            items: l.items.map((item) => renderInline(item.text)),
          });
          break;
        }
        case 'blockquote': {
          const b = token as Tokens.Blockquote;
          const raw = b.tokens
            .map((t) => ('text' in t ? (t as { text: string }).text : ''))
            .join(' ')
            .trim();
          blocks.push({
            id: nextId(),
            section,
            type: 'quote',
            html: renderInline(raw),
          });
          break;
        }
        default:
          // space, hr, raw html, etc. — ignored in this subset.
          break;
      }
    }
  });

  return { blocks, sectionCount: sections.length };
}
