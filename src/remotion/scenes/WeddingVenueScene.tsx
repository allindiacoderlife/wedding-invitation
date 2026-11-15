import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface WeddingVenueSceneProps {
  weddingDate?: string;
  weddingMuhurat?: string;
  venueName?: string;
  venueAddress?: string;
  rsvpContact?: string;
  backgroundUrl?: string;
}

export const WeddingVenueScene: React.FC<WeddingVenueSceneProps> = ({
  weddingDate = 'Sunday, 23rd November 2026',
  weddingMuhurat = 'Baarat: 6:00 PM | Hastmelap: 8:00 PM',
  venueName = 'The Oberoi Rajvilas Palace',
  venueAddress = 'Jaipur, Rajasthan',
  rsvpContact = 'RSVP: With Best Compliments',
  backgroundUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 210], [1.06, 1], {
    extrapolateRight: 'clamp',
  });

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  const venueOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rsvpHide = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950 text-center select-none font-serif">
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            transform: `scale(${bgScale})`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90" />

      {/* Frame Border */}
      <div className="absolute inset-6 border border-amber-400/30 rounded-3xl pointer-events-none p-4 flex flex-col justify-between">
        <div className="flex justify-between text-amber-400/60 text-xs">
          <span>⚜</span>
          <span>⚜</span>
        </div>
        <div className="flex justify-between text-amber-400/60 text-xs">
          <span>⚜</span>
          <span>⚜</span>
        </div>
      </div>

      <div className="relative z-10 max-w-sm px-6 flex flex-col items-center space-y-5">
        {/* Sacred Mandap / Wedding Header */}
        <div
          style={{ transform: `scale(${titleScale})` }}
          className="space-y-1"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-amber-400 font-semibold">
            The Auspicious Day
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-200 drop-shadow-[0_2px_12px_rgba(251,191,36,0.4)]">
            Wedding Ceremony
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
        </div>

        {/* Date & Muhurat */}
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-400/40 w-full space-y-1 backdrop-blur-sm">
          <p className="text-amber-200 text-base font-bold">
            {weddingDate}
          </p>
          <p className="text-zinc-300 text-xs font-sans">
            {weddingMuhurat}
          </p>
        </div>

        {/* Venue Information */}
        <div style={{ opacity: venueOpacity }} className="space-y-1 pt-1">
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-sans">
            Venue
          </span>
          <h3 className="text-lg font-bold text-amber-100">
            {venueName}
          </h3>
          <p className="text-zinc-300 text-xs font-sans max-w-xs mx-auto">
            {venueAddress}
          </p>
        </div>

        {/* RSVP / Blessings */}
        <div
          style={{ opacity: rsvpHide }}
          className="pt-2 border-t border-amber-400/20 w-full"
        >
          <p className="text-amber-300/80 text-[11px] font-sans tracking-wide">
            {rsvpContact}
          </p>
        </div>
      </div>
    </div>
  );
};

