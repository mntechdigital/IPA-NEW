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

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role,
        division: body.division,
        bio: body.bio,
        focusAreas: body.focusAreas,
        publicationsCount: body.publicationsCount ? parseInt(body.publicationsCount, 10) : undefined,
        avatar: body.avatar || null,
      },
    });

    revalidatePath('/about');

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath('/about');
    return NextResponse.json({ success: true, message: 'Member deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete member' }, { status: 500 });
  }
}
