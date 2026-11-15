/**
 * Wedding Invitation Video Template Schema Definitions
 * Defines the structure for video templates, scenes, fields, customization data, and audio.
 */

export type AspectRatio = '9:16' | '16:9' | '1:1';

export type TemplateCategory = 'wedding' | 'engagement' | 'anniversary' | 'save-the-date';

export type WeddingCulture = 
  | 'traditional-hindu'
  | 'rajasthani'
  | 'punjabi'
  | 'marathi'
  | 'gujarati'
  | 'south-indian'
  | 'bengali'
  | 'modern-minimal'
  | 'muslim-nikah'
  | 'christian-wedding';

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'date'
  | 'time'
  | 'image'
  | 'select';

export interface ImageCropConfig {
  shape: 'circle' | 'square' | 'rect';
  aspectRatio: number; // e.g., 1 for circle/square, 0.8 for 4:5 portrait
  targetWidth: number;
  targetHeight: number;
  minWidth?: number;
  minHeight?: number;
}

export interface TemplateField {
  id: string; // Unique key, e.g., 'brideName', 'brideParents', 'bridePhoto'
  label: string; // Human-friendly label, e.g., 'Bride's Full Name'
  type: FieldType;
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number; // Character counter constraint (like InviteCrafter)
  required?: boolean;
  helpText?: string;
  imageConfig?: ImageCropConfig; // Required if type === 'image'
  options?: { label: string; value: string }[]; // If type === 'select'
}

export interface TemplateScene {
  id: string; // e.g., 'scene-intro', 'scene-bride', 'scene-groom', 'scene-functions', 'scene-venue'
  title: string; // e.g., 'Bride Details', 'Ceremonies & Functions'
  description?: string;
  durationInSeconds: number; // Duration of this scene in the video
  durationInFrames: number; // at 30 fps (e.g., 150 = 5 seconds)
  background: {
    type: 'video' | 'image' | 'color' | 'lottie';
    url?: string;
    overlayColor?: string;
    opacity?: number;
  };
  fields: TemplateField[];
}

export interface AudioTrack {
  id: string;
  title: string;
  category: 'instrumental' | 'traditional' | 'flute' | 'shehnai' | 'romantic' | 'folk';
  url: string;
  durationInSeconds: number;
  previewUrl?: string;
}

export interface VideoTemplate {
  id: string; // Unique slug: e.g. 'royal-rajasthani-wedding'
  title: string;
  description: string;
  category: TemplateCategory;
  culture: WeddingCulture;
  language: string; // 'en', 'hi', 'mr', 'gu', etc.
  aspectRatio: AspectRatio;
  fps: number; // Standard 30 fps
  totalDurationInSeconds: number;
  totalDurationInFrames: number;
  priceInINR: number; // e.g. 199 INR for HD watermark-free
  previewVideoUrl: string; // Sample video for users to watch
  thumbnailUrl: string;
  badge?: 'Popular' | 'Trending' | 'New' | 'Premium';
  tags: string[];
  defaultAudio: AudioTrack;
  availableAudioTracks: AudioTrack[];
  scenes: TemplateScene[];
}

/**
 * The user-submitted customization payload
 */
export interface UserCustomizationData {
  templateId: string;
  audioTrackId: string;
  customAudioUrl?: string; // If user uploaded their own audio
  values: Record<string, string>; // Maps field.id -> user string value or base64 image URL
}

/**
 * Pre-defined Ceremony Event Structure for Indian Weddings
 */
export interface WeddingCeremonyEvent {
  name: string; // Haldi, Mehendi, Sangeet, Mandap, Reception, etc.
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
}

