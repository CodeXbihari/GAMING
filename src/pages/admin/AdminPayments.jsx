import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { Check, X, Eye, FileText, ExternalLink, CreditCard, ShieldCheck, Crosshair } from 'lucide-react';
import { EquipmentVisual } from '../../components/EquipmentVisual';

export const AdminPayments = () => {
  const { bookings, verifyPayment, rejectPayment } = useApp();
  const [activeTab, setActiveTab] = useState('pending');
  const [previewReceipt, setPreviewReceipt] = useState(null);
  const [proofUrl, setProofUrl] = useState(null);

  const pendingPayments = bookings.filter((b) => b.paymentStatus === 'Pending' && ['Confirmed', 'Pending Verification'].includes(b.status));
  const verifiedPayments = bookings.filter((b) => b.paymentStatus === 'Paid');
  const rejectedPayments = bookings.filter((b) => b.paymentStatus === 'Rejected');

  const getList = () => {
    if (activeTab === 'pending') return pendingPayments;
    if (activeTab === 'verified') return verifiedPayments;
    return rejectedPayments;
  };

  useEffect(() => {
    let isMounted = true;
    if (previewReceipt?.proof) {
      if (previewReceipt.proof.startsWith('http')) {
        setProofUrl(previewReceipt.proof);
      } else {
        supabase.storage
          .from('payment-proofs')
          .createSignedUrl(previewReceipt.proof, 600)
          .then(({ data, error }) => {
            if (isMounted) {
              if (data?.signedUrl) {
                setProofUrl(data.signedUrl);
              } else {
                setProofUrl(null);
              }
            }
          });
      }
    } else {
      setProofUrl(null);
    }
    return () => {
      isMounted = false;
    };
  }, [previewReceipt]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111512] border border-[#C6FF00]/40 text-xs font-bold text-[#C6FF00] mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>SETTLEMENT_CLEARINGHOUSE // PROTOCOL_04</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F5F7F2]">
            PAYMENT VERIFICATION
          </h1>
          <p className="text-xs text-[#9EA79C] mt-1">
            Review and verify UPI and Cash payments in real time
          </p>
        </div>

        {/* Tab Pills Container */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#111512] border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
                : 'text-[#9EA79C] hover:text-[#F5F7F2]'
            }`}
          >
            PENDING ({pendingPayments.length})
          </button>

          <button
            onClick={() => setActiveTab('verified')}
            className={`px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'verified'
                ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
                : 'text-[#9EA79C] hover:text-[#F5F7F2]'
            }`}
          >
            VERIFIED ({verifiedPayments.length})
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-full text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
                : 'text-[#9EA79C] hover:text-[#F5F7F2]'
            }`}
          >
            REJECTED ({rejectedPayments.length})
          </button>
        </div>
      </div>

      {/* Payment Cards Grid */}
      <div className="space-y-4">
        {getList().length === 0 ? (
          <div className="text-center py-16 bg-[#111512] border-2 border-white/[0.08] rounded-3xl p-8 shadow-2xl">
            <p className="text-xs text-[#687366] uppercase tracking-wider">No settlement records in this view.</p>
          </div>
        ) : (
          getList().map((item) => {
            return (
              <div
                key={item.id}
                className="bg-[#111512] border-2 border-white/[0.08] hover:border-[#C6FF00]/40 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-14 rounded-2xl bg-[#080A08] border border-white/[0.08] p-1.5 flex items-center justify-center overflow-hidden shrink-0">
                    <EquipmentVisual type={item.equipmentId || 'laptop'} className="h-full w-full" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-black text-[#C6FF00]">
                        {item.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#171D18] text-[#9EA79C] border border-white/[0.06]">
                        {item.paymentMethod || 'UPI'}
                      </span>
                    </div>

                    <div className="text-base font-black text-[#F5F7F2]">
                      ₹{item.price} • {item.equipmentName}
                    </div>

                    <div className="text-xs text-[#9EA79C]">
                      Student: <span className="font-bold text-[#F5F7F2]">{item.studentName}</span> ({item.roomNo})
                    </div>

                    {item.utr && (
                      <div className="text-xs text-[#9EA79C]">
                        UPI REF (LAST 4): <span className="font-mono font-bold text-[#C6FF00]">{item.utr}</span>
                      </div>
                    )}

                    <div className="text-[11px] text-[#687366]">
                      Schedule: {item.date} • {item.time}
                    </div>
                  </div>
                </div>

                {/* Right: Receipt thumbnail + Mark Paid / Reject buttons */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                  {/* Receipt / Proof Thumbnail */}
                  <div
                    onClick={() => setPreviewReceipt(item)}
                    className="w-12 h-16 rounded-xl bg-white/95 border border-white/20 p-1.5 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform group relative shrink-0 shadow-lg overflow-hidden"
                    title="Click to view proof / receipt"
                  >
                    <div className="space-y-1">
                      <div className="h-1 w-6 bg-gray-400 rounded-sm" />
                      <div className="h-0.5 w-8 bg-gray-300 rounded-sm" />
                      <div className="h-0.5 w-7 bg-gray-300 rounded-sm" />
                    </div>
                    <div className="text-[8px] font-black text-gray-900 text-center font-mono">
                      ₹{item.price}
                    </div>
                    <div className={`h-1 w-full rounded-sm ${
                      item.paymentStatus === 'Paid' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                    }`} />
                  </div>

                  {activeTab === 'pending' ? (
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => verifyPayment(item.id)}
                        className="px-5 py-2.5 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-mono font-black text-xs tracking-wider uppercase shadow-lime-sm transition-all cursor-pointer"
                      >
                        MARK PAID
                      </button>

                      <button
                        onClick={() => rejectPayment(item.id)}
                        className="px-4 py-2.5 rounded-full bg-[#220F12] hover:bg-[#331418] border border-[#FF453A]/50 text-[#FF453A] font-mono font-bold text-xs transition-colors cursor-pointer"
                      >
                        REJECT
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-black font-mono px-3.5 py-1.5 rounded-full uppercase tracking-wider ${
                      item.paymentStatus === 'Paid'
                        ? 'bg-[#171D18] text-[#C6FF00] border border-[#C6FF00]/40'
                        : 'bg-[#220F12] text-[#FF453A] border border-[#FF453A]/40'
                    }`}>
                      {item.paymentStatus}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Receipt Preview Modal */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111512] border-2 border-white/[0.12] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewReceipt(null)}
              className="absolute top-5 right-5 text-[#9EA79C] hover:text-[#F5F7F2] p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171D18] border border-[#C6FF00]/40 text-[10px] font-bold text-[#C6FF00]">
              <Crosshair className="w-3 h-3" />
              <span>ESCROW_PROOF_VIEWER</span>
            </div>

            <h3 className="text-lg font-black text-[#F5F7F2]">
              Settlement Verification Details
            </h3>

            {/* If uploaded screenshot exists */}
            {proofUrl ? (
              <div className="space-y-2">
                <span className="text-[10px] text-[#9EA79C] font-bold uppercase tracking-wider block">
                  Uploaded Payment Proof:
                </span>
                <div className="rounded-2xl overflow-hidden border-2 border-white/[0.08] max-h-64 bg-black flex items-center justify-center">
                  <img
                    src={proofUrl}
                    alt="Payment Proof"
                    className="w-full h-auto object-contain max-h-64"
                  />
                </div>
              </div>
            ) : null}

            {/* Bill Slip */}
            <div className="bg-white text-gray-900 rounded-2xl p-5 space-y-2.5 font-mono shadow-md">
              <div className="text-center pb-3 border-b border-gray-200">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hostel Gaming Hub Booking</div>
                <div className="text-2xl font-black text-gray-900 mt-1">₹{previewReceipt.price}.00</div>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Student:</span>
                <span className="font-bold text-gray-900">{previewReceipt.studentName}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Room:</span>
                <span className="font-bold text-gray-900">{previewReceipt.roomNo}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Method:</span>
                <span className="font-bold text-gray-900">{previewReceipt.paymentMethod}</span>
              </div>
              {previewReceipt.utr && (
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>UPI ref (last 4):</span>
                  <span className="font-mono font-black text-gray-900">{previewReceipt.utr}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Status:</span>
                <span className={`font-black ${previewReceipt.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {previewReceipt.paymentStatus}
                </span>
              </div>
            </div>

            {previewReceipt.paymentStatus !== 'Paid' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    verifyPayment(previewReceipt.id);
                    setPreviewReceipt(null);
                  }}
                  className="flex-1 py-3 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-black text-xs cursor-pointer transition-colors uppercase tracking-wider shadow-lime-sm"
                >
                  VERIFY & MARK PAID
                </button>
                <button
                  onClick={() => {
                    rejectPayment(previewReceipt.id);
                    setPreviewReceipt(null);
                  }}
                  className="px-5 py-3 rounded-full bg-[#220F12] border border-[#FF453A]/60 text-[#FF453A] font-bold text-xs cursor-pointer hover:bg-[#331418] transition-colors uppercase tracking-wider"
                >
                  REJECT
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
