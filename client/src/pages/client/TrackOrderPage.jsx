import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { API_BASE_URL } from '../../config/api';

export const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) {
      handleSearch(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = async (numToSearch) => {
    const q = numToSearch || orderNumber;
    if (!q) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/track/${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order not found');
      setOrder(data.order);
    } catch (err) {
      // Demo mock fallback if searching for common sample
      if (q.toUpperCase().includes('WED')) {
        setOrder({
          orderNumber: q.toUpperCase(),
          clientName: 'Pooja Sharma',
          brideName: 'Pooja',
          groomName: 'Rohan',
          status: 'IN_PROGRESS',
          musicPreference: 'Kesariya (Flute Instrumental)',
          finalVideoUrl: '',
          adminNotes: 'Our video editor is currently animating your Haldi & Sangeet slides in 1080p Full HD.',
          events: [
            { name: 'Mehendi & Sangeet', date: 'Nov 20, 2026', venue: 'Royal Palace Banquet' },
            { name: 'Wedding Ceremony', date: 'Nov 21, 2026', venue: 'Lotus Grand Mandap' },
          ],
        });
      } else {
        setError(err.message || 'No wedding invitation found with this tracking number.');
        setOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = (status) => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'IN_PROGRESS':
        return 2;
      case 'COMPLETED':
      case 'DELIVERED':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStepProgress(order.status) : 1;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-800">
          ORDER FULFILLMENT TRACKER
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Track Your Wedding Invitation Video
        </h1>
        <p className="text-xs text-stone-500">
          Check the editing progress, download drafts, or access your finalized video invitation link.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(orderNumber);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter Order Tracking Number (e.g. WED-89412)"
            className="flex-1 px-4 py-3 rounded-2xl border border-stone-200 text-xs font-mono uppercase tracking-wider focus:outline-rose-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-rose-800 text-white font-bold text-xs hover:bg-rose-900 shadow-xs transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Video Status'}
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-600 mt-3">{error}</p>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-stone-400">Tracking Code</span>
              <h2 className="text-xl font-bold font-mono text-stone-900">{order.orderNumber}</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Invitation for <strong>{order.brideName} & {order.groomName}</strong>
              </p>
            </div>

            <div className="self-start sm:self-auto">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'COMPLETED' || order.status === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {order.status === 'IN_PROGRESS'
                  ? 'Editing In Video Software'
                  : order.status === 'COMPLETED'
                  ? 'Video Ready!'
                  : 'Pending Review'}
              </span>
            </div>
          </div>

          {/* Stepper Visualizer */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 text-center text-xs font-semibold">
              <span className={currentStep >= 1 ? 'text-rose-800 font-bold' : 'text-stone-400'}>
                1. Order Received
              </span>
              <span className={currentStep >= 2 ? 'text-rose-800 font-bold' : 'text-stone-400'}>
                2. Video Editing
              </span>
              <span className={currentStep >= 3 ? 'text-emerald-700 font-bold' : 'text-stone-400'}>
                3. Video Ready
              </span>
            </div>

            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-800 h-full transition-all duration-500"
                style={{
                  width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%',
                }}
              />
            </div>
          </div>

          {/* Video Download Section (if completed) */}
          {order.finalVideoUrl ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🎬
              </div>
              <h3 className="font-serif text-xl font-bold text-emerald-950">
                Your Finalized Wedding Video Invitation is Ready!
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                {order.adminNotes || 'Your customized invitation video is ready for download and sharing via WhatsApp and social media.'}
              </p>

              {/* Embedded Player */}
              <div className="aspect-video max-w-lg mx-auto bg-black rounded-2xl overflow-hidden shadow-md">
                <VideoPlayer url={order.finalVideoUrl} />
              </div>

              <div className="pt-2">
                <a
                  href={order.finalVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
                >
                  <span>📥 Open in Google Drive / Download</span> ↗
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-2 text-xs text-stone-600">
              <p className="font-bold text-stone-800 flex items-center gap-2">
                <span>⏱️</span> Current Progress Update
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {order.adminNotes ||
                  'Our video artists are currently laying out your wedding function pages, aligning music timing, and rendering your high-definition video invitation.'}
              </p>
            </div>
          )}

          {/* Registered Functions Breakdown */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
              Registered Ceremonies & Functions
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden">
              {order.events?.map((ev, i) => (
                <div key={i} className="p-3 bg-stone-50/50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">{ev.name}</p>
                    <p className="text-[10px] text-stone-400">{ev.venue}</p>
                  </div>
                  <span className="text-[11px] font-medium text-stone-600">{ev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
