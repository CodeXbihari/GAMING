import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowUpRight, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Gamepad2, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Monitor,
  Flame,
  Layers,
  ArrowRight,
  Crosshair,
  Terminal,
  Activity
} from 'lucide-react';
import { StoneProductStage } from '../components/StoneProductStage';
import { Hero3DBackground } from '../components/Hero3DBackground';

export const HomePage = () => {
  const { setCurrentPage, setSelectedEquipment, equipmentList } = useApp();
  const [activeGearTab, setActiveGearTab] = useState('combo');

  // Interactive Hardware showcase details
  const gearSpecs = {
    laptop: {
      id: 'eq-laptop-01',
      title: 'ASUS TUF GAMING LAPTOP',
      subtitle: 'AMD Ryzen 7 7435HS • RTX 3050 4GB GPU • 144Hz FHD',
      code: 'TUF_RYZEN7_7435HS',
      price: '₹49',
      period: '/hr',
      image: '/images/laptop-inspect-neon.jpg',
      badge: 'AMD RYZEN 7 7435HS • RTX 3050 4GB',
      specs: [
        { label: 'Display', value: '144Hz Full HD IPS' },
        { label: 'Graphics', value: 'RTX 3050 4GB GDDR6' },
        { label: 'Processor', value: 'AMD Ryzen 7 7435HS' },
        { label: 'Memory', value: '16GB DDR5 RAM' },
        { label: 'Storage', value: '512GB NVMe SSD' },
        { label: 'Cooling', value: 'Dual Fan Cooling' },
      ],
      nodes: [
        { title: '144Hz FHD Display', desc: 'Ultra-fluid competitive visuals', top: '18%', left: '10%' },
        { title: 'AMD Ryzen 7 7435HS', desc: '8-Core 16-Thread High Performance', top: '70%', left: '8%' },
        { title: 'RTX 3050 4GB GPU', desc: 'Ray tracing & DLSS acceleration', top: '72%', right: '10%' },
      ]
    },
    controller: {
      id: 'eq-controller-01',
      title: 'EVOFOX ELITE OPS WIRELESS',
      subtitle: 'EvoFox Elite Ops Wireless Gamepad • Hyperconnect™ 2.4GHz',
      code: 'EVOFOX_HYPERCONNECT',
      price: '₹29',
      period: '/hr',
      image: '/images/controller-inspect-neon.jpg',
      badge: 'EVOFOX ELITE OPS • 2.4GHz HYPERCONNECT',
      specs: [
        { label: 'Gamepad', value: 'EvoFox Elite Ops Wireless' },
        { label: 'Connection', value: 'Hyperconnect™ 2.4GHz Dongle' },
        { label: 'Haptics', value: 'Dual Rumble Motors' },
        { label: 'Grip', value: 'Textured Handles' },
        { label: 'Combo Match', value: '2x same gamepads in Combo' },
        { label: 'Standalone Rate', value: '₹29 per hour' },
      ],
      nodes: [
        { title: 'Hyperconnect™ 2.4GHz', desc: 'Ultra-low latency wireless dongle', top: '22%', left: '10%' },
        { title: 'Dual Rumble Vibration', desc: 'Immersive in-game feedback motors', top: '45%', right: '8%' },
        { title: 'Ergonomic Rubber Grip', desc: 'Textured slip-resistant handles', top: '72%', left: '12%' },
      ]
    },
    combo: {
      id: 'eq-combo-01',
      title: 'FULL BATTLE STATION COMBO',
      subtitle: 'ASUS TUF Laptop + 2x EvoFox Wireless Gamepads',
      code: 'TUF_DUAL_COMBO',
      price: '₹69',
      period: '/hr',
      image: '/images/combo-inspect-battle-station.png',
      badge: 'TUF LAPTOP + 2x EVOFOX GAMEPADS',
      specs: [
        { label: 'Laptop Rig', value: 'ASUS TUF Ryzen 7 7435HS • RTX 3050 4GB' },
        { label: 'Gamepads', value: '2x EvoFox Elite Ops Wireless' },
        { label: 'Connection', value: 'Hyperconnect™ 2.4GHz Dongles' },
        { label: 'Peripherals', value: 'Power Brick + Type-C Cables' },
        { label: 'Game Library', value: 'Pre-Installed AAA Titles' },
        { label: 'Session Access', value: 'Instant Slot Activation' },
      ],
      nodes: [
        { title: 'Hardware Pre-Synced', desc: 'Plug-and-play wireless & ready to launch', top: '15%', left: '12%' },
        { title: 'Stone Podium Dock', desc: 'Curated tournament battle station', top: '68%', left: '8%' },
        { title: 'Dual Gamepad Action', desc: 'Instant multiplayer local co-op & scrims', top: '35%', right: '8%' },
      ]
    }
  };

  const handleBookGear = (key) => {
    const target = equipmentList.find(eq => eq.category?.toLowerCase() === key || eq.id === gearSpecs[key].id);
    if (target) {
      setSelectedEquipment(target);
      setCurrentPage('datetime');
    } else {
      setCurrentPage('equipment');
    }
  };

  const currentGear = gearSpecs[activeGearTab];
  const currentFleetPrice = equipmentList.find((item) => String(item.type || item.category || '').toLowerCase() === activeGearTab)?.price;
  const displayedGearPrice = `₹${currentFleetPrice || Number(currentGear.price.replace('₹', ''))}`;

  return (
    <div className="relative min-h-screen bg-[#060806] text-[#F5F7F2] overflow-x-hidden selection:bg-[#C6FF00] selection:text-[#080A08]">
      
      {/* Interactive 3D Canvas Background in Hero */}
      <Hero3DBackground />

      {/* Neo-Brutalist Micro Cyber Grid Backdrop */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-40 -z-20" />

      {/* Atmospheric Neon Acid Lime Spotlight Halos */}
      <div className="absolute top-0 right-1/4 w-[750px] h-[650px] bg-radial from-[#C6FF00]/14 via-[#C6FF00]/03 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-radial from-[#C6FF00]/08 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* ------------------------------------------------------------------------- */}
      {/* LATERAL NEO-BRUTALIST EDITORIAL BANNER (MATCHING REFERENCE IMAGE SIDEBAR) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="hidden 2xl:flex fixed left-4 top-1/4 flex-col items-center gap-6 z-30 pointer-events-none select-none opacity-80">
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-[#C6FF00]" />
        <span className="[writing-mode:vertical-lr] rotate-180 text-3xl font-black tracking-[0.25em] text-[#C6FF00]/40 hover:text-[#C6FF00] transition-colors">
          CYBER-HARDWARE // HOSTEL-HUB
        </span>
        <div className="w-[1px] h-20 bg-gradient-to-t from-transparent to-[#C6FF00]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Cyber-Tech Editorial + 3D Stone Pedestal Hardware Stage  */}
      {/* ========================================================================= */}
      <section className="hero-cinematic">
        <img
          src="/images/hero-neon-hardware.jpg"
          alt="ASUS TUF laptop and EvoFox gamepads on neon-lit volcanic stone"
          className="hero-cinematic-art"
          fetchPriority="high"
        />
        <div className="hero-cinematic-shade" aria-hidden="true" />
        <div className="hero-cinematic-content relative pt-8 pb-5 sm:pt-14 sm:pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Telemetry Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-white/[0.08] text-[11px] font-mono text-[#9EA79C]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[#C6FF00] font-bold shadow-lime-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-pulse" />
              <span>LIVE SYSTEM: OPERATIONAL</span>
            </span>
          </div>

          <div className="flex items-center gap-3 font-semibold">
            <span className="text-[#C6FF00]">COMPATIBILITY:</span>
            <span>STEAM • EPIC • XBOX • RIOT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-5 space-y-8 sm:space-y-9 text-center lg:text-left z-10">
            
            {/* Category Sub-Heading */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono font-bold text-[#C6FF00]">
              <Crosshair className="w-3.5 h-3.5" />
            </div>

            {/* Giant High-Impact Cyber Editorial Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-[58px] font-black tracking-tight text-[#F5F7F2] leading-[1.05]">
              BEAST RIGS<br />
              <span className="text-[#C6FF00] drop-shadow-[0_0_35px_rgba(198,255,0,0.5)]">
                ON SLATE STONE
              </span><br />
              IN YOUR HOSTEL
            </h1>

            {/* Action Row: Primary Button + Circular Arrow Button matching reference photo */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                onClick={() => setCurrentPage('equipment')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-black text-xs sm:text-sm tracking-wider uppercase shadow-lime-glow transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <span>RESERVE BATTLE RIG</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>

              {/* Signature Circular Arrow Button from Reference Photo */}
              <button
                onClick={() => {
                  const el = document.getElementById('bento-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-13 h-13 rounded-full bg-[#111512] hover:bg-[#C6FF00] border-2 border-[#C6FF00] text-[#C6FF00] hover:text-[#080A08] flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lime-sm group"
                title="Explore Hardware Architecture"
              >
                <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <div className="flex basis-full flex-col items-center text-center pt-1 sm:basis-auto sm:items-start sm:text-left sm:pt-0 sm:pl-2">
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#F5F7F2]">RATES FROM ₹29/HR</span>
                <span className="text-[10px] sm:text-[11px] text-[#9EA79C]">Instant UPI QR &amp; Cash</span>
              </div>
            </div>


          </div>

          {/* Right Column: 3D Stone Pedestal Hardware Stage Component */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <StoneProductStage useHeroBackground onBook={() => handleBookGear('combo')} />
          </div>

        </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. NEO-BRUTALIST BENTO GRID (DIRECT MATCH TO REFERENCE IMAGE 01, 02, 03)  */}
      {/* ========================================================================= */}
      <section id="bento-grid" className="pt-4 sm:pt-6 pb-12 sm:pb-16 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-10">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#C6FF00] mb-2 flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#C6FF00]" />
            <span>// ARCHITECTURE & RIG PERFORMANCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#F5F7F2] tracking-tight">
            CALIBRATED FOR SPEED
          </h2>
          <p className="text-xs sm:text-sm text-[#9EA79C] mt-2">
            Hardware stripped of bloatware, pre-overclocked, and maintained on dedicated cooling docks.
          </p>
        </div>

        {/* 3-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* CARD 01: Precision Hourly Slots */}
          <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#C6FF00]/50 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-[10px] font-mono text-[#687366]">
              [01_SLOTS]
            </div>

            <div>
              <div className="text-3xl font-black text-[#9EA79C] group-hover:text-[#C6FF00] font-mono transition-colors mb-4">
                01.
              </div>
              <h3 className="text-2xl font-black text-[#F5F7F2] tracking-tight mb-2">
                Precision Hourly Slots
              </h3>
              <p className="text-xs sm:text-sm text-[#9EA79C] leading-relaxed">
                Book in exact 1-hour session blocks between 9:00 AM and 11:00 PM. Automated calendar locking prevents any overlapping reservations.
              </p>
            </div>

            <div className="pt-6 mt-8 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#9EA79C]">
              <span>CALENDAR_LOCK: REAL-TIME</span>
              <span className="text-[#C6FF00] font-bold">1–4 HOURS</span>
            </div>
          </div>

          {/* CARD 02: INVERTED HERO CARD (SOLID ELECTRIC ACID LIME #C6FF00 WITH PITCH BLACK TEXT) */}
          <div className="bento-card-inverted rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-lime-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-[10px] font-mono font-black text-[#080A08]/60">
              [02_HERO_CARD]
            </div>

            <div>
              <div className="text-3xl font-black text-[#080A08]/60 font-mono mb-4">
                02.
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#080A08] tracking-tight mb-3">
                Zero Latency Hardware
              </h3>
              <p className="text-xs sm:text-sm text-[#080A08]/90 font-bold leading-relaxed">
                AMD Ryzen 7 7435HS and RTX 3050 4GB power with EvoFox Elite Ops 2.4GHz Hyperconnect™ wireless controllers engineered for zero-lag response and 144+ FPS smooth frames.
              </p>
            </div>

            <div className="pt-6 mt-8 border-t border-[#080A08]/20 flex items-center justify-between text-xs font-mono font-black text-[#080A08]">
              <span>TOURNAMENT PROTOCOL</span>
              <span className="bg-[#080A08] text-[#C6FF00] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                144+ FPS GUARANTEED
              </span>
            </div>
          </div>

          {/* CARD 03: Instant Session Pass */}
          <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#C6FF00]/50 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-[10px] font-mono text-[#687366]">
              [03_ACTIVATION]
            </div>

            <div>
              <div className="text-3xl font-black text-[#9EA79C] group-hover:text-[#C6FF00] font-mono transition-colors mb-4">
                03.
              </div>
              <h3 className="text-2xl font-black text-[#F5F7F2] tracking-tight mb-2">
                Instant Session Pass
              </h3>
              <p className="text-xs sm:text-sm text-[#9EA79C] leading-relaxed">
                Zero setup delays. Lock your reservation online in seconds and launch your battle station immediately at your reserved time.
              </p>
            </div>

            <div className="pt-6 mt-8 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#9EA79C]">
              <span>DIGITAL ACTIVATION</span>
              <span className="text-[#C6FF00] font-bold">INSTANT READY</span>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE HARDWARE SHOWCASE ("Больше возможностей" style section)    */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#0D100D]/60 via-[#0A0D0A]/80 to-[#080A08]/90 border-y border-white/[0.08] relative backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#C6FF00] mb-2 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-[#C6FF00]" />
                <span>// HARDWARE DEEP DIVE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#F5F7F2] tracking-tight">
                INSPECT THE HARDWARE
              </h2>
            </div>

            {/* Hardware Category Switcher Pills */}
            <div className="flex items-center gap-2 p-1.5 rounded-full glass-pill">
              <button
                onClick={() => setActiveGearTab('laptop')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeGearTab === 'laptop'
                    ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
                    : 'text-[#9EA79C] hover:text-[#F5F7F2]'
                }`}
              >
                RTX Laptop (₹49/h)
              </button>

              <button
                onClick={() => setActiveGearTab('controller')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeGearTab === 'controller'
                    ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
                    : 'text-[#9EA79C] hover:text-[#F5F7F2]'
                }`}
              >
                Controller (₹29/h)
              </button>

              <button
                onClick={() => setActiveGearTab('combo')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeGearTab === 'combo'
                    ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
                    : 'text-[#9EA79C] hover:text-[#F5F7F2]'
                }`}
              >
                Combo (₹69/h)
              </button>
            </div>
          </div>

          {/* Interactive Hardware Feature Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
            
            {/* Visual Hardware Stage with Spec Tags */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-[#040504] border-2 border-white/[0.08] group">
                <img 
                  src={currentGear.image} 
                  alt={currentGear.title}
                  className="w-full h-full object-contain filter brightness-95 contrast-105 group-hover:scale-[1.02] transition-transform duration-700"
                />
                
                {/* Radial lime halo overlay */}
                <div className="absolute inset-0 bg-radial from-[#C6FF00]/12 via-transparent to-black/50 pointer-events-none" />

                {/* Floating Interactive Feature Nodes */}
                {activeGearTab !== 'combo' && currentGear.nodes.map((node, i) => (
                  <div 
                    key={i}
                    style={{ top: node.top, left: node.left, right: node.right }}
                    className="absolute z-10 hidden sm:flex items-center gap-2 glass-modal rounded-xl px-3 py-1.5 text-left shadow-2xl"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#C6FF00] ring-4 ring-[#C6FF00]/20" />
                    <div>
                      <div className="text-[11px] font-mono font-bold text-[#F5F7F2]">{node.title}</div>
                      <div className="text-[9px] font-mono text-[#9EA79C]">{node.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specifications List */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full glass-pill text-[#C6FF00] text-xs font-mono font-bold mb-2 border-[#C6FF00]/40">
                  {currentGear.badge}
                </span>
                <h3 className="text-2xl font-black text-[#F5F7F2]">{currentGear.title}</h3>
                <p className="text-xs text-[#9EA79C] mt-1 font-mono">{currentGear.subtitle}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/[0.06]">
                {currentGear.specs.map((s, idx) => (
                  <div key={idx} className="glass-pill p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-[9px] text-[#687366] font-mono uppercase tracking-wider block font-bold">{s.label}</span>
                    <span className="text-xs font-mono font-bold text-[#F5F7F2] mt-0.5 block truncate">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Pricing & Booking Trigger */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-3xl font-black text-[#C6FF00] leading-none">
                    {displayedGearPrice}
                    <span className="text-xs text-[#9EA79C] font-mono font-normal">{currentGear.period}</span>
                  </div>
                  {currentGear.savings && (
                    <span className="text-[11px] text-[#C6FF00] font-bold font-mono">{currentGear.savings}</span>
                  )}
                </div>

                <button
                  onClick={() => handleBookGear(activeGearTab)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-black text-xs tracking-wider uppercase shadow-lime-sm transition-all"
                >
                  <span>RESERVE THIS RIG</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STEP-BY-STEP RESERVATION TIMELINE ("Как подключить" style section)   */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Step Process Timeline with Glowing LED Line */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#C6FF00] mb-2 flex items-center gap-2">
                <span className="w-5 h-[2px] bg-[#C6FF00]" />
                <span>// STEP-BY-STEP RESERVATION</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#F5F7F2] tracking-tight">
                HOW TO CLAIM YOUR RIG
              </h2>
            </div>

            {/* Glowing Timeline Container */}
            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#C6FF00] before:via-[#C6FF00]/40 before:to-transparent">
              
              {/* Step 1 */}
              <div className="relative group">
                <span className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-[#111512] border-2 border-[#C6FF00] flex items-center justify-center text-[10px] font-mono font-black text-[#C6FF00] shadow-lime-sm">
                  1
                </span>
                <h4 className="text-base font-extrabold text-[#F5F7F2]">Select Gear on Stone Podium</h4>
                <p className="text-xs text-[#9EA79C] mt-1 leading-relaxed">
                  Choose between the ASUS TUF Gaming Laptop with Ryzen 7 7435HS & RTX 3050 4GB (₹49/hr), EvoFox Elite Ops Wireless Gamepad (₹29/hr), or the bundled Laptop + 2 Controllers Combo (₹69/hr).
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <span className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-[#111512] border-2 border-[#C6FF00] flex items-center justify-center text-[10px] font-mono font-black text-[#C6FF00] shadow-lime-sm">
                  2
                </span>
                <h4 className="text-base font-extrabold text-[#F5F7F2]">Lock In 1-Hour Precision Slot</h4>
                <p className="text-xs text-[#9EA79C] mt-1 leading-relaxed">
                  Select available time between 9:00 AM and 11:00 PM. Booked slots are locked in real-time to eliminate scheduling collisions.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <span className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-[#111512] border-2 border-[#C6FF00] flex items-center justify-center text-[10px] font-mono font-black text-[#C6FF00] shadow-lime-sm">
                  3
                </span>
                <h4 className="text-base font-extrabold text-[#F5F7F2]">Scan UPI or Pay Cash</h4>
                <p className="text-xs text-[#9EA79C] mt-1 leading-relaxed">
                  Scan the live UPI QR code or pay cash. Your session slot locks immediately without delays.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative group">
                <span className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-[#111512] border-2 border-[#C6FF00] flex items-center justify-center text-[10px] font-mono font-black text-[#C6FF00] shadow-lime-sm">
                  4
                </span>
                <h4 className="text-base font-extrabold text-[#F5F7F2]">Instant Pass & Slot Allocation</h4>
                <p className="text-xs text-[#9EA79C] mt-1 leading-relaxed">
                  Receive your digital booking pass to launch your reserved gaming rig immediately at Block B.
                </p>
              </div>

            </div>
          </div>

          {/* Right: Studio Controller Presentation & Guarantee Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Hardware Card */}
            <div className="glass-panel rounded-3xl p-6 border-2 border-white/[0.08] relative overflow-hidden group shadow-2xl">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#040504] mb-4">
                <img 
                  src="/images/controller-studio.jpg" 
                  alt="Pro Controller"
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080A08] to-transparent" />
                <div className="absolute bottom-3 left-3 bg-[#080A08]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#C6FF00]/40 text-[10px] font-mono font-bold text-[#C6FF00]">
                  HYPERCONNECT™ 2.4GHZ WIRELESS
                </div>
              </div>

              {/* 15 Minute Guarantee Highlight (matching the reference image's '15 минут' card) */}
              <div className="space-y-2">
                <div className="text-3xl font-black text-[#C6FF00] font-mono tracking-tight">
                  15 MINUTE
                </div>
                <div className="text-xs font-bold text-[#F5F7F2] uppercase tracking-wider font-mono">
                  RAPID VERIFICATION & ACTIVATION
                </div>
                <p className="text-xs text-[#9EA79C] leading-relaxed">
                  Fast verification turnaround so you can jump straight into competitive scrims and matches.
                </p>
              </div>
            </div>

            {/* Conflict Prevention Guarantee card */}
            <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#111512] border border-[#C6FF00]/40 flex items-center justify-center text-[#C6FF00] shadow-lime-sm shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#F5F7F2]">Automated Conflict Prevention</h4>
                <p className="text-[11px] text-[#9EA79C]">Prevents unauthorized reservation access or double-booking with real-time slot locks.</p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. BOTTOM PERFORMANCE METRICS STRIP                                       */}
      {/* ========================================================================= */}
      <div className="w-full glass-nav py-5 px-4 font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-xs font-bold tracking-wider uppercase text-[#9EA79C]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#C6FF00]" />
            <span className="text-[#F5F7F2]">144+ FPS MINIMUM TARGET</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#C6FF00]" />
            <span className="text-[#F5F7F2]">RYZEN 7 7435HS & RTX 3050 4GB</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C6FF00]" />
            <span className="text-[#F5F7F2]">EVOFOX 2.4GHZ HYPERCONNECT</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C6FF00]" />
            <span className="text-[#F5F7F2]">INSTANT CONFIRMATION</span>
          </div>
        </div>
      </div>

    </div>
  );
};
