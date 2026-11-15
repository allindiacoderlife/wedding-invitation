'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface GsapTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const GsapTextReveal: React.FC<GsapTextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  as: Component = 'span',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const words = text.split(' ');

  useGSAP(
    () => {
      const wordElements = containerRef.current?.querySelectorAll('.gsap-word-inner');
      if (!wordElements || wordElements.length === 0) return;

      gsap.fromTo(
        wordElements,
        {
          yPercent: 125,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.045,
          delay,
          ease: 'power3.out',
          scrollTrigger: containerRef.current
            ? {
                trigger: containerRef.current,
                start: 'top 88%',
                once: true,
              }
            : undefined,
        }
      );
    },
    { scope: containerRef, dependencies: [text, delay] }
  );

  return (
    <Component
      ref={containerRef as any}
      className={`${className} inline-flex flex-wrap gap-x-[0.25em]`}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden py-0.5 align-bottom"
        >
          <span className="gsap-word-inner inline-block transform will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
};

