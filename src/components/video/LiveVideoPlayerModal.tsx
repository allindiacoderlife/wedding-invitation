'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { X, Sparkles, Volume2, ShieldCheck, Download } from 'lucide-react';
import { VideoTemplate } from '@/types/template';
import { WeddingVideoComposition } from '@/remotion/WeddingVideoComposition';

// Dynamically import Remotion Player to prevent SSR hydration mismatch
const Player = dynamic(
  () => import('@remotion/player').then((mod) => mod.Player),
  { ssr: false }
);

interface LiveVideoPlayerModalProps {
  isOpen: boolean;
  template: VideoTemplate;
  values: Record<string, string>;
  audioUrl?: string;
  isWatermarked?: boolean;
  onClose: () => void;
  onUpgradeToHD?: () => void;
}

export const LiveVideoPlayerModal: React.FC<LiveVideoPlayerModalProps> = ({
  isOpen,
  template,
  values,
  audioUrl,
  isWatermarked = true,
  onClose,
  onUpgradeToHD,
}) => {
  if (!isOpen) return null;

  const totalFrames = 900; // 30 seconds at 30 fps

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="relative bg-zinc-950 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-500/40 flex flex-col items-center max-h-[95vh]">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-200">
                60fps Live Video Preview
              </h3>
              <p className="text-[10px] text-zinc-400">
                9:16 Vertical Video (Reels & WhatsApp)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Remotion Player Container */}
        <div className="relative w-full flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-[280px] sm:w-[310px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl ring-2 ring-amber-500/30 bg-black">
            <Player
              component={WeddingVideoComposition as any}
              inputProps={{
                template,
                values,
                audioUrl: audioUrl || template.defaultAudio.url,
                isWatermarked,
              }}
              durationInFrames={totalFrames}
              fps={30}
              compositionWidth={1080}
              compositionHeight={1920}
              style={{
                width: '100%',
                height: '100%',
              }}
              controls
              autoPlay
              loop
            />
          </div>
        </div>

        {/* Bottom Actions / HD Upgrade banner */}
        <div className="w-full p-4 border-t border-zinc-800 bg-zinc-900/90 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Live In-Browser Composition
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              1080 × 1920 HD
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Back to Editing
            </button>
            {onUpgradeToHD && (
              <button
                onClick={onUpgradeToHD}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-xs font-bold text-white shadow-md shadow-amber-500/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download HD (₹{template.priceInINR})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
