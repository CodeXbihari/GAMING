import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  CreditCard,
  Clock,
  Laptop,
  TrendingUp,
  ChevronDown,
  Check,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const { bookings, equipmentList, setAdminSubPage } = useApp();
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');

  const totalBookingsCount = 248;
  const totalRevenue = 12400;
  const pendingPaymentsCount = 6;
  const availableEquipmentCount = 7;

  const chartPoints = [
    { day: 'Mon', value: 24, x: 20, y: 120 },
    { day: 'Tue', value: 38, x: 80, y: 85 },
    { day: 'Wed', value: 28, x: 140, y: 105 },
    { day: 'Thu', value: 52, x: 200, y: 50 },
    { day: 'Fri', value: 45, x: 260, y: 70 },
    { day: 'Sat', value: 72, x: 320, y: 20 },
    { day: 'Sun', value: 65, x: 380, y: 35 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Section matching reference */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F4EF]">
            Admin Dashboard
          </h1>
          <p className="text-xs text-[#A7ADA8] mt-0.5">
            Welcome, Admin 👋
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111815] border border-[#1E2822] text-xs font-semibold text-[#F4F4EF] transition-colors">
            <span>{timeFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#A7ADA8]" />
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards matching Frame 7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Bookings */}
        <div className="bg-[#111815] border border-[#1E2822] rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A7ADA8]">Total Bookings</span>
            <div className="w-7 h-7 rounded-lg bg-[#0D1511] border border-[#1E2B23] flex items-center justify-center text-[#36D98A]">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#F4F4EF]">
            {totalBookingsCount}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-[#36D98A]">
            <TrendingUp className="w-3 h-3" />
            <span>+12%</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#111815] border border-[#1E2822] rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A7ADA8]">Total Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-[#0D1511] border border-[#1E2B23] flex items-center justify-center text-[#D8B45A]">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#F4F4EF]">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-[#36D98A]">
            <TrendingUp className="w-3 h-3" />
            <span>+18%</span>
          </div>
        </div>

        {/* Pending Payments */}
        <div 
          onClick={() => setAdminSubPage('payments')}
          className="bg-[#111815] border border-[#1E2822] rounded-2xl p-4 shadow-card hover:border-[#E5B84C]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A7ADA8]">Pending Payments</span>
            <div className="w-7 h-7 rounded-lg bg-[#0D1511] border border-[#2A2315] flex items-center justify-center text-[#E5B84C]">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#F4F4EF]">
            {pendingPaymentsCount}
          </div>
        </div>

        {/* Available Equipment */}
        <div 
          onClick={() => setAdminSubPage('equipment')}
          className="bg-[#111815] border border-[#1E2822] rounded-2xl p-4 shadow-card hover:border-[#36D98A]/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A7ADA8]">Available Equipment</span>
            <div className="w-7 h-7 rounded-lg bg-[#0D1511] border border-[#1E2B23] flex items-center justify-center text-[#36D98A]">
              <Laptop className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#F4F4EF]">
            {availableEquipmentCount}
          </div>
        </div>

      </div>

      {/* Below Statistics: Booking Overview Chart & Recent Bookings matching Frame 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Booking Overview Line Chart */}
        <div className="lg:col-span-8 bg-[#111815] border border-[#1E2822] rounded-2xl p-5 shadow-card">
          <h3 className="text-xs font-bold text-[#F4F4EF] mb-4">
            Booking Overview
          </h3>

          <div className="w-full h-48 relative">
            <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad7" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#36D98A" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#36D98A" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow7" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="30" x2="380" y2="30" stroke="#1A2520" strokeDasharray="3,3" />
              <line x1="20" y1="75" x2="380" y2="75" stroke="#1A2520" strokeDasharray="3,3" />
              <line x1="20" y1="120" x2="380" y2="120" stroke="#1A2520" strokeDasharray="3,3" />

              {/* Area fill */}
              <path
                d="M 20 120 C 50 100, 60 90, 80 85 C 100 80, 120 110, 140 105 C 160 100, 180 55, 200 50 C 220 45, 240 75, 260 70 C 280 65, 300 25, 320 20 C 340 15, 360 40, 380 35 L 380 140 L 20 140 Z"
                fill="url(#chartGrad7)"
              />

              {/* Line */}
              <path
                d="M 20 120 C 50 100, 60 90, 80 85 C 100 80, 120 110, 140 105 C 160 100, 180 55, 200 50 C 220 45, 240 75, 260 70 C 280 65, 300 25, 320 20 C 340 15, 360 40, 380 35"
                fill="none"
                stroke="#36D98A"
                strokeWidth="2.5"
                filter="url(#glow7)"
              />

              {/* Data points */}
              {chartPoints.map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="3.5" fill="#080D0B" stroke="#36D98A" strokeWidth="2" />
                  <text x={pt.x} y="152" textAnchor="middle" fill="#777F79" fontSize="9" fontWeight="500">
                    {pt.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Recent Bookings List matching Frame 7 */}
        <div className="lg:col-span-4 bg-[#111815] border border-[#1E2822] rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#F4F4EF]">
              Recent Bookings
            </h3>
            <button
              onClick={() => setAdminSubPage('bookings')}
              className="text-[11px] font-semibold text-[#36D98A] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { id: '#GH250415007', slot: '11:00 AM' },
              { id: '#GH250415006', slot: '10:00 AM' },
              { id: '#GH250415005', slot: '09:00 AM' },
            ].map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1511] border border-[#1A2520]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#36D98A]" />
                  <span className="text-xs font-mono font-bold text-[#F4F4EF]">
                    {b.id}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-[#A7ADA8]">
                    {b.slot}
                  </span>
                  <Check className="w-3.5 h-3.5 text-[#36D98A]" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
