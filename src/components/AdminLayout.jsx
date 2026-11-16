import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Gamepad2,
  CalendarDays,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Crosshair,
  Terminal,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { adminSubPage, setAdminSubPage, setCurrentPage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'TELEMETRY', icon: LayoutDashboard },
    { id: 'equipment', label: 'INVENTORY RIGS', icon: Gamepad2 },
    { id: 'bookings', label: 'RESERVATIONS', icon: CalendarDays },
    { id: 'payments', label: 'SETTLEMENTS', icon: CreditCard },
    { id: 'timeslots', label: 'TIME SLOTS', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#060806] text-[#F5F7F2] flex flex-col md:flex-row relative font-mono selection:bg-[#C6FF00] selection:text-[#080A08]">
      
      {/* Background Cyber Grid Backdrop */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-40 -z-20" />

      {/* Atmospheric Lime Halo Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-radial from-[#C6FF00]/12 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 glass-nav">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg glass-pill flex items-center justify-center text-[#C6FF00] shadow-lime-sm">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-xs text-[#F5F7F2]">HOSTEL // ADMIN</div>
            <div className="text-[9px] text-[#C6FF00]">OPERATIONS_ONLINE</div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl glass-pill text-[#9EA79C] hover:text-[#F5F7F2]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Fixed Left Sidebar matching Futuristic Cyber-Tech Customer UI */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 glass-nav border-r border-white/[0.08] p-5 flex flex-col justify-between backdrop-blur-2xl transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-7">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center text-[#C6FF00] shadow-lime-sm">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-[#F5F7F2]">HOSTEL_ADMIN</div>
              <div className="text-[9px] text-[#C6FF00] font-bold tracking-widest uppercase">COMMAND_DECK v2.6</div>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="px-3 py-2 rounded-2xl bg-[#111512] border border-white/[0.08] flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-pulse" />
              <span className="text-[#9EA79C]">CORE_NODE</span>
            </span>
            <span className="text-[#C6FF00] font-bold">ACTIVE</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <div className="text-[9px] text-[#687366] font-bold uppercase tracking-widest px-2 mb-2">
              [SYSTEM_MODULES]
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminSubPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminSubPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-200 ${
                    isActive
                      ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm scale-102'
                      : 'text-[#9EA79C] hover:text-[#F5F7F2] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#080A08]' : 'text-[#C6FF00]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="text-[9px] font-black">●</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-5 border-t border-white/[0.08] space-y-2">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black text-[#C6FF00] bg-[#111512] hover:bg-[#171D18] border border-[#C6FF00]/40 shadow-lime-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            <span>CUSTOMER UI</span>
          </button>

          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#687366] hover:text-[#FF453A] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>EXIT ADMIN</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
