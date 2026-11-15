'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  href,
  children,
  className = '',
  showArrow = true,
}) => {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-black/80 bg-black text-white hover:bg-transparent hover:text-black transition-colors duration-500 overflow-hidden text-xs uppercase tracking-widest font-semibold ${className}`}
    >
      {/* Sliding Text Wrapper */}
      <div className="relative overflow-hidden h-4 flex items-center">
        <span className="inline-block transform transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute top-full left-0 inline-block transform transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-y-full">
          {children}
        </span>
      </div>

      {showArrow && (
        <div className="relative overflow-hidden w-3.5 h-3.5">
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-3 group-hover:-translate-y-3" />
          <ArrowUpRight className="w-3.5 h-3.5 absolute top-full -left-full transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-3.5 group-hover:-translate-y-3.5" />
        </div>
      )}
    </Link>
  );
};

