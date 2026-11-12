import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.programItem.findUnique({
      where: { id },
    });
    if (!item) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to retrieve program' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const cleanSlug = body.slug !== undefined
      ? (body.slug || body.title || '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : undefined;

    const updated = await prisma.programItem.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title.trim() : undefined,
        slug: cleanSlug,
        subtitle: body.subtitle,
        status: body.status,
        category: body.category,
        description: body.description,
        coverImage: body.coverImage,
        overview: body.overview,
        objectives: body.objectives,
        activities: body.activities,
        targetAudience: body.targetAudience,
        expectedOutcomes: body.expectedOutcomes,
        leadFellow: body.leadFellow,
        order: body.order !== undefined ? Number(body.order) || 0 : undefined,
        published: body.published !== undefined ? Boolean(body.published) : undefined,
      },
    });

    revalidatePath('/programs');
    revalidatePath('/');
    if (updated.slug) revalidatePath(`/programs/${updated.slug}`);

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.programItem.delete({ where: { id } });
    revalidatePath('/programs');
    revalidatePath('/');
    return NextResponse.json({ success: true, message: 'Program deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete program' }, { status: 500 });
  }
}
