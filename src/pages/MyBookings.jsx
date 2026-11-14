import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, ArrowRight, X, Download } from 'lucide-react';
import { EquipmentVisual } from '../components/EquipmentVisual';

export const MyBookings = () => {
  const { bookings, cancelBooking, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);

  const upcomingList = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending Verification');
  const pastList = bookings.filter((b) => b.status === 'Completed');
  const cancelledList = bookings.filter((b) => b.status === 'Cancelled');

  const getDisplayedList = () => {
    if (activeTab === 'upcoming') return upcomingList;
    if (activeTab === 'past') return pastList;
    return cancelledList;
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-start">
      {/* Ambient background glow & gaming gear silhouette matching Frame 6 */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-[#36D98A]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F4EF]">
          My Bookings
        </h2>
        <p className="text-xs sm:text-sm text-[#A7ADA8] mt-0.5">
          Track and manage your reservations
        </p>
      </div>

      {/* Tabs matching reference image */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#171E1A] text-[#36D98A] border border-[#36D98A]/40'
              : 'text-[#A7ADA8] hover:text-[#F4F4EF]'
          }`}
        >
          Upcoming ({upcomingList.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'past'
              ? 'bg-[#171E1A] text-[#36D98A] border border-[#36D98A]/40'
              : 'text-[#A7ADA8] hover:text-[#F4F4EF]'
          }`}
        >
          Past ({pastList.length})
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'cancelled'
              ? 'bg-[#171E1A] text-[#36D98A] border border-[#36D98A]/40'
              : 'text-[#A7ADA8] hover:text-[#F4F4EF]'
          }`}
        >
          Cancelled ({cancelledList.length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {getDisplayedList().length === 0 ? (
          <div className="text-center py-12 bg-[#111815] border border-[#1E2822] rounded-2xl p-6">
            <p className="text-xs text-[#A7ADA8]">No reservations found in this section.</p>
          </div>
        ) : (
          getDisplayedList().map((item) => {
            const isConfirmed = item.status === 'Confirmed';
            const isPaid = item.paymentStatus === 'Paid';

            return (
              <div
                key={item.id}
                className="bg-[#111815] border border-[#1E2822] hover:border-[#36D98A]/30 rounded-2xl p-4 shadow-card transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Equipment Thumbnail + Details matching reference */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-14 rounded-lg bg-[#0D1511] border border-[#1E2B23] p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <EquipmentVisual type={item.equipmentId || 'laptop'} className="h-full w-full" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-mono font-bold text-[#F4F4EF]">
                      {item.id}
                    </div>
                    <div className="text-sm font-bold text-[#A7ADA8]">
                      {item.equipmentName}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#777F79] pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#36D98A]" />
                        <span>{item.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#36D98A]" />
                        <span>{item.time}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Badges & View Details button matching Frame 6 */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1C2621]">
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#0B3D2B]/80 text-[#36D98A] border border-[#36D98A]/30">
                      Confirmed
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#0B3D2B]/80 text-[#36D98A] border border-[#36D98A]/30">
                      Paid
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedBookingModal(item)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#F4F4EF] hover:text-[#36D98A] bg-[#171E1A] hover:bg-[#1E2822] border border-[#232F28] px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111815] border border-[#2C3830] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedBookingModal(null)}
              className="absolute top-4 right-4 text-[#A7ADA8] hover:text-[#F4F4EF]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg bg-[#0D1511] border border-[#1E2B23] p-1 flex items-center justify-center">
                <EquipmentVisual type={selectedBookingModal.equipmentId || 'laptop'} className="h-full w-full" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#36D98A]">
                  {selectedBookingModal.id}
                </span>
                <h3 className="text-sm font-bold text-[#F4F4EF]">
                  {selectedBookingModal.equipmentName}
                </h3>
              </div>
            </div>

            <div className="bg-[#171E1A] rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A7ADA8]">Date & Time:</span>
                <span className="text-[#F4F4EF] font-medium">{selectedBookingModal.date} • {selectedBookingModal.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7ADA8]">Amount:</span>
                <span className="text-[#36D98A] font-bold">₹{selectedBookingModal.price}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#232F28]">
                <span className="text-[#A7ADA8]">Pickup PIN:</span>
                <span className="text-sm font-mono font-bold text-[#D8B45A] bg-[#080D0B] px-2 py-0.5 rounded border border-[#8D7845]">
                  {selectedBookingModal.pin || '4829'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                addToast('Booking pass downloaded', 'success');
                setSelectedBookingModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#36D98A] hover:bg-[#16B86A] text-[#080D0B] font-bold text-xs shadow-emerald-sm transition-all"
            >
              Download Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
