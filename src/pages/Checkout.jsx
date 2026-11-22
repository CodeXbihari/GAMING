import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Copy,
  Check,
  ArrowRight,
  Calendar,
  Clock,
  ShieldCheck,
  Banknote,
  QrCode,
  Crosshair,
  Terminal,
  Cpu
} from 'lucide-react';

export const Checkout = () => {
  const {
    selectedEquipment,
    selectedDate,
    selectedDateFormatted,
    selectedSlot,
    paymentMethod,
    setPaymentMethod,
    utrNumber,
    setUtrNumber,
    createBooking,
    setCurrentPage,
    getEndSlotTime,
    addToast
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const upiId = import.meta.env.VITE_UPI_ID || '7644940067@ptsbi';
  const qrCodeUrl = import.meta.env.VITE_QR_CODE_URL || '/upi_qr.jpg';
  const endTime = getEndSlotTime(selectedSlot);
  const totalAmount = selectedEquipment?.price || (selectedEquipment?.type === 'combo' ? 69 : selectedEquipment?.type === 'laptop' ? 49 : 29);

  const handleCopyUPI = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    addToast('UPI ID copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'UPI' && !/^\d{4}$/.test(utrNumber.trim())) {
      addToast('Enter the last 4 digits of your UPI transaction reference.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({ utr: utrNumber.trim() });
      if (!booking) {
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      addToast('Failed to complete booking. Please try again.', 'error');
      setSubmitting(false);
    }
  };

  const getEquipmentImage = () => {
    if (selectedEquipment?.image) return selectedEquipment.image;
    if (selectedEquipment?.type === 'controller') return '/images/controller-hero.jpg';
    if (selectedEquipment?.type === 'combo') return '/images/combo-setup.jpg';
    return '/images/laptop-hero.jpg';
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Cyber-Tech Editorial Header */}
      <div className="mb-8 border-b border-white/[0.08] pb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono font-bold text-[#C6FF00] mb-2 shadow-lime-sm">
            <Terminal className="w-3.5 h-3.5" />
            <span>ESCROW_VERIFICATION // GATEWAY_03</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F7F2]">
            CONFIRM & SETTLE
          </h1>
        </div>

        <div className="text-xs font-mono text-[#9EA79C] flex items-center gap-2">
          <span>SESSION_PASS: </span>
          <span className="px-2.5 py-0.5 rounded-full glass-pill text-[#C6FF00] font-bold">INSTANT_ACTIVATION</span>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        {/* LEFT PANEL: Rig on Stone & Method Selector */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Summary Card with 3D Stone Podium */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[9px] font-mono text-[#687366] uppercase">[RIG_MANIFEST]</div>

            <div className="flex items-center gap-5 pb-5 border-b border-white/[0.06]">
              {/* Mini Stone Podium */}
              <div className="relative w-24 h-20 rounded-2xl bg-[#040504] border border-[#C6FF00]/30 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lime-sm">
                <div className="absolute inset-x-0 bottom-0 h-8 bg-cover bg-bottom opacity-70" style={{ backgroundImage: "url('/images/stone-pedestal.jpg')" }} />
                <img src={getEquipmentImage()} alt="Rig" className="w-[85%] h-auto max-h-14 object-contain z-10" />
                <div className="absolute inset-0 bg-radial from-[#C6FF00]/20 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#F5F7F2]">
                    {selectedEquipment?.name || 'ASUS TUF Gaming Laptop'}
                  </h3>
                  <button
                    onClick={() => setCurrentPage('datetime')}
                    className="text-xs font-mono font-bold text-[#C6FF00] hover:underline"
                  >
                    [EDIT_SLOT]
                  </button>
                </div>
                <div className="text-sm font-mono font-black text-[#C6FF00] mt-1">
                  ₹{totalAmount} / hour
                </div>
              </div>
            </div>

            {/* Date and Time Details */}
            <div className="pt-4 space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-3 text-[#9EA79C]">
                <Calendar className="w-4 h-4 text-[#C6FF00]" />
                <span className="text-[#F5F7F2] font-bold">{selectedDateFormatted ? selectedDateFormatted.toUpperCase() : 'SELECTED DATE'}</span>
              </div>
              <div className="flex items-center gap-3 text-[#9EA79C]">
                <Clock className="w-4 h-4 text-[#C6FF00]" />
                <span className="text-[#F5F7F2] font-bold">{selectedSlot} – {endTime} (1-HOUR PRECISION)</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9EA79C]">
              [SELECT_SETTLEMENT_CHANNEL]
            </h4>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'glass-panel-lime shadow-lime-sm'
                    : 'glass-panel hover:border-[#C6FF00]/40'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'UPI' ? 'border-[#C6FF00] bg-[#C6FF00]' : 'border-[#4D5750]'
                }`}>
                  {paymentMethod === 'UPI' && <div className="w-2 h-2 rounded-full bg-[#080A08]" />}
                </div>
                <div>
                  <div className="text-xs font-mono font-black text-[#F5F7F2]">UPI INSTANT SCAN (PAYTM / GPAY / PHONEPE)</div>
                  <div className="text-[10px] font-mono text-[#9EA79C]">Zero transaction surcharge • Instant auto-receipt</div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('Cash')}
                className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Cash'
                    ? 'glass-panel-lime shadow-lime-sm'
                    : 'glass-panel hover:border-[#C6FF00]/40'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'Cash' ? 'border-[#C6FF00] bg-[#C6FF00]' : 'border-[#4D5750]'
                }`}>
                  {paymentMethod === 'Cash' && <div className="w-2 h-2 rounded-full bg-[#080A08]" />}
                </div>
                <div>
                  <div className="text-xs font-mono font-black text-[#F5F7F2]">PAY IN PERSON (CASH)</div>
                  <div className="text-[10px] font-mono text-[#9EA79C]">Settle cash at lounge before starting session</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Holographic Scan & Pay Terminal */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="absolute top-3 right-3 text-[9px] font-mono text-[#687366] uppercase">[TERMINAL_ACTIVE]</div>

          <h3 className="text-lg font-black text-[#F5F7F2] mb-6">
            {paymentMethod === 'UPI' ? 'SCAN & PAY VIA UPI' : 'CASH PAYMENT PROTOCOL'}
          </h3>

          {paymentMethod === 'UPI' ? (
            <>
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                {/* Real UPI QR Code exactly filling the box */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-white border-2 border-[#C6FF00] shadow-lime-glow overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/upi_qr.jpg';
                    }}
                  />
                </div>

                {/* UPI ID Details */}
                <div className="space-y-3.5 text-center sm:text-left flex-1 font-mono">
                  <div>
                    <span className="text-[10px] text-[#687366] font-bold uppercase tracking-wider block">OFFICIAL UPI ENDPOINT</span>
                    <div className="text-xs font-mono font-bold text-[#F5F7F2] mt-0.5 break-all">
                      {upiId}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyUPI}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171D18] hover:bg-[#C6FF00] hover:text-[#080A08] border border-white/[0.1] text-xs font-bold text-[#9EA79C] transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#C6FF00]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'ENDPOINT COPIED' : 'COPY UPI ID'}</span>
                  </button>

                  <div className="pt-1">
                    <span className="text-[10px] text-[#687366] font-bold uppercase tracking-wider block">SETTLEMENT TOTAL</span>
                    <div className="text-3xl font-black text-[#C6FF00]">
                      ₹{totalAmount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Instant Confirmation Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-white/[0.06] font-mono">
                <p className="text-xs text-[#9EA79C]">
                  Pay ₹{totalAmount} using the QR code, then enter the transaction reference shown by your UPI app:
                </p>

                <label className="block space-y-2">
                  <span className="text-[10px] font-bold tracking-wider text-[#9EA79C]">UPI REFERENCE — LAST 4 DIGITS</span>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(event) => setUtrNumber(event.target.value.replace(/\D/g, '').slice(0, 4))}
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    placeholder="e.g. 4821"
                    className="w-full rounded-xl border border-white/10 bg-[#080A08] px-4 py-3 text-sm text-[#F5F7F2] outline-none placeholder:text-[#687366] focus:border-[#C6FF00]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] disabled:opacity-50 text-[#080A08] font-black text-xs tracking-wider uppercase shadow-lime-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
                >
                  <span>{submitting ? 'CONFIRMING RESERVATION...' : 'CONFIRM PAYMENT & RESERVE SLOT'}</span>
                  {!submitting && <ArrowRight className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="text-center pt-2 text-[10px] text-[#687366] flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-pulse" />
                  <span>SESSION SLOT LOCKED IMMEDIATELY // ACCESS PASS ISSUED</span>
                </div>
              </form>
            </>
          ) : (
            <div className="space-y-6 font-mono">
              <div className="p-6 rounded-2xl bg-[#171D18] border border-white/[0.08] space-y-3">
                <div className="flex items-center gap-2.5 text-sm font-black text-[#F5F7F2]">
                  <Banknote className="w-5 h-5 text-[#C6FF00]" />
                  <span>HOSTEL LOUNGE CASH SETTLEMENT</span>
                </div>
                <p className="text-xs text-[#9EA79C] leading-relaxed">
                  Bring exact amount of ₹{totalAmount} at your reserved session time. Your rig and stone dock are reserved immediately.
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-[#9EA79C] px-1">
                <span>TOTAL SETTLEMENT DUE:</span>
                <span className="text-3xl font-black text-[#C6FF00]">₹{totalAmount}</span>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-black text-xs tracking-wider uppercase shadow-lime-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
              >
                <span>{submitting ? 'DISPATCHING BOOKING...' : 'CONFIRM CASH RESERVATION'}</span>
                {!submitting && <ArrowRight className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
