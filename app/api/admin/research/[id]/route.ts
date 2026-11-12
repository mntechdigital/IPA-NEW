import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.researchItem.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!item) return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve publication' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.researchItem.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!existing) return NextResponse.json({ error: 'Publication not found' }, { status: 404 });

    const cleanSlug = body.slug !== undefined
      ? (body.slug || body.title || '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : undefined;

    const updated = await prisma.researchItem.update({
      where: { id: existing.id },
      data: {
        title: body.title !== undefined ? body.title.trim() : undefined,
        slug: cleanSlug,
        category: body.category,
        type: body.type,
        date: body.date,
        year: body.year ? parseInt(body.year, 10) : undefined,
        featured: Boolean(body.featured),
        coverImage: body.coverImage !== undefined ? (body.coverImage || '') : undefined,
        pages: body.pages ? parseInt(body.pages, 10) : undefined,
        fileSize: body.fileSize,
        doi: body.doi || null,
        abstract: body.abstract,
        authors: body.authors,
        keyFindings: body.keyFindings,
        executiveSummary: body.executiveSummary || null,
        methodology: body.methodology || null,
        discussion: body.discussion || null,
        recommendations: body.recommendations,
        downloadUrl: body.downloadUrl || null,
        published: body.published ?? true,
      },
    });

    revalidatePath('/research');
    revalidatePath('/');
    if (updated.slug) revalidatePath(`/research/${updated.slug}`);
    if (existing.slug && existing.slug !== updated.slug) revalidatePath(`/research/${existing.slug}`);

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update publication' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.researchItem.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!existing) return NextResponse.json({ error: 'Publication not found' }, { status: 404 });

    await prisma.researchItem.delete({ where: { id: existing.id } });
    revalidatePath('/research');
    revalidatePath('/');
    if (existing.slug) revalidatePath(`/research/${existing.slug}`);
    return NextResponse.json({ success: true, message: 'Publication deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete publication' }, { status: 500 });
  }
}
