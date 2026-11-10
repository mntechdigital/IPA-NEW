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

    const updated = await prisma.campaignItem.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        tagline: body.tagline,
        status: body.status,
        coverImage: body.coverImage,
        introduction: body.introduction,
        whyItMatters: body.whyItMatters,
        objectives: body.objectives,
        coreActions: body.coreActions,
        partnerNetworks: body.partnerNetworks,
        resources: body.resources,
        published: body.published ?? true,
      },
    });

    revalidatePath('/campaigns');
    revalidatePath('/');
    if (updated.slug) revalidatePath(`/campaigns/${updated.slug}`);

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update campaign' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.campaignItem.delete({ where: { id } });
    revalidatePath('/campaigns');
    revalidatePath('/');
    return NextResponse.json({ success: true, message: 'Campaign deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete campaign' }, { status: 500 });
  }
}
