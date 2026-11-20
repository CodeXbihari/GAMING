import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Check, Calendar, Clock, Copy, ShieldCheck, KeyRound, Crosshair, Terminal, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingConfirmation = () => {
  const { latestBooking, bookings, equipmentList, setCurrentPage, addToast } = useApp();
  const [wantsGame, setWantsGame] = useState('');
  const [gameName, setGameName] = useState('');
  const [gameRequestSubmitted, setGameRequestSubmitted] = useState(false);
  const [gameRequestSubmitting, setGameRequestSubmitting] = useState(false);

  const booking = latestBooking || bookings[0] || null;
  const bookedEquipment = equipmentList.find((item) => item.id === booking?.equipmentId);
  const isControllerBooking = String(booking?.equipmentCategory || bookedEquipment?.type || bookedEquipment?.category || '').toLowerCase() === 'controller';

  useEffect(() => {
    if (!booking) return;
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#C6FF00', '#D4FF33', '#111512']
      });
    } catch (e) {}
  }, [Boolean(booking)]);

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

  if (!booking) {
    return (
      <main className="relative min-h-[calc(100vh-80px)] px-4 py-20 flex items-center justify-center">
        <div className="glass-panel max-w-lg w-full rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-black text-[#F5F7F2]">NO ACTIVE RESERVATION</h1>
          <p className="mt-3 text-sm text-[#9EA79C]">
            This browser session has no saved booking confirmation. You can browse equipment and make a reservation.
          </p>
          <button
            onClick={() => setCurrentPage('equipment')}
            className="mt-6 rounded-full bg-[#C6FF00] px-6 py-3 text-xs font-mono font-black text-[#080A08]"
          >
            BROWSE EQUIPMENT
          </button>
        </div>
      </main>
    );
  }

  const handleGameRequestSubmit = async (event) => {
    event.preventDefault();
    if (!wantsGame) {
      addToast('Choose Yes or No to continue.', 'warning');
      return;
    }
    if (!booking.bookingAccessToken) {
      addToast('This reservation has no active request key. Contact the admin to add a game request.', 'error');
      return;
    }
    if (wantsGame === 'yes' && !gameName.trim()) {
      addToast('Enter the game name you want downloaded.', 'warning');
      return;
    }

    setGameRequestSubmitting(true);
    let data;
    let error;
    try {
      ({ data, error } = await supabase.functions.invoke('game_download_request', {
        body: {
          booking_reference: booking.id,
          booking_access_token: booking.bookingAccessToken,
          wants_download: wantsGame === 'yes',
          game_name: wantsGame === 'yes' ? gameName.trim() : null
        }
      }));
    } catch (requestError) {
      error = requestError;
    } finally {
      setGameRequestSubmitting(false);
    }

    if (error || !data?.saved) {
      console.error('Game download request error:', error || data?.error);
      addToast(data?.error || 'Could not save the game download request. Please try again.', 'error');
      return;
    }

    setGameRequestSubmitted(true);
    const savedWantsGame = Boolean(data.wants_download);
    setWantsGame(savedWantsGame ? 'yes' : 'no');
    setGameName(data.game_name || '');
    if (savedWantsGame && !data.notification_sent) {
      addToast('Request saved with your reservation, but the admin email notification could not be sent.', 'warning');
      return;
    }
    addToast(savedWantsGame ? 'Game request saved and admin notified.' : 'Preference saved with your reservation.', 'success');
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
            Your gaming rig is reserved. Head to <span className="text-[#C6FF00] font-bold">ROOM 207</span> at your scheduled time.
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

      {/* Game downloads are offered for console/laptop sessions, not controller-only bookings. */}
      {!isControllerBooking && <form
        onSubmit={handleGameRequestSubmit}
        className="w-full max-w-md glass-panel rounded-3xl p-5 sm:p-6 mb-8 text-left space-y-4"
      >
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-[#C6FF00]">
            <Download className="w-3.5 h-3.5" />
            GAME DOWNLOAD REQUEST
          </div>
          <h2 className="mt-2 text-base font-black text-[#F5F7F2]">Would you like a game downloaded?</h2>
        </div>

        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Would you like a game downloaded?">
          {[
            { value: 'yes', label: 'Yes, please' },
            { value: 'no', label: 'No, thanks' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={gameRequestSubmitted}
              aria-pressed={wantsGame === option.value}
              onClick={() => {
                setWantsGame(option.value);
                setGameRequestSubmitted(false);
                if (option.value === 'no') setGameName('');
              }}
              className={`rounded-xl border px-4 py-3 text-xs font-mono font-bold transition-colors ${
                wantsGame === option.value
                  ? 'border-[#C6FF00] bg-[#C6FF00]/10 text-[#C6FF00]'
                  : 'border-white/10 bg-[#080A08]/60 text-[#9EA79C] hover:border-[#C6FF00]/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {wantsGame === 'yes' && (
          <label className="block space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#9EA79C]">GAME NAME</span>
            <input
              type="text"
              value={gameName}
              onChange={(event) => {
                setGameName(event.target.value);
                setGameRequestSubmitted(false);
              }}
              required
              disabled={gameRequestSubmitted}
              maxLength={100}
              placeholder="Enter the game you want"
              className="w-full rounded-xl border border-white/10 bg-[#080A08] px-4 py-3 text-sm text-[#F5F7F2] outline-none placeholder:text-[#687366] focus:border-[#C6FF00]"
            />
          </label>
        )}

        {gameRequestSubmitted ? (
          <p className="text-xs font-mono text-[#C6FF00]" role="status">
            {wantsGame === 'yes' ? `Request saved for ${gameName.trim()}.` : 'No game download requested; preference saved.'}
          </p>
        ) : (
          <button
            type="submit"
            disabled={gameRequestSubmitting}
            className="w-full rounded-full border border-[#C6FF00]/50 px-4 py-3 text-xs font-mono font-bold text-[#C6FF00] transition-colors hover:bg-[#C6FF00]/10"
          >
            {gameRequestSubmitting ? 'SAVING REQUEST…' : 'SAVE PREFERENCE'}
          </button>
        )}
        <p className="text-[10px] font-mono text-[#687366]">Your preference is saved with this reservation.</p>
      </form>}

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
