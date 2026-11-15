import fs from 'fs';
import path from 'path';
import {
  InvitationRecord,
  RsvpRecord,
  RenderJob,
  CreateInvitationInput,
  DashboardMetrics,
} from '@/types/invitation';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'invitations_store.json');

interface StoreSchema {
  invitations: InvitationRecord[];
  renderJobs: RenderJob[];
}

const SEED_DATA: StoreSchema = {
  invitations: [
    {
      id: 'inv_royal_001',
      slug: 'ananya-and-rohan',
      templateId: 'royal-rajasthani-wedding',
      title: 'Ananya & Rohan Royal Vivah',
      brideName: 'Ananya',
      groomName: 'Rohan',
      weddingDate: 'Sunday, 15 November 2026',
      venueName: 'The Grand Palace Resort & Spa',
      venueAddress: 'Lake Palace Road, Udaipur, Rajasthan',
      audioTrackId: 'audio-mangal-utsav',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      status: 'published',
      viewCount: 342,
      values: {
        auspiciousMantra: '|| Shree Ganeshay Namah ||',
        invitationHeading: 'Together with their families',
        brideName: 'Ananya',
        brideParents: 'D/o Smt. Sunita & Shri Rajesh Sharma',
        groomName: 'Rohan',
        groomParents: 'S/o Smt. Rekha & Shri Vikram Singhania',
        weddingDate: 'Sunday, 15 November 2026',
        venueName: 'The Grand Palace Resort & Spa',
        venueAddress: 'Lake Palace Road, Udaipur, Rajasthan',
        event1Name: 'Haldi & Mehendi Ceremony',
        event1Time: '14 Nov 2026 • 11:00 AM',
        event2Name: 'Sangeet & Cocktail Evening',
        event2Time: '14 Nov 2026 • 7:30 PM',
        event4Name: 'Grand Wedding Reception & Dinner',
        rsvpContact: 'Sharma & Singhania Family | +91 98765 43210',
      },
      rsvps: [
        {
          id: 'rsvp_01',
          guestName: 'Kunal & Neha Verma',
          guestPhone: '+91 98200 11223',
          guestEmail: 'kunal.verma@example.com',
          attendance: 'attending',
          guestCount: 2,
          eventsAttending: ['Haldi & Mehendi', 'Sangeet', 'Wedding Ceremony', 'Reception'],
          wishesMessage: 'Heartiest congratulations to Ananya & Rohan! Looking forward to dancing at the Sangeet.',
          submittedAt: '2026-11-10T14:20:00Z',
        },
        {
          id: 'rsvp_02',
          guestName: 'Aditya Kapoor',
          guestPhone: '+91 98111 22334',
          attendance: 'attending',
          guestCount: 1,
          eventsAttending: ['Wedding Ceremony', 'Reception'],
          wishesMessage: 'Wishing both of you a lifetime of love and togetherness!',
          submittedAt: '2026-11-12T09:15:00Z',
        },
        {
          id: 'rsvp_03',
          guestName: 'Dr. Shalini Mehta',
          guestPhone: '+91 99888 77665',
          attendance: 'declined',
          guestCount: 0,
          wishesMessage: 'Warmest blessings from London! Regret I will not be able to travel, but sending love.',
          submittedAt: '2026-11-13T11:45:00Z',
        },
      ],
      videoRenderId: 'render_job_101',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-indian-traditional-wedding-setup-43632-large.mp4',
      createdAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-14T12:30:00Z',
    },
    {
      id: 'inv_editorial_002',
      slug: 'camille-and-alexandre',
      templateId: 'french-chateau-editorial',
      title: 'Camille & Alexandre Editorial Story',
      brideName: 'Camille',
      groomName: 'Alexandre',
      weddingDate: 'Saturday, 24 October 2026',
      venueName: 'Château de Villette',
      venueAddress: 'Rue de la Maison Blanche, Condécourt, France',
      audioTrackId: 'audio-din-shagna-da',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      status: 'rendered',
      viewCount: 189,
      values: {
        editorialPoem: 'Two souls, one timeless journey',
        editorialHeadline: 'Camille & Alexandre',
        editorialDateTag: 'Autumn in Provence • 24 . 10 . 2026',
        editorialBrideName: 'Camille',
        editorialGroomName: 'Alexandre',
        editorialDate: 'Saturday, 24 October 2026',
        estateName: 'Château de Villette',
        estateAddress: 'Rue de la Maison Blanche, Condécourt, France',
        rsvpContact: 'vows@camille-alexandre.fr | +33 6 12 34 56 78',
      },
      rsvps: [
        {
          id: 'rsvp_04',
          guestName: 'Marc & Sophie Laurent',
          guestPhone: '+33 6 98 76 54 32',
          guestEmail: 'sophie.laurent@example.com',
          attendance: 'attending',
          guestCount: 2,
          wishesMessage: 'Félicitations! So excited to celebrate this magical weekend with you both.',
          submittedAt: '2026-11-11T16:10:00Z',
        },
      ],
      videoRenderId: 'render_job_102',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-with-flowers-43187-large.mp4',
      createdAt: '2026-11-05T08:30:00Z',
      updatedAt: '2026-11-13T18:00:00Z',
    },
    {
      id: 'inv_floral_003',
      slug: 'priya-and-kabir',
      templateId: 'modern-floral-wedding',
      title: 'Priya & Kabir Modern Floral Celebration',
      brideName: 'Priya',
      groomName: 'Kabir',
      weddingDate: 'Friday, 18 December 2026',
      venueName: 'The Tamarind Tree Heritage Villa',
      venueAddress: 'Avalahalli, Bengaluru, Karnataka',
      audioTrackId: 'audio-romantic-sitar',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      status: 'draft',
      viewCount: 76,
      values: {
        auspiciousMantra: '|| Shree Ganeshay Namah ||',
        brideName: 'Priya',
        groomName: 'Kabir',
        weddingDate: 'Friday, 18 December 2026',
        venueName: 'The Tamarind Tree Heritage Villa',
        venueAddress: 'Avalahalli, Bengaluru, Karnataka',
        event1Name: 'Cocktails & Sunset Sangeet',
        event1Time: '17 Dec 2026 • 6:00 PM',
        rsvpContact: 'Kapoor & Mehra Families | +91 94480 12345',
      },
      rsvps: [],
      createdAt: '2026-11-14T09:00:00Z',
      updatedAt: '2026-11-14T11:15:00Z',
    },
  ],
  renderJobs: [
    {
      id: 'render_job_101',
      invitationId: 'inv_royal_001',
      templateId: 'royal-rajasthani-wedding',
      status: 'completed',
      progress: 100,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-indian-traditional-wedding-setup-43632-large.mp4',
      durationSeconds: 30,
      createdAt: '2026-11-14T12:00:00Z',
      completedAt: '2026-11-14T12:02:15Z',
    },
    {
      id: 'render_job_102',
      invitationId: 'inv_editorial_002',
      templateId: 'french-chateau-editorial',
      status: 'completed',
      progress: 100,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-with-flowers-43187-large.mp4',
      durationSeconds: 28,
      createdAt: '2026-11-13T17:55:00Z',
      completedAt: '2026-11-13T17:57:40Z',
    },
  ],
};

