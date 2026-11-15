import { NextRequest, NextResponse } from 'next/server';
import { invitationStore } from '@/lib/invitation-store';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const invitation =
      invitationStore.getInvitationById(id) ||
      invitationStore.getInvitationBySlug(id);

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('Failed to get invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve invitation' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = invitationStore.updateInvitation(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Invitation updated successfully',
    });
  } catch (error) {
    console.error('Failed to update invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invitation' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const deleted = invitationStore.deleteInvitation(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invitation' },
      { status: 500 }
    );
  }
}
