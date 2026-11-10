import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve inquiries' }, { status: 500 });
  }
}
