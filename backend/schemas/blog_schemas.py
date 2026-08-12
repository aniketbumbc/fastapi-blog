"""Response contract for the book-blog API — mirrors frontend lib/blog/types.ts.

camelCase field names on purpose so the JSON matches what Next.js expects.
"""

from typing import Annotated, Literal, Union

from pydantic import BaseModel, Field


class HeadingBlock(BaseModel):
    id: str
    section: int
    type: Literal["heading"]
    level: int  # 1 | 2 | 3
    text: str


class ParagraphBlock(BaseModel):
    id: str
    section: int
    type: Literal["paragraph"]
    html: str


class CodeBlock(BaseModel):
    id: str
    section: int
    type: Literal["code"]
    language: str
    code: str


class ListBlock(BaseModel):
    id: str
    section: int
    type: Literal["list"]
    ordered: bool
    items: list[str]


class QuoteBlock(BaseModel):
    id: str
    section: int
    type: Literal["quote"]
    html: str


# Discriminated union — validated/serialized by the `type` field.
Block = Annotated[
    Union[HeadingBlock, ParagraphBlock, CodeBlock, ListBlock, QuoteBlock],
    Field(discriminator="type"),
]


class BlogResponse(BaseModel):
    """Full post for the reader route."""

    id: str
    slug: str
    title: str
    subtitle: str | None = None
    kicker: str | None = None
    author: str
    userId: str | None = None
    tags: list[str] | None = None
    publishedAt: str
    isBook: Literal[True] = True
    sectionCount: int
    markdown: str
    blocks: list[Block]


class BlogSummary(BaseModel):
    """Lightweight shape for the homepage feed and /blog index — no blocks."""

    slug: str
    title: str
    subtitle: str | None = None
    kicker: str | None = None
    tags: list[str] | None = None
    publishedAt: str
    preview: str
    readingTime: str


class BlogCreate(BaseModel):
    """Create payload: raw markdown in, compiled to blocks server-side."""

    slug: str
    title: str
    subtitle: str | None = None
    kicker: str | None = None
    author: str
    tags: list[str] | None = None
    markdown: str


class BlogUpdate(BaseModel):
    """Partial edit — only provided fields change. If `markdown` is provided,
    blocks and sectionCount are recompiled server-side."""
 
    slug: str | None = None
    title: str | None = None
    subtitle: str | None = None
    kicker: str | None = None
    author: str | None = None
    tags: list[str] | None = None
    markdown: str | None = None
 