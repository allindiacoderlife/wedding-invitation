import { NextRequest, NextResponse } from 'next/server';
import { invitationStore } from '@/lib/invitation-store';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.guestName || !body.guestPhone || !body.attendance) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required RSVP fields: guestName, guestPhone, attendance',
        },
        { status: 400 }
      );
    }

    const rsvp = invitationStore.addRsvp(id, {
      guestName: body.guestName,
      guestPhone: body.guestPhone,
      guestEmail: body.guestEmail,
      attendance: body.attendance,
      guestCount: Number(body.guestCount || 1),
      eventsAttending: body.eventsAttending,
      wishesMessage: body.wishesMessage,
    });

    if (!rsvp) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rsvp,
      message: 'RSVP submitted successfully! The couple has been notified.',
    });
  } catch (error) {
    console.error('Failed to submit RSVP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}
