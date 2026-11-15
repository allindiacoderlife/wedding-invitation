'use client';

import React from 'react';
import { getRemainingCharacters } from '@/lib/template-utils';

interface CharacterCountdownInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  helpText?: string;
  error?: string;
  onChange: (value: string) => void;
}

export const CharacterCountdownInput: React.FC<CharacterCountdownInputProps> = ({
  id,
  label,
  value,
  placeholder,
  maxLength,
  required = false,
  helpText,
  error,
  onChange,
}) => {
  const remaining = getRemainingCharacters(maxLength, value.length);
  const isNearLimit = typeof remaining === 'number' && remaining <= 5;
  const isAtLimit = typeof remaining === 'number' && remaining === 0;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>

        {/* Character remaining counter badge (InviteCrafter style) */}
        {typeof remaining === 'number' && (
          <span
            className={`text-xs font-mono font-medium px-2 py-0.5 rounded-md transition-colors ${
              isAtLimit
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 font-bold'
                : isNearLimit
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
            title={`${remaining} characters remaining`}
          >
            {remaining} left
          </span>
        )}
      </div>

      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 ${
            error
              ? 'border-rose-400 focus:ring-rose-400/20 focus:border-rose-500'
              : 'border-zinc-300 dark:border-zinc-700 focus:ring-amber-500/20 focus:border-amber-500'
          }`}
        />
      </div>

      {helpText && !error && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{helpText}</p>
      )}

      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
};

