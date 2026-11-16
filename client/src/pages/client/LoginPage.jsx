import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';

export const LoginPage = () => {
  const [mode, setMode] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details?.isVerified === false || data.message?.includes('not verified')) {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
          return;
        }
        throw new Error(data.message || 'Login failed');
      }

      login(data.user, data.token);
      if (data.user?.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Network error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/request-login-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

      navigate(`/verify-otp?email=${encodeURIComponent(email)}&type=LOGIN`);
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-rose-100 p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-serif font-bold text-stone-800">Sign in to your invitation</h2>
          <p className="text-xs text-stone-500">Access RSVP responses and wedding updates</p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode('password')}
            className={`py-2 rounded-lg transition ${
              mode === 'password' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => setMode('otp')}
            className={`py-2 rounded-lg transition ${
              mode === 'otp' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
            }`}
          >
            Email OTP Login
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-rose-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-rose-700 text-white font-medium text-sm hover:bg-rose-800 transition disabled:opacity-60 shadow-xs"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-rose-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-rose-700 text-white font-medium text-sm hover:bg-rose-800 transition disabled:opacity-60 shadow-xs"
            >
              {loading ? 'Sending OTP...' : 'Send Login OTP Code'}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-rose-700 font-medium hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
