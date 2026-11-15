export interface RsvpRecord {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  attendance: 'attending' | 'declined' | 'tentative';
  guestCount: number;
  eventsAttending?: string[];
  wishesMessage?: string;
  submittedAt: string;
}

export interface RenderJob {
  id: string;
  invitationId: string;
  templateId: string;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  durationSeconds: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface InvitationRecord {
  id: string;
  slug: string;
  templateId: string;
  title: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  audioTrackId: string;
  customAudioUrl?: string;
  coverPhotoUrl?: string;
  values: Record<string, string>;
  status: 'draft' | 'published' | 'rendered';
  viewCount: number;
  rsvps: RsvpRecord[];
  videoRenderId?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationInput {
  templateId: string;
  audioTrackId?: string;
  customAudioUrl?: string;
  values: Record<string, string>;
}

export interface DashboardMetrics {
  totalInvitations: number;
  totalViews: number;
  totalRsvps: number;
  totalRenders: number;
}
