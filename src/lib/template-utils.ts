import { VideoTemplate, UserCustomizationData } from '@/types/template';

/**
 * Extracts a map of field ID -> initial default value for all scenes in a template
 */
export function getInitialValuesFromTemplate(template: VideoTemplate): Record<string, string> {
  const initialValues: Record<string, string> = {};

  template.scenes.forEach((scene) => {
    scene.fields.forEach((field) => {
      initialValues[field.id] = field.defaultValue || '';
    });
  });

  return initialValues;
}

/**
 * Creates a complete initial UserCustomizationData payload for a template
 */
export function createDefaultCustomization(template: VideoTemplate): UserCustomizationData {
  return {
    templateId: template.id,
    audioTrackId: template.defaultAudio.id,
    values: getInitialValuesFromTemplate(template),
  };
}

/**
 * Validates the user customization values for a given scene or the whole template
 */
export function validateSceneData(
  template: VideoTemplate,
  sceneId: string,
  values: Record<string, string>
): { isValid: boolean; errors: Record<string, string> } {
  const scene = template.scenes.find((s) => s.id === sceneId);
  const errors: Record<string, string> = {};

  if (!scene) {
    return { isValid: false, errors: { scene: 'Scene not found' } };
  }

  scene.fields.forEach((field) => {
    const val = (values[field.id] || '').trim();

    if (field.required && !val) {
      errors[field.id] = `${field.label} is required`;
    } else if (field.maxLength && val.length > field.maxLength) {
      errors[field.id] = `Cannot exceed ${field.maxLength} characters`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculate characters remaining for countdown badge (InviteCrafter style)
 */
export function getRemainingCharacters(maxLength?: number, currentLength: number = 0): number | null {
  if (typeof maxLength !== 'number') return null;
  return Math.max(0, maxLength - currentLength);
}

