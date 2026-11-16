import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, ArrowRight, X, Download, ShieldCheck, KeyRound, Crosshair, Terminal } from 'lucide-react';

export const MyBookings = () => {
  const { bookings, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);

  const upcomingList = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending Verification');
  const pastList = bookings.filter((b) => b.status === 'Completed');

  const getDisplayedList = () => {
    if (activeTab === 'past') return pastList;
    return upcomingList;
  };

  const getEquipmentImage = (type) => {
    if (type === 'controller') return '/images/controller-hero.jpg';
    if (type === 'combo') return '/images/combo-setup.jpg';
    return '/images/laptop-hero.jpg';
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-start">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#C6FF00]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Cyber-Tech Editorial Header */}
      <div className="mb-8 border-b border-white/[0.08] pb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono font-bold text-[#C6FF00] mb-2 shadow-lime-sm">
            <Crosshair className="w-3.5 h-3.5" />
            <span>STUDENT_RESERVATIONS // COMMAND_DECK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F7F2]">
            MY RESERVATIONS
          </h1>
        </div>

        <div className="text-xs font-mono text-[#9EA79C] flex items-center gap-2">
          <span>HOSTEL_LOCATION: </span>
          <span className="px-2.5 py-0.5 rounded-full glass-pill text-[#C6FF00] font-bold">BLOCK-B GROUND FLOOR</span>
        </div>
      </div>

      {/* Neo-Brutalist Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-full glass-pill w-fit mb-8 font-mono">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
              : 'text-[#9EA79C] hover:text-[#F5F7F2]'
          }`}
        >
          UPCOMING ({upcomingList.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all ${
            activeTab === 'past'
              ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
              : 'text-[#9EA79C] hover:text-[#F5F7F2]'
          }`}
        >
          PAST ({pastList.length})
        </button>
      </div>

      {/* Bookings List with 3D Stone Podium Cards */}
      <div className="space-y-4">
        {getDisplayedList().length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl p-8">
            <p className="text-xs font-mono text-[#9EA79C]">NO ACTIVE SLOTS FOUND IN THIS PROTOCOL FILTER.</p>
          </div>
        ) : (
          getDisplayedList().map((item) => {
            const isConfirmed = item.status === 'Confirmed';
            const isPaid = item.paymentStatus === 'Paid';

            return (
              <div
                key={item.id}
                className="glass-panel hover:border-[#C6FF00]/50 rounded-3xl p-6 shadow-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
              >
                {/* 3D Stone Podium Thumbnail + Details */}
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-20 rounded-2xl bg-[#040504] border border-[#C6FF00]/30 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lime-sm group-hover:border-[#C6FF00] transition-all">
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-cover bg-bottom opacity-70" style={{ backgroundImage: "url('/images/stone-pedestal.jpg')" }} />
                    <img src={getEquipmentImage(item.equipmentId)} alt="Rig" className="w-[85%] h-auto max-h-14 object-contain z-10" />
                    <div className="absolute inset-0 bg-radial from-[#C6FF00]/20 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="space-y-1 font-mono">
                    <div className="text-xs font-mono font-bold text-[#C6FF00]">
                      {item.id}
                    </div>
                    <div className="text-lg font-black text-[#F5F7F2]">
                      {item.equipmentName}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#9EA79C]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C6FF00]" />
                        <span>{item.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C6FF00]" />
                        <span>{item.time}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Telemetry Badges & Action */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.06] font-mono">
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[10px] px-3 py-1 rounded-full font-black glass-pill text-[#C6FF00] uppercase border-[#C6FF00]/40">
                      {item.status || 'CONFIRMED'}
                    </span>
                    <span className="text-[10px] px-3 py-1 rounded-full font-black glass-pill text-[#C6FF00] uppercase border-[#C6FF00]/40">
                      {item.paymentStatus || 'PAID'}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedBookingModal(item)}
                    className="inline-flex items-center gap-2 text-xs font-mono font-black text-[#080A08] bg-[#C6FF00] hover:bg-[#D4FF33] px-5 py-3 rounded-full transition-all shadow-lime-glow hover:scale-102 cursor-pointer"
                  >
                    <span>VIEW PASS</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
          <div className="glass-modal rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedBookingModal(null)}
              className="absolute top-4 right-4 text-[#9EA79C] hover:text-[#F5F7F2]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-16 rounded-xl bg-[#040504] border border-[#C6FF00]/40 p-1 flex items-center justify-center overflow-hidden shrink-0">
                <div className="absolute inset-x-0 bottom-0 h-6 bg-cover bg-bottom opacity-70" style={{ backgroundImage: "url('/images/stone-pedestal.jpg')" }} />
                <img src={getEquipmentImage(selectedBookingModal.equipmentId)} alt="Rig" className="w-[85%] h-auto max-h-11 object-contain z-10" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#C6FF00] font-bold">
                  {selectedBookingModal.id}
                </span>
                <h3 className="text-base font-black text-[#F5F7F2]">
                  {selectedBookingModal.equipmentName}
                </h3>
              </div>
            </div>

            <div className="glass-pill rounded-2xl p-5 space-y-3 text-xs border border-white/[0.08]">
              <div className="flex justify-between">
                <span className="text-[#9EA79C]">SCHEDULE SLOT:</span>
                <span className="text-[#F5F7F2] font-bold">{selectedBookingModal.date} • {selectedBookingModal.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9EA79C]">SETTLEMENT:</span>
                <span className="text-[#C6FF00] font-black text-sm">₹{selectedBookingModal.price}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/[0.08]">
                <span className="text-[#9EA79C] font-bold">BOOKING STATUS:</span>
                <span className="text-xs font-mono font-black text-[#C6FF00] glass-pill px-3.5 py-1.5 rounded-xl border-[#C6FF00]/50 shadow-lime-sm">
                  {selectedBookingModal.status || 'CONFIRMED'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080A08] border border-white/[0.06] text-[11px] text-[#9EA79C] leading-relaxed">
              Present this pass at <span className="text-[#C6FF00] font-bold">Ground Floor Block B Lounge</span> to launch your session.
            </div>

            <button
              onClick={() => {
                addToast('Booking pass verified & active', 'success');
                setSelectedBookingModal(null);
              }}
              className="w-full py-3.5 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-black text-xs tracking-wider uppercase shadow-lime-sm transition-all"
            >
              READY FOR COLLECTION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
