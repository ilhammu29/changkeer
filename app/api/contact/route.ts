import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import { saveContactMessage } from '@/lib/data/contact';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: getFirstErrorMessage(result.error),
        },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;

    const saveResult = await saveContactMessage(result.data, ip);

    if (!saveResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: saveResult.error || 'Failed to submit message',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received by the CHANGKEER concierge. We will review and reply shortly.',
    });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'A server error occurred. Please try again in a moment.',
      },
      { status: 500 }
    );
  }
}
