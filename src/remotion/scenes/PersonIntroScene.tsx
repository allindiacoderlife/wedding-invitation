import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface PersonIntroSceneProps {
  name?: string;
  relation?: string;
  parents?: string;
  photoUrl?: string;
  roleBadge: 'Bride' | 'Groom';
  backgroundUrl?: string;
}

export const PersonIntroScene: React.FC<PersonIntroSceneProps> = ({
  name = 'Name',
  relation = 'Daughter of',
  parents = 'Parents Names',
  photoUrl,
  roleBadge,
  backgroundUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background slow pan / zoom
  const bgScale = interpolate(frame, [0, 180], [1.05, 1], {
    extrapolateRight: 'clamp',
  });

  // Portrait scale spring
  const photoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  // Name slide in
  const nameY = interpolate(frame, [30, 55], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const nameOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Parents fade in
  const parentsOpacity = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-zinc-950 text-center select-none font-serif">
      {/* Background with subtle zoom */}
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            transform: `scale(${bgScale})`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90" />

      {/* Decorative Ornaments */}
      <div className="absolute inset-6 border border-amber-400/30 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
        <div className="flex justify-between text-amber-400/70 text-sm">
          <span>⚜</span>
          <span>⚜</span>
        </div>
        <div className="flex justify-between text-amber-400/70 text-sm">
          <span>⚜</span>
          <span>⚜</span>
        </div>
      </div>

      <div className="relative z-10 max-w-sm px-6 flex flex-col items-center space-y-4">
        {/* Role Badge (The Bride / The Groom) */}
        <div className="inline-block px-4 py-1 rounded-full border border-amber-400/50 bg-amber-500/10 text-amber-300 text-[11px] font-sans uppercase tracking-[0.25em] font-semibold">
          The {roleBadge}
        </div>

        {/* Circular Portrait with Golden Glow */}
        {photoUrl ? (
          <div
            style={{
              transform: `scale(${Math.max(0, photoScale)})`,
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.35)',
            }}
            className="w-40 h-40 rounded-full overflow-hidden border-4 border-amber-400/90 relative my-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            style={{
              transform: `scale(${Math.max(0, photoScale)})`,
            }}
            className="w-36 h-36 rounded-full border-2 border-dashed border-amber-400/60 bg-amber-500/5 flex items-center justify-center text-amber-300/60 text-4xl font-serif my-2"
          >
            {name.charAt(0) || '✦'}
          </div>
        )}

        {/* Name Reveal */}
        <div
          style={{
            transform: `translateY(${nameY}px)`,
            opacity: nameOpacity,
          }}
          className="space-y-1"
        >
          <h2 className="text-amber-200 text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]">
            {name}
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
        </div>

        {/* Parentage details */}
        <div style={{ opacity: parentsOpacity }} className="space-y-1 pt-1">
          <p className="text-zinc-400 text-xs font-sans tracking-wider uppercase">
            {relation}
          </p>
          <p className="text-amber-100 text-sm font-medium px-4">
            {parents}
          </p>
        </div>
      </div>
    </div>
  );
};

