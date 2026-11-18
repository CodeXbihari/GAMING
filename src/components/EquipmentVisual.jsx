import React from 'react';

export const EquipmentVisual = ({ type, className = "h-40 w-full" }) => {
  if (type === 'laptop') {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden p-2 group ${className}`}>
        {/* Subtle ambient green spotlight */}
        <div className="absolute inset-0 bg-radial from-[#36D98A]/18 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Rendered High-Fidelity TUF Gaming Laptop */}
        <svg viewBox="0 0 320 200" className="w-full h-full max-h-44 drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-105">
          <defs>
            <linearGradient id="laptopLid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A3035" />
              <stop offset="45%" stopColor="#151A1D" />
              <stop offset="100%" stopColor="#0B0E10" />
            </linearGradient>
            <linearGradient id="laptopScreen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0E1A14" />
              <stop offset="40%" stopColor="#07100B" />
              <stop offset="100%" stopColor="#030504" />
            </linearGradient>
            <linearGradient id="rogNeon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#36D98A" />
              <stop offset="50%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#36D98A" />
            </linearGradient>
            <filter id="emeraldGlowFine" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="rogAura" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ambient Screen Glow behind Display */}
          <ellipse cx="160" cy="75" rx="85" ry="45" fill="#36D98A" opacity="0.22" filter="url(#rogAura)" />

          {/* Laptop Screen Bezel */}
          <polygon points="56,122 70,24 250,24 264,122" fill="url(#laptopLid)" stroke="#2F3B34" strokeWidth="1.8" />
          
          {/* Inner Display Glass */}
          <polygon points="63,118 75,31 245,31 257,118" fill="url(#laptopScreen)" stroke="#111815" strokeWidth="1.2" />

          {/* Cyberpunk ROG Eye Logo on Screen */}
          <g transform="translate(132, 45) scale(0.62)" filter="url(#emeraldGlowFine)">
            {/* Upper Slash / Wing */}
            <path d="M5 42 C18 28, 42 10, 88 10 C68 25, 58 43, 54 48 C42 36, 26 38, 5 42 Z" fill="url(#rogNeon)" />
            {/* Lower Eye Arch */}
            <path d="M54 48 C57 56, 68 70, 88 73 C72 68, 60 58, 54 48 Z" fill="#36D98A" />
            {/* Inner Glint */}
            <polygon points="14,26 36,26 10,40" fill="#00E5FF" opacity="0.85" />
          </g>

          {/* Keyboard Deck & Chassis Base */}
          <polygon points="22,170 56,122 264,122 298,170" fill="#171F1B" stroke="#2B3931" strokeWidth="1.5" />
          
          {/* Front Bevel Lip with Emerald LED Lightbar Strip */}
          <polygon points="22,170 298,170 292,178 28,178" fill="#0D1310" stroke="#16B86A" strokeWidth="0.8" />
          <line x1="42" y1="176" x2="278" y2="176" stroke="#36D98A" strokeWidth="2.5" filter="url(#emeraldGlowFine)" />

          {/* Recessed Keyboard Well */}
          <polygon points="64,126 73,126 247,126 256,126 268,156 52,156" fill="#0A0E0C" stroke="#19241E" strokeWidth="1" />
          
          {/* Backlit Key Rows Effect */}
          <g opacity="0.8" stroke="#36D98A" strokeWidth="0.8">
            <line x1="62" y1="133" x2="258" y2="133" strokeDasharray="5,2" />
            <line x1="58" y1="140" x2="262" y2="140" strokeDasharray="6,2" />
            <line x1="55" y1="147" x2="265" y2="147" strokeDasharray="7,2" />
            <line x1="52" y1="154" x2="268" y2="154" strokeDasharray="9,3" />
          </g>

          {/* Touchpad with Emerald Accent Border */}
          <polygon points="132,158 188,158 191,168 129,168" fill="#111714" stroke="#36D98A" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </div>
    );
  }

  if (type === 'controller') {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden p-2 group ${className}`}>
        {/* Subtle ambient green spotlight */}
        <div className="absolute inset-0 bg-radial from-[#36D98A]/18 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Rendered High-Precision Wireless Controller */}
        <svg viewBox="0 0 300 190" className="w-full h-full max-h-44 drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-105">
          <defs>
            <linearGradient id="controllerBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#282E32" />
              <stop offset="55%" stopColor="#151A1D" />
              <stop offset="100%" stopColor="#0B0E10" />
            </linearGradient>
            <linearGradient id="analogStick" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#353D42" />
              <stop offset="100%" stopColor="#121618" />
            </linearGradient>
            <filter id="controllerHalo">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ambient Center Glow */}
          <circle cx="150" cy="80" r="28" fill="#36D98A" opacity="0.25" filter="url(#controllerHalo)" />

          {/* Ergonomic Wing Handles & Chassis */}
          <path 
            d="M 62 165 C 42 150 32 105 52 62 C 67 33 110 33 150 45 C 190 33 233 33 248 62 C 268 105 258 150 238 165 C 218 178 198 145 183 122 C 163 127 137 127 117 122 C 102 145 82 178 62 165 Z" 
            fill="url(#controllerBody)" 
            stroke="#28342D" 
            strokeWidth="2" 
          />

          {/* Textured Grips */}
          <path d="M 48 100 C 48 122 57 146 68 155" stroke="#0E1311" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          <path d="M 252 100 C 252 122 243 146 232 155" stroke="#0E1311" strokeWidth="4" strokeLinecap="round" opacity="0.7" />

          {/* Center Nexus Button with Emerald Halo */}
          <circle cx="150" cy="78" r="13" fill="#121815" stroke="#36D98A" strokeWidth="2.2" filter="url(#controllerHalo)" />
          {/* Glowing Emblem */}
          <path d="M144 73 L156 83 M156 73 L144 83" stroke="#36D98A" strokeWidth="2.2" strokeLinecap="round" />

          {/* Left D-Pad */}
          <g transform="translate(94, 88)">
            <rect x="0" y="7" width="26" height="12" rx="2.5" fill="#1F2529" stroke="#313C36" strokeWidth="1" />
            <rect x="7" y="0" width="12" height="26" rx="2.5" fill="#1F2529" stroke="#313C36" strokeWidth="1" />
            <circle cx="13" cy="13" r="3" fill="#101416" />
          </g>

          {/* Left Analog Thumbstick */}
          <circle cx="106" cy="62" r="18" fill="#101416" stroke="#252F2A" strokeWidth="1.5" />
          <circle cx="106" cy="62" r="13" fill="url(#analogStick)" stroke="#36D98A" strokeWidth="1" />
          <circle cx="106" cy="62" r="3.5" fill="#090C0D" />

          {/* Right Analog Thumbstick */}
          <circle cx="174" cy="98" r="18" fill="#101416" stroke="#252F2A" strokeWidth="1.5" />
          <circle cx="174" cy="98" r="13" fill="url(#analogStick)" stroke="#36D98A" strokeWidth="1" />
          <circle cx="174" cy="98" r="3.5" fill="#090C0D" />

          {/* 4 Action Buttons (Y, B, A, X) */}
          <g transform="translate(193, 56)">
            {/* Top Y button (Gold) */}
            <circle cx="14" cy="0" r="5" fill="#222826" stroke="#D8B45A" strokeWidth="1.4" />
            {/* Right B button (Red) */}
            <circle cx="25" cy="11" r="5" fill="#222826" stroke="#F04444" strokeWidth="1.4" />
            {/* Bottom A button (Emerald Green) */}
            <circle cx="14" cy="22" r="5" fill="#222826" stroke="#36D98A" strokeWidth="1.4" />
            {/* Left X button (Cyan Blue) */}
            <circle cx="3" cy="11" r="5" fill="#222826" stroke="#00C4FF" strokeWidth="1.4" />
          </g>

          {/* Top Shoulder Bumpers */}
          <path d="M 76 38 Q 105 34 125 39" stroke="#26302B" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 175 39 Q 195 34 224 38" stroke="#26302B" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Combo Setup (Laptop + 2 Controllers together)
  return (
    <div className={`relative flex items-center justify-center overflow-hidden p-2 group ${className}`}>
      {/* Ambient gold + green spotlight matching combo card in reference */}
      <div className="absolute inset-0 bg-radial from-[#D8B45A]/16 via-[#C6FF00]/12 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background Angled Laptop */}
        <div className="w-[80%] -translate-y-3 transition-transform duration-500 group-hover:-translate-y-4">
          <EquipmentVisual type="laptop" className="h-32 w-full !p-0" />
        </div>
        {/* Foreground Left Controller */}
        <div className="absolute bottom-0 left-0 w-[48%] translate-y-3 -rotate-6 drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-105">
          <EquipmentVisual type="controller" className="h-24 w-full !p-0" />
        </div>
        {/* Foreground Right Controller */}
        <div className="absolute bottom-0 right-0 w-[48%] translate-y-3 rotate-6 drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-105">
          <EquipmentVisual type="controller" className="h-24 w-full !p-0" />
        </div>
      </div>
    </div>
  );
};
