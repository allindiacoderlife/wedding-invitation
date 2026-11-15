'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup, loginDemo } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const res = await login(formData.email, formData.password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in');
        }
      } else {
        const res = await signup(
          formData.name,
          formData.email,
          formData.password,
          formData.phone
        );
        if (!res.success) {
          setError(res.error || 'Failed to create account');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginDemo(role);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-zinc-100 relative animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-zinc-200 text-zinc-400 hover:text-black hover:bg-zinc-100 flex items-center justify-center transition-colors text-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Inscription */}
        <div className="text-center space-y-1 mb-6">
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3D6373] to-[#4F7C8F] text-white inline-flex items-center justify-center font-extrabold text-xs shadow-md tracking-tighter mb-2">
            VVV
          </span>
          <h2 className="text-xl font-bold text-zinc-900">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Studio Account'}
          </h2>
          <p className="text-xs text-zinc-500">
            {mode === 'signin'
              ? 'Sign in to access your wedding video invitations and guest RSVPs.'
              : 'Join Vaishno Video Vision to design cinematic 60fps wedding invitations.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-xl text-xs font-bold mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium mb-4">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div className="space-y-1">
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-[#4F7C8F]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
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
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-[#4F7C8F]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-[#4F7C8F]"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Mobile Number (for WhatsApp delivery)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-[#4F7C8F]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#4F7C8F] hover:bg-[#3D6373] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div className="mt-6 pt-5 border-t border-zinc-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-center block">
            Instant 1-Click Test Access
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Demo Couple</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F7C8F]" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
