import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Badge } from './ui/Badge';

export const AdminLayout = () => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
      isActive
        ? 'bg-stone-800 text-white font-semibold'
        : 'text-stone-400 hover:bg-stone-900 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-stone-50/70 text-stone-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-950 text-white flex flex-col shrink-0 border-r border-stone-800">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-stone-800/80">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-xs font-bold font-serif text-white shadow-xs">
              M
            </span>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm tracking-wider text-white">
                MARRIED ADMIN
              </span>
              <span className="text-[9px] uppercase tracking-widest text-stone-400">
                Studio & Video Workflow
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-6 flex-1">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              Studio Management
            </p>
            <NavLink to="/" end className={navClass}>
              <span className="text-base">📊</span>
              <span>Overview</span>
            </NavLink>
            <NavLink to="/orders" className={navClass}>
              <span className="text-base">💌</span>
              <span>Client Orders & Submissions</span>
            </NavLink>
            <NavLink to="/templates" className={navClass}>
              <span className="text-base">🎬</span>
              <span>Video Templates</span>
            </NavLink>
          </div>
        </div>

        {/* Footer in Sidebar */}
        <div className="p-4 border-t border-stone-800/80 space-y-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-900 transition"
          >
            <span>Preview Client Website</span>
            <span>↗</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-stone-900 transition"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main View */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-stone-200/80 flex items-center justify-between px-8 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 font-medium">Workspace:</span>
            <span className="text-xs font-bold text-stone-800">Wedding Invitation Studio</span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="purple">Admin Role</Badge>
            <span className="text-xs font-medium text-stone-700">
              {adminUser?.name || adminUser?.email || 'Admin'}
            </span>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
