import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, Search, Filter, CheckCircle, AlertTriangle, Crosshair, Terminal, Ban, X } from 'lucide-react';
import { EquipmentVisual } from '../../components/EquipmentVisual';

export const AdminBookings = () => {
  const { bookings, verifyPayment, cancelBooking } = useApp();
  const [gameRequests, setGameRequests] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    let active = true;
    const loadGameRequests = async () => {
      const { data, error } = await supabase
        .from('game_download_requests')
        .select('booking_reference, wants_download, game_name, notification_sent');
      if (!active) return;
      if (error) {
        console.error('Could not load game download requests:', error);
        return;
      }
      setGameRequests(Object.fromEntries((data || []).map((request) => [request.booking_reference, request])));
    };

    loadGameRequests();
    const refreshInterval = window.setInterval(loadGameRequests, 30000);

    return () => {
      active = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.studentName && b.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.utr && b.utr.includes(searchTerm)) ||
      (gameRequests[b.id]?.game_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-mono">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111512] border border-[#C6FF00]/40 text-xs font-bold text-[#C6FF00] mb-2">
            <Crosshair className="w-3.5 h-3.5" />
            <span>RESERVATION_LOG // PROTOCOL_TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F5F7F2]">
            BOOKINGS & DISPATCH LOG
          </h1>
          <p className="text-xs text-[#9EA79C] mt-1">
            Real-time reservations and equipment allocations
          </p>
        </div>

        <div className="text-xs text-[#9EA79C]">
          <span>TOTAL LOGGED: </span>
          <span className="text-[#C6FF00] font-bold">{bookings.length} RECORDS</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#111512] p-4 rounded-3xl border-2 border-white/[0.08] shadow-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#687366] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, equipment, student, UPI last 4..."
            className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#F5F7F2] placeholder-[#687366] focus:outline-none focus:border-[#C6FF00] font-mono"
          />
        </div>

        {/* Status Pill Tabs Container */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#171D18] border border-white/[0.08]">
          {['All', 'Confirmed', 'Pending Verification', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
                  : 'text-[#9EA79C] hover:text-[#F5F7F2]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[#687366] font-bold uppercase tracking-wider text-[10px] bg-[#080A08]/60">
                <th className="py-4 px-6">REF ID</th>
                <th className="py-4 px-6">EQUIPMENT</th>
                <th className="py-4 px-6">STUDENT / ROOM</th>
                <th className="py-4 px-6">DATE & SLOT</th>
                <th className="py-4 px-6">AMOUNT</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">METHOD</th>
                <th className="py-4 px-6">GAME DOWNLOAD</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-4 px-6 font-mono font-black text-[#C6FF00]">
                    {b.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-8 rounded-xl bg-[#080A08] border border-white/[0.08] p-1 flex items-center justify-center shrink-0">
                        <EquipmentVisual type={b.equipmentId || 'laptop'} className="h-full w-full" />
                      </div>
                      <span className="font-black text-[#F5F7F2]">{b.equipmentName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#9EA79C]">
                    <div className="font-bold text-[#F5F7F2]">{b.studentName || 'Student'}</div>
                    <div className="text-[11px] text-[#687366]">{b.roomNo || 'Block B'}</div>
                  </td>
                  <td className="py-4 px-6 text-[#9EA79C]">
                    <div className="font-bold text-[#F5F7F2]">{b.date}</div>
                    <div className="text-[11px] text-[#C6FF00] font-bold">{b.time}</div>
                  </td>
                  <td className="py-4 px-6 font-black text-sm text-[#F5F7F2]">
                    ₹{b.price}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        b.status === 'Confirmed'
                          ? 'bg-[#171D18] text-[#C6FF00] border border-[#C6FF00]/40'
                          : b.status === 'Completed'
                          ? 'bg-[#171D18] text-[#60A5FA] border border-[#60A5FA]/40'
                          : b.status === 'Cancelled'
                          ? 'bg-red-950/40 text-red-400 border border-red-500/40'
                          : 'bg-[#171D18] text-[#E5B84C] border border-[#E5B84C]/40'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-[#F5F7F2]">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#171D18] border border-white/[0.08] text-[#C6FF00] font-black uppercase">
                      {b.paymentMethod || 'UPI'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[11px] text-[#9EA79C]">
                    {gameRequests[b.id] ? (
                      gameRequests[b.id].wants_download ? (
                        <div>
                          <div className="font-black text-[#C6FF00]">YES · {gameRequests[b.id].game_name}</div>
                          <div className="mt-1 text-[9px] uppercase tracking-wider text-[#687366]">
                            {gameRequests[b.id].notification_sent ? 'ADMIN EMAIL SENT' : 'SAVED · EMAIL NOT SENT'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#687366]">NO DOWNLOAD REQUEST</span>
                      )
                    ) : (
                      <span className="text-[#687366]">NOT ANSWERED</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {b.status === 'Cancelled' ? (
                      <span className="text-[10px] text-[#687366] font-mono font-bold uppercase tracking-wider">
                        VOID
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCancelTarget(b)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-black text-red-400 bg-red-950/40 border border-red-500/40 hover:bg-red-900/60 hover:border-red-400 hover:text-white transition-all cursor-pointer shadow-sm"
                        title="Cancel reservation & free time slot"
                      >
                        <Ban className="w-3 h-3" />
                        <span>CANCEL</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#687366]">
                    No matching reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Cancellation Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
          <div className="bg-[#111512] border-2 border-red-500/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.25)] relative space-y-5">
            <button
              onClick={() => setCancelTarget(null)}
              className="absolute top-4 right-4 text-[#9EA79C] hover:text-[#F5F7F2]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                  ADMIN_CANCEL_OVERRIDE
                </span>
                <h3 className="text-base font-black text-[#F5F7F2]">
                  Cancel Reservation?
                </h3>
              </div>
            </div>

            <div className="bg-[#171D18] rounded-2xl p-4 space-y-2.5 text-xs border border-white/[0.06]">
              <div className="flex justify-between">
                <span className="text-[#9EA79C]">REF ID:</span>
                <span className="text-[#C6FF00] font-black">{cancelTarget.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9EA79C]">EQUIPMENT:</span>
                <span className="text-[#F5F7F2] font-bold">{cancelTarget.equipmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9EA79C]">STUDENT:</span>
                <span className="text-[#F5F7F2]">{cancelTarget.studentName || 'Student'} ({cancelTarget.roomNo || 'Block B'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9EA79C]">SLOT:</span>
                <span className="text-[#F5F7F2]">{cancelTarget.date} • {cancelTarget.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9EA79C]">STATUS:</span>
                <span className="text-[#E5C05C] font-bold">{cancelTarget.status}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#9EA79C] leading-relaxed">
              Cancelling this reservation will invalidate the student pass and immediately <span className="text-[#C6FF00] font-bold">free up this time slot</span> on the public booking calendar.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-3 rounded-full bg-[#171D18] hover:bg-white/[0.05] text-[#9EA79C] hover:text-[#F5F7F2] border border-white/[0.1] font-bold text-xs transition-all cursor-pointer"
              >
                ABORT
              </button>
              <button
                type="button"
                onClick={async () => {
                  const cancelled = await cancelBooking(cancelTarget.id);
                  if (cancelled) setCancelTarget(null);
                }}
                className="flex-1 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
              >
                CONFIRM CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
