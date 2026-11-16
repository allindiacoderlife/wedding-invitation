import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';

export const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialType = searchParams.get('type') || 'EMAIL_VERIFICATION';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type: initialType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      login(data.user, data.token);

      if (data.user?.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Please provide your email address first.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setResending(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: initialType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');

      setSuccessMsg('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-rose-100 p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto text-xl mb-2">
            ✉️
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-800">Verify Your OTP</h2>
          <p className="text-xs text-stone-500">
            Enter the 6-digit code sent to <strong>{email || 'your email'}</strong>
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {!initialEmail && (
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
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">6-Digit OTP Code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full tracking-widest text-center font-mono text-xl py-2.5 rounded-lg border border-stone-200 focus:outline-rose-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-rose-700 text-white font-medium text-sm hover:bg-rose-800 transition disabled:opacity-60 shadow-xs"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="text-xs text-stone-600 hover:text-rose-700 font-medium transition disabled:opacity-50"
          >
            {resending ? 'Sending...' : "Didn't receive the code? Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};
