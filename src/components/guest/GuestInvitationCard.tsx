'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { InvitationRecord, RsvpRecord } from '@/types/invitation';
import { VideoTemplate } from '@/types/template';
import { LiveVideoPlayerModal } from '@/components/video/LiveVideoPlayerModal';
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Music,
  Volume2,
  VolumeX,
  Play,
  Check,
  Share2,
  Send,
  Navigation,
  Flower2,
  Phone,
  MessageSquare,
  Users,
} from 'lucide-react';

interface GuestInvitationCardProps {
  invitation: InvitationRecord;
  template: VideoTemplate;
}

export const GuestInvitationCard: React.FC<GuestInvitationCardProps> = ({
  invitation,
  template,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    attendance: 'attending' as 'attending' | 'declined' | 'tentative',
    guestCount: 2,
    wishesMessage: '',
  });
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);

  // Live countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 124, hours: 18, mins: 45, secs: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, mins: 59, secs: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio player setup
  const audioUrl =
    invitation.customAudioUrl ||
    template.availableAudioTracks.find((t) => t.id === invitation.audioTrackId)?.url ||
    template.defaultAudio.url;

  const toggleAudio = () => {
    if (!audioElement) {
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.play().catch((e) => console.log('Audio autoplay prevented:', e));
      setAudioElement(audio);
      setIsPlayingAudio(true);
    } else {
      if (isPlayingAudio) {
        audioElement.pause();
        setIsPlayingAudio(false);
      } else {
        audioElement.play().catch((e) => console.log('Audio play failed:', e));
        setIsPlayingAudio(true);
      }
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpData.guestName || !rsvpData.guestPhone) return;

    setIsSubmittingRsvp(true);
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData),
      });

      const json = await res.json();
      if (json.success) {
        setIsRsvpSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit RSVP:', err);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const mantra = invitation.values['auspiciousMantra'] || '|| Shree Ganeshay Namah ||';
  const brideName = invitation.brideName || 'Ananya';
  const groomName = invitation.groomName || 'Rohan';
  const brideParents = invitation.values['brideParents'] || 'D/o Smt. Sunita & Shri Rajesh Sharma';
  const groomParents = invitation.values['groomParents'] || 'S/o Smt. Rekha & Shri Vikram Singhania';
  const weddingDate = invitation.weddingDate || 'Sunday, 15 November 2026';
  const venueName = invitation.venueName || 'The Grand Palace Resort & Spa';
  const venueAddress = invitation.venueAddress || 'Lake Palace Road, Udaipur, Rajasthan';
  const photoUrl = invitation.coverPhotoUrl;
  const event1Name = invitation.values['event1Name'] || 'Haldi & Mehendi Ceremony';
  const event1Time = invitation.values['event1Time'] || '14 Nov 2026 • 11:00 AM';
  const event2Name = invitation.values['event2Name'] || 'Sangeet & Cocktail Evening';
  const event2Time = invitation.values['event2Time'] || '14 Nov 2026 • 7:30 PM';
  const rsvpContact = invitation.values['rsvpContact'] || 'Sharma & Singhania Families | +91 98765 43210';

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venueName}, ${venueAddress}`
  )}`;

  return (
    <div className="min-h-screen bg-[#F0F4F7] text-[#2C3531] flex flex-col items-center py-6 sm:py-12 px-4 font-sans selection:bg-[#4F7C8F]/20">
      {/* Floating Audio Soundtrack Control */}
      <button
        onClick={toggleAudio}
        className="fixed top-5 right-5 z-40 px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 shadow-md text-xs font-semibold text-zinc-700 flex items-center gap-2 hover:bg-white transition-all hover:scale-105"
        title={isPlayingAudio ? 'Mute Music' : 'Play Wedding Soundtrack'}
      >
        {isPlayingAudio ? (
          <>
            <Volume2 className="w-4 h-4 text-[#4F7C8F] animate-pulse" />
            <span className="text-[11px] text-[#4F7C8F]">Playing Music</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-zinc-400" />
            <span className="text-[11px] text-zinc-500">Play Music</span>
          </>
        )}
      </button>

      {/* Main Wedding Invitation Card Mockup */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-zinc-200/80 overflow-hidden flex flex-col">
        {/* Hero Photo & Cover */}
        <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden flex flex-col justify-between p-6 text-white text-center">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={invitation.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3D6373] to-[#4F7C8F] opacity-75" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30" />

          {/* Top Auspicious Inscription */}
          <div className="relative z-10 pt-2">
            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-amber-300 font-bold">
              {mantra}
            </span>
          </div>

          {/* Couple Headline */}
          <div className="relative z-10 pb-2 space-y-1">
            <h1 className="font-editorial text-4xl sm:text-5xl font-medium leading-tight text-white drop-shadow-md">
              {brideName} &amp; {groomName}
            </h1>
            <p className="text-xs font-sans tracking-[0.2em] text-zinc-300 uppercase">
              {weddingDate}
            </p>
          </div>
        </div>

        {/* Live Countdown Banner */}
        <div className="px-6 -mt-5 relative z-20">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-zinc-100 flex items-center justify-around text-center">
            <div>
              <span className="text-xl font-bold text-[#4F7C8F]">{timeLeft.days}</span>
              <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Days</span>
            </div>
            <span className="text-zinc-300 font-light text-lg">:</span>
            <div>
              <span className="text-xl font-bold text-[#4F7C8F]">{timeLeft.hours}</span>
              <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Hours</span>
            </div>
            <span className="text-zinc-300 font-light text-lg">:</span>
            <div>
              <span className="text-xl font-bold text-[#4F7C8F]">{timeLeft.mins}</span>
              <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Mins</span>
            </div>
            <span className="text-zinc-300 font-light text-lg">:</span>
            <div>
              <span className="text-xl font-bold text-[#4F7C8F]">{timeLeft.secs}</span>
              <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Secs</span>
            </div>
          </div>
        </div>

        {/* Invitation Message Body */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-zinc-400 font-bold block">
              Together with their families
            </span>
            <p className="font-editorial text-base sm:text-lg italic text-zinc-700 leading-relaxed max-w-md mx-auto">
              &ldquo;We joyfully request the pleasure of your company to celebrate the auspicious wedding of our beloved {brideName} and {groomName}.&rdquo;
            </p>

            <div className="pt-2 text-xs text-zinc-500 space-y-0.5">
              <p>{brideParents}</p>
              <p>&amp;</p>
              <p>{groomParents}</p>
            </div>
          </div>

          {/* Watch Motion Video Invitation CTA */}
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#3D6373] to-[#4F7C8F] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Watch Cinematic 60fps Video Invitation</span>
          </button>

          {/* Ceremony Locations & Functions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-zinc-100 pb-2">
              <Calendar className="w-3.5 h-3.5 text-[#4F7C8F]" />
              Ceremony Schedule &amp; Itinerary
            </h3>

            {/* Main Wedding Venue Card */}
            <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-zinc-200/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF1F4] text-[#4F7C8F] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 block">
                      Wedding Ceremony &amp; Pheras
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900">{venueName}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">{venueAddress}</p>
                  </div>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-[11px] font-semibold flex items-center gap-1 flex-shrink-0 transition-colors"
                >
                  <Navigation className="w-3 h-3 text-[#4F7C8F]" />
                  <span>Maps</span>
                </a>
              </div>
            </div>

            {/* Pre-wedding Celebration Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4F7C8F] block">
                  {event1Name}
                </span>
                <p className="text-xs text-zinc-800 font-semibold">{event1Time}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A0522D] block">
                  {event2Name}
                </span>
                <p className="text-xs text-zinc-800 font-semibold">{event2Time}</p>
              </div>
            </div>
          </div>

          {/* Interactive Guest RSVP Section */}
          <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-zinc-200 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-zinc-900">Confirm Your Attendance</h3>
              <p className="text-xs text-zinc-500">
                Kindly RSVP so the families can make gracious arrangements for you.
              </p>
            </div>

            {isRsvpSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 text-emerald-800 text-center space-y-2 border border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <h4 className="text-sm font-bold">Thank You! Your RSVP Has Been Received</h4>
                <p className="text-xs text-emerald-700">
                  {brideName} &amp; {groomName} look forward to celebrating with you!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs">
                {/* Attendance Options */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpData((p) => ({ ...p, attendance: 'attending' }))}
                    className={`py-2.5 px-3 rounded-xl font-bold border transition-all ${
                      rsvpData.attendance === 'attending'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    🎉 Will Attend
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpData((p) => ({ ...p, attendance: 'declined' }))}
                    className={`py-2.5 px-3 rounded-xl font-bold border transition-all ${
                      rsvpData.attendance === 'declined'
                        ? 'bg-zinc-800 text-white border-zinc-800 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    💌 Regretfully Cannot
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpData.guestName}
                    onChange={(e) => setRsvpData((p) => ({ ...p, guestName: e.target.value }))}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-none focus:border-[#4F7C8F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={rsvpData.guestPhone}
                      onChange={(e) => setRsvpData((p) => ({ ...p, guestPhone: e.target.value }))}
                      placeholder="+91 98765..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-none focus:border-[#4F7C8F]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Number of Guests
                    </label>
                    <select
                      value={rsvpData.guestCount}
                      onChange={(e) =>
                        setRsvpData((p) => ({ ...p, guestCount: Number(e.target.value) }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-none focus:border-[#4F7C8F]"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Warm Wishes &amp; Blessings
                  </label>
                  <textarea
                    rows={2}
                    value={rsvpData.wishesMessage}
                    onChange={(e) => setRsvpData((p) => ({ ...p, wishesMessage: e.target.value }))}
                    placeholder="Leave a heartfelt message for the couple..."
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-none focus:border-[#4F7C8F]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="w-full py-3 rounded-xl bg-[#4F7C8F] text-white font-bold text-xs hover:bg-[#3D6373] transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingRsvp ? 'Submitting RSVP...' : 'Submit RSVP Confirmation'}</span>
                </button>
              </form>
            )}

            <div className="pt-2 text-center text-[11px] text-zinc-400">
              <span>Host Contacts: {rsvpContact}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAFBFD] p-5 border-t border-zinc-100 text-center text-[10px] text-zinc-400 uppercase tracking-widest">
          Created with Vaishno Video Vision • Digital Wedding Invitations
        </div>
      </div>

      {/* Video Modal */}
      <LiveVideoPlayerModal
        isOpen={isVideoModalOpen}
        template={template}
        values={invitation.values}
        audioUrl={audioUrl}
        isWatermarked={false}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};
