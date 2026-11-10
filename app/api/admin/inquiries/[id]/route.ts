import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inquiry status' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.contactInquiry.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