function ensureStoreFile(): StoreSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
      return SEED_DATA;
    }

    const content = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(content) as StoreSchema;
  } catch (err) {
    console.error('Error reading invitation store, returning seed:', err);
    return SEED_DATA;
  }
}

function writeStoreFile(store: StoreSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing invitation store:', err);
  }
}

function generateSlug(brideName: string, groomName: string): string {
  const cleanBride = (brideName || 'bride').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanGroom = (groomName || 'groom').toLowerCase().replace(/[^a-z0-9]/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${cleanBride}-and-${cleanGroom}-${rand}`;
}

/**
 * Repository Operations
 */
export const invitationStore = {
  getAllInvitations(): InvitationRecord[] {
    const store = ensureStoreFile();
    return store.invitations.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getInvitationById(id: string): InvitationRecord | undefined {
    const store = ensureStoreFile();
    return store.invitations.find((item) => item.id === id);
  },

  getInvitationBySlug(slug: string): InvitationRecord | undefined {
    const store = ensureStoreFile();
    return store.invitations.find((item) => item.slug === slug || item.id === slug);
  },

  createInvitation(input: CreateInvitationInput): InvitationRecord {
    const store = ensureStoreFile();
    const now = new Date().toISOString();
    const id = `inv_${Date.now()}`;

    const bride =
      input.values['brideName'] || input.values['editorialBrideName'] || 'Bride';
    const groom =
      input.values['groomName'] || input.values['editorialGroomName'] || 'Groom';
    const weddingDate =
      input.values['weddingDate'] || input.values['editorialDate'] || 'TBD';
    const venueName =
      input.values['venueName'] || input.values['estateName'] || 'Wedding Venue';
    const venueAddress =
      input.values['venueAddress'] || input.values['estateAddress'] || '';
    const coverPhoto =
      input.values['couplePhoto'] ||
      input.values['bridePhoto'] ||
      input.values['editorialPhoto'];

    const newRecord: InvitationRecord = {
      id,
      slug: generateSlug(bride, groom),
      templateId: input.templateId,
      title: `${bride} & ${groom}'s Wedding`,
      brideName: bride,
      groomName: groom,
      weddingDate,
      venueName,
      venueAddress,
      audioTrackId: input.audioTrackId || 'audio-mangal-utsav',
      customAudioUrl: input.customAudioUrl,
      coverPhotoUrl: coverPhoto,
      values: input.values,
      status: 'draft',
      viewCount: 1,
      rsvps: [],
      createdAt: now,
      updatedAt: now,
    };

    store.invitations.unshift(newRecord);
    writeStoreFile(store);
    return newRecord;
  },

  updateInvitation(
    id: string,
    updates: Partial<InvitationRecord>
  ): InvitationRecord | null {
    const store = ensureStoreFile();
    const index = store.invitations.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const existing = store.invitations[index];
    const updated: InvitationRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      values: updates.values ? { ...existing.values, ...updates.values } : existing.values,
    };

    // Keep top-level helper fields in sync if values changed
    if (updates.values) {
      if (updates.values['brideName']) updated.brideName = updates.values['brideName'];
      if (updates.values['groomName']) updated.groomName = updates.values['groomName'];
      if (updates.values['weddingDate']) updated.weddingDate = updates.values['weddingDate'];
      if (updates.values['venueName']) updated.venueName = updates.values['venueName'];
      if (updates.values['venueAddress']) updated.venueAddress = updates.values['venueAddress'];
      if (updates.values['couplePhoto']) updated.coverPhotoUrl = updates.values['couplePhoto'];
    }

    store.invitations[index] = updated;
    writeStoreFile(store);
    return updated;
  },

  deleteInvitation(id: string): boolean {
    const store = ensureStoreFile();
    const initialLen = store.invitations.length;
    store.invitations = store.invitations.filter((i) => i.id !== id);
    if (store.invitations.length !== initialLen) {
      writeStoreFile(store);
      return true;
    }
    return false;
  },

  incrementViewCount(id: string): void {
    const store = ensureStoreFile();
    const inv = store.invitations.find((i) => i.id === id || i.slug === id);
    if (inv) {
      inv.viewCount = (inv.viewCount || 0) + 1;
      writeStoreFile(store);
    }
  },

  addRsvp(invitationId: string, rsvpInput: Omit<RsvpRecord, 'id' | 'submittedAt'>): RsvpRecord | null {
    const store = ensureStoreFile();
    const inv = store.invitations.find((i) => i.id === invitationId || i.slug === invitationId);
    if (!inv) return null;

    const newRsvp: RsvpRecord = {
      ...rsvpInput,
      id: `rsvp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      submittedAt: new Date().toISOString(),
    };

    inv.rsvps.unshift(newRsvp);
    writeStoreFile(store);
    return newRsvp;
  },

  getRenderJob(jobId: string): RenderJob | undefined {
    const store = ensureStoreFile();
    return store.renderJobs.find((j) => j.id === jobId);
  },

  createRenderJob(invitationId: string, templateId: string): RenderJob {
    const store = ensureStoreFile();
    const jobId = `job_${Date.now()}`;
    const newJob: RenderJob = {
      id: jobId,
      invitationId,
      templateId,
      status: 'rendering',
      progress: 15,
      durationSeconds: 30,
      createdAt: new Date().toISOString(),
    };

    store.renderJobs.unshift(newJob);

    // Link to invitation
    const inv = store.invitations.find((i) => i.id === invitationId);
    if (inv) {
      inv.videoRenderId = jobId;
    }

    writeStoreFile(store);
    return newJob;
  },

  updateRenderJob(
    jobId: string,
    updates: Partial<RenderJob>
  ): RenderJob | null {
    const store = ensureStoreFile();
    const job = store.renderJobs.find((j) => j.id === jobId);
    if (!job) return null;

    Object.assign(job, updates);

    // If completed, update invitation status and videoUrl
    if (updates.status === 'completed' && updates.videoUrl) {
      const inv = store.invitations.find((i) => i.id === job.invitationId);
      if (inv) {
        inv.status = 'rendered';
        inv.videoUrl = updates.videoUrl;
      }
    }

    writeStoreFile(store);
    return job;
  },

  getDashboardMetrics(): DashboardMetrics {
    const store = ensureStoreFile();
    const totalInvitations = store.invitations.length;
    const totalViews = store.invitations.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
    const totalRsvps = store.invitations.reduce((acc, curr) => acc + (curr.rsvps?.length || 0), 0);
    const totalRenders = store.renderJobs.filter((j) => j.status === 'completed').length;

    return {
      totalInvitations,
      totalViews,
      totalRsvps,
      totalRenders,
    };
  },
};
