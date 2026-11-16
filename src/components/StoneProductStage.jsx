import React, { useState } from 'react';
import { Cpu, Zap, Wifi, Shield, Activity, Maximize2 } from 'lucide-react';

export const StoneProductStage = ({ onBook }) => {
  const [activePin, setActivePin] = useState(null);

  const telemetryPins = [
    {
      id: 'gpu',
      label: 'RTX 3050 4GB GPU',
      sub: 'Ampere Architecture',
      x: '28%',
      y: '32%',
      align: 'left'
    },
    {
      id: 'cpu',
      label: 'AMD RYZEN 7 7435HS',
      sub: '8 Cores / 16 Threads',
      x: '22%',
      y: '48%',
      align: 'left'
    },
    {
      id: 'screen',
      label: '144Hz IPS FHD+',
      sub: 'Fast Refresh Display',
      x: '68%',
      y: '18%',
      align: 'right'
    },
    {
      id: 'controller',
      label: '2x EvoFox Gamepads',
      sub: 'Hyperconnect™ 2.4GHz USB',
      x: '75%',
      y: '65%',
      align: 'right'
    }
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      
      {/* 3D Neo-Brutalist Wireframe Framing & Telemetry Bar */}
      <div className="flex items-center justify-between pb-3 px-2 text-[10px] font-mono tracking-widest text-[#9EA79C] uppercase border-b border-white/[0.08] mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#C6FF00] animate-ping rounded-full inline-block" />
          <span className="text-[#C6FF00] font-black">SYS.3D // HARDWARE_STAGE</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[#687366]">
          <span>ELEV: 24.5°</span>
          <span>LATENCY: 0.8MS</span>
          <span className="text-[#C6FF00]">PODIUM: BASALT_STONE_SLAB</span>
        </div>
      </div>

      {/* Main 3D Stage Container */}
      <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden glass-panel border border-white/[0.15] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.18)] group">
        
        {/* Background Radial Acid-Lime Backlight Halo */}
        <div className="absolute inset-x-0 top-1/4 h-3/4 bg-radial from-[#C6FF00]/25 via-[#C6FF00]/06 to-transparent blur-3xl pointer-events-none" />

        {/* Ambient Top Cyber Grid */}
        <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none" />

        {/* ------------------------------------------------------------- */}
        {/* PHYSICAL STONE PEDESTAL (BASALT ROCK SLAB LIKE PHOTO)         */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute inset-x-4 bottom-2 sm:bottom-4 h-36 sm:h-44 rounded-2xl overflow-hidden z-10">
          
          {/* Intense Neon Lime Underglow Under the Stone Slab */}
          <div className="absolute -bottom-6 inset-x-8 h-20 bg-[#C6FF00] opacity-40 blur-2xl rounded-full" />
          <div className="absolute bottom-0 inset-x-12 h-6 bg-[#C6FF00] opacity-75 blur-md" />

          {/* Textured Stone Slab Image */}
          <img 
            src="/images/stone-pedestal.jpg" 
            alt="Basalt Stone Pedestal" 
            className="w-full h-full object-cover object-bottom filter contrast-125 brightness-90 saturate-50 mix-blend-luminosity transform scale-105"
          />

          {/* Lime Rim Lighting on the Top Edge of the Stone */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6FF00] to-transparent shadow-[0_0_15px_#C6FF00]" />
          
          {/* Rough Mineral Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Stone Texture Label */}
          <div className="absolute bottom-2 left-4 z-20 flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#9EA79C] uppercase bg-black/70 px-2 py-0.5 rounded border border-white/[0.1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00]" />
            <span>TEXTURE: VOLCANIC_SLATE_BED</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* HARDWARE ON STONE: GAMING LAPTOP & PRO CONTROLLER             */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 pb-12 sm:pb-16 pointer-events-none">
          
          {/* Gaming Laptop (Angled in center-left, resting on the rock) */}
          <div className="relative w-[78%] sm:w-[72%] transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-auto">
            
            {/* Laptop Base Shadow onto Stone */}
            <div className="absolute -bottom-4 inset-x-8 h-8 bg-black/90 blur-xl rounded-full transform scale-y-50" />

            {/* Laptop Hardware Photo */}
            <div className="relative rounded-xl overflow-hidden border border-[#C6FF00]/30 shadow-2xl">
              <img 
                src="/images/laptop-hero.jpg" 
                alt="ASUS TUF Gaming Laptop on Stone Pedestal" 
                className="w-full h-auto object-cover object-center filter brightness-105 contrast-110"
              />
              
              {/* Screen Reflection & Cyber Gloss */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            </div>

            {/* Pro Controller 1 (Foreground right, resting directly on the stone ledge) */}
            <div className="absolute -bottom-8 -right-3 sm:-right-8 w-[40%] sm:w-[38%] z-30 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
              <div className="absolute -bottom-3 inset-x-2 h-6 bg-black/95 blur-md rounded-full transform scale-y-50" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#C6FF00]/60 shadow-[0_15px_35px_rgba(0,0,0,0.9)] bg-[#080A08]">
                <img 
                  src="/images/controller-hero.jpg" 
                  alt="EvoFox Elite Ops Wireless Gamepad 1" 
                  className="w-full h-auto object-cover filter brightness-105 contrast-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-1.5 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-[#C6FF00] border border-[#C6FF00]/40">
                  CTRL 01
                </div>
              </div>
            </div>

            {/* Pro Controller 2 (Foreground left, resting directly on the stone ledge) */}
            <div className="absolute -bottom-6 -left-3 sm:-left-6 w-[34%] sm:w-[32%] z-30 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 -rotate-6">
              <div className="absolute -bottom-3 inset-x-2 h-6 bg-black/95 blur-md rounded-full transform scale-y-50" />
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#C6FF00]/60 shadow-[0_15px_35px_rgba(0,0,0,0.9)] bg-[#080A08]">
                <img 
                  src="/images/controller-hero.jpg" 
                  alt="EvoFox Elite Ops Wireless Gamepad 2" 
                  className="w-full h-auto object-cover filter brightness-105 contrast-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-1.5 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-[#C6FF00] border border-[#C6FF00]/40">
                  CTRL 02
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3D HOLOGRAPHIC TELEMETRY PINS & CONNECTOR NODES               */}
        {/* ------------------------------------------------------------- */}
        {telemetryPins.map((pin) => (
          <div
            key={pin.id}
            style={{ top: pin.y, left: pin.x }}
            onMouseEnter={() => setActivePin(pin.id)}
            onMouseLeave={() => setActivePin(null)}
            className="absolute z-30 hidden sm:flex items-center gap-2 pointer-events-auto cursor-pointer transition-all duration-300"
          >
            {/* Glowing Target Node Indicator */}
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-[#C6FF00] animate-ping absolute opacity-75" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF00] border border-[#080A08] shadow-[0_0_10px_#C6FF00] relative" />
            </div>

            {/* Data Badge with Hairline Border */}
            <div className={`glass-modal border border-white/[0.15] hover:border-[#C6FF00] px-3 py-1.5 rounded-xl text-left shadow-2xl transition-all ${
              activePin === pin.id ? 'border-[#C6FF00] scale-105 shadow-lime-glow' : ''
            }`}>
              <div className="text-[10px] font-mono font-bold text-[#F5F7F2] flex items-center gap-1.5">
                <span>{pin.label}</span>
              </div>
              <div className="text-[8px] font-mono text-[#9EA79C] uppercase">{pin.sub}</div>
            </div>
          </div>
        ))}

        {/* Neo-Brutalist Frame Corner Accents */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#C6FF00] z-20 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#C6FF00] z-20 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#C6FF00] z-20 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#C6FF00] z-20 pointer-events-none" />

      </div>

      {/* Podium Bottom Specs Strip */}
      <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-mono text-[#9EA79C]">
        <div className="flex items-center gap-2">
          <span className="text-[#C6FF00] font-bold">ASUS TUF RYZEN 7 7435HS • RTX 3050 4GB (16GB/512GB) + 2x EVOFOX GAMEPADS</span>
          <span>//</span>
          <span>CALIBRATED FOR COMPETITIVE HOSTEL GAMING</span>
        </div>
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
};
