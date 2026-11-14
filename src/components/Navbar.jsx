import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gamepad2, User, ShieldCheck, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { currentPage, setCurrentPage, user, setUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isHome = currentPage === 'home';

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#080D0B]/90 backdrop-blur-md border-b border-[#171E1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo matching reference */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <Gamepad2 className="w-5 h-5 text-[#36D98A] transition-transform group-hover:scale-105" />
            <div className="font-bold text-sm tracking-tight text-[#F4F4EF] leading-tight">
              <span>Hostel</span><br />
              <span className="text-[10px] text-[#A7ADA8] uppercase tracking-wider font-semibold">Gaming Hub</span>
            </div>
          </button>

          {/* Desktop Nav Links matching reference */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors py-1 ${
                currentPage === 'home' ? 'text-[#36D98A]' : 'text-[#A7ADA8] hover:text-[#F4F4EF]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('equipment')}
              className={`relative transition-colors py-1 ${
                currentPage === 'equipment' || currentPage === 'datetime' || currentPage === 'checkout'
                  ? 'text-[#36D98A]'
                  : 'text-[#A7ADA8] hover:text-[#F4F4EF]'
              }`}
            >
              Equipment
              {(currentPage === 'equipment' || currentPage === 'datetime' || currentPage === 'checkout') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36D98A] rounded-full" />
              )}
            </button>

            {isHome ? (
              <>
                <button
                  onClick={() => alert("Hostel Gaming Lounge:\n• Timings: 9:00 AM - 11:00 PM Daily\n• Location: Ground Floor, Block B\n• High-performance ROG laptops and controllers")}
                  className="text-[#A7ADA8] hover:text-[#F4F4EF] transition-colors py-1"
                >
                  How It Works
                </button>
                <button
                  onClick={() => alert("Contact Hostel Desk:\n• In-Charge: Shashank (Room 304)\n• WhatsApp: +91 98765 43210")}
                  className="text-[#A7ADA8] hover:text-[#F4F4EF] transition-colors py-1"
                >
                  Contact
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('bookings')}
                className={`relative transition-colors py-1 ${
                  currentPage === 'bookings' ? 'text-[#36D98A]' : 'text-[#A7ADA8] hover:text-[#F4F4EF]'
                }`}
              >
                My Bookings
                {currentPage === 'bookings' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36D98A] rounded-full" />
                )}
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Admin Portal Switcher */}
            <button
              onClick={() => setCurrentPage(currentPage === 'admin' ? 'home' : 'admin')}
              className="text-[11px] px-2.5 py-1 rounded-full border border-[#8D7845]/50 bg-[#171E1A] text-[#D8B45A] hover:border-[#D8B45A] font-semibold transition-all flex items-center gap-1.5"
              title="Toggle Admin View"
            >
              <ShieldCheck className="w-3 h-3" />
              <span className="hidden sm:inline">Admin Portal</span>
            </button>

            {/* Profile Avatar circle with 'S' matching reference */}
            <button
              onClick={() => setCurrentPage('bookings')}
              className="w-7 h-7 rounded-full bg-[#111815] border border-[#2B3530] flex items-center justify-center text-xs font-bold text-[#F4F4EF] hover:border-[#36D98A] transition-all"
              title="Profile"
            >
              {user.initial || 'S'}
            </button>

            {/* Green Login Pill button on homepage matching reference */}
            {isHome && (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:inline-flex bg-[#36D98A] hover:bg-[#16B86A] text-[#080D0B] font-bold text-xs px-4 py-1.5 rounded-full shadow-emerald-sm transition-all"
              >
                Login
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-[#A7ADA8] hover:text-[#F4F4EF]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0D1511] border-b border-[#171E1A] px-4 py-3 space-y-2 text-xs">
            <button
              onClick={() => handleNavClick('home')}
              className="block w-full text-left py-1.5 text-[#F4F4EF]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('equipment')}
              className="block w-full text-left py-1.5 text-[#F4F4EF]"
            >
              Equipment
            </button>
            <button
              onClick={() => handleNavClick('bookings')}
              className="block w-full text-left py-1.5 text-[#F4F4EF]"
            >
              My Bookings
            </button>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111815] border border-[#2C3830] rounded-2xl p-5 max-w-xs w-full shadow-2xl relative text-xs">
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-3.5 right-3.5 text-[#A7ADA8] hover:text-[#F4F4EF]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-[#F4F4EF] mb-3">Student Login</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[#A7ADA8] mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value, initial: e.target.value.charAt(0).toUpperCase() })}
                  className="w-full bg-[#171E1A] border border-[#2C3830] rounded-xl px-3 py-1.5 text-[#F4F4EF] focus:outline-none focus:border-[#36D98A]"
                />
              </div>

              <div>
                <label className="block text-[#A7ADA8] mb-1 font-medium">Room</label>
                <input
                  type="text"
                  value={user.room}
                  onChange={(e) => setUser({ ...user, room: e.target.value })}
                  className="w-full bg-[#171E1A] border border-[#2C3830] rounded-xl px-3 py-1.5 text-[#F4F4EF] focus:outline-none focus:border-[#36D98A]"
                />
              </div>

              <button
                onClick={() => setAuthModalOpen(false)}
                className="w-full mt-1 py-2 rounded-xl bg-[#36D98A] text-[#080D0B] font-bold"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
