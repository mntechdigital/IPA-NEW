import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: {
        siteName: body.siteName,
        shortName: body.shortName,
        tagline: body.tagline,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        contactAddress: body.contactAddress,
        facebookUrl: body.facebookUrl,
        twitterUrl: body.twitterUrl,
        linkedinUrl: body.linkedinUrl,
        youtubeUrl: body.youtubeUrl,
      },
      create: {
        id: 'default',
        siteName: body.siteName || 'IPA — Institute of Public Affairs',
        shortName: body.shortName || 'IPA',
        tagline: body.tagline || '',
        editorialLead: '',
        mission: '',
        vision: '',
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        contactAddress: body.contactAddress,
        facebookUrl: body.facebookUrl,
        twitterUrl: body.twitterUrl,
        linkedinUrl: body.linkedinUrl,
        youtubeUrl: body.youtubeUrl,
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/contact');
    revalidatePath('/about');

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
