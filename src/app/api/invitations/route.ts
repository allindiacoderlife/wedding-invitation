import { NextRequest, NextResponse } from 'next/server';
import { invitationStore } from '@/lib/invitation-store';

export async function GET() {
  try {
    const invitations = invitationStore.getAllInvitations();
    const metrics = invitationStore.getDashboardMetrics();

    return NextResponse.json({
      success: true,
      data: invitations,
      metrics,
    });
  } catch (error) {
    console.error('Failed to get invitations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve invitations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.templateId || !body.values) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: templateId and values' },
        { status: 400 }
      );
    }

    const created = invitationStore.createInvitation({
      templateId: body.templateId,
      audioTrackId: body.audioTrackId,
      customAudioUrl: body.customAudioUrl,
      values: body.values,
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Invitation successfully created',
    });
  } catch (error) {
    console.error('Failed to create invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}
