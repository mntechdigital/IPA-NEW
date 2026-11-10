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

    const updated = await prisma.resourceItem.update({
      where: { id },
      data: {
        title: body.title,
        type: body.type,
        category: body.category,
        date: body.date,
        year: body.year ? parseInt(body.year, 10) : undefined,
        size: body.size,
        description: body.description,
        fileFormat: body.fileFormat,
        downloadUrl: body.downloadUrl || null,
        published: body.published ?? true,
      },
    });

    revalidatePath('/resources');
    revalidatePath('/');

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update resource' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.resourceItem.delete({ where: { id } });
    revalidatePath('/resources');
    revalidatePath('/');
    return NextResponse.json({ success: true, message: 'Resource deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete resource' }, { status: 500 });
  }
}
