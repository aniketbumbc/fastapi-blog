
import re 
from schemas.blog_schemas import BlogResponse, BlogSummary

def _strip_html(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()


def preview_text(blocks: list[dict], max_len: int = 300) -> str:
    for b in blocks:
        if b.get("type") == "paragraph":
            text = _strip_html(b.get("html", ""))
            return f"{text[:max_len].rstrip()}…" if len(text) > max_len else text
    return ""


def summary_text(blocks: list[dict], max_lines: int = 10) -> str:
    text = " ".join(
        _strip_html(b.get("html", "")) for b in blocks if b.get("type") == "paragraph"
    )
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return " ".join(s for s in sentences[:max_lines] if s)


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


def _avatar_url(blog) -> str | None:
    if blog.user is None:
        return None
    image_path = blog.user.image_path
    return image_path if image_path != "Image not found" else None


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
        summary=summary_text(blocks),
        readingTime=reading_time(blocks),
        author=blog.author_name,
        authorAvatarUrl=_avatar_url(blog),
    )


def to_response(blog) -> BlogResponse:
    return BlogResponse(
        id=str(blog.id),
        slug=blog.slug,
        title=blog.title,
        subtitle=blog.subtitle,
        kicker=blog.kicker,
        author=blog.author_name,
        userId=str(blog.user_id) if blog.user_id is not None else None,
        tags=blog.tags,
        publishedAt=blog.date_posted.isoformat(),
        isBook=True,
        sectionCount=blog.section_count,
        markdown=blog.markdown,
        blocks=blog.blocks or [],
    )