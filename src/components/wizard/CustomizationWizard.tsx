'use client';

import React, { useState } from 'react';
import { VideoTemplate, UserCustomizationData } from '@/types/template';
import {
  createDefaultCustomization,
  validateSceneData,
} from '@/lib/template-utils';
import { ProgressBar } from './ProgressBar';
import { CharacterCountdownInput } from './CharacterCountdownInput';
import { ImageUploadCropper } from './ImageUploadCropper';
import { AudioSelector } from './AudioSelector';
import { SlidePreviewModal } from './SlidePreviewModal';
import { LiveVideoPlayerModal } from '../video/LiveVideoPlayerModal';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Lock,
  Play,
  Video,
} from 'lucide-react';

interface CustomizationWizardProps {
  template: VideoTemplate;
  onFinish?: (data: UserCustomizationData) => void;
}

export const CustomizationWizard: React.FC<CustomizationWizardProps> = ({
  template,
  onFinish,
}) => {
  const [customization, setCustomization] = useState<UserCustomizationData>(() =>
    createDefaultCustomization(template)
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLivePlayerOpen, setIsLivePlayerOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const totalScenes = template.scenes.length;
  const isAudioReviewStep = currentStepIndex === totalScenes;
  const currentScene = !isAudioReviewStep ? template.scenes[currentStepIndex] : null;

  const handleFieldValueChange = (fieldId: string, val: string) => {
    setCustomization((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [fieldId]: val,
      },
    }));

    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleNext = () => {
    if (currentScene) {
      const validation = validateSceneData(
        template,
        currentScene.id,
        customization.values
      );

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
    }

    setErrors({});
    if (currentStepIndex < totalScenes) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepJump = (idx: number) => {
    setErrors({});
    setCurrentStepIndex(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    setIsRendering(true);
    setTimeout(() => {
      setIsRendering(false);
      setIsSubmitted(true);
      if (onFinish) {
        onFinish(customization);
      }
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Progress Navigation Bar */}
      <ProgressBar
        scenes={template.scenes}
        currentStepIndex={currentStepIndex}
        onStepClick={handleStepJump}
      />

      {/* Main Form Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
        {!isSubmitted ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-sm space-y-8">
            {/* Step Description */}
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{template.title}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {isAudioReviewStep
                  ? 'Select Music & Final Review'
                  : currentScene?.title}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {isAudioReviewStep
                  ? 'Review your wedding invitation details and pick the background audio before rendering.'
                  : currentScene?.description}
              </p>
            </div>

            {/* Step 1 to N: Scene Fields Form */}
            {!isAudioReviewStep && currentScene && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {currentScene.fields.map((field) => {
                    if (field.type === 'image') {
                      return (
                        <ImageUploadCropper
                          key={field.id}
                          id={field.id}
                          label={field.label}
                          value={customization.values[field.id]}
                          config={field.imageConfig}
                          required={field.required}
                          helpText={field.helpText}
                          error={errors[field.id]}
                          onChange={(base64) =>
                            handleFieldValueChange(field.id, base64)
                          }
                        />
                      );
                    }

                    return (
                      <CharacterCountdownInput
                        key={field.id}
                        id={field.id}
                        label={field.label}
                        value={customization.values[field.id] || ''}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        required={field.required}
                        helpText={field.helpText}
                        error={errors[field.id]}
                        onChange={(val) =>
                          handleFieldValueChange(field.id, val)
                        }
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Final Step: Audio & Summary Review */}
            {isAudioReviewStep && (
              <div className="space-y-8">
                {/* Audio Selector */}
                <AudioSelector
                  availableTracks={template.availableAudioTracks}
                  selectedTrackId={customization.audioTrackId}
                  customAudioUrl={customization.customAudioUrl}
                  onSelectTrack={(trackId, customUrl) => {
                    setCustomization((prev) => ({
                      ...prev,
                      audioTrackId: trackId,
                      customAudioUrl: customUrl,
                    }));
                  }}
                />

                {/* Pricing & Download Options (InviteCrafter model) */}
                <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-4">
                  <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200">
                    Video Generation & Quality Options
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          Standard Preview
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          Free
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Includes subtle watermark for draft preview and test sharing with family.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-rose-500/10 border-2 border-amber-500 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-amber-950 dark:text-amber-200">
                          Full HD 1080p
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500 text-white">
                          ₹{template.priceInINR}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">
                        Crystal clear 1080p resolution, no watermarks, ready for WhatsApp and Instagram.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}

                {!isAudioReviewStep && currentScene && (
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-950/50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Slide Preview
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsLivePlayerOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-rose-500/10 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold hover:bg-amber-500/20 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Live Video
                </button>
              </div>

              <div className="w-full sm:w-auto">
                {!isAudioReviewStep ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 hover:opacity-95 flex items-center justify-center gap-2 transition-opacity"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isRendering}
                    onClick={handleSubmit}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/25 hover:opacity-95 flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
                  >
                    {isRendering ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Queueing Render...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Generate & Render Video
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Render Queued / Complete Success View */
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 shadow-sm text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Invitation Video Queued!
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Your wedding video for <strong className="text-amber-600">{customization.values['brideName'] || 'Bride'} & {customization.values['groomName'] || 'Groom'}</strong> is being composited with background music.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-left text-xs space-y-2">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Template:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{template.title}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Estimated Render Time:</span>
                <span className="font-semibold text-emerald-600">2 - 3 minutes</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Resolution:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">1080 x 1920 Full HD (9:16)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out our wedding invitation video for ${customization.values['brideName']} & ${customization.values['groomName']}!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share on WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Edit Details Again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Instant Slide Preview Modal */}
      {currentScene && (
        <SlidePreviewModal
          isOpen={isPreviewOpen}
          scene={currentScene}
          values={customization.values}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {/* Live 60fps Video Player Modal */}
      <LiveVideoPlayerModal
        isOpen={isLivePlayerOpen}
        template={template}
        values={customization.values}
        audioUrl={customization.customAudioUrl}
        isWatermarked={true}
        onClose={() => setIsLivePlayerOpen(false)}
      />
    </div>
  );
};

