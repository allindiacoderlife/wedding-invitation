'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  Heart,
} from 'lucide-react';

export const UserNavMenu: React.FC = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={openAuthModal}
        className="px-4 py-2 rounded-full border border-black/15 text-xs font-semibold text-zinc-800 hover:border-black hover:text-black transition-all"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 transition-all text-xs font-semibold text-zinc-800"
      >
        <div className="w-6 h-6 rounded-full bg-[#4F7C8F] text-white flex items-center justify-center font-bold text-[10px]">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="max-w-[120px] truncate">{user.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 z-50 text-xs animate-in fade-in duration-150">
            <div className="px-3 py-2 border-b border-zinc-100">
              <p className="font-bold text-zinc-900 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-1 px-2 py-0.2 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold uppercase">
                  Admin
                </span>
              )}
            </div>

            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                <span>My Dashboard</span>
              </Link>
            </div>

            <div className="pt-1 border-t border-zinc-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
