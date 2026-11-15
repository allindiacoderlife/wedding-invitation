'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface GalleryPhoto {
  src: string;
  title: string;
  subtitle: string;
  rotation: number;
}

const PHOTOS: GalleryPhoto[] = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    title: 'The French Vows',
    subtitle: 'Château de Villette',
    rotation: -3,
  },
  {
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    title: 'Candid Romance',
    subtitle: 'Provence, France',
    rotation: 2.5,
  },
  {
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    title: 'Royal Palace Heritage',
    subtitle: 'Jaipur, Rajasthan',
    rotation: -2,
  },
  {
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
    title: 'Rose Garden Soirée',
    subtitle: 'The Manor & Lawn',
    rotation: 3,
  },
];

export const GsapFloatingGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll('.gallery-card');
      if (!cards) return;

      // Animate entry
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardIdx: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      rotateX: -y * 0.08,
      rotateY: x * 0.08,
      y: -10,
      scale: 1.03,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>, baseRotation: number) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      rotateZ: baseRotation,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
    });
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-8 max-w-6xl mx-auto"
    >
      {PHOTOS.map((photo, i) => (
        <div
          key={i}
          onMouseMove={(e) => handleCardMouseMove(e, i)}
          onMouseLeave={(e) => handleCardMouseLeave(e, photo.rotation)}
          style={{ transform: `rotate(${photo.rotation}deg)` }}
          className="gallery-card bg-white p-3 shadow-xl border border-black/5 rounded-none cursor-pointer will-change-transform transition-shadow hover:shadow-2xl"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 filter contrast-[1.02]"
            />
          </div>

          <div className="pt-3 pb-1 flex items-center justify-between text-zinc-800">
            <div>
              <p className="font-editorial text-sm font-normal italic tracking-wide text-zinc-900">
                {photo.title}
              </p>
              <p className="text-[10px] font-sans tracking-widest uppercase text-zinc-400">
                {photo.subtitle}
              </p>
            </div>
            <span className="text-[11px] font-editorial italic text-zinc-400">
              N° 0{i + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

