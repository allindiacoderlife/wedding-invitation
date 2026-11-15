import { VideoTemplate } from '@/types/template';
import { ROYAL_RAJASTHANI_TEMPLATE } from './royal-rajasthani';
import { MODERN_FLORAL_TEMPLATE } from './modern-floral';
import { FRENCH_CHATEAU_EDITORIAL_TEMPLATE } from './french-chateau-editorial';

export const TEMPLATES_CATALOG: VideoTemplate[] = [
  FRENCH_CHATEAU_EDITORIAL_TEMPLATE,
  ROYAL_RAJASTHANI_TEMPLATE,
  MODERN_FLORAL_TEMPLATE,
];

export function getTemplateById(id: string): VideoTemplate | undefined {
  return TEMPLATES_CATALOG.find((template) => template.id === id);
}

export function getAllTemplates(): VideoTemplate[] {
  return TEMPLATES_CATALOG;
}
