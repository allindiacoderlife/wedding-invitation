import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-rose-700 text-white shadow-xs'
        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-stone-100 text-stone-900">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-stone-800">
          <Link to="/admin" className="font-serif text-xl tracking-wide text-rose-300 font-semibold">
            Wedding Admin
          </Link>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          <NavLink to="/admin" end className={navLinkClass}>
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/guests" className={navLinkClass}>
            <span>💌</span>
            <span>Guests & RSVPs</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <span>←</span>
            <span>Back to Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-stone-800 transition"
          >
            <span>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6">
          <h1 className="text-base font-semibold text-stone-700">Admin Control Center</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">
              Role: {user?.role || 'ADMIN'}
            </span>
            <span className="text-sm text-stone-600 font-medium">
              {user?.name || user?.email}
            </span>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
