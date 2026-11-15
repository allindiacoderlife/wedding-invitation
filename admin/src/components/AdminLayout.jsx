import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLayout = () => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition ${
      isActive
        ? 'bg-rose-700 text-white shadow-xs'
        : 'text-stone-400 hover:bg-stone-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-stone-100 text-stone-900">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-950 text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-stone-800">
          <Link to="/" className="font-serif text-lg tracking-wider text-rose-300 font-bold">
            Wedding Manager
          </Link>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          <NavLink to="/" end className={navClass}>
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/guests" className={navClass}>
            <span>💌</span>
            <span>Guests & RSVPs</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-stone-900 transition"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6">
          <h1 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
            Sophia & Alexander Wedding Administration
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-semibold">
              Admin
            </span>
            <span className="text-xs text-stone-600 font-medium">
              {adminUser?.name || adminUser?.email || 'Administrator'}
            </span>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
