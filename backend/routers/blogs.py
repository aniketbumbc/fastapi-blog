from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from auth import CurrentUser

from database import get_db
from models.blog_model import Blog
from schemas.blog_schemas import BlogResponse, BlogSummary, BlogStats, BlogCreate, BlogUpdate
from utils.blog_utils import to_response, to_summary
from utils.blog_compiler import compile_markdown

router = APIRouter(
    prefix="/api/blogs",
    tags=["Blogs"],
)


# GET /api/blogs/ — summaries for the homepage feed and /blog index (no blocks)
@router.get("/", response_model=list[BlogSummary], status_code=status.HTTP_200_OK)
async def list_blogs(
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    result = await db.execute(
        select(Blog)
        .options(selectinload(Blog.user))
        .order_by(Blog.date_posted.desc())
        .offset(skip)
        .limit(limit)
    )
    blogs = result.scalars().all()
    return [to_summary(b) for b in blogs]


# GET /api/blogs/stats — total post count + year of the earliest post, for the homepage hero
@router.get("/stats", response_model=BlogStats, status_code=status.HTTP_200_OK)
async def get_blog_stats(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(func.count(Blog.id), func.min(Blog.date_posted))
    )
    total, earliest = result.one()
    return BlogStats(total=total, since=earliest.year if earliest else None)


# GET /api/blogs/{slug} — the full post for the reader route
@router.get("/{slug}", response_model=BlogResponse, status_code=status.HTTP_200_OK)
async def get_blog(slug: str, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(Blog).where(Blog.slug == slug))
    blog = result.scalar_one_or_none()

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog '{slug}' not found",
        )

    return to_response(blog)


# POST /api/blogs/ — create a post: raw markdown in, compiled to blocks + stored
@router.post("/", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
async def create_blog(
    payload: BlogCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # Slugs are unique — reject a collision rather than silently overwriting.
    existing = await db.execute(select(Blog).where(Blog.slug == payload.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Blog '{payload.slug}' already exists",
        )
 
    blocks, section_count = compile_markdown(payload.markdown)
 
    blog = Blog(
        slug=payload.slug,
        title=payload.title,
        subtitle=payload.subtitle,
        kicker=payload.kicker,
        author_name=payload.author,
        tags=payload.tags,
        section_count=section_count,
        markdown=payload.markdown,   # source of truth
        blocks=blocks,               # compiled cache served to the frontend
        user_id=current_user.id,
    )
 
    db.add(blog)
    await db.commit()
    await db.refresh(blog)
 
    return to_response(blog)


# PUT /api/blogs/{slug} — partial edit. Recompiles blocks if markdown changes.
@router.put("/{slug}", response_model=BlogResponse, status_code=status.HTTP_200_OK)
async def update_blog(
    slug: str,
    payload: BlogUpdate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(select(Blog).where(Blog.slug == slug))
    blog = result.scalar_one_or_none()
 
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog '{slug}' not found",
        )
 
    if blog.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this blog",
        )
 
    data = payload.model_dump(exclude_unset=True)
 
    # If the slug is being changed, make sure the new one is free.
    new_slug = data.get("slug")
    if new_slug and new_slug != blog.slug:
        clash = await db.execute(select(Blog).where(Blog.slug == new_slug))
        if clash.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Blog '{new_slug}' already exists",
            )
 
    # Map `author` -> author_name; everything else maps 1:1.
    if "author" in data:
        blog.author_name = data.pop("author")
 
    for field, value in data.items():
        setattr(blog, field, value)
 
    # Recompile only when the markdown actually changed.
    if "markdown" in data:
        blocks, section_count = compile_markdown(data["markdown"])
        blog.blocks = blocks
        blog.section_count = section_count
 
    await db.commit()
    await db.refresh(blog)
 
    return to_response(blog)


 
# DELETE /api/blogs/{slug} — remove a post (owner only). 204, no body.
@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(
    slug: str,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(select(Blog).where(Blog.slug == slug))
    blog = result.scalar_one_or_none()
 
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog '{slug}' not found",
        )
 
    if blog.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this blog",
        )
 
    await db.delete(blog)
    await db.commit()
    return None
 