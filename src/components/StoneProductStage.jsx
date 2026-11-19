import React from 'react';

export const StoneProductStage = ({ onBook, useHeroBackground = false }) => (
  <div className="relative w-full max-w-2xl mx-auto select-none">
    <div className="stone-stage-visual relative aspect-[16/11] sm:aspect-[16/10] w-full">
      {!useHeroBackground && (
        <img
          src="/images/hero-neon-hardware.png"
          alt="ASUS TUF laptop and two EvoFox gamepads on cracked volcanic stone with neon lime lighting and smoke"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          fetchPriority="high"
        />
      )}
    </div>
    <div className="stone-stage-action mt-3 flex justify-end px-2">
      <button
        onClick={onBook}
        className="text-xs font-black text-[#C6FF00] hover:text-[#D4FF33] uppercase tracking-wider transition-colors flex items-center gap-1 underline underline-offset-4"
      >
        <span>Reserve Rig & Stone Dock</span>
        <span>↗</span>
      </button>
    </div>
  </div>
);
