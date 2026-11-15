'use client';

import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { TemplateScene } from '@/types/template';

interface SlidePreviewModalProps {
  isOpen: boolean;
  scene: TemplateScene;
  values: Record<string, string>;
  onClose: () => void;
}

export const SlidePreviewModal: React.FC<SlidePreviewModalProps> = ({
  isOpen,
  scene,
  values,
  onClose,
}) => {
  if (!isOpen) return null;

  // Find image field in the scene if present
  const imageField = scene.fields.find((f) => f.type === 'image');
  const imageValue = imageField ? values[imageField.id] : null;

  // Find text fields
  const textFields = scene.fields.filter((f) => f.type !== 'image');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-zinc-950 text-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col items-center">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wide text-amber-200">
              Slide Live Preview
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 9:16 Vertical Video Frame Simulation */}
        <div className="relative w-[280px] h-[497px] my-4 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-zinc-900 flex flex-col justify-between p-5 text-center">
          {/* Background image / overlay */}
          {scene.background.url && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-[1px] transform scale-105"
              style={{ backgroundImage: `url(${scene.background.url})` }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: scene.background.overlayColor || 'rgba(20, 10, 5, 0.75)',
            }}
          />

          {/* Ornamental Golden Border */}
          <div className="absolute inset-3 border border-amber-400/40 rounded-xl pointer-events-none z-10 flex flex-col justify-between p-2">
            <div className="flex justify-between text-[10px] text-amber-400">
              <span>✦</span>
              <span>✦</span>
            </div>
            <div className="flex justify-between text-[10px] text-amber-400">
              <span>✦</span>
              <span>✦</span>
            </div>
          </div>

          {/* Content Layer */}
          <div className="relative z-20 flex-1 flex flex-col justify-center items-center py-4 space-y-3">
            {/* Optional Photo */}
            {imageValue && (
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-500/20 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageValue}
                  alt="Slide Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Rendered Text Fields */}
            {textFields.map((field, idx) => {
              const val = values[field.id] || field.placeholder || '';
              const isTitle = idx === 0 || field.id.toLowerCase().includes('name');

              return (
                <div key={field.id} className="w-full">
                  <p
                    className={`leading-tight px-2 drop-shadow-md ${
                      isTitle
                        ? 'text-lg font-serif font-bold text-amber-200 tracking-wide'
                        : 'text-xs text-zinc-300 font-sans mt-0.5'
                    }`}
                  >
                    {val}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer watermark preview */}
          <div className="relative z-20 text-[9px] tracking-wider uppercase text-amber-400/60 pt-2 border-t border-amber-400/20">
            {scene.title} • Invite Video Preview
          </div>
        </div>

        {/* Modal close / confirm button */}
        <div className="w-full p-4 border-t border-zinc-800 bg-zinc-900/60">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-semibold text-xs text-zinc-950 transition-colors"
          >
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
};

