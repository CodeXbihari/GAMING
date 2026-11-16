import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, Check, Zap, Crosshair, Shield, Activity, Wrench } from 'lucide-react';

export const EquipmentSelection = () => {
  const { equipmentList, selectedEquipment, setSelectedEquipment, setCurrentPage, addToast } = useApp();

  const handleSelect = (item) => {
    if (item.status === 'Maintenance') {
      addToast(`${item.name} is currently under maintenance. Please select an available rig.`, 'warning');
      return;
    }
    setSelectedEquipment(item);
    setCurrentPage('datetime');
  };

  // Dynamically map from equipment fleet in AppContext (synchronized with Admin & Supabase)
  const cards = (equipmentList && equipmentList.length > 0)
    ? equipmentList.map((item) => {
        const type = (item.type || item.category || 'laptop').toLowerCase();
        const isLaptop = type === 'laptop';
        const isCombo = type === 'combo';
        const isMaintenance = item.status === 'Maintenance';

        let specsArray = [];
        if (Array.isArray(item.specs)) {
          specsArray = item.specs;
        } else if (typeof item.specs === 'string' && item.specs.trim()) {
          specsArray = item.specs.split(/[•,]/).map(s => s.trim()).filter(Boolean);
        } else {
          specsArray = isCombo 
            ? ['TUF Ryzen 7', '2x EvoFox Gamepads', 'Split-Screen', 'Pre-Loaded AAA'] 
            : isLaptop 
            ? ['Ryzen 7 7435HS', 'RTX 3050 4GB', '16GB RAM', '144Hz FHD'] 
            : ['Hyperconnect 2.4G', 'Dual Vibration', 'Textured Grip', 'Type-C Charge'];
        }

        const defaultImage = isCombo 
          ? '/images/combo-setup.jpg' 
          : isLaptop 
          ? '/images/laptop-hero.jpg' 
          : '/images/controller-hero.jpg';

        return {
          id: item.id,
          name: item.name || (isCombo ? 'BATTLE STATION COMBO' : isLaptop ? 'ASUS TUF GAMING LAPTOP' : 'EVOFOX ELITE OPS WIRELESS'),
          type,
          tag: item.assetCode || (isCombo ? 'TUF_DUAL_COMBO' : isLaptop ? 'TUF_RYZEN7_7435HS' : 'EVOFOX_HYPERCONNECT'),
          price: item.price || (isCombo ? 80 : isLaptop ? 50 : 20),
          description: item.description || (isCombo
            ? 'ASUS TUF Laptop (Ryzen 7 7435HS/RTX 3050) + 2x EvoFox Wireless Gamepads on Stone Dock'
            : isLaptop
            ? 'AMD Ryzen 7 7435HS • NVIDIA RTX 3050 4GB GPU • 16GB RAM • 512GB SSD • 144Hz FHD'
            : 'Hyperconnect™ 2.4GHz USB Receiver • Dual Vibration Motors • Textured Grips • 8h Battery'),
          badge: isMaintenance 
            ? 'MAINTENANCE' 
            : (item.badge || (isCombo ? 'TUF LAPTOP + 2x EVOFOX' : isLaptop ? 'RYZEN 7 7435HS + RTX 3050' : '2.4GHz HYPERCONNECT')),
          image: item.image || item.image_url || defaultImage,
          isHero: Boolean(item.isPopular || isCombo),
          specs: specsArray.slice(0, 4),
          status: item.status || 'Available'
        };
      })
    : [];

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-start">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-radial from-[#C6FF00]/12 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Cyber-Tech Editorial Header */}
      <div className="mb-10 sm:mb-12 border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono font-bold text-[#C6FF00] mb-3 shadow-lime-sm">
            <Crosshair className="w-3.5 h-3.5" />
            <span>SELECT_HARDWARE_PROTOCOL // v2.6</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F7F2]">
            CHOOSE YOUR RIG
          </h1>
          <p className="text-xs sm:text-sm text-[#9EA79C] font-mono mt-1">
            Tournament-calibrated hardware resting on basalt stone docks. 1-hour precision reservation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono text-[#9EA79C]">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill">
            <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-pulse" />
            <span className="text-[#F5F7F2]">{cards.filter(c => c.status === 'Available').length} UNITS ONLINE</span>
          </span>
          <span>//</span>
          <span>LOCATION: HOSTEL LOUNGE</span>
        </div>
      </div>

      {/* Dynamic Equipment Cards Grid with 3D Stone Staging */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto w-full items-stretch">
        {cards.map((card) => {
          const isSelected = selectedEquipment?.id === card.id || selectedEquipment?.assetCode === card.tag;
          const isHero = card.isHero;
          const isMaintenance = card.status === 'Maintenance';

          return (
            <div
              key={card.id}
              onClick={() => handleSelect(card)}
              className={`relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 lg:p-5 xl:p-7 transition-all duration-300 cursor-pointer group ${
                isMaintenance
                  ? 'glass-panel opacity-75 border-amber-500/30'
                  : isHero
                  ? 'glass-panel-lime hover:scale-[1.02]'
                  : 'glass-panel hover:border-[#C6FF00]/60 hover:shadow-lime-sm'
              } ${
                isSelected && !isMaintenance
                  ? 'ring-2 ring-[#C6FF00] border-[#C6FF00] shadow-lime-glow'
                  : ''
              }`}
            >
              {/* Neo-brutalist corner ticks */}
              <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-[#C6FF00] pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-[#C6FF00] pointer-events-none" />

              <div>
                {/* Header Tag & Badge */}
                <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-[#687366] tracking-wider uppercase shrink-0">
                    [{card.tag}]
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                    isMaintenance
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : isHero
                      ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
                      : 'glass-pill text-[#C6FF00] border border-[#C6FF00]/40'
                  }`}>
                    {card.badge}
                  </span>
                </div>

                {/* 3D Stone Podium Stage Showcase */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#040504] border border-white/[0.08] mb-6 group-hover:border-[#C6FF00]/40 transition-all flex items-center justify-center">
                  
                  {/* Basalt stone slab at bottom */}
                  <div className="absolute inset-x-2 bottom-0 h-16 rounded-xl overflow-hidden pointer-events-none z-10">
                    <img 
                      src="/images/stone-pedestal.jpg" 
                      alt="Stone slab" 
                      className="w-full h-full object-cover object-bottom filter contrast-125 brightness-75 mix-blend-luminosity" 
                    />
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C6FF00] to-transparent shadow-[0_0_10px_#C6FF00]" />
                  </div>

                  {/* Hardware photo resting on the stone slab */}
                  {card.type === 'combo' && card.image === '/images/combo-setup.jpg' ? (
                    <div className="relative w-full h-full flex items-center justify-center z-20">
                      {/* Laptop in background */}
                      <img 
                        src="/images/laptop-hero.jpg" 
                        alt="ASUS TUF Gaming Laptop" 
                        className="w-[58%] h-auto max-h-28 object-contain -translate-y-2 filter contrast-110 brightness-105 group-hover:scale-105 transition-transform duration-500" 
                      />
                      {/* Controller 1 in foreground left */}
                      <img 
                        src="/images/controller-hero.jpg" 
                        alt="EvoFox Elite Ops Wireless Gamepad 1" 
                        className="w-[32%] h-auto max-h-20 object-contain -translate-x-7 translate-y-3 z-30 drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-500 -rotate-6" 
                      />
                      {/* Controller 2 in foreground right */}
                      <img 
                        src="/images/controller-hero.jpg" 
                        alt="EvoFox Elite Ops Wireless Gamepad 2" 
                        className="w-[32%] h-auto max-h-20 object-contain translate-x-7 translate-y-3 z-30 drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-500 rotate-6" 
                      />
                    </div>
                  ) : (
                    <img 
                      src={card.image} 
                      alt={card.name} 
                      className="w-[85%] h-auto max-h-36 object-contain z-20 filter contrast-110 brightness-105 group-hover:scale-105 transition-transform duration-500" 
                    />
                  )}

                  {/* Neon Lime underglow */}
                  <div className="absolute inset-0 bg-radial from-[#C6FF00]/15 via-transparent to-black/60 pointer-events-none" />
                </div>

                {/* Card Title & Description */}
                <h3 className="text-xl font-black text-[#F5F7F2] tracking-tight group-hover:text-[#C6FF00] transition-colors">
                  {card.name}
                </h3>
                <p className="text-xs text-[#9EA79C] mt-2 leading-relaxed line-clamp-2">
                  {card.description}
                </p>

                {/* Spec Tag Pills */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                  {card.specs.map((spec, i) => (
                    <div 
                      key={i} 
                      className="glass-pill px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#9EA79C] flex items-center overflow-hidden"
                      title={spec}
                    >
                      <span className="text-[#C6FF00] mr-1 shrink-0">/</span>
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Select Button Footer */}
              <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                <div className="shrink-0">
                  <span className="text-[10px] font-mono text-[#687366] uppercase tracking-wider block font-bold">Standard Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-[#C6FF00]">
                      ₹{card.price}
                    </span>
                    <span className="text-xs font-mono text-[#9EA79C]">/ hour</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isMaintenance}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(card);
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-mono font-black tracking-wider uppercase transition-all shrink-0 ${
                    isMaintenance
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
                      : isHero
                      ? 'bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] shadow-lime-sm'
                      : 'bg-[#171D18] hover:bg-[#C6FF00] text-[#F5F7F2] hover:text-[#080A08] border border-white/[0.1] hover:border-[#C6FF00]'
                  }`}
                >
                  <span>{isMaintenance ? 'MAINTENANCE' : isSelected ? 'SELECTED' : 'SELECT RIG'}</span>
                  {isMaintenance ? <Wrench className="w-3.5 h-3.5" /> : isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
