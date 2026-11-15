import { NextRequest, NextResponse } from 'next/server';
import { invitationStore } from '@/lib/invitation-store';

interface RouteContext {
  params: Promise<{
    jobId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { jobId } = await params;
    const job = invitationStore.getRenderJob(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Render job not found' },
        { status: 404 }
      );
    }

    // Advance rendering simulation if currently rendering
    if (job.status === 'rendering') {
      const nextProgress = Math.min(100, job.progress + 25);
      const isComplete = nextProgress >= 100;

      const sampleVideoUrls: Record<string, string> = {
        'royal-rajasthani-wedding':
          'https://assets.mixkit.co/videos/preview/mixkit-indian-traditional-wedding-setup-43632-large.mp4',
        'french-chateau-editorial':
          'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-with-flowers-43187-large.mp4',
        'modern-floral-wedding':
          'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-with-flowers-43187-large.mp4',
      };

      const updated = invitationStore.updateRenderJob(jobId, {
        progress: nextProgress,
        status: isComplete ? 'completed' : 'rendering',
        videoUrl: isComplete
          ? sampleVideoUrls[job.templateId] || sampleVideoUrls['royal-rajasthani-wedding']
          : undefined,
        completedAt: isComplete ? new Date().toISOString() : undefined,
      });

      return NextResponse.json({
        success: true,
        data: updated,
      });
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Failed to get render job status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve render status' },
      { status: 500 }
    );
  }
}
