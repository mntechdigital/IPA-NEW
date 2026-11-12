import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.researchItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to get research items:', error);
    return NextResponse.json({ error: 'Failed to retrieve publications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      category,
      type,
      date,
      year,
      featured,
      coverImage,
      pages,
      fileSize,
      doi,
      abstract,
      authors,
      keyFindings,
      executiveSummary,
      methodology,
      discussion,
      recommendations,
      downloadUrl,
    } = body;

    if (!title || !slug || !abstract) {
      return NextResponse.json({ error: 'Title, slug, and abstract are required' }, { status: 400 });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const created = await prisma.researchItem.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        category: category || 'Media Research',
        type: type || 'Research Report',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        year: year ? parseInt(year, 10) : new Date().getFullYear(),
        featured: Boolean(featured),
        coverImage: coverImage || '',
        pages: pages ? parseInt(pages, 10) : 1,
        fileSize: fileSize || '2.0 MB',
        doi: doi || null,
        abstract,
        authors: authors || [],
        keyFindings: keyFindings || [],
        executiveSummary: executiveSummary || null,
        methodology: methodology || null,
        discussion: discussion || null,
        recommendations: recommendations || [],
        downloadUrl: downloadUrl || null,
        published: true,
      },
    });

    revalidatePath('/research');
    revalidatePath('/');

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    console.error('Failed to create research item:', error);
    return NextResponse.json({ error: error.message || 'Failed to create publication' }, { status: 500 });
  }
}
