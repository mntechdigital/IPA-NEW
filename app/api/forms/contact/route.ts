import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, organization, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        organization: organization || null,
        subject: subject || 'General Inquiry',
        message,
        status: 'unread',
      },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to record inquiry' },
      { status: 500 }
    );
  }
}
