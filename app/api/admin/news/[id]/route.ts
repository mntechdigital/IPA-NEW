import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.newsItem.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category,
        date: body.date,
        coverImage: body.coverImage,
        summary: body.summary,
        location: body.location || null,
        readTime: body.readTime,
        content: body.content,
        relatedTopics: body.relatedTopics,
        published: body.published ?? true,
      },
    });

    revalidatePath('/news');
    revalidatePath('/');
    if (updated.slug) revalidatePath(`/news/${updated.slug}`);

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.newsItem.delete({ where: { id } });
    revalidatePath('/news');
    revalidatePath('/');
    return NextResponse.json({ success: true, message: 'News deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete news' }, { status: 500 });
  }
}
