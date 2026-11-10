import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.resourceItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve resources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type, category, date, year, size, description, fileFormat, downloadUrl } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const created = await prisma.resourceItem.create({
      data: {
        title,
        type: type || 'Research Report',
        category: category || 'Media Research',
        date: date || 'October 2026',
        year: year ? parseInt(year, 10) : 2026,
        size: size || '2.0 MB',
        description,
        fileFormat: fileFormat || 'PDF',
        downloadUrl: downloadUrl || null,
        downloadCount: 0,
      },
    });

    revalidatePath('/resources');
    revalidatePath('/');

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create resource' }, { status: 500 });
  }
}
