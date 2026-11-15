'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { VideoTemplate, UserCustomizationData } from '@/types/template';
import { createDefaultCustomization } from '@/lib/template-utils';
import { CustomCursor } from '@/components/gsap/CustomCursor';
import { LiveVideoPlayerModal } from '@/components/video/LiveVideoPlayerModal';
import { ImageUploadCropper } from '@/components/wizard/ImageUploadCropper';
import { AudioSelector } from '@/components/wizard/AudioSelector';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Sliders,
  X,
  Sparkles,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Check,
  Camera,
  RotateCcw,
} from 'lucide-react';

interface MarieGuillaumeStudioProps {
  template: VideoTemplate;
}

// Bespoke Marie Guillaume atmospheric palettes
const COLOR_THEMES = [
  { name: 'Chateau Ivory', bg: '#FAF7F2', text: '#121212', accent: '#D4AF37' },
  { name: 'Blush Poudré', bg: '#F2DFD7', text: '#7A4338', accent: '#CA6F57' },
  { name: 'Brume Bleue', bg: '#DDE6ED', text: '#1B3B52', accent: '#276678' },
  { name: 'Sauge Olive', bg: '#E3E8DE', text: '#2D4436', accent: '#4E6C50' },
  { name: 'Champagne Soleil', bg: '#FFF1E0', text: '#8C4325', accent: '#D97706' },
];

