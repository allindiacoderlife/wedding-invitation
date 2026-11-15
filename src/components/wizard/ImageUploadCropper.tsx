'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Crop, Check, Image as ImageIcon } from 'lucide-react';
import { ImageCropConfig } from '@/types/template';

interface ImageUploadCropperProps {
  id: string;
  label: string;
  value?: string; // base64 or URL
  config?: ImageCropConfig;
  required?: boolean;
  helpText?: string;
  error?: string;
  onChange: (base64Url: string) => void;
}

export const ImageUploadCropper: React.FC<ImageUploadCropperProps> = ({
  id,
  label,
  value,
  config = { shape: 'circle', aspectRatio: 1, targetWidth: 600, targetHeight: 600 },
  required = false,
  helpText,
  error,
  onChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input value so same image can be reselected
    e.target.value = '';
  };

  const handleApplyCrop = () => {
    if (!rawImageSrc) return;

    const img = new Image();
    img.src = rawImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = config.targetWidth;
      canvas.height = config.targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw image onto canvas taking zoom & offset into account
      const containerSize = 280; // preview container dimension in modal
      const scale = (config.targetWidth / containerSize) * zoom;

      ctx.save();
      if (config.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(
          config.targetWidth / 2,
          config.targetHeight / 2,
          config.targetWidth / 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
      }

      const imgWidth = img.width;
      const imgHeight = img.height;
      const minDim = Math.min(imgWidth, imgHeight);

      // Center crop
      const sx = (imgWidth - minDim) / 2 - (offset.x / containerSize) * minDim;
      const sy = (imgHeight - minDim) / 2 - (offset.y / containerSize) * minDim;

      ctx.drawImage(
        img,
        Math.max(0, sx),
        Math.max(0, sy),
        minDim / zoom,
        minDim / zoom,
        0,
        0,
        config.targetWidth,
        config.targetHeight
      );
      ctx.restore();

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92);
      onChange(croppedBase64);
      setIsModalOpen(false);
      setRawImageSrc(null);
    };
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
          {config.shape === 'circle' ? 'Circular Crop' : 'Square Crop'}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box */
        <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <div
            className={`w-20 h-20 overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 shadow-inner ring-2 ring-amber-500/30 ${
              config.shape === 'circle' ? 'rounded-full' : 'rounded-xl'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded portrait"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" /> Image Ready
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              High-resolution portrait applied to template
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <Crop className="w-3.5 h-3.5" /> Change Photo
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs font-medium text-rose-500 hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Trigger Button */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative cursor-pointer border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-400 rounded-2xl p-5 text-center transition-all bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-amber-50/20"
        >
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Click to upload portrait photo
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            PNG, JPG or WebP up to 10MB (Circle auto-crop available)
          </p>
        </div>
      )}

      {helpText && !error && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{helpText}</p>
      )}

      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}

      {/* Cropper Modal */}
      {isModalOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
                <Crop className="w-5 h-5 text-amber-500" /> Position & Zoom
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Drag to position and use the slider to adjust face framing inside the circular template frame.
            </p>

            {/* Circular Preview Area */}
            <div className="relative w-[260px] h-[260px] mx-auto rounded-full overflow-hidden bg-zinc-950 shadow-inner border-4 border-amber-500/50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rawImageSrc}
                alt="Crop Target"
                style={{
                  transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                  transformOrigin: 'center center',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                className="select-none pointer-events-none transition-transform duration-75"
              />
            </div>

            {/* Zoom Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-amber-500/20"
              >
                Done Cropping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

