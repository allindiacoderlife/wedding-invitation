'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VideoTemplate, UserCustomizationData } from '@/types/template';
import {
  createDefaultCustomization,
  validateSceneData,
  getRemainingCharacters,
} from '@/lib/template-utils';
import { ImageUploadCropper } from './ImageUploadCropper';
import { AudioSelector } from './AudioSelector';
import { LiveVideoPlayerModal } from '../video/LiveVideoPlayerModal';
import { CustomCursor } from '@/components/gsap/CustomCursor';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Sparkles,
  Check,
  Share2,
  Camera,
  Heart,
  Volume2,
} from 'lucide-react';

interface EditorialFormWizardProps {
  template: VideoTemplate;
  onFinish?: (data: UserCustomizationData) => void;
}

export const EditorialFormWizard: React.FC<EditorialFormWizardProps> = ({
  template,
  onFinish,
}) => {
  const [customization, setCustomization] = useState<UserCustomizationData>(() =>
    createDefaultCustomization(template)
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const handleSubmit = () => {
    setIsRendering(true);
    setTimeout(() => {
      setIsRendering(false);
      setIsSubmitted(true);
      if (onFinish) {
        onFinish(customization);
      }
    }, 1200);
  };

  // Preview values extractors for live left card
  const displayCouple =
    customization.values['editorialHeadline'] ||
    customization.values['coupleNames'] ||
    (customization.values['brideName'] && customization.values['groomName']
      ? `${customization.values['brideName']} & ${customization.values['groomName']}`
      : customization.values['brideName'] || 'Camille & Alexandre');

  const displaySubtitle =
    customization.values['editorialPoem'] ||
    customization.values['invitationHeading'] ||
    customization.values['tagline'] ||
    'Two souls, one timeless journey';

  const displayDate =
    customization.values['editorialDateTag'] ||
    customization.values['weddingDate'] ||
    customization.values['weddingDateBrief'] ||
    'Autumn in Provence • 24 . 10 . 2026';

  const photoValue =
    customization.values['editorialPhoto'] ||
    customization.values['couplePhoto'] ||
    customization.values['bridePhoto'] ||
    customization.values['groomPhoto'];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#121212] selection:bg-[#C5A880]/30 selection:text-black flex flex-col font-sans">
      <CustomCursor />

      {/* TOP LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-zinc-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </Link>

          <div className="text-center">
            <span className="font-editorial text-xl sm:text-2xl italic tracking-wide text-[#121212]">
              Marie &amp; Co.
            </span>
            <span className="block text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-sans">
              Bespoke Invitation Studio
            </span>
          </div>

          <button
            onClick={() => setIsLivePlayerOpen(true)}
            className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-black/85 text-[11px] uppercase tracking-[0.2em] font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-105"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Watch Motion</span>
          </button>
        </div>
      </header>

      {/* PROGRESS STEP BAR (Marie Guillaume Refined Aesthetic) */}
      <div className="border-b border-black/10 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            {template.scenes.map((scene, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;

              return (
                <button
                  key={scene.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-all whitespace-nowrap ${isCurrent
                      ? 'text-black font-bold border-b-2 border-black pb-1'
                      : isDone
                        ? 'text-zinc-700 font-medium hover:text-black'
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-sans ${isCurrent
                        ? 'bg-black text-white'
                        : isDone
                          ? 'bg-zinc-200 text-zinc-700'
                          : 'border border-black/20 text-zinc-400'
                      }`}
                  >
                    {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </span>
                  <span>{scene.title}</span>
                </button>
              );
            })}

            {/* Audio Step */}
            <button
              onClick={() => setCurrentStepIndex(totalScenes)}
              className={`flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-all whitespace-nowrap ${isAudioReviewStep
                  ? 'text-black font-bold border-b-2 border-black pb-1'
                  : 'text-zinc-400 hover:text-zinc-600'
                }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-sans ${isAudioReviewStep
                    ? 'bg-black text-white'
                    : 'border border-black/20 text-zinc-400'
                  }`}
              >
                {totalScenes + 1}
              </span>
              <span>Audio &amp; Review</span>
            </button>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-sans tracking-widest uppercase text-zinc-400">
              Step {currentStepIndex + 1} / {totalScenes + 1}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT-SCREEN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10">
        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT COLUMN: LIVE VISUAL PREVIEW MOCKUP (Sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col items-center">
              <div className="w-full max-w-sm rounded-none bg-white p-6 shadow-2xl border border-black/10 relative overflow-hidden flex flex-col items-center text-center justify-between aspect-[9/16]">
                {/* Background wash */}
                {currentScene?.background.url && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${currentScene.background.url})` }}
                  />
                )}

                {/* Delicate Outer Border */}
                <div className="absolute inset-4 border border-black/10 pointer-events-none p-3 flex flex-col justify-between text-[9px] uppercase tracking-widest text-zinc-400">
                  <div className="flex justify-between">
                    <span>N° 0{currentStepIndex + 1}</span>
                    <span>STUDIO</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HAUTE COUTURE</span>
                    <span>2026</span>
                  </div>
                </div>

                {/* Top Quote */}
                <div className="relative z-10 pt-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] font-sans text-zinc-500 max-w-[200px]">
                    {displaySubtitle}
                  </p>
                </div>

                {/* Center Content */}
                <div className="relative z-10 my-auto space-y-3 flex flex-col items-center">
                  {photoValue ? (
                    <div className="w-28 h-36 bg-white p-1.5 shadow-lg border border-black/10 transform -rotate-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoValue}
                        alt="Portrait"
                        className="w-full h-full object-cover filter contrast-[1.02]"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full border border-black/20 flex items-center justify-center text-2xl font-editorial italic">
                      &amp;
                    </div>
                  )}

                  <h3 className="font-editorial text-2xl sm:text-3xl font-normal leading-tight text-zinc-900 px-2">
                    {displayCouple}
                  </h3>

                  <div className="w-12 h-[0.5px] bg-black/20 mx-auto" />
                </div>

                {/* Bottom Date / Venue */}
                <div className="relative z-10 pb-6 space-y-1">
                  <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-zinc-700">
                    {displayDate}
                  </p>
                  <p className="text-[9px] font-editorial italic text-zinc-400">
                    Bespoke Video Invitation Preview
                  </p>
                </div>

                {/* Play Button Overlay */}
                <button
                  type="button"
                  onClick={() => setIsLivePlayerOpen(true)}
                  className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  title="Watch Full Motion Video"
                >
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </button>
              </div>

              <p className="text-[11px] font-editorial italic text-zinc-500 mt-3 text-center">
                ✦ Updates live in real time as you fill out the details.
              </p>
            </div>

            {/* RIGHT COLUMN: REFINED MULTI-STEP EDITORIAL FORM */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12 shadow-xl border border-black/10 space-y-8 rounded-none">
              {/* Form Step Header */}
              <div className="border-b border-black/10 pb-6 space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-zinc-400 font-semibold">
                  {template.title}
                </span>
                <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-zinc-900">
                  {isAudioReviewStep
                    ? 'Soundtrack & Final Composition'
                    : currentScene?.title}
                </h1>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                  {isAudioReviewStep
                    ? 'Select your accompanying musical piece and review your video composition before rendering.'
                    : currentScene?.description}
                </p>
              </div>

              {/* Dynamic Step Fields */}
              {!isAudioReviewStep && currentScene && (
                <div className="space-y-6">
                  {currentScene.fields.map((field) => {
                    const value = customization.values[field.id] || '';
                    const remaining = getRemainingCharacters(field.maxLength, value.length);

                    if (field.type === 'image') {
                      return (
                        <div key={field.id} className="space-y-2 pt-2">
                          <label className="text-xs font-sans uppercase tracking-[0.15em] font-semibold text-zinc-700 flex items-center gap-1.5">
                            {field.label}
                            {field.required && <span className="text-rose-500">*</span>}
                          </label>
                          <ImageUploadCropper
                            id={field.id}
                            label=""
                            value={value}
                            config={field.imageConfig}
                            helpText={field.helpText}
                            error={errors[field.id]}
                            onChange={(base64) =>
                              handleFieldValueChange(field.id, base64)
                            }
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={field.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={field.id}
                            className="text-xs font-sans uppercase tracking-[0.15em] font-semibold text-zinc-700 flex items-center gap-1"
                          >
                            {field.label}
                            {field.required && <span className="text-rose-500">*</span>}
                          </label>

                          {typeof remaining === 'number' && (
                            <span
                              className={`text-[11px] font-mono ${remaining === 0
                                  ? 'text-rose-600 font-bold'
                                  : remaining <= 5
                                    ? 'text-amber-600'
                                    : 'text-zinc-400'
                                }`}
                            >
                              {remaining} left
                            </span>
                          )}
                        </div>

                        <input
                          id={field.id}
                          type="text"
                          value={value}
                          maxLength={field.maxLength}
                          placeholder={field.placeholder}
                          onChange={(e) =>
                            handleFieldValueChange(field.id, e.target.value)
                          }
                          className={`w-full px-4 py-3.5 rounded-none border text-sm font-sans transition-all focus:outline-none ${errors[field.id]
                              ? 'border-rose-400 bg-rose-50/20'
                              : 'border-black/15 focus:border-black bg-white text-zinc-900'
                            }`}
                        />

                        {field.helpText && !errors[field.id] && (
                          <p className="text-[11px] text-zinc-400 font-sans">
                            {field.helpText}
                          </p>
                        )}
                        {errors[field.id] && (
                          <p className="text-[11px] font-medium text-rose-500 font-sans">
                            {errors[field.id]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 5 / Final Step: Audio & Quality Options */}
              {isAudioReviewStep && (
                <div className="space-y-8">
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

                  {/* Quality & Pricing */}
                  <div className="p-6 bg-[#FAF7F2] border border-black/10 space-y-4">
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-semibold text-zinc-500">
                      Export Resolution
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-black/10 space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                          Standard Preview
                        </span>
                        <p className="text-[11px] text-zinc-500">
                          Free preview with subtle watermark for testing.
                        </p>
                      </div>

                      <div className="p-4 bg-white border-2 border-black space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-black">
                            Haute Couture 1080p
                          </span>
                          <span className="text-xs font-bold text-amber-700">
                            ₹{template.priceInINR}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600">
                          Full 1080p HD, watermark-free, WhatsApp ready.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions Bar */}
              <div className="pt-6 border-t border-black/10 flex items-center justify-between gap-4">
                {currentStepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] font-semibold text-zinc-600 hover:text-black transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsLivePlayerOpen(true)}
                    className="px-6 py-3.5 rounded-full border border-black/20 text-xs font-sans uppercase tracking-[0.2em] font-semibold hover:border-black transition-colors flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Live Cinema</span>
                  </button>

                  {!isAudioReviewStep ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3.5 rounded-full bg-black text-white hover:bg-black/90 text-xs font-sans uppercase tracking-[0.2em] font-semibold flex items-center gap-2 transition-all shadow-md"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isRendering}
                      onClick={handleSubmit}
                      className="px-8 py-3.5 rounded-full bg-black text-white hover:bg-black/90 text-xs font-sans uppercase tracking-[0.2em] font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                    >
                      {isRendering ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Rendering...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate 1080p Video</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Completion State */
          <div className="max-w-xl mx-auto bg-white p-10 sm:p-14 shadow-2xl border border-black/10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full border border-black/20 flex items-center justify-center text-3xl font-editorial italic mx-auto">
              ✦
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-zinc-400">
                Invitation Generated
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-zinc-900">
                {displayCouple}
              </h2>
              <p className="text-xs font-sans text-zinc-500 leading-relaxed max-w-sm mx-auto">
                Your wedding video invitation is ready with synchronized music and 1080p composition.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setIsLivePlayerOpen(true)}
                className="w-full py-4 rounded-full bg-black text-white text-xs font-sans uppercase tracking-[0.2em] font-semibold hover:bg-black/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4 fill-white" /> Watch 60fps Video
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out our wedding invitation for ${displayCouple}!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-full border border-black/20 text-xs font-sans uppercase tracking-[0.2em] font-semibold hover:border-black transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share On WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-editorial italic text-zinc-400 hover:text-black pt-2"
              >
                ← Edit Information Again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* LIVE 60FPS CINEMATIC PLAYER */}
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

