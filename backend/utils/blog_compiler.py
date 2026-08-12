"""Markdown -> blocks compiler. Server port of the frontend compile-markdown.ts.

Section syntax: a line containing only `===` starts a new section (hard page
break). Inline formatting (**bold**, *em*, `code`, [links], ==highlight==) is
rendered to sanitized HTML; block structure stays typed.
"""

import html as _html
import re

import mistune
import nh3

# mistune AST mode (renderer=None) + the `mark` plugin for ==highlight==.
_md = mistune.create_markdown(renderer=None, plugins=["mark"])

_ALLOWED_TAGS = {"strong", "em", "code", "mark", "a"}
_ALLOWED_ATTRS = {"a": {"href"}}


def _esc(text: str) -> str:
    return _html.escape(text, quote=True)


def _inline(nodes: list[dict]) -> str:
    """Render inline AST nodes to a whitelist of HTML tags."""
    parts: list[str] = []
    for n in nodes:
        t = n.get("type")
        if t == "text":
            parts.append(_esc(n.get("raw", "")))
        elif t == "strong":
            parts.append(f"<strong>{_inline(n.get('children', []))}</strong>")
        elif t == "emphasis":
            parts.append(f"<em>{_inline(n.get('children', []))}</em>")
        elif t == "codespan":
            parts.append(f"<code>{_esc(n.get('raw', ''))}</code>")
        elif t == "mark":
            parts.append(f"<mark>{_inline(n.get('children', []))}</mark>")
        elif t == "link":
            url = _esc(n.get("attrs", {}).get("url", ""))
            parts.append(f'<a href="{url}">{_inline(n.get("children", []))}</a>')
        elif t in ("softbreak", "linebreak"):
            parts.append(" ")
        elif "children" in n:
            parts.append(_inline(n["children"]))
        elif "raw" in n:
            parts.append(_esc(n["raw"]))
    return "".join(parts)


def _plain(nodes: list[dict]) -> str:
    """Flatten inline nodes to plain text (for headings)."""
    out: list[str] = []
    for n in nodes:
        if "children" in n:
            out.append(_plain(n["children"]))
        elif "raw" in n:
            out.append(n["raw"])
    return "".join(out)


def _sanitize(markup: str) -> str:
    return nh3.clean(markup, tags=_ALLOWED_TAGS, attributes=_ALLOWED_ATTRS).strip()


def _item_inline(item: dict) -> str:
    for child in item.get("children", []):
        if child.get("type") in ("block_text", "paragraph"):
            return _inline(child.get("children", []))
    return ""


def _quote_inline(node: dict) -> str:
    texts = [
        _inline(child.get("children", []))
        for child in node.get("children", [])
        if child.get("type") == "paragraph"
    ]
    return " ".join(texts).strip()


def compile_markdown(markdown: str) -> tuple[list[dict], int]:
    """Return (blocks, section_count)."""
    sections = re.split(r"^[ \t]*===[ \t]*$", markdown, flags=re.MULTILINE)
    blocks: list[dict] = []
    counter = 0

    def next_id() -> str:
        nonlocal counter
        counter += 1
        return f"b{counter:02d}"

    for section, text in enumerate(sections):
        for tok in _md(text):
            typ = tok.get("type")
            if typ == "heading":
                level = min(3, max(1, tok["attrs"]["level"]))
                blocks.append({
                    "id": next_id(),
                    "section": section,
                    "type": "heading",
                    "level": level,
                    "text": _plain(tok.get("children", [])).strip(),
                })
            elif typ == "paragraph":
                blocks.append({
                    "id": next_id(),
                    "section": section,
                    "type": "paragraph",
                    "html": _sanitize(_inline(tok.get("children", []))),
                })
            elif typ == "block_code":
                lang = (tok.get("attrs", {}).get("info") or "").strip()
                blocks.append({
                    "id": next_id(),
                    "section": section,
                    "type": "code",
                    "language": lang,
                    "code": tok.get("raw", "").rstrip("\n"),
                })
            elif typ == "list":
                blocks.append({
                    "id": next_id(),
                    "section": section,
                    "type": "list",
                    "ordered": bool(tok.get("attrs", {}).get("ordered")),
                    "items": [_sanitize(_item_inline(it)) for it in tok.get("children", [])],
                })
            elif typ == "block_quote":
                blocks.append({
                    "id": next_id(),
                    "section": section,
                    "type": "quote",
                    "html": _sanitize(_quote_inline(tok)),
                })
            # blank_line, thematic_break, raw html, etc. are ignored.

    return blocks, len(sections)