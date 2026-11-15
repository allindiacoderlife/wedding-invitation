'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop devices with hover capability
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // GSAP quickTo for high-performance 60fps tracking
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3' });

    const xFollowerTo = gsap.quickTo(follower, 'x', { duration: 0.5, ease: 'power3' });
    const yFollowerTo = gsap.quickTo(follower, 'y', { duration: 0.5, ease: 'power3' });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xFollowerTo(e.clientX);
      yFollowerTo(e.clientY);
    };

    const onMouseEnterInteractive = () => {
      gsap.to(follower, {
        scale: 2.4,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: 'rgba(212, 175, 55, 0.6)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(cursor, { scale: 0, duration: 0.2 });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(follower, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(18, 18, 18, 0.25)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Attach hover listeners to all clickable elements
    const interactiveEls = document.querySelectorAll('a, button, [role="button"], input');
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveEls.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden hidden md:block">
      {/* Tiny solid dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-black dark:bg-amber-400"
      />
      {/* Smooth trailing outer ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-black/30 dark:border-amber-400/30 transition-opacity"
      />
    </div>
  );
};

