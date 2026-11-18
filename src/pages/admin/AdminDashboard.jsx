import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  CreditCard,
  Clock,
  Laptop,
  TrendingUp,
  Check,
  ArrowRight,
  Crosshair,
  Terminal,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboard = () => {
  const { bookings, equipmentList, setAdminSubPage } = useApp();
  const [timeFilter, setTimeFilter] = useState('LAST 30 DAYS');

  const filterDays = timeFilter === 'LAST 7 DAYS' ? 7 : timeFilter === 'LAST 30 DAYS' ? 30 : null;
  const cutoff = filterDays ? new Date(Date.now() - filterDays * 24 * 60 * 60 * 1000) : null;
  const visibleBookings = bookings.filter((booking) => {
    if (!cutoff) return true;
    const date = booking.dateISO ? new Date(`${booking.dateISO}T00:00:00`) : null;
    return !date || (date >= cutoff && date <= new Date());
  });

  const totalBookingsCount = visibleBookings.length;
  const totalRevenue = visibleBookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const pendingPaymentsCount = visibleBookings.filter(
    (b) => b.paymentStatus === 'Pending' || b.status === 'Pending Verification'
  ).length;
  const availableEquipmentCount = equipmentList.filter(
    (e) => e.status === 'Available'
  ).length;

  const recentBookings = visibleBookings.slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-mono">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111512] border border-[#C6FF00]/40 text-xs font-bold text-[#C6FF00] mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>ADMIN_COMMAND_DECK // BLOCK-B DESK</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F5F7F2]">
            DESK TELEMETRY & OPERATIONS
          </h1>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <label className="sr-only" htmlFor="dashboard-time-filter">Dashboard date range</label>
          <select
            id="dashboard-time-filter"
            value={timeFilter}
            onChange={(event) => setTimeFilter(event.target.value)}
            className="px-4 py-2 rounded-xl bg-[#111512] border border-white/[0.1] text-xs font-bold text-[#F5F7F2] transition-colors hover:border-[#C6FF00]/50"
          >
            <option>LAST 7 DAYS</option>
            <option>LAST 30 DAYS</option>
            <option>ALL TIME</option>
          </select>
        </div>
      </div>

      {/* 4 Neo-Brutalist Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Bookings */}
        <div 
          onClick={() => setAdminSubPage('bookings')}
          className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl p-5 shadow-2xl hover:border-[#C6FF00]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9EA79C] uppercase font-bold">TOTAL RESERVATIONS</span>
            <div className="w-8 h-8 rounded-xl bg-[#080A08] border border-white/[0.08] flex items-center justify-center text-[#C6FF00]">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#F5F7F2]">
            {totalBookingsCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-[#C6FF00]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>REAL-TIME LIVE SYNC</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9EA79C] uppercase font-bold">SETTLED REVENUE</span>
            <div className="w-8 h-8 rounded-xl bg-[#080A08] border border-white/[0.08] flex items-center justify-center text-[#C6FF00]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#C6FF00]">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-[#9EA79C]">
            <Check className="w-3.5 h-3.5 text-[#C6FF00]" />
            <span>VERIFIED SETTLEMENTS</span>
          </div>
        </div>

        {/* Pending Payments */}
        <div 
          onClick={() => setAdminSubPage('payments')}
          className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl p-5 shadow-2xl hover:border-[#C6FF00]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9EA79C] uppercase font-bold">PENDING VERIFICATION</span>
            <div className="w-8 h-8 rounded-xl bg-[#080A08] border border-white/[0.08] flex items-center justify-center text-[#E5B84C]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#E5B84C]">
            {pendingPaymentsCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-[#E5B84C]">
            <span>1-CLICK VERIFY PROOFS</span>
          </div>
        </div>

        {/* Available Rigs on Stone */}
        <div 
          onClick={() => setAdminSubPage('equipment')}
          className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl p-5 shadow-2xl hover:border-[#C6FF00]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9EA79C] uppercase font-bold">RIGS ON STONE DOCK</span>
            <div className="w-8 h-8 rounded-xl bg-[#080A08] border border-white/[0.08] flex items-center justify-center text-[#C6FF00]">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#F5F7F2]">
            {availableEquipmentCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-[#C6FF00]">
            <span>DEPLOYABLE NOW</span>
          </div>
        </div>

      </div>

      {/* Recent Bookings Queue */}
      <div className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <h2 className="text-base font-black text-[#F5F7F2]">
            DISPATCH QUEUE // RECENT BOOKINGS
          </h2>
          <button
            onClick={() => setAdminSubPage('bookings')}
            className="text-xs font-bold text-[#C6FF00] hover:underline"
          >
            [VIEW_FULL_LOG]
          </button>
        </div>

        <div className="space-y-3">
          {recentBookings.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl bg-[#171D18] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#C6FF00]">{b.id}</span>
                <div className="text-sm font-black text-[#F5F7F2]">{b.equipmentName}</div>
                <div className="text-[11px] text-[#9EA79C]">{b.studentName || 'Student'} • Room {b.studentRoom || '304'}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#F5F7F2]">{b.time}</div>
                  <div className="text-[10px] text-[#9EA79C]">{b.date}</div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#080A08] text-[#C6FF00] border border-[#C6FF00]/40 uppercase">
                    {b.status || 'CONFIRMED'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
