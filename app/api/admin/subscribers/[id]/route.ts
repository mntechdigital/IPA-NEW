import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.newsletterSubscription.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Subscriber deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
