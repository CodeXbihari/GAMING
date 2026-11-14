import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Calendar, Clock, Copy } from 'lucide-react';
import { EquipmentVisual } from '../components/EquipmentVisual';
import confetti from 'canvas-confetti';

export const BookingConfirmation = () => {
  const { latestBooking, bookings, setCurrentPage, addToast } = useApp();

  const booking = latestBooking || bookings[0] || {
    id: '#GH250415007',
    equipmentName: 'Gaming Laptop',
    equipmentId: 'laptop',
    date: 'Sat, 15 Nov 2026',
    time: '11:00 AM - 12:00 PM',
    price: 50,
  };

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.55 },
        colors: ['#36D98A', '#16B86A', '#D8B45A']
      });
    } catch (e) {}
  }, []);

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(booking.id);
    addToast('Booking reference copied!', 'success');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background emerald cave / smoky ambient lighting matching Frame 5 in reference */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#36D98A]/20 via-[#0B3D2B]/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Large Glowing Emerald Success Icon matching reference */}
      <div className="relative mb-5">
        <div className="absolute -inset-3 rounded-full bg-[#36D98A]/25 blur-lg animate-pulse" />
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0D1813] border-2 border-[#36D98A] flex items-center justify-center shadow-[0_0_30px_rgba(54,217,138,0.55)]">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 text-[#36D98A] stroke-[3]" />
        </div>
      </div>

      {/* Heading matching reference */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#36D98A] drop-shadow-[0_0_20px_rgba(54,217,138,0.4)] mb-2">
        Booking Confirmed!
      </h1>

      <p className="text-xs sm:text-sm text-[#A7ADA8] max-w-md mx-auto mb-8 font-normal">
        Your gaming slot has been successfully booked.
      </p>

      {/* Center Details Card matching reference */}
      <div className="w-full max-w-md bg-[#111815] border border-[#1E2822] rounded-2xl p-5 shadow-card text-left mb-8">
        
        {/* Reference Number Heading */}
        <div className="text-center pb-4 border-b border-[#1C2621]">
          <span className="text-[11px] uppercase tracking-wider text-[#777F79] font-medium">
            Booking Reference
          </span>
          <div className="text-lg sm:text-xl font-bold text-[#F4F4EF] tracking-wider font-mono mt-0.5">
            {booking.id}
          </div>
        </div>

        {/* Equipment & Schedule details matching reference */}
        <div className="pt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-lg bg-[#0D1511] border border-[#1E2B23] p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
              <EquipmentVisual type={booking.equipmentId || 'laptop'} className="h-full w-full" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F4F4EF]">
                {booking.equipmentName}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#A7ADA8] mt-0.5">
                <span>{booking.date}</span>
                <span>•</span>
                <span>{booking.time}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-base font-extrabold text-[#36D98A]">
              ₹{booking.price}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons matching reference */}
      <div className="flex flex-row items-center justify-center gap-4 w-full max-w-sm">
        <button
          onClick={() => setCurrentPage('bookings')}
          className="flex-1 py-2.5 px-5 rounded-full bg-[#36D98A] hover:bg-[#16B86A] text-[#080D0B] font-bold text-xs shadow-emerald-sm transition-all"
        >
          View My Bookings
        </button>

        <button
          onClick={() => setCurrentPage('home')}
          className="flex-1 py-2.5 px-5 rounded-full bg-[#111815] hover:bg-[#171E1A] text-[#F4F4EF] border border-[#2B3530] hover:border-[#36D98A]/50 font-medium text-xs transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
