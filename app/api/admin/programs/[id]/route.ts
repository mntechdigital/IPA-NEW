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

    const updated = await prisma.programItem.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
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
        published: body.published ?? true,
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
