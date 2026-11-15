import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const HomePage = () => {
  const { user, isAuthenticated, isAdmin, login } = useAuth();

  // Helper for quick local development testing
  const handleQuickDemoAdmin = () => {
    login(
      {
        id: 'demo-admin-id',
        email: 'admin@wedding.com',
        name: 'Wedding Organizer (Demo)',
        role: 'ADMIN',
        isVerified: true,
      },
      'demo-admin-jwt-token'
    );
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Invitation Section */}
      <section className="text-center px-4 max-w-4xl mx-auto space-y-6">
        <p className="text-xs uppercase tracking-widest text-rose-600 font-semibold">
          Together with their families
        </p>
        <h1 className="text-4xl sm:text-6xl font-serif text-stone-900 tracking-tight">
          Sophia & Alexander
        </h1>
        <p className="text-lg text-stone-600 font-light italic">
          Invite you to celebrate their wedding day
        </p>

        <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-xs border border-rose-100 text-stone-700 text-sm">
          <span>📅 October 24, 2026</span>
          <span className="text-rose-200">|</span>
          <span>📍 Grand Botanical Pavilion</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-rose-700 text-white font-medium hover:bg-rose-800 shadow-sm transition"
          >
            RSVP for the Wedding
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-white border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition"
          >
            Guest Login
          </Link>
        </div>
      </section>

      {/* Dev / Quick Test Info Box */}
      <section className="max-w-2xl mx-auto px-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
              <span>⚡</span> Quick Role & Auth Demonstration
            </h3>
            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
              Status: {isAuthenticated ? `Logged in as ${user?.role}` : 'Guest (Not logged in)'}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            You can test the client and admin routes right away. Try signing in as Admin or using the quick demo button below to preview the protected <code>/admin</code> dashboard.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {!isAdmin ? (
              <button
                onClick={handleQuickDemoAdmin}
                className="text-xs px-3.5 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-medium"
              >
                Set Demo Admin Role
              </button>
            ) : (
              <Link
                to="/admin"
                className="text-xs px-3.5 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-medium"
              >
                Open Admin Dashboard →
              </Link>
            )}
            <Link
              to="/admin"
              className="text-xs px-3 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition"
            >
              Test Protected /admin Route
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
