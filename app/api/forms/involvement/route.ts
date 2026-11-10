import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, role, interests, message } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    const submission = await prisma.involvementSubmission.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        role: role || null,
        interests: interests || null,
        message: message || null,
        status: 'unread',
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Involvement submission error:', error);
    return NextResponse.json(
      { error: 'Failed to record submission' },
      { status: 500 }
    );
  }
}
