'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingEditorialFrameProps {
  src: string;
  alt: string;
  caption?: string;
  rotation?: number;
  className?: string;
  delay?: number;
}

export const FloatingEditorialFrame: React.FC<FloatingEditorialFrameProps> = ({
  src,
  alt,
  caption,
  rotation = 0,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.33, 1, 0.68, 1] as const,
      }}
      whileHover={{
        y: -8,
        rotate: 0,
        scale: 1.02,
        transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] as const },
      }}
      className={`editorial-photo rounded-none bg-white p-2.5 sm:p-3 cursor-pointer ${className}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {caption && (
        <div className="pt-2 pb-0.5 px-1 flex items-center justify-between text-[11px] font-editorial italic text-zinc-600">
          <span>{caption}</span>
          <span className="text-[9px] font-sans uppercase tracking-widest text-zinc-400 not-italic">
            Editorial
          </span>
        </div>
      )}
    </motion.div>
  );
};
