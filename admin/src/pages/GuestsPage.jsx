import { useState } from 'react';

export const GuestsPage = () => {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const guests = [
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', table: 'Table 3', count: 2, status: 'CONFIRMED' },
    { id: 2, name: 'David & Emily Miller', email: 'david.m@example.com', table: 'Table 1', count: 2, status: 'CONFIRMED' },
    { id: 3, name: 'Robert Chen', email: 'robert.c@example.com', table: '-', count: 1, status: 'DECLINED' },
    { id: 4, name: 'Maria Rodriguez', email: 'maria.r@example.com', table: 'Table 5', count: 3, status: 'CONFIRMED' },
    { id: 5, name: 'Arthur Pendelton', email: 'arthur.p@example.com', table: 'Unassigned', count: 2, status: 'PENDING' },
    { id: 6, name: 'Chloe Bennett', email: 'chloe.b@example.com', table: 'Unassigned', count: 1, status: 'PENDING' },
  ];

  const filtered = guests.filter((g) => {
    const matchesFilter = filter === 'ALL' || g.status === filter;
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Manage Wedding Guests</h2>
          <p className="text-xs text-stone-500 mt-1">Review guest headcount and table assignments.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name or email..."
            className="px-3.5 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-rose-600"
          />

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'CONFIRMED', 'PENDING', 'DECLINED'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === s ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Seating Table</th>
              <th className="py-3 px-6">Seats Reserved</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((g) => (
              <tr key={g.id} className="hover:bg-stone-50/70 transition">
                <td className="py-3.5 px-6 font-semibold text-stone-900">{g.name}</td>
                <td className="py-3.5 px-6 text-stone-500">{g.email}</td>
                <td className="py-3.5 px-6 font-medium text-stone-700">{g.table}</td>
                <td className="py-3.5 px-6 font-bold text-stone-900">{g.count}</td>
                <td className="py-3.5 px-6">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      g.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : g.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
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
  );
};
