import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export const DashboardPage = () => {
  const { adminUser } = useAdminAuth();

  const metrics = [
    { title: 'Total Invited', count: '185', sub: 'Invites delivered', icon: '💌' },
    { title: 'Attending (Yes)', count: '138', sub: '74% of guest list', icon: '✨' },
    { title: 'Pending RSVPs', count: '35', sub: 'Awaiting submission', icon: '⏳' },
    { title: 'Declined (No)', count: '12', sub: 'With love & blessings', icon: '🕊️' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            Welcome, {adminUser?.name || 'Administrator'}!
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Track RSVPs, seating capacities, and meal preferences in real time.
          </p>
        </div>
        <Link
          to="/guests"
          className="px-4 py-2 bg-rose-700 text-white rounded-xl text-xs font-semibold hover:bg-rose-800 transition shadow-xs"
        >
          View Full Guest List →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{m.title}</span>
              <span className="text-xl">{m.icon}</span>
            </div>
            <div className="text-3xl font-extrabold text-stone-900">{m.count}</div>
            <p className="text-[11px] text-stone-400">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-stone-800">Wedding Checklist Status</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-700 font-medium">Digital Invitations Dispatched</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">100% Done</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-700 font-medium">Catering Dietary Counts Finalized</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">In Progress</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-700 font-medium">Seating Chart Arrangements</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-semibold">Ready for Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};
