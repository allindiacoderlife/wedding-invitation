import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Guests Invited', value: '185', icon: '💌', change: '+12 this week' },
    { label: 'RSVP Confirmed', value: '138', icon: '✅', change: '74% attendance' },
    { label: 'Awaiting Response', value: '35', icon: '⏳', change: 'Follow-up needed' },
    { label: 'Declined with Regrets', value: '12', icon: '🕊️', change: '6%' },
  ];

  const recentRsvps = [
    { name: 'Sarah Jenkins', email: 'sarah.j@example.com', partySize: 2, status: 'Confirmed', time: '10 mins ago' },
    { name: 'David & Emily Miller', email: 'david.m@example.com', partySize: 2, status: 'Confirmed', time: '1 hour ago' },
    { name: 'Robert Chen', email: 'robert.chen@example.com', partySize: 1, status: 'Declined', time: '3 hours ago' },
    { name: 'Maria Rodriguez', email: 'maria.r@example.com', partySize: 3, status: 'Confirmed', time: 'Yesterday' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            Welcome back, {user?.name || 'Wedding Administrator'}!
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Overview of Sophia & Alexander's wedding celebration responses.
          </p>
        </div>
        <Link
          to="/admin/guests"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-700 text-white text-xs font-semibold rounded-lg hover:bg-rose-800 transition"
        >
          <span>Manage Guest List</span>
          <span>→</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                {s.label}
              </span>
              <span className="text-xl">{s.icon}</span>
            </div>
            <div className="text-2xl font-bold text-stone-900">{s.value}</div>
            <div className="text-[11px] text-stone-500">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800">Recent RSVP Responses</h3>
          <span className="text-xs text-stone-400">Live guest feed</span>
        </div>

        <div className="divide-y divide-stone-100">
          {recentRsvps.map((rsvp, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-900">{rsvp.name}</p>
                <p className="text-xs text-stone-400">{rsvp.email} • {rsvp.partySize} Guest(s)</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    rsvp.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {rsvp.status}
                </span>
                <span className="text-xs text-stone-400 hidden sm:inline">{rsvp.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
