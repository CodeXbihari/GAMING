import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Copy,
  Check,
  UploadCloud,
  ArrowRight,
  Calendar,
  Clock,
  ShieldCheck,
  QrCode,
  Banknote
} from 'lucide-react';
import { EquipmentVisual } from '../components/EquipmentVisual';

export const Checkout = () => {
  const {
    selectedEquipment,
    selectedDate,
    selectedSlot,
    paymentMethod,
    setPaymentMethod,
    utrNumber,
    setUtrNumber,
    paymentProofName,
    setPaymentProofName,
    createBooking,
    setCurrentPage,
    getEndSlotTime,
    addToast
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const upiId = 'hostelgaming@okaxis';
  const endTime = getEndSlotTime(selectedSlot);
  const totalAmount = selectedEquipment?.price || 50;

  const handleCopyUPI = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    addToast('UPI ID copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProofName(file.name);
      addToast(`Proof attached: ${file.name}`, 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'UPI' && !utrNumber.trim()) {
      addToast('Please enter the UTR Number', 'warning');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      createBooking({ utr: utrNumber || '5189473621' });
    }, 600);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Top Header with Back button matching reference */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setCurrentPage('datetime')}
          className="inline-flex items-center gap-1.5 text-xs text-[#A7ADA8] hover:text-[#36D98A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F4EF]">
          Checkout
        </h2>
      </div>

      {/* Two-Panel Layout matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-6">
        
        {/* LEFT PANEL */}
        <div className="md:col-span-6 space-y-6">
          {/* Summary Card */}
          <div className="bg-[#111815] border border-[#1E2822] rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-4 pb-4 border-b border-[#1C2621]">
              <div className="w-16 h-14 rounded-lg bg-[#0D1511] border border-[#1E2B23] p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                <EquipmentVisual type={selectedEquipment?.type || 'laptop'} className="h-full w-full" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#F4F4EF]">
                    {selectedEquipment?.name || 'Gaming Laptop'}
                  </h3>
                  <button
                    onClick={() => setCurrentPage('datetime')}
                    className="text-xs font-semibold text-[#36D98A] hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs font-semibold text-[#36D98A] mt-0.5">
                  ₹{totalAmount} / hour
                </div>
              </div>
            </div>

            {/* Date and Time Details */}
            <div className="pt-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-[#A7ADA8]">
                <Calendar className="w-3.5 h-3.5 text-[#36D98A]" />
                <span className="text-[#F4F4EF]">Sat, {selectedDate} Nov 2026</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#A7ADA8]">
                <Clock className="w-3.5 h-3.5 text-[#36D98A]" />
                <span className="text-[#F4F4EF]">{selectedSlot} - {endTime}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A7ADA8]">
              Payment Method
            </h4>

            <div className="space-y-2">
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#171E1A] border-[#36D98A]'
                    : 'bg-[#111815] border-[#1E2822] hover:border-[#36D98A]/40'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'UPI' ? 'border-[#36D98A] bg-[#36D98A]' : 'border-[#44524A]'
                }`}>
                  {paymentMethod === 'UPI' && <div className="w-1.5 h-1.5 rounded-full bg-[#080D0B]" />}
                </div>
                <span className="text-xs font-medium text-[#F4F4EF]">Pay using UPI</span>
              </label>

              <label
                onClick={() => setPaymentMethod('Cash')}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash'
                    ? 'bg-[#171E1A] border-[#36D98A]'
                    : 'bg-[#111815] border-[#1E2822] hover:border-[#36D98A]/40'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'Cash' ? 'border-[#36D98A] bg-[#36D98A]' : 'border-[#44524A]'
                }`}>
                  {paymentMethod === 'Cash' && <div className="w-1.5 h-1.5 rounded-full bg-[#080D0B]" />}
                </div>
                <span className="text-xs font-medium text-[#F4F4EF]">Pay at Collection (Cash)</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Scan & Pay */}
        <div className="md:col-span-6 bg-[#111815] border border-[#1E2822] rounded-2xl p-5 shadow-card">
          <h3 className="text-sm font-bold text-[#F4F4EF] mb-4">
            Scan & Pay
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-5 mb-5">
            {/* QR Code with glowing emerald frame matching reference */}
            <div className="p-2 rounded-xl bg-[#080D0B] border-2 border-[#36D98A] shadow-emerald-glow flex-shrink-0">
              <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="28" height="28" fill="black" rx="3" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="black" />
                  
                  <rect x="67" y="5" width="28" height="28" fill="black" rx="3" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="black" />

                  <rect x="5" y="67" width="28" height="28" fill="black" rx="3" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="black" />

                  <circle cx="45" cy="15" r="3" fill="black" />
                  <circle cx="55" cy="15" r="3" fill="black" />
                  <circle cx="45" cy="25" r="3" fill="black" />
                  <circle cx="55" cy="35" r="3" fill="black" />
                  <circle cx="20" cy="45" r="3" fill="black" />
                  <circle cx="50" cy="50" r="4" fill="#16B86A" />
                  <circle cx="65" cy="45" r="3" fill="black" />
                  <circle cx="80" cy="45" r="3" fill="black" />
                  <circle cx="45" cy="65" r="3" fill="black" />
                  <circle cx="55" cy="75" r="3" fill="black" />
                  <circle cx="65" cy="85" r="3" fill="black" />
                  <circle cx="75" cy="65" r="3" fill="black" />
                </svg>
              </div>
            </div>

            {/* UPI ID Details */}
            <div className="space-y-2.5 text-center sm:text-left flex-1">
              <div>
                <span className="text-[11px] text-[#777F79]">UPI ID</span>
                <div className="text-xs font-bold text-[#F4F4EF] mt-0.5">
                  {upiId}
                </div>
              </div>

              <button
                onClick={handleCopyUPI}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#171E1A] hover:bg-[#1F2923] border border-[#232F28] text-[11px] font-semibold text-[#A7ADA8] hover:text-[#36D98A] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[#36D98A]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy UPI ID'}</span>
              </button>

              <div className="pt-0.5">
                <span className="text-[11px] text-[#777F79]">Amount</span>
                <div className="text-xl font-extrabold text-[#36D98A]">
                  ₹{totalAmount}
                </div>
              </div>
            </div>
          </div>

          {/* Form matching reference image */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-[#1C2621]">
            <p className="text-[11px] text-[#A7ADA8]">
              After payment, enter the UTR number below:
            </p>

            <div className="flex gap-2.5">
              <input
                type="text"
                placeholder="Enter UTR Number"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="flex-1 bg-[#171E1A] border border-[#232F28] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F4EF] placeholder-[#555E57] focus:outline-none focus:border-[#36D98A]"
              />

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#171E1A] border border-[#232F28] hover:border-[#36D98A]/50 text-xs font-semibold text-[#A7ADA8] hover:text-[#F4F4EF] transition-colors flex-shrink-0">
                <UploadCloud className="w-3.5 h-3.5 text-[#36D98A]" />
                <span>{paymentProofName ? 'Proof Added' : 'Upload Proof'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-[#36D98A] hover:bg-[#16B86A] text-[#080D0B] font-bold text-xs shadow-emerald-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>{submitting ? 'Submitting...' : 'Submit Payment'}</span>
              {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
            </button>

            <div className="text-center pt-1 text-[10px] text-[#777F79] flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36D98A]" />
              <span>Payment will be verified by admin shortly.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
