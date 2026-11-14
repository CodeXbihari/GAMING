import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { EquipmentSelection } from './pages/EquipmentSelection';
import { DateTimeSelection } from './pages/DateTimeSelection';
import { Checkout } from './pages/Checkout';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { MyBookings } from './pages/MyBookings';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEquipment } from './pages/admin/AdminEquipment';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminBookings } from './pages/admin/AdminBookings';

const MainContent = () => {
  const { currentPage, adminSubPage } = useApp();

  // If in Admin Mode
  if (currentPage === 'admin') {
    return (
      <AdminLayout>
        {adminSubPage === 'dashboard' && <AdminDashboard />}
        {adminSubPage === 'equipment' && <AdminEquipment />}
        {adminSubPage === 'payments' && <AdminPayments />}
        {adminSubPage === 'bookings' && <AdminBookings />}
        {(adminSubPage === 'students' || adminSubPage === 'reports' || adminSubPage === 'settings') && (
          <div className="p-8 text-center bg-[#111815] border border-[#1E2822] rounded-2xl">
            <h3 className="text-base font-bold text-[#F4F4EF] capitalize">{adminSubPage} Module</h3>
            <p className="text-xs text-[#A7ADA8] mt-1">Hostel Gaming Hub administrative records.</p>
          </div>
        )}
      </AdminLayout>
    );
  }

  // Customer Mode matching reference design
  return (
    <div className="min-h-screen flex flex-col bg-[#080D0B] text-[#F4F4EF] relative">
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
