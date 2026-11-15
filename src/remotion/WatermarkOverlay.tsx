import React from 'react';

export const WatermarkOverlay: React.FC = () => {
  return (
    <div className="absolute bottom-6 right-6 z-50 pointer-events-none select-none opacity-60">
      <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white font-sans text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Created with Vaishno Video Vision
      </div>
    </div>
  );
};

