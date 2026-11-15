'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { TemplateScene } from '@/types/template';

interface ProgressBarProps {
  scenes: TemplateScene[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  scenes,
  currentStepIndex,
  onStepClick,
}) => {
  const totalSteps = scenes.length + 1; // Scenes + 1 Audio/Review Step
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  const stepsList = [
    ...scenes.map((scene) => ({
      title: scene.title,
      id: scene.id,
    })),
    {
      title: 'Music & Review',
      id: 'step-audio-review',
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-4 px-4 sm:px-8">
      {/* Top Header: Progress percentage & current step name */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {stepsList[currentStepIndex]?.title}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {progressPercent}% Completed
          </span>
        </div>
      </div>

      {/* Thin animated progress bar */}
      <div className="max-w-4xl mx-auto w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Pills for quick navigation */}
      <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {stepsList.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                  : isDone
                  ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100'
                  : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {isDone ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px]">
                  {idx + 1}
                </span>
              )}
              <span>{step.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

