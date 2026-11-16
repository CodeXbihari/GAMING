import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Calendar, Clock, Copy, ShieldCheck, KeyRound, Crosshair, Terminal, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingConfirmation = () => {
  const { latestBooking, bookings, setCurrentPage, addToast } = useApp();

  const booking = latestBooking || bookings[0] || {
    id: '#GH250415007',
    equipmentName: 'ASUS TUF Gaming Laptop',
    equipmentId: 'laptop',
    date: 'Sat, 15 Nov 2026',
    time: '11:00 AM - 12:00 PM',
    price: 50,
    pickup_pin: '4829',
  };

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#C6FF00', '#D4FF33', '#111512']
      });
    } catch (e) {}
  }, []);

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(booking.id);
    addToast('Booking reference copied to clipboard!', 'success');
  };

  const getEquipmentImage = () => {
    if (booking.image) return booking.image;
    if (booking.equipmentId === 'controller') return '/images/controller-hero.jpg';
    if (booking.equipmentId === 'combo') return '/images/combo-setup.jpg';
    return '/images/laptop-hero.jpg';
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-radial from-[#C6FF00]/15 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Cyber-Tech Success Telemetry Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-xs font-mono font-bold text-[#C6FF00] mb-6 shadow-lime-sm">
        <Crosshair className="w-3.5 h-3.5" />
        <span>RESERVATION_CONFIRMED // PROTOCOL_SUCCESS</span>
      </div>

      {/* Large Glowing Electric Lime Success Icon */}
      <div className="relative mb-6">
        <div className="absolute -inset-5 rounded-full bg-[#C6FF00]/25 blur-2xl animate-pulse" />
        <div className="relative w-22 h-22 rounded-full bg-[#080A08]/90 border-2 border-[#C6FF00] flex items-center justify-center shadow-lime-glow backdrop-blur-xl">
          <Check className="w-11 h-11 text-[#C6FF00] stroke-[3]" />
        </div>
      </div>

      {/* Editorial Heading */}
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#C6FF00] drop-shadow-[0_0_30px_rgba(198,255,0,0.45)] mb-3">
        RIG SECURED & ALLOCATED
      </h1>

      <p className="text-xs sm:text-sm font-mono text-[#9EA79C] max-w-md mx-auto mb-10">
        Your battle station has been locked in the hostel schedule. Present your booking reference at Block B.
      </p>

      {/* Neo-Brutalist Boarding Pass Ticket on Stone */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl text-left mb-8 space-y-6 relative overflow-hidden">
        
        {/* Ticket Header & Status Matrix */}
        <div className="pb-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#687366] font-bold block">
              BOOKING MANIFEST
            </span>
            <div className="text-sm font-mono font-black text-[#F5F7F2] tracking-wider mt-0.5">
              {booking.id}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#C6FF00] font-black block">
              STATUS
            </span>
            <div className="text-xs font-mono font-black text-[#C6FF00] tracking-wider mt-0.5 glass-pill px-3 py-1.5 rounded-xl border-[#C6FF00]/50 shadow-lime-sm inline-block">
              {booking.status ? booking.status.toUpperCase() : 'CONFIRMED'}
            </div>
          </div>
        </div>

        {/* 3D Stone Podium Hardware Preview in Ticket */}
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-20 rounded-2xl bg-[#040504] border border-[#C6FF00]/30 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lime-sm">
            <div className="absolute inset-x-0 bottom-0 h-8 bg-cover bg-bottom opacity-70" style={{ backgroundImage: "url('/images/stone-pedestal.jpg')" }} />
            <img src={getEquipmentImage()} alt="Rig" className="w-[85%] h-auto max-h-14 object-contain z-10" />
            <div className="absolute inset-0 bg-radial from-[#C6FF00]/20 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="space-y-1">
            <div className="text-base font-black text-[#F5F7F2]">
              {booking.equipmentName}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#9EA79C]">
              <span>{booking.date}</span>
              <span>•</span>
              <span className="text-[#C6FF00] font-bold">{booking.time}</span>
            </div>
            <div className="text-xs font-mono font-black text-[#C6FF00]">
              TOTAL: ₹{booking.price}
            </div>
          </div>
        </div>

        {/* Access Instructions */}
        <div className="p-4 rounded-2xl glass-pill border border-white/[0.08] flex items-center gap-3.5">
          <ShieldCheck className="w-5 h-5 text-[#C6FF00] shrink-0" />
          <div className="text-[11px] font-mono text-[#9EA79C] leading-relaxed">
            Your gaming rig is reserved. Head to <span className="text-[#C6FF00] font-bold">Ground Floor Block B Lounge</span> at your scheduled time.
          </div>
        </div>

        {/* Barcode Strip */}
        <div className="pt-2 flex flex-col items-center gap-1 opacity-70">
          <div className="w-full h-8 flex items-center justify-between px-2 gap-1 bg-[#080A08] rounded p-1">
            {Array.from({ length: 42 }).map((_, i) => (
              <span key={i} className={`h-full ${i % 3 === 0 ? 'w-1 bg-[#C6FF00]' : i % 2 === 0 ? 'w-0.5 bg-white' : 'w-1.5 bg-[#687366]'}`} />
            ))}
          </div>
          <span className="text-[8px] font-mono text-[#687366] tracking-widest uppercase">AUTH_CODE: HGH-HOSTEL-CRYPT-2026</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center justify-center gap-4 w-full max-w-sm">
        <button
          onClick={() => setCurrentPage('bookings')}
          className="flex-1 py-3.5 px-6 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-mono font-black text-xs tracking-wider uppercase shadow-lime-glow transition-all hover:scale-102"
        >
          VIEW MY PASSES
        </button>

        <button
          onClick={() => setCurrentPage('home')}
          className="flex-1 py-3.5 px-6 rounded-full glass-pill hover:bg-white/[0.08] text-[#F5F7F2] font-mono font-bold text-xs tracking-wider uppercase transition-all"
        >
          MAIN OVERVIEW
        </button>
      </div>
    </div>
  );
};
