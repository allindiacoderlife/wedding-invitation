'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { InvitationRecord, DashboardMetrics, RenderJob } from '@/types/invitation';
import { getAllTemplates } from '@/data/templates';
import { LiveVideoPlayerModal } from '@/components/video/LiveVideoPlayerModal';
import { UserNavMenu } from '@/components/navbar/UserNavMenu';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  Users,
  Video,
  Eye,
  Plus,
  Share2,
  Copy,
  ExternalLink,
  Edit3,
  Trash2,
  Download,
  Play,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface DashboardViewProps {
  initialInvitations: InvitationRecord[];
  initialMetrics: DashboardMetrics;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  initialInvitations,
  initialMetrics,
}) => {
  const templates = getAllTemplates();
  const [invitations, setInvitations] = useState<InvitationRecord[]>(initialInvitations);
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [activeTab, setActiveTab] = useState<'invitations' | 'rsvps' | 'renders'>('invitations');
  const [searchQuery, setSearchQuery] = useState('');

  // Video preview modal state
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<any>(null);
  const [activePreviewValues, setActivePreviewValues] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Video render queue progress
  const [renderingJob, setRenderingJob] = useState<RenderJob | null>(null);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);

  // New invitation dialog
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Copied toast state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/invitations');
      const json = await res.json();
      if (json.success) {
        setInvitations(json.data);
        if (json.metrics) setMetrics(json.metrics);
      }
    } catch (err) {
      console.error('Failed to refresh dashboard data:', err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this wedding invitation?')) return;

    try {
      const res = await fetch(`/api/invitations/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setInvitations((prev) => prev.filter((item) => item.id !== id));
        setMetrics((prev) => ({
          ...prev,
          totalInvitations: Math.max(0, prev.totalInvitations - 1),
        }));
      }
    } catch (err) {
      console.error('Failed to delete invitation:', err);
    }
  };

  const handleCopyLink = (inv: InvitationRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/invite/${inv.slug || inv.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayVideo = (inv: InvitationRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const tpl = templates.find((t) => t.id === inv.templateId) || templates[0];
    setActivePreviewTemplate(tpl);
    setActivePreviewValues(inv.values);
    setIsPreviewOpen(true);
  };

  const handleTriggerRender = async (inv: InvitationRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/render-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationId: inv.id,
          templateId: inv.templateId,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setRenderingJob(json.data);
        setIsRenderModalOpen(true);

        // Poll for progress updates
        const pollInterval = setInterval(async () => {
          try {
            const pollRes = await fetch(`/api/render-video/${json.data.id}`);
            const pollJson = await pollRes.json();
            if (pollJson.success && pollJson.data) {
              setRenderingJob(pollJson.data);
              if (pollJson.data.status === 'completed') {
                clearInterval(pollInterval);
                refreshData();
              }
            }
          } catch (pollErr) {
            console.error('Error polling render status:', pollErr);
            clearInterval(pollInterval);
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to trigger video render:', err);
    }
  };

  // Filtered invitations
  const filteredInvitations = invitations.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.brideName?.toLowerCase().includes(q) ||
      inv.groomName?.toLowerCase().includes(q) ||
      inv.title?.toLowerCase().includes(q) ||
      inv.venueName?.toLowerCase().includes(q)
    );
  });

  // Collect all RSVPs across invitations
  const allRsvps = invitations.flatMap((inv) =>
    (inv.rsvps || []).map((rsvp) => ({
      ...rsvp,
      invitationTitle: `${inv.brideName} & ${inv.groomName}`,
      invitationId: inv.id,
    }))
  );

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#2C3531] flex flex-col font-sans">
      {/* 1. TOP DASHBOARD NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E9EC] h-16 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3D6373] to-[#4F7C8F] text-white flex items-center justify-center font-extrabold text-xs shadow-sm tracking-tighter">
              VVV
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#2C3531] leading-none">
                Vaishno Video Vision
              </span>
              <span className="text-[10px] text-[#4F7C8F] font-semibold tracking-wider uppercase mt-0.5">
                Invitation Studio Dashboard
              </span>
            </div>
          </Link>

          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            API Connected
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            title="Refresh Data"
            className="p-2 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F7C8F] text-white hover:bg-[#3D6373] text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invitation</span>
          </button>

          <UserNavMenu />
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* METRICS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E9EC] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Total Invitations
              </span>
              <span className="text-2xl font-extrabold text-zinc-900 leading-tight">
                {metrics.totalInvitations}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E9EC] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Guest Views
              </span>
              <span className="text-2xl font-extrabold text-zinc-900 leading-tight">
                {metrics.totalViews}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E9EC] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                RSVP Responses
              </span>
              <span className="text-2xl font-extrabold text-zinc-900 leading-tight">
                {metrics.totalRsvps}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E9EC] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                HD Videos Exported
              </span>
              <span className="text-2xl font-extrabold text-zinc-900 leading-tight">
                {metrics.totalRenders}
              </span>
            </div>
          </div>
        </div>

        {/* 3. NAVIGATION TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'invitations', label: 'My Invitations', icon: Heart, count: invitations.length },
              { id: 'rsvps', label: 'Guest RSVPs', icon: Users, count: allRsvps.length },
              { id: 'renders', label: 'Video Export Queue', icon: Video, count: metrics.totalRenders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#4F7C8F] text-white shadow-xs'
                      : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTab === 'invitations' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bride or groom..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-[#4F7C8F]"
              />
            </div>
          )}
        </div>

        {/* 4. TAB CONTENTS */}

        {/* TAB 1: INVITATIONS GRID */}
        {activeTab === 'invitations' && (
          <div className="space-y-6">
            {filteredInvitations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/80 space-y-4">
                <Heart className="w-12 h-12 text-zinc-300 mx-auto" />
                <h3 className="text-base font-bold text-zinc-800">No wedding invitations found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Create your first personalized digital video invitation in minutes using our live studio.
                </p>
                <button
                  onClick={() => setIsNewModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-[#4F7C8F] text-white text-xs font-bold hover:bg-[#3D6373] transition-all"
                >
                  Create New Invitation
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvitations.map((inv) => {
                  const tpl = templates.find((t) => t.id === inv.templateId) || templates[0];
                  const hasVideo = !!inv.videoUrl;

                  return (
                    <div
                      key={inv.id}
                      className="group bg-white rounded-2xl border border-[#E5E9EC] shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
                    >
                      {/* Card Header & Photo */}
                      <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                        {inv.coverPhotoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={inv.coverPhotoUrl}
                            alt={inv.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-[#3D6373] to-[#4F7C8F] opacity-75" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider">
                            {tpl?.title || 'Wedding'}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inv.status === 'rendered'
                                ? 'bg-emerald-500 text-white'
                                : inv.status === 'published'
                                ? 'bg-blue-500 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {inv.status === 'rendered' ? '1080p Ready' : inv.status}
                          </span>
                        </div>

                        {/* Bottom Couple Headline */}
                        <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                          <h3 className="font-editorial text-xl font-medium truncate drop-shadow-md">
                            {inv.brideName} &amp; {inv.groomName}
                          </h3>
                          <p className="text-[10px] text-zinc-300 flex items-center gap-1.5 truncate">
                            <Calendar className="w-3 h-3 text-amber-300" />
                            <span>{inv.weddingDate}</span>
                          </p>
                        </div>
                      </div>

                      {/* Card Meta Stats */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                          <div className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{inv.viewCount || 0} Guest Views</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{inv.rsvps?.length || 0} RSVPs</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                            Venue Location
                          </span>
                          <p className="text-xs text-zinc-800 font-semibold truncate">
                            {inv.venueName}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {inv.venueAddress || 'Location details set'}
                          </p>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-3 border-t border-zinc-100 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/customize/${inv.templateId}?id=${inv.id}`}
                              className="py-2 px-3 rounded-lg border border-zinc-200 text-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-zinc-50 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                              <span>Edit Studio</span>
                            </Link>

                            <button
                              onClick={(e) => handlePlayVideo(inv, e)}
                              className="py-2 px-3 rounded-lg bg-[#EAF1F4] text-[#4F7C8F] hover:bg-[#d9e6eb] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Play className="w-3.5 h-3.5 fill-[#4F7C8F]" />
                              <span>60fps Video</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-1 pt-1">
                            <button
                              onClick={(e) => handleCopyLink(inv, e)}
                              className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-black font-semibold py-1 px-2 rounded hover:bg-zinc-100"
                              title="Copy Public Guest Share Link"
                            >
                              {copiedId === inv.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Guest Link</span>
                                </>
                              )}
                            </button>

                            <Link
                              href={`/invite/${inv.slug || inv.id}`}
                              target="_blank"
                              className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-black font-semibold py-1 px-2 rounded hover:bg-zinc-100"
                              title="Open Live Guest Card"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View Card</span>
                            </Link>

                            <button
                              onClick={(e) => handleTriggerRender(inv, e)}
                              className="flex items-center gap-1 text-[11px] text-[#4F7C8F] hover:text-[#3D6373] font-bold py-1 px-2 rounded hover:bg-[#EAF1F4]"
                              title="Export 1080p Full HD MP4 Video"
                            >
                              <Download className="w-3 h-3" />
                              <span>Export HD</span>
                            </button>

                            <button
                              onClick={(e) => handleDelete(inv.id, e)}
                              className="text-zinc-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete Invitation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GUEST RSVPS TABLE */}
        {activeTab === 'rsvps' && (
          <div className="bg-white rounded-2xl border border-[#E5E9EC] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Guest RSVPs &amp; Greetings</h3>
                <p className="text-xs text-zinc-500">
                  Real-time list of guests confirming attendance for your weddings.
                </p>
              </div>

              <button
                onClick={() => {
                  const csv = [
                    'Guest Name,Phone,Email,Wedding,Attendance,Pax,Wishes,Date',
                    ...allRsvps.map(
                      (r) =>
                        `"${r.guestName}","${r.guestPhone}","${r.guestEmail || ''}","${r.invitationTitle}","${r.attendance}",${r.guestCount},"${(r.wishesMessage || '').replace(/"/g, '""')}","${r.submittedAt}"`
                    ),
                  ].join('\n');

                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `wedding_rsvps_${Date.now()}.csv`;
                  a.click();
                }}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {allRsvps.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Users className="w-10 h-10 text-zinc-300 mx-auto" />
                <p className="text-sm font-semibold text-zinc-700">No RSVPs received yet</p>
                <p className="text-xs text-zinc-400">
                  Share your public guest invitation card link on WhatsApp to collect RSVPs.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFBFD] border-b border-zinc-100 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Guest Name</th>
                      <th className="py-3 px-4">Phone / Email</th>
                      <th className="py-3 px-4">Wedding</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Guests</th>
                      <th className="py-3 px-4">Personal Wishes</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {allRsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-zinc-900">{rsvp.guestName}</td>
                        <td className="py-3 px-4 text-zinc-600">
                          <div>{rsvp.guestPhone}</div>
                          {rsvp.guestEmail && (
                            <div className="text-[10px] text-zinc-400">{rsvp.guestEmail}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#4F7C8F] font-semibold">
                          {rsvp.invitationTitle}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              rsvp.attendance === 'attending'
                                ? 'bg-emerald-50 text-emerald-700'
                                : rsvp.attendance === 'declined'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {rsvp.attendance === 'attending' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            <span>{rsvp.attendance}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-zinc-700">
                          {rsvp.guestCount} pax
                        </td>
                        <td className="py-3 px-4 max-w-xs text-zinc-600 truncate italic">
                          &ldquo;{rsvp.wishesMessage || 'Best wishes!'}&rdquo;
                        </td>
                        <td className="py-3 px-4 text-zinc-400 text-[10px]">
                          {new Date(rsvp.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VIDEO RENDER QUEUE */}
        {activeTab === 'renders' && (
          <div className="bg-white rounded-2xl border border-[#E5E9EC] shadow-xs p-6 space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="text-base font-bold text-zinc-900">
                1080p Full HD Video Rendering Engine
              </h3>
              <p className="text-xs text-zinc-500">
                Remotion video rendering queue generates broadcast-quality MP4 video invitations suitable for WhatsApp status &amp; Instagram reels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Full HD Specification
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  All videos are rendered in <strong>1080 x 1920 (9:16 vertical)</strong> at 30/60 fps with crystal-clear AAC stereo soundtrack.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Instant Cloud Download
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Completed videos include an direct MP4 download link and pre-composed WhatsApp share messages.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Recent Render Jobs
              </h4>
              <div className="space-y-3">
                {invitations
                  .filter((inv) => inv.videoUrl)
                  .map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 rounded-xl border border-zinc-200 bg-[#FAFBFD] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-zinc-900 truncate">
                            {inv.brideName} &amp; {inv.groomName} — 1080p Full HD Video
                          </h5>
                          <span className="text-[10px] text-zinc-400 block">
                            Status: Completed • MP4 Video Ready
                          </span>
                        </div>
                      </div>

                      <a
                        href={inv.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={`${inv.brideName}_${inv.groomName}_Invitation.mp4`}
                        className="px-4 py-2 rounded-lg bg-[#4F7C8F] text-white hover:bg-[#3D6373] text-xs font-bold flex items-center gap-1.5 transition-colors flex-shrink-0 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download MP4</span>
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 5. CREATE NEW INVITATION MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-100 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Select a Wedding Template</h3>
                <p className="text-xs text-zinc-500">
                  Pick a cinematic design to customize in the Vaishno Video Vision studio.
                </p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="w-8 h-8 rounded-full border border-zinc-200 text-zinc-500 flex items-center justify-center hover:bg-zinc-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <Link
                  key={tpl.id}
                  href={`/customize/${tpl.id}`}
                  onClick={() => setIsNewModalOpen(false)}
                  className="group bg-[#FAFBFD] p-3 rounded-xl border border-zinc-200 hover:border-[#4F7C8F] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden relative bg-zinc-900 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tpl.thumbnailUrl}
                      alt={tpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    {tpl.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 text-white text-[9px] font-bold uppercase">
                        {tpl.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#4F7C8F] transition-colors line-clamp-1">
                      {tpl.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-zinc-200/80 flex items-center justify-between text-xs font-bold text-[#4F7C8F]">
                    <span>₹{tpl.priceInINR}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      Choose <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. LIVE VIDEO PREVIEW MODAL */}
      {activePreviewTemplate && (
        <LiveVideoPlayerModal
          isOpen={isPreviewOpen}
          template={activePreviewTemplate}
          values={activePreviewValues}
          isWatermarked={true}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {/* 7. LIVE VIDEO RENDER PROGRESS MODAL */}
      {isRenderModalOpen && renderingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#EAF1F4] text-[#4F7C8F] flex items-center justify-center mx-auto">
              <Video className="w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">
                {renderingJob.status === 'completed'
                  ? 'Video Export Complete!'
                  : 'Rendering 1080p HD Video...'}
              </h3>
              <p className="text-xs text-zinc-500">
                {renderingJob.status === 'completed'
                  ? 'Your video is ready in broadcast quality for WhatsApp & Instagram!'
                  : 'Remotion is animating scenes, compositing audio, and encoding in MP4 format.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-zinc-600">
                <span>Progress</span>
                <span>{renderingJob.progress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4F7C8F] to-[#25D366] transition-all duration-500"
                  style={{ width: `${renderingJob.progress}%` }}
                />
              </div>
            </div>

            {renderingJob.status === 'completed' && renderingJob.videoUrl && (
              <div className="space-y-3 pt-2">
                <a
                  href={renderingJob.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  download="Wedding_Invitation_1080p.mp4"
                  className="w-full py-3 rounded-full bg-[#4F7C8F] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#3D6373] transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 1080p MP4 Video</span>
                </a>

                <button
                  onClick={() => setIsRenderModalOpen(false)}
                  className="w-full py-2.5 rounded-full border border-zinc-200 text-zinc-600 text-xs font-semibold hover:bg-zinc-50 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
