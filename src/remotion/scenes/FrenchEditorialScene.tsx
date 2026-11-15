import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface FrenchEditorialSceneProps {
  quote?: string;
  headline?: string;
  dateTag?: string;
  subtext?: string;
  photoUrl?: string;
  backgroundUrl?: string;
}

export const FrenchEditorialScene: React.FC<FrenchEditorialSceneProps> = ({
  quote = 'Two souls, one timeless journey',
  headline = 'Camille & Alexandre',
  dateTag = 'Autumn in Provence • 24 . 10 . 2026',
  subtext = 'Cordially invite you to celebrate our union',
  photoUrl,
  backgroundUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle image zoom
  const bgScale = interpolate(frame, [0, 180], [1, 1.05], {
    extrapolateRight: 'clamp',
  });

  // Masked slide-up for quote (0.33, 1, 0.68, 1 easing simulated with spring)
  const quoteY = interpolate(frame, [10, 40], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const quoteOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Headline spring animation
  const headlineScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, mass: 0.5 },
  });

  // Photo scale
  const photoScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  const subtextOpacity = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-[#FAF7F2] text-[#121212] select-none p-8 font-editorial">
      {/* Background subtle atmospheric wash */}
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            transform: `scale(${bgScale})`,
          }}
        />
      )}

      {/* Delicate Editorial Outer Frame */}
      <div className="absolute inset-6 border border-black/10 rounded-none pointer-events-none p-4 flex flex-col justify-between">
        <div className="flex justify-between text-[10px] font-sans tracking-widest text-zinc-400 uppercase">
          <span>N° 01</span>
          <span>HAUTE COUTURE</span>
        </div>
        <div className="flex justify-between text-[10px] font-sans tracking-widest text-zinc-400 uppercase">
          <span>PARIS</span>
          <span>EST. 2026</span>
        </div>
      </div>

      {/* Top Header / Quote */}
      <div className="relative z-10 pt-8 text-center space-y-1">
        <p
          style={{
            transform: `translateY(${quoteY}px)`,
            opacity: quoteOpacity,
          }}
          className="text-xs sm:text-sm font-sans tracking-[0.25em] uppercase text-zinc-500"
        >
          {quote}
        </p>
      </div>

      {/* Centerpiece: Couple Photo or Monogram */}
      <div className="relative z-10 flex flex-col items-center space-y-4 my-auto">
        {photoUrl ? (
          <div
            style={{
              transform: `scale(${Math.max(0, photoScale)}) rotate(-1.5deg)`,
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.2)',
            }}
            className="w-48 h-64 bg-white p-2.5 shadow-xl border border-black/5"
          >
            <div className="w-full h-full overflow-hidden bg-zinc-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt={headline}
                className="w-full h-full object-cover filter grayscale contrast-105"
              />
            </div>
          </div>
        ) : (
          <div
            style={{ transform: `scale(${Math.max(0, headlineScale)})` }}
            className="w-20 h-20 rounded-full border border-black/20 flex items-center justify-center text-3xl font-light italic"
          >
            &amp;
          </div>
        )}

        {/* Headline Couple Names with high-fashion tracking */}
        <div className="text-center space-y-1 pt-2">
          <h1
            style={{
              transform: `scale(${Math.max(0, headlineScale)})`,
            }}
            className="text-3xl sm:text-4xl font-normal tracking-tight text-[#121212]"
          >
            {headline}
          </h1>
          <div className="w-16 h-[0.5px] bg-black/30 mx-auto" />
        </div>
      </div>

      {/* Bottom Date Tag & Subtext */}
      <div
        style={{ opacity: subtextOpacity }}
        className="relative z-10 pb-8 text-center space-y-1"
      >
        <p className="text-xs sm:text-sm font-sans font-medium tracking-widest uppercase text-zinc-800">
          {dateTag}
        </p>
        <p className="text-[11px] font-sans text-zinc-500 tracking-wide">
          {subtext}
        </p>
      </div>
    </div>
  );
};

