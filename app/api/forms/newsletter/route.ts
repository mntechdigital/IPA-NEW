import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required.' },
        { status: 400 }
      );
    }

    const sub = await prisma.newsletterSubscription.upsert({
      where: { email },
      update: { status: 'active' },
      create: { email, status: 'active' },
    });

    return NextResponse.json({ success: true, subscriber: sub });
  } catch (error) {
    console.error('Newsletter submission error:', error);
    return NextResponse.json(
      { error: 'Failed to record subscription' },
      { status: 500 }
    );
  }
}
