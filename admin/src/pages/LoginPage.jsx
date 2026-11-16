import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { API_BASE_URL } from '../config/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
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
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (data.user?.role !== 'ADMIN') {
        throw new Error('Access denied: Admin credentials required.');
      }

      login(data.user, data.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminLogin = () => {
    login(
      {
        id: 'admin-123',
        name: 'Wedding Organizer (Demo)',
        email: 'admin@wedding.com',
        role: 'ADMIN',
      },
      'demo-admin-token-jwt'
    );
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            👑
          </div>
          <h2 className="text-xl font-bold text-stone-900">Admin Portal Sign In</h2>
          <p className="text-xs text-stone-500">Access exclusive RSVP & guest management</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wedding.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-black transition shadow-xs disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Sign in as Admin'}
          </button>
        </form>

        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={handleDemoAdminLogin}
            className="w-full py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-xs hover:bg-rose-100 transition"
          >
            ⚡ Instant Demo Admin Login (Click to bypass login)
          </button>
        </div>
      </div>
    </div>
  );
};
