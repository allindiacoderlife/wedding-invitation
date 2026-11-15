'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDemo, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemo = async (role: 'user' | 'admin') => {
    setIsSubmitting(true);
    await loginDemo(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#2C3531] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-zinc-200/80 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3D6373] to-[#4F7C8F] text-white inline-flex items-center justify-center font-extrabold text-sm shadow-md tracking-tighter">
              VVV
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900">Sign in to your Studio</h1>
          <p className="text-xs text-zinc-500">
            Vaishno Video Vision • Wedding Invitation Video Creator
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-none focus:border-[#4F7C8F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-none focus:border-[#4F7C8F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#4F7C8F] hover:bg-[#3D6373] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Buttons */}
        <div className="pt-4 border-t border-zinc-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-center block">
            Instant 1-Click Demo Sign In
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemo('user')}
              className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Demo Couple</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F7C8F]" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-500">
          <span>Don&apos;t have an account? </span>
          <Link href="/signup" className="text-[#4F7C8F] font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
