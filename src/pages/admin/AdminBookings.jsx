import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, Search, Filter, CheckCircle, AlertTriangle } from 'lucide-react';
import { EquipmentVisual } from '../../components/EquipmentVisual';

export const AdminBookings = () => {
  const { bookings, verifyPayment, cancelBooking } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.studentName && b.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.utr && b.utr.includes(searchTerm));

    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F4EF]">
          Bookings Management
        </h1>
        <p className="text-xs sm:text-sm text-[#A7ADA8] mt-0.5">
          Real-time reservations and equipment allocations
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111815] p-3 rounded-2xl border border-[#232F28]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#777F79] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, equipment, student, UTR..."
            className="w-full bg-[#171E1A] border border-[#232F28] rounded-xl pl-9 pr-4 py-2 text-xs text-[#F4F4EF] placeholder-[#555E57] focus:outline-none focus:border-[#36D98A]"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Confirmed', 'Pending Verification', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-[#36D98A] text-[#080D0B]'
                  : 'bg-[#171E1A] text-[#A7ADA8] hover:text-[#F4F4EF]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#111815] border border-[#232F28] rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1C2621] text-[#777F79] font-semibold uppercase tracking-wider text-[11px] bg-[#0D1511]/50">
                <th className="py-4 px-5">Ref ID</th>
                <th className="py-4 px-5">Equipment</th>
                <th className="py-4 px-5">Student / Room</th>
                <th className="py-4 px-5">Date & Slot</th>
                <th className="py-4 px-5">Amount</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Desk PIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2621]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[#171E1A]/60 transition-colors">
                  <td className="py-3 px-5 font-mono font-bold text-[#F4F4EF]">
                    {b.id}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-7 rounded bg-[#0D1511] border border-[#1E2B23] p-0.5">
                        <EquipmentVisual type={b.equipmentId || 'laptop'} className="h-full w-full" />
                      </div>
                      <span className="font-semibold text-[#F4F4EF]">{b.equipmentName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-[#A7ADA8]">
                    <div className="font-semibold text-[#F4F4EF]">{b.studentName || 'Student'}</div>
                    <div className="text-[11px] text-[#777F79]">{b.roomNo || 'Block B'}</div>
                  </td>
                  <td className="py-3 px-5 text-[#A7ADA8]">
                    <div className="font-semibold text-[#F4F4EF]">{b.date}</div>
                    <div className="text-[11px] text-[#36D98A]">{b.time}</div>
                  </td>
                  <td className="py-3 px-5 font-bold text-[#F4F4EF]">
                    ₹{b.price}
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        b.status === 'Confirmed'
                          ? 'bg-[#0B3D2B] text-[#36D98A] border border-[#36D98A]/30'
                          : b.status === 'Completed'
                          ? 'bg-[#17202A] text-[#60A5FA] border border-[#60A5FA]/30'
                          : 'bg-[#2B2310] text-[#E5B84C] border border-[#E5B84C]/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono font-bold text-[#D8B45A]">
                    {b.pin || '4829'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
