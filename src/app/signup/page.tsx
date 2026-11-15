'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const res = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );

      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.error || 'Failed to create account');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold text-zinc-900">Create Studio Account</h1>
          <p className="text-xs text-zinc-500">
            Start creating cinematic 60fps wedding video invitations.
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
              Couple / Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Priya & Rohan"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-none focus:border-[#4F7C8F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-none focus:border-[#4F7C8F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs focus:outline-none focus:border-[#4F7C8F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              WhatsApp Contact Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98765 43210"
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500">
          <span>Already have an account? </span>
          <Link href="/login" className="text-[#4F7C8F] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
