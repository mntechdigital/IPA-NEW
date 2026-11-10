import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.newsItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      category,
      date,
      coverImage,
      summary,
      location,
      readTime,
      content,
      relatedTopics,
    } = body;

    if (!title || !slug || !summary) {
      return NextResponse.json({ error: 'Title, slug, and summary are required' }, { status: 400 });
    }

    const created = await prisma.newsItem.create({
      data: {
        title,
        slug,
        category: category || 'News',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        coverImage: coverImage || '',
        summary,
        location: location || null,
        readTime: readTime || '4 min read',
        content: content || [],
        relatedTopics: relatedTopics || [],
      },
    });

    revalidatePath('/news');
    revalidatePath('/');

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create news' }, { status: 500 });
  }
}
