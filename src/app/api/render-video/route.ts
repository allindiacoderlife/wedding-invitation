import { NextRequest, NextResponse } from 'next/server';
import { invitationStore } from '@/lib/invitation-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invitationId, templateId } = body;

    if (!invitationId || !templateId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: invitationId and templateId' },
        { status: 400 }
      );
    }

    // Create a new render job
    const job = invitationStore.createRenderJob(invitationId, templateId);

    return NextResponse.json({
      success: true,
      data: job,
      message: 'Video rendering queued successfully in 1080p Full HD',
    });
  } catch (error) {
    console.error('Failed to trigger video render:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during render initialization' },
      { status: 500 }
    );
  }
}
