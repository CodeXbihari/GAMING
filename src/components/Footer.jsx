import React from 'react';
import { Gamepad2, Phone, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="w-full glass-nav mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg glass-pill flex items-center justify-center shadow-lime-sm">
                <Gamepad2 className="w-4 h-4 text-[#C6FF00]" />
              </div>
              <span className="font-extrabold text-[#F5F7F2] tracking-tight text-sm">Hostel Gaming Hub</span>
            </div>
            <p className="text-xs text-[#9EA79C] leading-relaxed">
              Tournament-grade ASUS TUF gaming laptops and EvoFox Hyperconnect™ wireless controllers reserved exclusively for hostel residents.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7F2] mb-3.5">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#9EA79C]">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-[#C6FF00] transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('equipment')} className="hover:text-[#C6FF00] transition-colors">
                  Hardware Rigs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('bookings')} className="hover:text-[#C6FF00] transition-colors">
                  My Bookings
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin')} className="hover:text-[#E5C05C] transition-colors">
                  Admin Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Timings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7F2] mb-3.5">Gaming HELP</h4>
            <ul className="space-y-2.5 text-xs text-[#9EA79C]">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C6FF00]" />
                <span>flexible slot booking</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C6FF00] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[#9EA79C]">Contact:</span>
                  <div className="flex flex-col space-y-1 mt-1">
                    <a 
                      href="tel:7644940067" 
                      className="text-[#F5F7F2] hover:text-[#C6FF00] transition-colors font-mono tracking-wide"
                    >
                      7644940067
                    </a>
                    <a 
                      href="tel:7387071740" 
                      className="text-[#F5F7F2] hover:text-[#C6FF00] transition-colors font-mono tracking-wide"
                    >
                      7387071740
                    </a>
                    <a 
                      href="tel:8170963530" 
                      className="text-[#F5F7F2] hover:text-[#C6FF00] transition-colors font-mono tracking-wide"
                    >
                      8170963530
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Status & Support */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7F2] mb-2">System Status</h4>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill border-[#C6FF00]/40 text-[#C6FF00] text-xs font-bold shadow-lime-sm">
              <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-pulse" />
              <span>Hostel Desk Active & Online</span>
            </div>
            <p className="text-[11px] text-[#9EA79C]">
              Need hardware support? Reach the student coordinator at Room 209 or via WhatsApp.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-[#687366] gap-4">
          <p>© 2026 Hostel Gaming Hub. Engineered for university gamers.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#9EA79C] cursor-pointer">Hardware Safety</span>
            <span className="hover:text-[#9EA79C] cursor-pointer">Fair Usage Policy</span>
            <span className="hover:text-[#9EA79C] cursor-pointer">Hostel Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
