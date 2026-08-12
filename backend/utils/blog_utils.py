
import re 
from schemas.blog_schemas import BlogResponse, BlogSummary

def _strip_html(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()


def preview_text(blocks: list[dict], max_len: int = 150) -> str:
    for b in blocks:
        if b.get("type") == "paragraph":
            text = _strip_html(b.get("html", ""))
            return f"{text[:max_len].rstrip()}…" if len(text) > max_len else text
    return ""


def reading_time(blocks: list[dict]) -> str:
    words = 0
    for b in blocks:
        t = b.get("type")
        if t in ("paragraph", "quote"):
            words += len(_strip_html(b.get("html", "")).split())
        elif t == "heading":
            words += len(b.get("text", "").split())
        elif t == "list":
            words += sum(len(_strip_html(i).split()) for i in b.get("items", []))
        elif t == "code":
            words += len(b.get("code", "").split())
    return f"{max(1, round(words / 200))} min read"


def to_summary(blog) -> BlogSummary:
    blocks = blog.blocks or []
    return BlogSummary(
        slug=blog.slug,
        title=blog.title,
        subtitle=blog.subtitle,
        kicker=blog.kicker,
        tags=blog.tags,
        publishedAt=blog.date_posted.isoformat(),
        preview=preview_text(blocks),
        readingTime=reading_time(blocks),
    )


def to_response(blog) -> BlogResponse:
    return BlogResponse(
        id=str(blog.id),
        slug=blog.slug,
        title=blog.title,
        subtitle=blog.subtitle,
        kicker=blog.kicker,
        author=blog.author_name,
        tags=blog.tags,
        publishedAt=blog.date_posted.isoformat(),
        isBook=True,
        sectionCount=blog.section_count,
        blocks=blog.blocks or [],
    )