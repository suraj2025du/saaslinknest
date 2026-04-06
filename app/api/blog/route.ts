import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts, users } from '@/lib/schema';
import { eq, and, desc, like, or } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

// Get published posts (public) or all posts (admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const status = searchParams.get('status'); // 'all', 'published', 'draft' - admin only
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single post by slug
    if (slug) {
      const posts = await db
        .select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          coverImage: blogPosts.coverImage,
          authorName: users.name,
          publishedAt: blogPosts.publishedAt,
          tags: blogPosts.tags,
          seoTitle: blogPosts.seoTitle,
          seoDescription: blogPosts.seoDescription,
        })
        .from(blogPosts)
        .leftJoin(users, eq(blogPosts.authorId, users.id))
        .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)))
        .limit(1);

      if (posts.length === 0) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      return NextResponse.json({ post: posts[0] });
    }

    // Check if admin for status filter
    let isAdmin = false;
    const session = await getSession();
    if (session?.userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, session.userId as number),
      });
      isAdmin = user?.role === 'admin';
    }

    // List posts with filters
    // Admin can filter by all/draft/published
    const useAdminFilter = isAdmin && status;

    let whereClause = eq(blogPosts.published, true);

    if (useAdminFilter && status === 'all') {
      // No filter - get all posts
      const posts = await db
        .select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
          excerpt: blogPosts.excerpt,
          content: blogPosts.content,
          coverImage: blogPosts.coverImage,
          published: blogPosts.published,
          authorName: users.name,
          publishedAt: blogPosts.publishedAt,
          tags: blogPosts.tags,
          seoTitle: blogPosts.seoTitle,
          seoDescription: blogPosts.seoDescription,
          createdAt: blogPosts.createdAt,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .leftJoin(users, eq(blogPosts.authorId, users.id))
        .orderBy(desc(blogPosts.updatedAt))
        .limit(limit)
        .offset(offset);

      return NextResponse.json({ posts });
    }

    if (useAdminFilter && status === 'draft') {
      whereClause = eq(blogPosts.published, false);
    }

    if (tag) {
      whereClause = whereClause ? and(whereClause, like(blogPosts.tags, `%"${tag}"%`))! : like(blogPosts.tags, `%"${tag}"%`);
    }

    if (search) {
      const searchCondition = or(
        like(blogPosts.title, `%${search}%`),
        like(blogPosts.excerpt, `%${search}%`)
      )!;
      whereClause = whereClause ? and(whereClause, searchCondition)! : searchCondition;
    }

    const posts = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        coverImage: blogPosts.coverImage,
        published: blogPosts.published,
        authorName: users.name,
        publishedAt: blogPosts.publishedAt,
        tags: blogPosts.tags,
        seoTitle: blogPosts.seoTitle,
        seoDescription: blogPosts.seoDescription,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(whereClause)
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// Create post (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId as number),
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    // SECURITY: Whitelist allowed fields to prevent arbitrary column injection
    const { slug, title, excerpt, content, coverImage, published, tags, seoTitle, seoDescription } = body;
    const allowedFields = { slug, title, excerpt, content, coverImage, published, tags, seoTitle, seoDescription };

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Slug, title, and content are required' },
        { status: 400 }
      );
    }

    const [result] = await db.insert(blogPosts).values({
      slug,
      title,
      excerpt,
      content,
      coverImage,
      authorId: session.userId as number,
      published: published || false,
      publishedAt: published ? new Date() : null,
      tags: tags || [],
      seoTitle,
      seoDescription,
    });

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// Update post (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId as number),
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const body = await req.json();
    await db.update(blogPosts).set(body).where(eq(blogPosts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// Delete post (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId as number),
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