export const MarieGuillaumeStudio: React.FC<MarieGuillaumeStudioProps> = ({
  template,
}) => {
  const [customization, setCustomization] = useState<UserCustomizationData>(() =>
    createDefaultCustomization(template)
  );

  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [themeIdx, setThemeIdx] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLivePlayerOpen, setIsLivePlayerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const totalScenes = template.scenes.length;
  const currentScene = template.scenes[currentSceneIdx];
  const activeTheme = COLOR_THEMES[themeIdx];

  const handleFieldValueChange = (fieldId: string, val: string) => {
    setCustomization((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [fieldId]: val,
      },
    }));
  };

  // GSAP animation on scene change
  useGSAP(
    () => {
      const titleEl = canvasRef.current?.querySelector('.editorial-title');
      const arcEl = canvasRef.current?.querySelector('.editorial-arc');
      const photoEl = canvasRef.current?.querySelector('.editorial-photo-center');
      const subtitleEl = canvasRef.current?.querySelector('.editorial-subtitle');

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (titleEl) {
        tl.fromTo(
          titleEl,
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9 }
        );
      }

      if (arcEl) {
        tl.fromTo(
          arcEl,
          { scale: 0.88, rotate: -25, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 1.1 },
          '-=0.7'
        );
      }

      if (photoEl) {
        tl.fromTo(
          photoEl,
          { scale: 0.9, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8 },
          '-=0.7'
        );
      }

      if (subtitleEl) {
        tl.fromTo(
          subtitleEl,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.5'
        );
      }
    },
    { scope: canvasRef, dependencies: [currentSceneIdx, themeIdx] }
  );

  const nextScene = () => {
    setCurrentSceneIdx((prev) => (prev + 1) % totalScenes);
  };

  const prevScene = () => {
    setCurrentSceneIdx((prev) => (prev - 1 + totalScenes) % totalScenes);
  };

  const toggleSoundtrack = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Values extractors
  const coupleName =
    customization.values['editorialHeadline'] ||
    customization.values['coupleNames'] ||
    (customization.values['brideName'] && customization.values['groomName']
      ? `${customization.values['brideName']} & ${customization.values['groomName']}`
      : 'Camille & Alexandre');

  const cityDate =
    customization.values['editorialDateTag'] ||
    customization.values['weddingDateBrief'] ||
    customization.values['weddingDate'] ||
    'Château de Villette • 24 . 10 . 2026';

  const poemQuote =
    customization.values['editorialPoem'] ||
    customization.values['tagline'] ||
    customization.values['auspiciousMantra'] ||
    'Two souls, one timeless journey';

  const photoValue =
    customization.values['editorialPhoto'] ||
    customization.values['couplePhoto'] ||
    customization.values['bridePhoto'];

  return (
    <div
      style={{
        backgroundColor: activeTheme.bg,
        color: activeTheme.text,
        transition: 'background-color 0.8s cubic-bezier(0.33, 1, 0.68, 1), color 0.8s cubic-bezier(0.33, 1, 0.68, 1)',
      }}
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col justify-between font-sans"
    >
      <CustomCursor />

      {/* Hidden audio element for preview */}
      <audio
        ref={audioRef}
        src={customization.customAudioUrl || template.defaultAudio.url}
        loop
      />

      {/* 1. TOP HEADER (Marie Guillaume Style) */}
      <header className="relative z-30 w-full px-6 sm:px-12 pt-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-medium opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Gallery</span>
        </Link>

        {/* Center Title */}
        <div className="text-center">
          <span className="font-editorial text-xl sm:text-2xl italic tracking-wide">
            Vaishno Video Vision
          </span>
          <span className="block text-[9px] uppercase tracking-[0.3em] opacity-50 font-sans">
            Wedding Video Invitation Studio
          </span>
        </div>

        {/* Right Tools: Palette & Audio */}
        <div className="flex items-center gap-3">
          {/* Palette Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/5 border border-black/10">
            {COLOR_THEMES.map((theme, i) => (
              <button
                key={theme.name}
                onClick={() => setThemeIdx(i)}
                style={{ backgroundColor: theme.bg }}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  themeIdx === i
                    ? 'border-black scale-125 shadow-sm'
                    : 'border-black/20 hover:scale-110'
                }`}
                title={theme.name}
              />
            ))}
          </div>

          {/* Soundtrack Toggle */}
          <button
            onClick={toggleSoundtrack}
            className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center opacity-70 hover:opacity-100 transition-all hover:scale-105"
            title={isMuted ? 'Play Music' : 'Mute Music'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* 2. THE MAIN FULLSCREEN EDITORIAL CANVAS */}
      <main
        ref={canvasRef}
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing px-4"
      >
        {/* Curved Circular SVG Arc & Rotating Text Path (Marie Guillaume SVG) */}
        <div className="editorial-arc absolute w-[340px] sm:w-[480px] lg:w-[560px] h-[340px] sm:h-[480px] lg:h-[560px] pointer-events-none flex items-center justify-center">
          {/* SVG Arc Geometry */}
          <svg
            viewBox="0 0 515 515"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-full h-full animate-[spin_60s_linear_infinite]"
          >
            <path
              id="circlePath"
              transform="rotate(-180, 257.5, 257.5)"
              d="M 515,257.5 A 257.5,257.5 0 1 1 0,257.5 A 257.5,257.5 0 1 1 515,257.5"
            />
            <text className="font-editorial text-[14px] uppercase tracking-[0.45em] fill-current opacity-70">
              <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                ✦ {cityDate} ✦ {poemQuote}
              </textPath>
            </text>
          </svg>

          {/* Dashed outer rings */}
          <div className="absolute inset-4 rounded-full border border-current opacity-20 border-dashed pointer-events-none" />
          <div className="absolute inset-10 rounded-full border border-current opacity-10 pointer-events-none" />
        </div>

        {/* Centerpiece Content: Differs by scene */}
        <div className="relative z-10 text-center max-w-2xl px-4 flex flex-col items-center justify-center">
          {/* SCENE 0: The Grand Opening / Couple Name */}
          {currentSceneIdx === 0 && (
            <div className="space-y-4">
              <span className="editorial-subtitle text-[11px] sm:text-xs font-sans tracking-[0.4em] uppercase opacity-60">
                {poemQuote}
              </span>

              {/* Giant Cyrène / Cormorant Typography (10vw) */}
              <h1 className="editorial-title font-editorial text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-normal leading-none tracking-tight">
                {coupleName}
              </h1>

              <div className="pt-2">
                <p className="editorial-subtitle font-editorial italic text-base sm:text-xl opacity-80">
                  Cordially invite you to celebrate our union
                </p>
              </div>
            </div>
          )}

          {/* SCENE 1: The Portrait Photograph */}
          {currentSceneIdx === 1 && (
            <div className="space-y-4 flex flex-col items-center">
              <span className="text-[10px] font-sans tracking-[0.35em] uppercase opacity-60">
                The Couple &amp; Portrait
              </span>

              {photoValue ? (
                <div className="editorial-photo-center w-52 sm:w-64 aspect-[3/4] bg-white p-2.5 shadow-2xl border border-black/10 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full overflow-hidden bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoValue}
                      alt={coupleName}
                      className="w-full h-full object-cover filter contrast-[1.03]"
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsDrawerOpen(true)}
                  className="editorial-photo-center w-52 sm:w-64 aspect-[3/4] bg-white/60 p-4 border-2 border-dashed border-current/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white transition-colors"
                >
                  <Camera className="w-6 h-6 opacity-40" />
                  <span className="font-editorial text-sm italic">Click to Upload Portrait</span>
                </div>
              )}

              <h2 className="font-editorial text-3xl sm:text-4xl font-normal">
                {coupleName}
              </h2>
            </div>
          )}

          {/* SCENE 2: Celebrations Timeline */}
          {currentSceneIdx === 2 && (
            <div className="space-y-6 max-w-lg">
              <span className="text-[10px] font-sans tracking-[0.35em] uppercase opacity-60">
                Celebrations Timeline
              </span>

              <h2 className="editorial-title font-editorial text-4xl sm:text-6xl font-normal">
                The Soirée
              </h2>

              <div className="space-y-3 pt-2 font-editorial text-base sm:text-xl italic opacity-85">
                <p>{customization.values['event1'] || 'Exchange of Vows • 15:30 at The Orangery'}</p>
                <div className="w-12 h-[0.5px] bg-current opacity-30 mx-auto" />
                <p>{customization.values['event2'] || 'Cocktail de Bienvenue • 17:00 at The Terrace'}</p>
                <div className="w-12 h-[0.5px] bg-current opacity-30 mx-auto" />
                <p>{customization.values['event3'] || 'Dîner aux Chandelles • 19:30 in The Grand Hall'}</p>
              </div>
            </div>
          )}

          {/* SCENE 3: The Chateau Estate & RSVP */}
          {currentSceneIdx === 3 && (
            <div className="space-y-6 max-w-lg">
              <span className="text-[10px] font-sans tracking-[0.35em] uppercase opacity-60">
                The Estate &amp; RSVP
              </span>

              <h2 className="editorial-title font-editorial text-4xl sm:text-6xl font-normal">
                {customization.values['estateName'] || 'Château de Villette'}
              </h2>

              <p className="font-sans text-xs sm:text-sm tracking-wider uppercase opacity-75">
                {customization.values['estateAddress'] || 'Condécourt, France'}
              </p>

              <div className="pt-4 border-t border-current/20">
                <p className="font-editorial text-sm sm:text-base italic opacity-80">
                  {customization.values['formalRsvp'] || 'Kindly RSVP by August 15th'}
                </p>
              </div>
            </div>
          )}

          {/* SCENE 4: Music & Final Video Render */}
          {currentSceneIdx === 4 && (
            <div className="space-y-6 max-w-md">
              <span className="text-[10px] font-sans tracking-[0.35em] uppercase opacity-60">
                Final Step • Audio &amp; Cinema
              </span>

              <h2 className="editorial-title font-editorial text-4xl sm:text-5xl font-normal">
                Ready to Render
              </h2>

              <p className="font-editorial italic text-sm opacity-80">
                Your bespoke invitation is fully composed and ready for 60fps cinematic export.
              </p>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => setIsLivePlayerOpen(true)}
                  className="w-full py-4 rounded-full bg-black text-white hover:bg-black/90 transition-all text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 shadow-xl"
                >
                  <Play className="w-4 h-4 fill-white" /> Watch 60fps Motion Video
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. SIDE DOT NAVIGATION (.weddings__dots as seen in Marie Guillaume) */}
      <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
        {Array.from({ length: totalScenes }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSceneIdx(idx)}
            className={`w-2.5 h-2.5 rounded-full border border-current transition-all duration-300 ${
              currentSceneIdx === idx
                ? 'bg-current scale-150'
                : 'opacity-30 hover:opacity-75'
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* 4. BOTTOM BAR: PREV / NEXT & EDIT STORY DRAWER TRIGGER */}
      <footer className="relative z-30 w-full px-6 sm:px-12 pb-8 flex items-center justify-between">
        {/* Next & Previous Buttons (.weddings__btns) */}
        <div className="flex items-center gap-4">
          <button
            onClick={prevScene}
            className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold opacity-70 hover:opacity-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Prev</span>
          </button>

          <span className="opacity-30">•</span>

          <button
            onClick={nextScene}
            className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold opacity-70 hover:opacity-100 transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Center Pill: Watch Motion / Edit Drawer */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLivePlayerOpen(true)}
            className="px-6 py-3 rounded-full bg-black text-white hover:bg-black/85 transition-all text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2 shadow-lg hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Watch Cinema</span>
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-5 py-3 rounded-full border border-black/20 bg-white/40 backdrop-blur-md hover:bg-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center gap-2 transition-all hover:scale-105"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Story</span>
          </button>
        </div>

        {/* Right Info Stamp */}
        <div className="hidden sm:block text-right">
          <span className="text-[10px] uppercase tracking-[0.25em] opacity-40 font-sans">
            Scene 0{currentSceneIdx + 1} / 0{totalScenes}
          </span>
          <p className="font-editorial text-xs italic opacity-70">
            {currentScene?.title}
          </p>
        </div>
      </footer>

      {/* 5. SLEEK SLIDE-OVER EDITORIAL DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-[#FAF7F2] text-[#121212] h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-l border-black/10 animate-in slide-in-from-right duration-500">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-zinc-400">
                    Bespoke Customizer
                  </span>
                  <h3 className="font-editorial text-2xl font-normal text-zinc-900">
                    {currentScene?.title}
                  </h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Scene Input Fields */}
              <div className="space-y-5">
                {currentScene?.fields.map((field) => {
                  if (field.type === 'image') {
                    return (
                      <div key={field.id} className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-semibold text-zinc-600">
                          {field.label}
                        </label>
                        <ImageUploadCropper
                          id={field.id}
                          label=""
                          value={customization.values[field.id]}
                          config={field.imageConfig}
                          onChange={(base64) => handleFieldValueChange(field.id, base64)}
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={field.id}
                          className="text-xs font-semibold tracking-wider uppercase text-zinc-700"
                        >
                          {field.label}
                        </label>
                        {field.maxLength && (
                          <span className="text-[10px] font-mono text-zinc-400">
                            {Math.max(0, field.maxLength - (customization.values[field.id]?.length || 0))} left
                          </span>
                        )}
                      </div>
                      <input
                        id={field.id}
                        type="text"
                        value={customization.values[field.id] || ''}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white text-zinc-900 text-sm focus:outline-none focus:border-black transition-colors font-sans"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Audio Library inside Drawer */}
              <div className="pt-4 border-t border-black/10">
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
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-black/10 flex items-center gap-3">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-3.5 rounded-full bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-black/90 transition-colors shadow-lg"
              >
                Apply &amp; View Canvas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. REMOTION LIVE 60FPS CINEMATIC PLAYER */}
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

