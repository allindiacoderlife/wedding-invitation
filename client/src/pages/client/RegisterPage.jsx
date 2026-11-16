import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}&type=EMAIL_VERIFICATION`);
    } catch (err) {
      setError(err.message || 'Network error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-rose-100 p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-serif font-bold text-stone-800">Create an Account</h2>
          <p className="text-xs text-stone-500">Register to submit RSVPs or manage celebrations</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-rose-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Email address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-rose-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-rose-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Account Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm bg-white focus:outline-rose-600"
            >
              <option value="USER">USER (Wedding Guest)</option>
              <option value="ADMIN">ADMIN (Wedding Host / Organizer)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-rose-700 text-white font-medium text-sm hover:bg-rose-800 transition disabled:opacity-60 shadow-xs"
          >
            {loading ? 'Creating account...' : 'Register & Receive OTP'}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="text-rose-700 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
