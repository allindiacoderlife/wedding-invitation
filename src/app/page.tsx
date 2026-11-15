import React from 'react';
import Link from 'next/link';
import { getAllTemplates } from '@/data/templates';
import { CustomCursor } from '@/components/gsap/CustomCursor';
import { GsapTextReveal } from '@/components/gsap/GsapTextReveal';
import { GsapMagneticButton } from '@/components/gsap/GsapMagneticButton';
import { GsapFloatingGallery } from '@/components/gsap/GsapFloatingGallery';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Music,
  Share2,
  Film,
  Camera,
  Heart,
  Video,
} from 'lucide-react';

export default function Home() {
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#121212] selection:bg-[#4F7C8F]/25 selection:text-black flex flex-col font-sans">
      {/* Luxury Trailing Dot Cursor */}
      <CustomCursor />

      {/* Top Editorial Announcement Header */}
      <div className="border-b border-black/10 py-2.5 px-6 text-center bg-white/60">
        <p className="text-[11px] font-sans tracking-[0.2em] uppercase text-zinc-600 font-medium">
          ✨ Vaishno Video Vision — Create stunning wedding video invitations for WhatsApp in under 3 minutes!
        </p>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3D6373] to-[#4F7C8F] text-white flex items-center justify-center font-extrabold text-sm shadow-md tracking-tighter">
              VVV
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#2C3531] leading-none">
                Vaishno Video Vision
              </span>
              <span className="text-[10px] text-[#4F7C8F] font-semibold tracking-wider uppercase mt-0.5">
                Wedding Video Invitation Studio
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-6 sm:gap-8 text-xs font-sans uppercase tracking-[0.2em] font-medium text-zinc-600">
            <a href="#collection" className="hover:text-black transition-colors">
              Templates
            </a>
            <Link href="/dashboard" className="hover:text-[#4F7C8F] transition-colors font-bold text-[#4F7C8F]">
              Dashboard
            </Link>
            <a href="#features" className="hover:text-black transition-colors hidden sm:inline-block">
              Features
            </a>
            <GsapMagneticButton
              href={`/customize/${templates[0]?.id || 'royal-rajasthani-wedding'}`}
              className="py-2.5 px-5 text-[10px]"
              showArrow={false}
            >
              Create Video
            </GsapMagneticButton>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-6 text-center max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="inline-block">
            <span className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-[#4F7C8F] font-bold border-b border-[#4F7C8F]/30 pb-1">
              #1 Digital Wedding Video Invitation Maker
            </span>
          </div>

          {/* GSAP SplitText Reveal Headline */}
          <div className="max-w-4xl mx-auto">
            <GsapTextReveal
              as="h1"
              text="Create Grand Wedding Video Invitations In Minutes"
              className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#121212] justify-center"
            />
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base font-editorial italic text-zinc-600 leading-relaxed pt-2">
            Personalize Bride &amp; Groom names, Haldi, Mehendi, Sangeet &amp; Reception timelines, crop couple portraits, select romantic music, and download instant 1080p Full HD video invitations for WhatsApp &amp; Instagram.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <GsapMagneticButton href="#collection">
              Explore Wedding Templates
            </GsapMagneticButton>
            <Link
              href="#features"
              className="px-6 py-4 rounded-full border border-black/20 text-xs font-sans uppercase tracking-[0.2em] text-zinc-800 hover:border-black transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Gallery */}
      <section className="pb-16 border-b border-black/10">
        <div className="max-w-6xl mx-auto px-6 mb-6 flex items-center justify-between">
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-zinc-400">
            Featured Video Invitation Styles
          </span>
          <span className="font-editorial text-xs italic text-zinc-500">
            Hover to explore perspectives
          </span>
        </div>
        <GsapFloatingGallery />
      </section>

      {/* The Template Collection */}
      <section id="collection" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-zinc-400 font-semibold">
            Vaishno Video Vision Catalog
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#121212]">
            Wedding Video Invitation Templates
          </h2>
          <p className="text-xs sm:text-sm font-sans text-zinc-500">
            Choose a design to customize with your wedding itinerary, photos, and music.
          </p>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((tpl, i) => (
            <div
              key={tpl.id}
              className="group bg-white p-4 shadow-xl border border-black/5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Photo Banner with subtle zoom */}
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tpl.thumbnailUrl}
                  alt={tpl.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {tpl.badge && (
                  <span className="absolute top-3 left-3 text-[9px] font-sans tracking-widest uppercase px-3 py-1 bg-black text-white">
                    {tpl.badge}
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-amber-300">
                    N° 0{i + 1} • {tpl.totalDurationInSeconds}s
                  </span>
                  <h3 className="font-editorial text-xl font-normal text-white mt-0.5">
                    {tpl.title}
                  </h3>
                </div>
              </div>

              {/* Card Meta & Description */}
              <div className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-zinc-600 font-sans leading-relaxed line-clamp-2">
                  {tpl.description}
                </p>

                <div className="text-[11px] font-sans text-zinc-500 space-y-1 pt-2 border-t border-black/5">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{tpl.scenes.length} Animated Scenes</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="truncate">{tpl.defaultAudio.title}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-black/10 flex items-center justify-between">
                  <div>
                    <span className="text-base font-editorial font-bold text-[#121212]">
                      ₹{tpl.priceInINR}
                    </span>
                    <span className="text-[10px] font-sans tracking-wider uppercase text-zinc-400 ml-1">
                      / 1080p HD
                    </span>
                  </div>

                  <Link
                    href={`/customize/${tpl.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.15em] font-semibold text-[#4F7C8F] hover:text-black transition-colors"
                  >
                    Customize Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#2C3531] text-white px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#82A4B3] font-semibold">
              The Vaishno Video Vision Advantage
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight">
              &ldquo;Transforming your wedding announcement into a cinematic memory.&rdquo;
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10">
            <div className="space-y-2">
              <span className="font-editorial text-xl italic text-amber-300">01. Live Phone Mockup Sync</span>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Watch every edit you make in names, dates, and venues update immediately on the photorealistic smartphone screen before generating.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-editorial text-xl italic text-amber-300">02. 60fps Real-Time Cinema</span>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Powered by Remotion video engine in the browser for instant smooth previews with synchronized music and zero waiting.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-editorial text-xl italic text-amber-300">03. 1-Click WhatsApp Share</span>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                Download pristine 1080p Full HD MP4 video invitations ready to send directly to your guests on WhatsApp and Instagram.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-black/10 text-center text-xs text-zinc-500 font-sans uppercase tracking-[0.2em]">
        <p>© 2026 Vaishno Video Vision. All rights reserved. Premium Digital Wedding Video Invitations.</p>
      </footer>
    </div>
  );
}
