import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { API_BASE_URL } from '../config/api';

export const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default mock data for instant preview + API fetch
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('wedding_admin_token');
        const res = await fetch(`${API_BASE_URL}/api/orders/admin`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch {
        // Fallback demo orders for instant showcase
        setOrders([
          {
            id: 'ord-1',
            orderNumber: 'WED-10842',
            clientName: 'Pooja Sharma',
            clientEmail: 'pooja@example.com',
            clientPhone: '+91 98765 43210',
            brideName: 'Pooja',
            groomName: 'Rohan',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            events: [
              { name: 'Mehendi & Sangeet', date: '2026-11-20', time: '5:00 PM', venue: 'Royal Palace Banquet' },
              { name: 'Wedding Ceremony', date: '2026-11-21', time: '10:00 AM', venue: 'Lotus Grand Mandap' },
            ],
          },
          {
            id: 'ord-2',
            orderNumber: 'WED-10841',
            clientName: 'Alexander Vance',
            clientEmail: 'alex@example.com',
            clientPhone: '+1 555-0192',
            brideName: 'Sophia',
            groomName: 'Alexander',
            status: 'IN_PROGRESS',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            events: [
              { name: 'Ceremony', date: '2026-10-24', time: '4:30 PM', venue: 'St. Sophia Chapel' },
              { name: 'Reception Banquet', date: '2026-10-24', time: '7:30 PM', venue: 'Botanical Pavilion' },
            ],
          },
          {
            id: 'ord-3',
            orderNumber: 'WED-10839',
            clientName: 'Kavita Patel',
            clientEmail: 'kavita@example.com',
            clientPhone: '+91 99887 76655',
            brideName: 'Kavita',
            groomName: 'Dev',
            status: 'COMPLETED',
            finalVideoUrl: 'https://drive.google.com/file/d/demo-video-link/view',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            events: [
              { name: 'Haldi', date: '2026-12-05', time: '10:00 AM', venue: 'Patel Courtyard' },
              { name: 'Wedding Muhurtham', date: '2026-12-06', time: '11:15 AM', venue: 'Grand Hyatt' },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const inProgressCount = orders.filter((o) => o.status === 'IN_PROGRESS').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED' || o.status === 'DELIVERED').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="destructive">Pending Review</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">Under Video Editing</Badge>;
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
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Studio Dashboard</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage incoming wedding invitation orders, video rendering pipeline, and templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/templates">
            <Button variant="outline" size="sm">
              🎬 Manage Video Templates
            </Button>
          </Link>
          <Link to="/orders">
            <Button variant="primary" size="sm">
              Review Client Orders ({pendingCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders Received</CardDescription>
            <CardTitle className="text-3xl font-extrabold">{orders.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-stone-400">All client invitation requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Video Editing</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-red-600">{pendingCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-stone-400">Action needed: review text details</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Video Software (Editing)</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-amber-600">{inProgressCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-stone-400">After Effects / Premiere / Canva</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rendered & Delivered</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-600">{completedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-stone-400">Final video link sent to couple</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Explanation Banner */}
      <Card className="bg-stone-900 text-white border-stone-800">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-rose-300 flex items-center gap-2">
            <span>⚙️</span> How Your Wedding Video Studio Workflow Operates
          </CardTitle>
          <CardDescription className="text-stone-400 text-xs">
            From client form submission to video software rendering and sharing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80 space-y-1.5">
              <span className="font-bold text-rose-400">Step 1: Client Submits</span>
              <p className="text-[11px] text-stone-300">
                User selects video template on client site and fills Bride, Groom & function details page-by-page.
              </p>
            </div>
            <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80 space-y-1.5">
              <span className="font-bold text-amber-400">Step 2: Admin Reviews</span>
              <p className="text-[11px] text-stone-300">
                Admin opens order in this panel, copies all page-by-page text, dates, venues & music choice.
              </p>
            </div>
            <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80 space-y-1.5">
              <span className="font-bold text-blue-400">Step 3: Edit in Video Tool</span>
              <p className="text-[11px] text-stone-300">
                You edit the template in Premiere, After Effects, or Canva, inserting the couple's exact text and song.
              </p>
            </div>
            <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/80 space-y-1.5">
              <span className="font-bold text-emerald-400">Step 4: Upload & Share</span>
              <p className="text-[11px] text-stone-300">
                Attach the rendered Google Drive or MP4 link, mark as Delivered, and share directly via WhatsApp!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Invitation Orders</CardTitle>
            <CardDescription>Latest client submissions awaiting video customization.</CardDescription>
          </div>
          <Link to="/orders">
            <Button variant="ghost" size="sm">
              View All Orders →
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Couple Names</th>
                  <th className="py-3 px-4">Functions</th>
                  <th className="py-3 px-4">Client Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                    <td className="py-3 px-4 font-semibold text-stone-800">
                      {ord.brideName} & {ord.groomName}
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {ord.events?.length || 0} Function(s)
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {ord.clientPhone}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to="/orders">
                        <Button variant="outline" size="sm">
                          Review Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
