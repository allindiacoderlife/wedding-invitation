import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { invitationStore } from '@/lib/invitation-store';
import { getTemplateById, TEMPLATES_CATALOG } from '@/data/templates';
import { GuestInvitationCard } from '@/components/guest/GuestInvitationCard';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const invitations = invitationStore.getAllInvitations();
  return invitations.map((inv) => ({
    id: inv.slug || inv.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const invitation =
    invitationStore.getInvitationById(id) ||
    invitationStore.getInvitationBySlug(id);

  if (!invitation) {
    return {
      title: 'Wedding Invitation | Vaishno Video Vision',
    };
  }

  return {
    title: `${invitation.brideName} & ${invitation.groomName}'s Wedding Invitation | Vaishno Video Vision`,
    description: `You are cordially invited to celebrate the wedding of ${invitation.brideName} & ${invitation.groomName} on ${invitation.weddingDate}.`,
    openGraph: {
      title: `${invitation.brideName} & ${invitation.groomName} are Getting Married!`,
      description: `Save the date: ${invitation.weddingDate} at ${invitation.venueName}.`,
      images: invitation.coverPhotoUrl ? [invitation.coverPhotoUrl] : [],
    },
  };
}

async function GuestInviteContent({ params }: PageProps) {
  const { id } = await params;
  const invitation =
    invitationStore.getInvitationById(id) ||
    invitationStore.getInvitationBySlug(id);

  if (!invitation) {
    notFound();
  }

  // Increment view counter
  invitationStore.incrementViewCount(id);

  const template =
    getTemplateById(invitation.templateId) || TEMPLATES_CATALOG[0];

  return <GuestInvitationCard invitation={invitation} template={template} />;
}

export default function GuestInvitePage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F0F4F7] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#4F7C8F] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GuestInviteContent params={params} />
    </Suspense>
  );
}
