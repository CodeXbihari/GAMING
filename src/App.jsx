import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { EquipmentSelection } from './pages/EquipmentSelection';
import { DateTimeSelection } from './pages/DateTimeSelection';
import { Checkout } from './pages/Checkout';
import { supabase } from './lib/supabase';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { MyBookings } from './pages/MyBookings';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEquipment } from './pages/admin/AdminEquipment';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminTimeSlots } from './pages/admin/AdminTimeSlots';
const MainContent = () => {
  const { currentPage, adminSubPage } = useApp();

  // If in Admin Mode
  if (currentPage === 'admin') {
    return (
      <AdminLayout>
        {adminSubPage === 'dashboard' && <AdminDashboard />}
        {adminSubPage === 'equipment' && <AdminEquipment />}
        {adminSubPage === 'bookings' && <AdminBookings />}
        {adminSubPage === 'payments' && <AdminPayments />}
        {adminSubPage === 'timeslots' && <AdminTimeSlots />}
        {(adminSubPage === 'students' || adminSubPage === 'reports' || adminSubPage === 'settings') && (
          <div className="p-8 text-center bg-[#111512] border-2 border-white/[0.08] rounded-3xl font-mono">
            <h3 className="text-base font-black text-[#F5F7F2] uppercase">{adminSubPage} Module</h3>
            <p className="text-xs text-[#9EA79C] mt-1">Hostel Gaming Hub administrative records.</p>
          </div>
        )}
      </AdminLayout>
    );
  }

  // Customer Mode matching reference design
  return (
    <div className="min-h-screen flex flex-col bg-[#080A08] text-[#F5F7F2] relative">
      <Navbar />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'equipment' && <EquipmentSelection />}
        {currentPage === 'datetime' && <DateTimeSelection />}
        {currentPage === 'checkout' && <Checkout />}
        {currentPage === 'confirmation' && <BookingConfirmation />}
        {currentPage === 'bookings' && <MyBookings />}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
