import { useState } from 'react';

export const AdminGuests = () => {
  const [filter, setFilter] = useState('ALL');

  const guestData = [
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', partySize: 2, status: 'CONFIRMED', dietary: 'Vegetarian' },
    { id: 2, name: 'David Miller', email: 'david.m@example.com', partySize: 2, status: 'CONFIRMED', dietary: 'None' },
    { id: 3, name: 'Emily Miller', email: 'emily.m@example.com', partySize: 1, status: 'CONFIRMED', dietary: 'Gluten-Free' },
    { id: 4, name: 'Robert Chen', email: 'robert.chen@example.com', partySize: 1, status: 'DECLINED', dietary: '-' },
    { id: 5, name: 'Maria Rodriguez', email: 'maria.r@example.com', partySize: 3, status: 'CONFIRMED', dietary: 'Vegan' },
    { id: 6, name: 'Thomas Wright', email: 'thomas.w@example.com', partySize: 2, status: 'PENDING', dietary: 'Awaiting notes' },
    { id: 7, name: 'Chloe Bennett', email: 'chloe.b@example.com', partySize: 1, status: 'PENDING', dietary: 'Awaiting notes' },
  ];

  const filtered = guestData.filter((g) => {
    if (filter === 'ALL') return true;
    return g.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Guest List & Attendance</h2>
          <p className="text-xs text-stone-500 mt-0.5">Filter and manage invitations and dinner preferences</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-medium">
          {['ALL', 'CONFIRMED', 'PENDING', 'DECLINED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition capitalize ${
                filter === tab ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Guest Name</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Seats Reserved</th>
                <th className="py-3.5 px-6">Dietary Notes</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-4 px-6 font-medium text-stone-900">{g.name}</td>
                  <td className="py-4 px-6 text-stone-500">{g.email}</td>
                  <td className="py-4 px-6 font-semibold text-stone-800">{g.partySize}</td>
                  <td className="py-4 px-6 text-stone-500">{g.dietary}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                        g.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : g.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
