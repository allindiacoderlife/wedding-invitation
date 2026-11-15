import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface AuspiciousSceneProps {
  mantra?: string;
  heading?: string;
  subtext?: string;
  backgroundUrl?: string;
}

export const AuspiciousScene: React.FC<AuspiciousSceneProps> = ({
  mantra = '|| Shree Ganeshay Namah ||',
  heading = 'Together with their families',
  subtext = 'Cordially invite you to celebrate the joyous wedding of',
  backgroundUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background slow Ken Burns zoom
  const bgScale = interpolate(frame, [0, 150], [1, 1.08], {
    extrapolateRight: 'clamp',
  });

  // Spring animation for sacred mantra
  const mantraScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  const mantraOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Text reveals
  const headingOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headingY = interpolate(frame, [25, 45], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtextOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950 text-center select-none font-serif">
      {/* Background Image with slow cinematic zoom */}
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            transform: `scale(${bgScale})`,
          }}
        />
      )}

      {/* Dark royal warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />

      {/* Royal Ornamental Arch / Mandala Motif */}
      <div className="absolute inset-8 border border-amber-400/40 rounded-3xl pointer-events-none flex flex-col justify-between p-6">
        <div className="flex justify-between text-amber-400 text-lg">
          <span>✦</span>
          <span>⚜</span>
          <span>✦</span>
        </div>
        <div className="flex justify-between text-amber-400 text-lg">
          <span>✦</span>
          <span>⚜</span>
          <span>✦</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-md px-6 flex flex-col items-center space-y-6">
        {/* Lord Ganesha / Sacred Symbol Icon */}
        <div
          style={{
            transform: `scale(${mantraScale})`,
            opacity: mantraOpacity,
          }}
          className="w-16 h-16 rounded-full border border-amber-400/60 bg-amber-500/10 flex items-center justify-center text-amber-300 text-2xl shadow-lg shadow-amber-500/20"
        >
          ॐ
        </div>

        {/* Sacred Mantra */}
        <h2
          style={{
            opacity: mantraOpacity,
            transform: `scale(${mantraScale})`,
          }}
          className="text-amber-300 text-xl font-bold tracking-widest drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]"
        >
          {mantra}
        </h2>

        {/* Golden Divider */}
        <div
          style={{ opacity: headingOpacity }}
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
        />

        {/* Invitation Heading */}
        <p
          style={{
            opacity: headingOpacity,
            transform: `translateY(${headingY}px)`,
          }}
          className="text-amber-100 text-base sm:text-lg font-light tracking-wide uppercase text-opacity-90"
        >
          {heading}
        </p>

        {/* Announcement Subtext */}
        <p
          style={{ opacity: subtextOpacity }}
          className="text-zinc-300 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-xs"
        >
          {subtext}
        </p>
      </div>
    </div>
  );
};

