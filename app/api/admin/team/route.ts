import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, division, bio, focusAreas, publicationsCount, avatar } = body;

    if (!name || !role || !bio) {
      return NextResponse.json({ error: 'Name, role, and bio are required' }, { status: 400 });
    }

    const created = await prisma.teamMember.create({
      data: {
        name,
        role,
        division: division || 'Research Directorate',
        bio,
        focusAreas: focusAreas || [],
        publicationsCount: publicationsCount ? parseInt(publicationsCount, 10) : 0,
        avatar: avatar || null,
      },
    });

    revalidatePath('/about');

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create member' }, { status: 500 });
  }
}
