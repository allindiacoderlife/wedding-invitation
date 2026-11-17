import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export const ClientLayout = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHome = location.pathname === '/';
  const hideFooter = location.pathname.startsWith('/create-invitation');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Floating Glassmorphic Header */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/create-invitation" className="flex items-center gap-2 group">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-700/10 border border-rose-700/20 text-rose-800 font-serif font-bold flex items-center justify-center text-base sm:text-lg shadow-xs group-hover:scale-105 transition-transform">
              M
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wider text-stone-900 leading-none">
                MARRIED<span className="text-rose-700 font-bold">.</span>
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-stone-400 font-medium mt-0.5">
                Digital Wedding Invitations
              </span>
            </div>
          </Link>

          {/* Active Studio Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-semibold text-xs border border-rose-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-700 animate-pulse"></span>
              Video Invitation Studio
            </span>
          </div>

          {/* 
          ============================================================================
          DISABLED NAVIGATION (Uncomment below to restore full multi-page navigation)
          ============================================================================
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-600">
            {isHome ? (
              <>
                <a href="#features" className="hover:text-rose-700 transition">Features</a>
                <a href="#interactive-demo" className="hover:text-rose-700 transition">Interactive Demo</a>
                <a href="#templates" className="hover:text-rose-700 transition">Templates</a>
                <a href="#dashboard-preview" className="hover:text-rose-700 transition">RSVP Management</a>
                <a href="#pricing" className="hover:text-rose-700 transition">Pricing</a>
                <a href="#faq" className="hover:text-rose-700 transition">FAQ</a>
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-rose-700 transition">Home</Link>
                <Link to="/#features" className="hover:text-rose-700 transition">Features</Link>
                <Link to="/#pricing" className="hover:text-rose-700 transition">Pricing</Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="bg-purple-100 text-purple-900 px-3 py-1.5 rounded-full font-bold hover:bg-purple-200 transition"
              >
                Admin Panel 👑
              </Link>
            )}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-500 font-medium">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs px-3.5 py-2 rounded-full border border-stone-300 text-stone-700 hover:bg-white font-medium transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-900 px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <a
                  href="#interactive-demo"
                  className="text-xs font-semibold px-4 py-2.5 rounded-full border border-stone-300 text-stone-800 bg-white hover:bg-stone-50 transition shadow-2xs"
                >
                  Live Demo
                </a>
                <Link to="/track-order" className="hover:text-rose-700 transition">Track Order</Link>
                <Link
                  to="/create-invitation"
                  className="text-xs font-semibold px-5 py-2.5 rounded-full bg-rose-800 text-white hover:bg-rose-900 transition shadow-xs hover:shadow-sm"
                >
                  Create Invitation
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 rounded-lg hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          ============================================================================
          */}
        </div>

        {/* 
        ============================================================================
        DISABLED MOBILE DROPDOWN (Uncomment to restore)
        ============================================================================
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-4 space-y-3 text-sm">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-700 hover:text-rose-700"
            >
              Features
            </a>
            <a
              href="#interactive-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-700 hover:text-rose-700"
            >
              Interactive Demo
            </a>
            <a
              href="#templates"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-700 hover:text-rose-700"
            >
              Templates
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-700 hover:text-rose-700"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-700 hover:text-rose-700"
            >
              FAQ
            </a>
            <hr className="border-stone-100" />
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-lg border border-stone-200 text-stone-700 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-lg bg-rose-800 text-white font-medium shadow-xs"
              >
                Create Invitation Free
              </Link>
            </div>
          </div>
        )}
        ============================================================================
        */}
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Luxury Footer (Hidden on /create-invitation) */}
      {!hideFooter && (
        <footer className="border-t border-stone-200/80 bg-stone-900 text-white pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
              {/* Col 1 */}
              <div className="space-y-4 md:col-span-1">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-rose-600/30 text-rose-300 font-serif font-bold flex items-center justify-center text-sm">
                    M
                  </span>
                  <span className="font-serif text-2xl font-bold tracking-wider">
                    MARRIED<span className="text-rose-400">.</span>
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  The modern, paperless digital wedding invitation platform. Beautiful interactive invitations, real-time RSVP tracking, Google Maps directions, and unforgettable guest experiences.
                </p>
                <div className="flex items-center gap-3 text-stone-400 text-sm">
                  <span>💌 hello@married.me</span>
                </div>
              </div>

              {/* Col 2 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">Features</h4>
                <ul className="space-y-2 text-xs text-stone-400">
                  <li><a href="#features" className="hover:text-white transition">Online RSVP Tracking</a></li>
                  <li><a href="#interactive-demo" className="hover:text-white transition">1-Click Google Maps</a></li>
                  <li><a href="#interactive-demo" className="hover:text-white transition">Interactive Schedule</a></li>
                  <li><a href="#interactive-demo" className="hover:text-white transition">Digital Envelope & IBAN</a></li>
                  <li><a href="#features" className="hover:text-white transition">Live Photo Gallery</a></li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">Wedding Themes</h4>
                <ul className="space-y-2 text-xs text-stone-400">
                  <li><a href="#templates" className="hover:text-white transition">Classic Elegance</a></li>
                  <li><a href="#templates" className="hover:text-white transition">Aegean / Island Breeze</a></li>
                  <li><a href="#templates" className="hover:text-white transition">Botanical Garden</a></li>
                  <li><a href="#templates" className="hover:text-white transition">Golden Sunset</a></li>
                  <li><a href="#templates" className="hover:text-white transition">Minimalist Chic</a></li>
                </ul>
              </div>

              {/* Col 4 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">Plan With Confidence</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Send your wedding invitations via WhatsApp, SMS, or QR code in seconds. No apps required for guests.
                </p>
                <div className="pt-2">
                  <Link
                    to="/register"
                    className="inline-block px-5 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-xs transition"
                  >
                    Start Your Invitation →
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
              <p>© {new Date().getFullYear()} MARRIED. All rights reserved. Created with love for unforgettable celebrations.</p>
              <div className="flex items-center gap-6">
                <a href="#faq" className="hover:text-stone-300 transition">FAQ</a>
                <Link to="/login" className="hover:text-stone-300 transition">Guest Login</Link>
                <Link to="/admin" className="hover:text-stone-300 transition">Admin Portal</Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
