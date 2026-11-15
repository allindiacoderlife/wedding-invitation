import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fulfillment form states
  const [editStatus, setEditStatus] = useState('PENDING');
  const [finalVideoUrl, setFinalVideoUrl] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('wedding_admin_token');
      const res = await fetch('http://localhost:8000/api/orders/admin', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && data.orders?.length > 0) {
        setOrders(data.orders);
        return;
      }
    } catch {
      // fallback
    }

    // Default rich sample orders
    setOrders([
      {
        id: 'ord-101',
        orderNumber: 'WED-89412',
        clientName: 'Pooja Sharma',
        clientEmail: 'pooja.s@example.com',
        clientPhone: '+91 98765 43210',
        brideName: 'Pooja',
        groomName: 'Rohan',
        brideParents: 'Mr. Rajesh & Mrs. Sunita Sharma',
        groomParents: 'Mr. Anil & Mrs. Meenakshi Verma',
        status: 'PENDING',
        musicPreference: 'Kesariya (Instrumental Flute)',
        customTextNotes: 'Please use royal gold font with hashtag #RohAnKiPooja',
        finalVideoUrl: '',
        adminNotes: '',
        createdAt: new Date().toISOString(),
        events: [
          {
            pageNumber: 1,
            name: 'Haldi & Chooda Ceremony',
            date: 'Friday, November 20, 2026',
            time: '10:00 AM onwards',
            venue: 'Sharma Villa Courtyard',
            address: 'Civil Lines, Jaipur, Rajasthan',
          },
          {
            pageNumber: 2,
            name: 'Mehendi & Musical Sangeet',
            date: 'Friday, November 20, 2026',
            time: '06:30 PM onwards',
            venue: 'The Grand Heritage Ballroom',
            address: 'Station Road, Jaipur',
          },
          {
            pageNumber: 3,
            name: 'Shubh Vivah (Wedding Muhurtham)',
            date: 'Saturday, November 21, 2026',
            time: '11:15 AM Auspicious Hour',
            venue: 'Palace Mandap Lawn',
            address: 'Amer Road, Jaipur',
          },
          {
            pageNumber: 4,
            name: 'Grand Reception Dinner',
            date: 'Saturday, November 21, 2026',
            time: '08:00 PM onwards',
            venue: 'Palace Royal Banquet Hall',
            address: 'Amer Road, Jaipur',
          },
        ],
      },
      {
        id: 'ord-102',
        orderNumber: 'WED-89405',
        clientName: 'Alexander Vance',
        clientEmail: 'alex@example.com',
        clientPhone: '+1 555-234-5678',
        brideName: 'Sophia',
        groomName: 'Alexander',
        brideParents: 'David & Catherine Miller',
        groomParents: 'Arthur & Beatrice Vance',
        status: 'IN_PROGRESS',
        musicPreference: 'Canon in D Major (Acoustic Guitar)',
        customTextNotes: 'Santorini cliffside illustration style',
        finalVideoUrl: '',
        adminNotes: 'Currently rendering in After Effects at 1080x1920 portrait format.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        events: [
          {
            pageNumber: 1,
            name: 'Church Ceremony',
            date: 'Saturday, October 24, 2026',
            time: '04:30 PM',
            venue: 'Holy Chapel of St. Sophia',
            address: 'Oia Cliffs, Santorini, Greece',
          },
          {
            pageNumber: 2,
            name: 'Dinner Reception & Dancing',
            date: 'Saturday, October 24, 2026',
            time: '07:30 PM onwards',
            venue: 'Grand Botanical Pavilion',
            address: 'Fira Coast, Santorini, Greece',
          },
        ],
      },
      {
        id: 'ord-103',
        orderNumber: 'WED-89390',
        clientName: 'Kavita Patel',
        clientEmail: 'kavita@example.com',
        clientPhone: '+91 99887 76655',
        brideName: 'Kavita',
        groomName: 'Dev',
        brideParents: 'Smt. & Shri Ramesh Patel',
        groomParents: 'Smt. & Shri Suresh Shah',
        status: 'COMPLETED',
        musicPreference: 'Kudmayi (Wedding Film Version)',
        customTextNotes: 'Delivered draft via WhatsApp, approved by couple.',
        finalVideoUrl: 'https://drive.google.com/file/d/1demo-wedding-invite-rendered-file/view',
        adminNotes: 'Rendered at 60fps with customized family names.',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        events: [
          {
            pageNumber: 1,
            name: 'Lagna Patrika & Haldi',
            date: 'December 5, 2026',
            time: '09:00 AM',
            venue: 'Patel Niwas',
            address: 'Ahmedabad, Gujarat',
          },
          {
            pageNumber: 2,
            name: 'Wedding & Dinner',
            date: 'December 6, 2026',
            time: '06:00 PM',
            venue: 'YMCA Club Banquet',
            address: 'SG Highway, Ahmedabad',
          },
        ],
      },
    ]);
  };

  const handleOpenOrder = (ord) => {
    setSelectedOrder(ord);
    setEditStatus(ord.status);
    setFinalVideoUrl(ord.finalVideoUrl || '');
    setAdminNotes(ord.adminNotes || '');
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('wedding_admin_token');
      await fetch(`http://localhost:8000/api/orders/admin/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: editStatus,
          finalVideoUrl,
          adminNotes,
        }),
      });
    } catch {
      // ignore
    }

    // Update local state
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, status: editStatus, finalVideoUrl, adminNotes }
          : o
      )
    );

    setSelectedOrder(null);
    setLoading(false);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="destructive">Pending Review</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">In Video Software</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'DELIVERED':
        return <Badge variant="purple">Delivered</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Client Video Orders</h1>
          <p className="text-xs text-stone-500 mt-1">
            Review page-by-page wedding details submitted by clients, customize in your video editor, and deliver.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition capitalize ${
                filterStatus === st
                  ? 'bg-white shadow-2xs text-stone-900 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {st === 'ALL' ? 'All Orders' : st.toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Wedding Submissions ({filteredOrders.length})</CardTitle>
          <CardDescription>
            Click "Process Order" to view all page-by-page function text and attach the final video link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Couple</th>
                  <th className="py-3 px-4">Functions</th>
                  <th className="py-3 px-4">Music Choice</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Final Video</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-800">
                        {ord.brideName} & {ord.groomName}
                      </p>
                      <p className="text-[10px] text-stone-400">{ord.clientName}</p>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-medium">
                      {ord.events?.length || 0} Pages
                    </td>
                    <td className="py-3 px-4 text-stone-500 max-w-[150px] truncate">
                      {ord.musicPreference || 'Default'}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="py-3 px-4">
                      {ord.finalVideoUrl ? (
                        <a
                          href={ord.finalVideoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <span>Video Attached</span> ↗
                        </a>
                      ) : (
                        <span className="text-stone-400 italic">Not attached yet</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="primary" size="sm" onClick={() => handleOpenOrder(ord)}>
                        Process Order ⚙️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail & Video Delivery Modal (Shadcn style) */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="max-w-3xl"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Order Details: {selectedOrder?.orderNumber}</DialogTitle>
              <DialogDescription>
                Full page-by-page wedding text submitted by {selectedOrder?.clientName}
              </DialogDescription>
            </div>
            {selectedOrder && getStatusBadge(selectedOrder.status)}
          </div>
        </DialogHeader>

        {selectedOrder && (
          <div className="space-y-6 text-xs text-stone-700">
            {/* Quick Contact & WhatsApp Bar */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-stone-900">{selectedOrder.clientName}</p>
                <p className="text-[11px] text-stone-500">
                  Email: {selectedOrder.clientEmail} • Phone: {selectedOrder.clientPhone}
                </p>
              </div>
              <a
                href={`https://wa.me/${selectedOrder.clientPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.clientName)}!%20We%20are%20working%20on%20your%20wedding%20invitation%20video.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <span>💬 Chat on WhatsApp</span>
              </a>
            </div>

            {/* Couple & Parents Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 space-y-1">
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Bride's Side</span>
                <p className="text-sm font-serif font-bold text-stone-900">{selectedOrder.brideName}</p>
                <p className="text-[11px] text-stone-600">Parents: {selectedOrder.brideParents || 'Not specified'}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 space-y-1">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Groom's Side</span>
                <p className="text-sm font-serif font-bold text-stone-900">{selectedOrder.groomName}</p>
                <p className="text-[11px] text-stone-600">Parents: {selectedOrder.groomParents || 'Not specified'}</p>
              </div>
            </div>

            {/* Page-by-Page Functions Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Page-by-Page Wedding Functions ({selectedOrder.events?.length} Pages)</span>
                <span className="text-[10px] font-normal text-stone-500">Copy text to paste in your video software</span>
              </h4>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {selectedOrder.events?.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-bold text-[10px]">
                        Page {idx + 1}: {ev.name}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        📅 {ev.date} • ⏰ {ev.time}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-700 space-y-0.5 pt-1">
                      <p><strong>Venue:</strong> {ev.venue}</p>
                      {ev.address && <p><strong>Address:</strong> {ev.address}</p>}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const copyText = `Function: ${ev.name}\nDate: ${ev.date}\nTime: ${ev.time}\nVenue: ${ev.venue}\nAddress: ${ev.address || ''}`;
                        navigator.clipboard.writeText(copyText);
                        alert(`Copied text for Page ${idx + 1} (${ev.name})!`);
                      }}
                      className="text-[10px] text-rose-700 font-semibold hover:underline mt-1"
                    >
                      📋 Copy Page Text
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Notes & Song */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Music / Song Choice</span>
                <p className="text-xs font-semibold text-stone-900">{selectedOrder.musicPreference || 'Default theme music'}</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Special Instructions</span>
                <p className="text-xs text-stone-700">{selectedOrder.customTextNotes || 'None'}</p>
              </div>
            </div>

            {/* Admin Video Fulfillment Form */}
            <form onSubmit={handleUpdateOrder} className="bg-stone-950 text-white p-5 rounded-2xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-rose-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎬</span> Video Editing & Delivery Fulfillment
                </h4>
                <span className="text-[10px] text-stone-400">After Effects / Premiere / Canva</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-stone-300 mb-1">Update Status</label>
                  <Select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="bg-stone-900 border-stone-700 text-white"
                  >
                    <option value="PENDING">PENDING (Reviewing text)</option>
                    <option value="IN_PROGRESS">IN PROGRESS (Editing video)</option>
                    <option value="COMPLETED">COMPLETED (Video rendered)</option>
                    <option value="DELIVERED">DELIVERED (Shared with client)</option>
                  </Select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-stone-300 mb-1">
                    Attach Rendered Video URL (Google Drive / YouTube / Cloudinary link)
                  </label>
                  <Input
                    value={finalVideoUrl}
                    onChange={(e) => setFinalVideoUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... or YouTube unlisted link"
                    className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-300 mb-1">
                  Message / Notes to Client
                </label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Here is your finalized wedding invitation video rendered in Full HD with the requested music track!"
                  rows={2}
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <Button variant="secondary" type="button" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save & Update Order'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Dialog>
    </div>
  );
};
