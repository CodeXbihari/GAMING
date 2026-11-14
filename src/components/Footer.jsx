import React from 'react';
import { Gamepad2, Shield, Clock, MapPin, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="w-full bg-[#080D0B] border-t border-[#171E1A] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#111815] border border-[#36D98A]/30 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-[#36D98A]" />
              </div>
              <span className="font-bold text-[#F4F4EF] tracking-tight">Hostel Gaming Hub</span>
            </div>
            <p className="text-xs text-[#777F79] leading-relaxed">
              Premium gaming laptops and controllers reserved exclusively for hostel residents. Fast 1-hour slots with zero hassle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A7ADA8] mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-[#777F79]">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-[#36D98A] transition-colors">
                  Home Hero
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('equipment')} className="hover:text-[#36D98A] transition-colors">
                  Choose Equipment
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('bookings')} className="hover:text-[#36D98A] transition-colors">
                  My Bookings
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin')} className="hover:text-[#D8B45A] transition-colors">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Timings */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A7ADA8] mb-3">Lounge Details</h4>
            <ul className="space-y-2 text-xs text-[#777F79]">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#36D98A]" />
                <span>Ground Floor, Block B Lounge</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#36D98A]" />
                <span>Open Daily: 9:00 AM - 11:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#36D98A]" />
                <span>ID Verification Required</span>
              </li>
            </ul>
          </div>

          {/* Status & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A7ADA8] mb-2">Live Hub Status</h4>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1E16] border border-[#36D98A]/30 text-[#36D98A] text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#36D98A] animate-pulse" />
              <span>Gaming Hub is Active Now</span>
            </div>
            <p className="text-[11px] text-[#777F79]">
              Need immediate support? Ping the warden or gaming coordinator on WhatsApp.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#111815] flex flex-col sm:flex-row items-center justify-between text-xs text-[#777F79] gap-4">
          <p>© 2026 Hostel Gaming Hub. Built for collegiate gamers.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#A7ADA8] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#A7ADA8] cursor-pointer">Security Policy</span>
            <span className="hover:text-[#A7ADA8] cursor-pointer">Hostel Rules</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
