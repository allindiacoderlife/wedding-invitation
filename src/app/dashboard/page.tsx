import React, { Suspense } from 'react';
import { invitationStore } from '@/lib/invitation-store';
import { DashboardView } from '@/components/dashboard/DashboardView';

export const metadata = {
  title: 'Dashboard | Vaishno Video Vision',
  description: 'Manage wedding video invitations, track guest RSVPs, and export 1080p Full HD video invitations.',
};

function DashboardContent() {
  const invitations = invitationStore.getAllInvitations();
  const metrics = invitationStore.getDashboardMetrics();

  return <DashboardView initialInvitations={invitations} initialMetrics={metrics} />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F7F9] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#4F7C8F] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
