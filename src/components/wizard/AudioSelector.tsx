'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, Volume2, Upload, Check } from 'lucide-react';
import { AudioTrack } from '@/types/template';

interface AudioSelectorProps {
  availableTracks: AudioTrack[];
  selectedTrackId: string;
  customAudioUrl?: string;
  onSelectTrack: (trackId: string, customUrl?: string) => void;
}

export const AudioSelector: React.FC<AudioSelectorProps> = ({
  availableTracks,
  selectedTrackId,
  customAudioUrl,
  onSelectTrack,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAuditionId, setActiveAuditionId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTrack = availableTracks.find((t) => t.id === selectedTrackId);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudition = (track: AudioTrack) => {
    if (activeAuditionId === track.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play().catch(() => {
          // Playback error handling (e.g. mock audio file)
        });
        setIsPlaying(true);
        setActiveAuditionId(track.id);
      }
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    onSelectTrack('custom-uploaded-audio', objectUrl);
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden audio player for auditioning */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-500" /> Background Music & Audio
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Select a romantic or traditional wedding song or upload your favorite MP3 track
          </p>
        </div>
      </div>

      {/* Track Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableTracks.map((track) => {
          const isSelected = selectedTrackId === track.id && !customAudioUrl;
          const isThisPlaying = activeAuditionId === track.id && isPlaying;

          return (
            <div
              key={track.id}
              onClick={() => {
                onSelectTrack(track.id, undefined);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 ring-2 ring-amber-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudition(track);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 ${
                    isThisPlaying
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                  title={isThisPlaying ? 'Pause audition' : 'Audition track'}
                >
                  {isThisPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {track.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 capitalize flex items-center gap-1.5 mt-0.5">
                    <span>{track.category}</span>
                    <span>•</span>
                    <span>{track.durationInSeconds}s</span>
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Custom Audio Track */}
      <div className="pt-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mp3,audio/wav,audio/m4a"
          onChange={handleCustomFileUpload}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`p-3.5 rounded-2xl border border-dashed flex items-center justify-between cursor-pointer transition-all ${
            customAudioUrl
              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {customAudioUrl ? 'Custom Audio Selected' : 'Upload Your Own Song'}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                MP3 or WAV audio track from your device
              </p>
            </div>
          </div>

          {customAudioUrl && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Attached
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

