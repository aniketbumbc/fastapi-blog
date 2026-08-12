from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Blog(Base):
    """Book-style blog post. Separate from Post (which is your markdown blog)."""

    __tablename__ = "blogs"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True)
    title: Mapped[str] = mapped_column(String)
    subtitle: Mapped[str | None] = mapped_column(String, nullable=True)
    kicker: Mapped[str | None] = mapped_column(String, nullable=True)
    author_name: Mapped[str] = mapped_column(String)
    tags: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    section_count: Mapped[int] = mapped_column(Integer, default=1)

    # Raw markdown = editable source of truth; blocks = compiled cache served to
    # the frontend. Both regenerated together on every save.
    markdown: Mapped[str] = mapped_column(Text)
    blocks: Mapped[list] = mapped_column(JSONB)

    date_posted: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    # Optional owner link for auth on the write endpoints later.
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)