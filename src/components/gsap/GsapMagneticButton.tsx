'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

interface GsapMagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

export const GsapMagneticButton: React.FC<GsapMagneticButtonProps> = ({
  href,
  children,
  className = '',
  showArrow = true,
}) => {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.35;
    const deltaY = (e.clientY - centerY) * 0.35;

    gsap.to(btn, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;

    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.35)',
    });
  };

  return (
    <Link
      ref={btnRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative inline-flex items-center gap-3 px-7 py-4 rounded-full border border-black bg-black text-white hover:bg-transparent hover:text-black transition-colors duration-500 overflow-hidden text-xs uppercase tracking-[0.2em] font-semibold will-change-transform shadow-lg shadow-black/10 ${className}`}
    >
      {/* Text Roll Wrapper */}
      <div className="relative overflow-hidden h-4 flex items-center">
        <span className="inline-block transform transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute top-full left-0 inline-block transform transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-y-full font-serif italic capitalize text-sm">
          {children}
        </span>
      </div>

      {showArrow && (
        <div className="relative overflow-hidden w-3.5 h-3.5">
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-3.5 group-hover:-translate-y-3.5" />
          <ArrowUpRight className="w-3.5 h-3.5 absolute top-full -left-full transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-3.5 group-hover:-translate-y-3.5" />
        </div>
      )}
    </Link>
  );
};

