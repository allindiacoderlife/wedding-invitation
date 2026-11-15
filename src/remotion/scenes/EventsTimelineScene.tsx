import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface EventsTimelineSceneProps {
  event1Name?: string;
  event1Time?: string;
  event2Name?: string;
  event2Time?: string;
  backgroundUrl?: string;
}

export const EventsTimelineScene: React.FC<EventsTimelineSceneProps> = ({
  event1Name = 'Haldi Ceremony',
  event1Time = 'Friday, 21st Nov 2026 | 10:00 AM',
  event2Name = 'Mehendi & Sangeet Night',
  event2Time = 'Saturday, 22nd Nov 2026 | 06:30 PM',
  backgroundUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background subtle zoom
  const bgScale = interpolate(frame, [0, 180], [1, 1.06], {
    extrapolateRight: 'clamp',
  });

  // Title spring
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Event 1 card reveal
  const card1Scale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  // Event 2 card reveal
  const card2Scale = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, mass: 0.6 },
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90" />

      {/* Frame Border */}
      <div className="absolute inset-6 border border-amber-400/30 rounded-3xl pointer-events-none p-4 flex flex-col justify-between">
        <div className="flex justify-between text-amber-400/60 text-xs">
          <span>✦</span>
          <span>✦</span>
        </div>
        <div className="flex justify-between text-amber-400/60 text-xs">
          <span>✦</span>
          <span>✦</span>
        </div>
      </div>

      <div className="relative z-10 max-w-sm w-full px-6 flex flex-col items-center space-y-6">
        {/* Section Header */}
        <div style={{ opacity: titleOpacity }} className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-amber-400 font-semibold">
            Wedding Itinerary
          </span>
          <h2 className="text-2xl font-bold text-amber-200">
            Pre-Wedding Celebrations
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
        </div>

        {/* Event 1 Card (e.g. Haldi) */}
        <div
          style={{
            transform: `scale(${Math.max(0, card1Scale)})`,
          }}
          className="w-full p-4 rounded-2xl bg-amber-950/40 border border-amber-400/40 backdrop-blur-sm text-center space-y-1 shadow-lg shadow-amber-950/40"
        >
          <span className="text-amber-400 text-xs">💛</span>
          <h3 className="text-amber-200 text-lg font-bold">
            {event1Name}
          </h3>
          <p className="text-zinc-300 text-xs font-sans font-light">
            {event1Time}
          </p>
        </div>

        {/* Event 2 Card (e.g. Sangeet) */}
        <div
          style={{
            transform: `scale(${Math.max(0, card2Scale)})`,
          }}
          className="w-full p-4 rounded-2xl bg-rose-950/40 border border-rose-400/40 backdrop-blur-sm text-center space-y-1 shadow-lg shadow-rose-950/40"
        >
          <span className="text-rose-400 text-xs">🎶</span>
          <h3 className="text-amber-200 text-lg font-bold">
            {event2Name}
          </h3>
          <p className="text-zinc-300 text-xs font-sans font-light">
            {event2Time}
          </p>
        </div>
      </div>
    </div>
  );
};

