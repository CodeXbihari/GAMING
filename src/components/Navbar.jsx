import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck, Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar = () => {
  const { currentPage, setCurrentPage, user, setUser, profileModalOpen, setProfileModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = currentPage === 'home';

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo matching reference aesthetic */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <img src="/images/hostel-gaming-hub-logo.svg" alt="Hostel Gaming Hub" className="w-[88px] sm:w-[104px] h-[60px] object-contain transition-transform group-hover:scale-[1.03]" />
          </button>

          {/* Desktop Nav Pills matching reference */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full glass-pill text-xs font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                currentPage === 'home'
                  ? 'bg-[#C6FF00] text-[#080A08] font-bold shadow-lime-sm'
                  : 'text-[#9EA79C] hover:text-[#F5F7F2] hover:bg-white/[0.04]'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => handleNavClick('equipment')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                currentPage === 'equipment' || currentPage === 'datetime' || currentPage === 'checkout'
                  ? 'bg-[#C6FF00] text-[#080A08] font-bold shadow-lime-sm'
                  : 'text-[#9EA79C] hover:text-[#F5F7F2] hover:bg-white/[0.04]'
              }`}
            >
              Hardware Rigs
            </button>

            <button
              onClick={() => handleNavClick('bookings')}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                currentPage === 'bookings'
                  ? 'bg-[#C6FF00] text-[#080A08] font-bold shadow-lime-sm'
                  : 'text-[#9EA79C] hover:text-[#F5F7F2] hover:bg-white/[0.04]'
              }`}
            >
              My Bookings
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Profile Avatar circle with Initial */}
            <button
              onClick={() => setCurrentPage('bookings')}
              className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-xs font-bold text-[#F5F7F2] hover:border-[#C6FF00] hover:text-[#C6FF00] hover:shadow-lime-sm transition-all"
              title="Student Profile"
            >
              {user.initial || 'S'}
            </button>

            {/* Lime Arrow CTA button on homepage matching reference image */}
            {isHome ? (
              <button
                onClick={() => setCurrentPage('equipment')}
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-extrabold text-xs px-4 py-2 rounded-full shadow-lime-glow transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Book Rig</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setProfileModalOpen(true)}
                className="hidden sm:inline-flex glass-pill hover:bg-white/[0.08] text-[#F5F7F2] font-semibold text-xs px-3.5 py-1.5 rounded-full transition-all"
              >
                Profile
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg glass-pill text-[#9EA79C] hover:text-[#F5F7F2]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-white/[0.08] px-4 py-3 space-y-2 text-xs">
            <button
              onClick={() => handleNavClick('home')}
              className="block w-full text-left py-2 px-3 rounded-lg text-[#F5F7F2] hover:bg-white/[0.05]"
            >
              Overview
            </button>
            <button
              onClick={() => handleNavClick('equipment')}
              className="block w-full text-left py-2 px-3 rounded-lg text-[#F5F7F2] hover:bg-white/[0.05]"
            >
              Hardware Rigs
            </button>
            <button
              onClick={() => handleNavClick('bookings')}
              className="block w-full text-left py-2 px-3 rounded-lg text-[#F5F7F2] hover:bg-white/[0.05]"
            >
              My Bookings
            </button>
          </div>
        )}
      </header>

      {/* Login / Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-modal rounded-3xl p-6 max-w-xs w-full relative text-xs">
            <button 
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 text-[#9EA79C] hover:text-[#F5F7F2]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-[#F5F7F2] mb-1">Student Profile</h3>
            <p className="text-[11px] text-[#9EA79C] mb-4">Set your hostel details for instant desk identification.</p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[#9EA79C] mb-1 font-semibold uppercase tracking-wider text-[10px]">Student Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value, initial: e.target.value.charAt(0).toUpperCase() })}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-[#F5F7F2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9EA79C] mb-1 font-semibold uppercase tracking-wider text-[10px]">Room Number</label>
                <input
                  type="text"
                  value={user.room}
                  onChange={(e) => setUser({ ...user, room: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-[#F5F7F2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9EA79C] mb-1 font-semibold uppercase tracking-wider text-[10px]">Mobile Number</label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={user.phone || ''}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-[#F5F7F2] focus:outline-none"
                  placeholder="Enter mobile number"
                />
              </div>

              <button
                onClick={() => setProfileModalOpen(false)}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-extrabold tracking-wide shadow-lime-glow transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
