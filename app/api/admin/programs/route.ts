import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.programItem.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      subtitle,
      status,
      category,
      description,
      coverImage,
      overview,
      objectives,
      activities,
      targetAudience,
      expectedOutcomes,
      leadFellow,
      order,
      published,
    } = body;

    if (!title || !slug || !description) {
      return NextResponse.json({ error: 'Title, slug, and description are required' }, { status: 400 });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const created = await prisma.programItem.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        subtitle: subtitle || '',
        status: status || 'Ongoing',
        category: category || 'Civic Engagement',
        description,
        coverImage: coverImage || '',
        overview: overview || description,
        objectives: objectives || [],
        activities: activities || [],
        targetAudience: targetAudience || '',
        expectedOutcomes: expectedOutcomes || [],
        leadFellow: leadFellow || '',
        order: typeof order === 'number' ? order : Number(order) || 0,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    revalidatePath('/programs');
    revalidatePath('/');
    if (created.slug) {
      revalidatePath(`/programs/${created.slug}`);
    }

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create program' }, { status: 500 });
  }
}
