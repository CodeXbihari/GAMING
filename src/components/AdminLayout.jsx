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
  X
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { adminSubPage, setAdminSubPage, setCurrentPage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'equipment', label: 'Equipment', icon: Gamepad2 },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#080D0B] text-[#F4F4EF] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0D1511] border-b border-[#171E1A]">
        <div className="flex items-center gap-2.5">
          <Gamepad2 className="w-5 h-5 text-[#36D98A]" />
          <span className="font-bold text-sm text-[#F4F4EF]">Hostel Gaming Hub</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#A7ADA8] hover:text-[#F4F4EF]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Fixed Left Sidebar matching Frames 7-9 in reference */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-60 bg-[#0D1511] border-r border-[#171E1A] p-4 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo matching reference */}
          <div className="flex items-center gap-2.5 px-2 py-1">
            <Gamepad2 className="w-5 h-5 text-[#36D98A]" />
            <div className="font-bold text-xs leading-tight text-[#F4F4EF]">
              <div>Hostel</div>
              <div className="text-[10px] text-[#A7ADA8] uppercase tracking-wider">Gaming Hub</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#36D98A] text-[#080D0B] font-bold shadow-emerald-sm'
                      : 'text-[#A7ADA8] hover:text-[#F4F4EF] hover:bg-[#171E1A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#080D0B]' : 'text-[#777F79]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#1C2621] space-y-1.5">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#D8B45A] hover:bg-[#171E1A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </button>

          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#777F79] hover:text-[#F04444] hover:bg-[#220F12] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 p-5 sm:p-7 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
