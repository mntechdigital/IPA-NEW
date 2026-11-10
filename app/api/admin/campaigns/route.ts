import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.campaignItem.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve campaigns' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      tagline,
      status,
      coverImage,
      introduction,
      whyItMatters,
      objectives,
      coreActions,
      partnerNetworks,
      resources,
    } = body;

    if (!title || !slug || !introduction) {
      return NextResponse.json({ error: 'Title, slug, and introduction are required' }, { status: 400 });
    }

    const created = await prisma.campaignItem.create({
      data: {
        title,
        slug,
        tagline: tagline || '',
        status: status || 'Active Campaign',
        coverImage: coverImage || '',
        introduction,
        whyItMatters: whyItMatters || introduction,
        objectives: objectives || [],
        coreActions: coreActions || [],
        partnerNetworks: partnerNetworks || [],
        resources: resources || [],
      },
    });

    revalidatePath('/campaigns');
    revalidatePath('/');

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create campaign' }, { status: 500 });
  }
}
