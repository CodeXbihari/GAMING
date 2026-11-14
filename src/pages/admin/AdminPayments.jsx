import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, Eye } from 'lucide-react';
import { EquipmentVisual } from '../../components/EquipmentVisual';

export const AdminPayments = () => {
  const { bookings, verifyPayment, rejectPayment } = useApp();
  const [activeTab, setActiveTab] = useState('pending');
  const [previewReceipt, setPreviewReceipt] = useState(null);

  const pendingPayments = bookings.filter((b) => b.paymentStatus === 'Pending' || b.status === 'Pending Verification');
  const verifiedPayments = bookings.filter((b) => b.paymentStatus === 'Paid');
  const rejectedPayments = bookings.filter((b) => b.paymentStatus === 'Rejected');

  const getList = () => {
    if (activeTab === 'pending') return pendingPayments;
    if (activeTab === 'verified') return verifiedPayments;
    return rejectedPayments;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F4EF]">
          Payment Verification
        </h1>
        <p className="text-xs text-[#A7ADA8] mt-0.5">
          Review and verify UPI payments
        </p>
      </div>

      {/* Tabs matching Frame 9 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'pending'
              ? 'bg-[#171E1A] text-[#36D98A] border border-[#36D98A]/40'
              : 'text-[#A7ADA8] hover:text-[#F4F4EF]'
          }`}
        >
          Pending ({pendingPayments.length})
        </button>

        <button
          onClick={() => setActiveTab('verified')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'verified'
              ? 'bg-[#171E1A] text-[#36D98A] border border-[#36D98A]/40'
              : 'text-[#A7ADA8] hover:text-[#F4F4EF]'
          }`}
        >
          Verified ({verifiedPayments.length})
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'rejected'
              ? 'bg-[#171E1A] text-[#36D98A] border border-[#36D98A]/40'
              : 'text-[#A7ADA8] hover:text-[#F4F4EF]'
          }`}
        >
          Rejected ({rejectedPayments.length})
        </button>
      </div>

      {/* Payment Cards Grid matching Frame 9 */}
      <div className="space-y-3.5">
        {getList().length === 0 ? (
          <div className="text-center py-12 bg-[#111815] border border-[#1E2822] rounded-2xl p-6">
            <p className="text-xs text-[#A7ADA8]">No records in this list.</p>
          </div>
        ) : (
          getList().map((item) => {
            return (
              <div
                key={item.id}
                className="bg-[#111815] border border-[#1E2822] hover:border-[#36D98A]/30 rounded-2xl p-4 shadow-card transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-12 rounded-lg bg-[#0D1511] border border-[#1E2B23] p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <EquipmentVisual type={item.equipmentId || 'laptop'} className="h-full w-full" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-mono font-bold text-[#F4F4EF]">
                      {item.id}
                    </div>
                    <div className="text-sm font-bold text-[#36D98A]">
                      ₹{item.price}
                    </div>
                    <div className="text-[11px] text-[#A7ADA8]">
                      UTR: <span className="font-mono text-[#F4F4EF]">{item.utr || '5189473621'}</span>
                    </div>
                    <div className="text-[10px] text-[#777F79]">
                      Submitted: {item.submittedAt || '15 Nov, 10:45 AM'}
                    </div>
                  </div>
                </div>

                {/* Right: Receipt thumbnail + Mark Paid / Reject buttons matching Frame 9 */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1C2621]">
                  {/* Receipt Thumbnail */}
                  <div
                    onClick={() => setPreviewReceipt(item)}
                    className="w-11 h-14 rounded bg-white/95 border border-[#334238] p-1 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform group relative flex-shrink-0 shadow-sm"
                    title="Click to view receipt"
                  >
                    <div className="space-y-0.5">
                      <div className="h-1 w-5 bg-gray-400 rounded-sm" />
                      <div className="h-0.5 w-7 bg-gray-300 rounded-sm" />
                      <div className="h-0.5 w-6 bg-gray-300 rounded-sm" />
                    </div>
                    <div className="text-[7px] font-bold text-gray-800 text-center font-mono">
                      ₹{item.price}
                    </div>
                    <div className="h-0.5 w-full bg-emerald-500 rounded-sm" />
                  </div>

                  {activeTab === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verifyPayment(item.id)}
                        className="px-3 py-1.5 rounded-full bg-[#36D98A] hover:bg-[#16B86A] text-[#080D0B] font-bold text-xs shadow-emerald-sm transition-all"
                      >
                        Mark Paid
                      </button>

                      <button
                        onClick={() => rejectPayment(item.id)}
                        className="px-3 py-1.5 rounded-full bg-transparent hover:bg-[#220F12] border border-[#F04444]/60 text-[#F04444] font-semibold text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-[#A7ADA8]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111815] border border-[#2C3830] rounded-2xl p-5 max-w-sm w-full shadow-2xl relative space-y-3 text-xs">
            <button
              onClick={() => setPreviewReceipt(null)}
              className="absolute top-4 right-4 text-[#A7ADA8] hover:text-[#F4F4EF]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-[#F4F4EF]">UPI Receipt</h3>

            <div className="bg-white text-gray-900 rounded-xl p-4 space-y-2">
              <div className="text-center pb-2 border-b border-gray-200">
                <div className="text-[10px] text-gray-500 font-semibold uppercase">Successful Payment</div>
                <div className="text-xl font-black text-gray-900">₹{previewReceipt.price}.00</div>
              </div>
              <div className="flex justify-between text-gray-600 text-[11px]">
                <span>To:</span>
                <span className="font-semibold text-gray-900">Hostel Gaming Hub</span>
              </div>
              <div className="flex justify-between text-gray-600 text-[11px]">
                <span>UTR:</span>
                <span className="font-mono font-bold text-gray-900">{previewReceipt.utr || '5189473621'}</span>
              </div>
            </div>

            {previewReceipt.paymentStatus === 'Pending' && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    verifyPayment(previewReceipt.id);
                    setPreviewReceipt(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#36D98A] text-[#080D0B] font-bold text-xs"
                >
                  Verify & Mark Paid
                </button>
                <button
                  onClick={() => {
                    rejectPayment(previewReceipt.id);
                    setPreviewReceipt(null);
                  }}
                  className="px-3 py-2 rounded-xl border border-[#F04444]/60 text-[#F04444] font-semibold text-xs"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
