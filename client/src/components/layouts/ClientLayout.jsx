import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ClientLayout = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl text-rose-800 tracking-wide font-medium">
              Eternal Vows
            </span>
            <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
              Wedding
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-stone-700 hover:text-rose-700 transition"
            >
              Home
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs font-semibold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md hover:bg-purple-200 transition"
              >
                Admin Panel
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-600 hidden sm:inline">
                  Hi, <strong className="text-stone-900">{user?.name || user?.email}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-stone-700 hover:text-rose-700 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-rose-700 text-white px-3.5 py-1.5 rounded-lg hover:bg-rose-800 shadow-xs transition"
                >
                  RSVP / Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Client Footer */}
      <footer className="border-t border-rose-100 bg-white py-8 text-center text-stone-500 text-sm">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-serif text-rose-900 font-medium mb-1">
            Forever & Always
          </p>
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} Wedding Invitation Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
