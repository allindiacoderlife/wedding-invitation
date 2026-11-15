import { VideoTemplate } from '@/types/template';

export interface WeddingVideoProps {
  template: VideoTemplate;
  values: Record<string, string>;
  audioUrl?: string;
  isWatermarked?: boolean;
}

