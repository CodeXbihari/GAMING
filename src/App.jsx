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
import { AdminTimeSlots } from './pages/admin/AdminTimeSlots';
import { ArrowLeft } from 'lucide-react';
const MainContent = () => {
  const {
    currentPage,
    equipmentLoading,
    equipmentLoadError,
    refreshEquipment,
    adminSubPage,
    setAdminSubPage,
    authSession,
    authProfile,
    authLoading,
    authProfileError,
    signInAdmin,
    signOutAdmin,
    setCurrentPage
  } = useApp();

  const isInventoryView = currentPage === 'equipment'
    || (currentPage === 'admin' && adminSubPage === 'equipment');

  if (isInventoryView && equipmentLoading) {
    return (
      <main className="min-h-screen bg-[#080A08] flex flex-col items-center justify-center gap-4 text-xs font-mono text-[#9EA79C]">
        <span className="w-8 h-8 rounded-full border-2 border-[#C6FF00]/25 border-t-[#C6FF00] animate-spin" aria-hidden="true" />
        <span>SYNCING_LIVE_INVENTORY...</span>
        <ToastContainer />
      </main>
    );
  }

  if (isInventoryView && equipmentLoadError) {
    return (
      <main className="min-h-screen bg-[#080A08] flex flex-col items-center justify-center gap-4 px-5 text-center text-xs font-mono text-[#9EA79C]">
        <span className="text-[#F5F7F2]">{equipmentLoadError}</span>
        <p className="max-w-md">The cached inventory photos are hidden until the latest equipment data can be confirmed.</p>
        <button
          type="button"
          onClick={refreshEquipment}
          className="px-5 py-3 rounded-full bg-[#C6FF00] text-[#080A08] font-black tracking-wider"
        >
          RETRY INVENTORY SYNC
        </button>
        <ToastContainer />
      </main>
    );
  }

  const handleBack = () => {
    if (currentPage === 'admin') {
      if (adminSubPage !== 'dashboard') setAdminSubPage('dashboard');
      else setCurrentPage('home');
      return;
    }
    const previousPage = {
      equipment: 'home',
      datetime: 'equipment',
      checkout: 'datetime',
      confirmation: 'bookings',
      bookings: 'home'
    }[currentPage] || 'home';
    setCurrentPage(previousPage);
  };

  const backButton = (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#9EA79C] hover:text-[#C6FF00] transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>BACK</span>
    </button>
  );

  // If in Admin Mode
  if (currentPage === 'admin') {
    if (authLoading) {
      return (
        <main className="min-h-screen bg-[#080A08] flex flex-col items-center justify-center gap-5 text-xs font-mono text-[#9EA79C]">
          {backButton}
          <span>CHECKING_ADMIN_ACCESS...</span>
        </main>
      );
    }

    if (!authSession) {
      return <AdminSignIn signInAdmin={signInAdmin} setCurrentPage={setCurrentPage} />;
    }

    if (authProfile?.role !== 'admin') {
      return (
        <main className="min-h-screen bg-[#080A08] flex items-center justify-center p-5 text-center">
          <section className="glass-panel rounded-3xl p-8 max-w-md w-full">
            <h1 className="text-xl font-black text-[#F5F7F2]">ADMIN ACCESS REQUIRED</h1>
            <p className="text-sm text-[#9EA79C] mt-3">
              {authProfileError || 'This signed-in account does not have the admin role.'}
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={signOutAdmin} className="px-5 py-2.5 rounded-full glass-pill text-xs text-[#F5F7F2]">
                SIGN OUT
              </button>
              <button onClick={() => setCurrentPage('home')} className="px-5 py-2.5 rounded-full bg-[#C6FF00] text-[#080A08] text-xs font-black">
                CUSTOMER SITE
              </button>
            </div>
          </section>
          <ToastContainer />
        </main>
      );
    }

    return (
      <AdminLayout>
        <div className="mb-5">{backButton}</div>
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

      {currentPage !== 'home' && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {backButton}
        </div>
      )}

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

const AdminSignIn = ({ signInAdmin, setCurrentPage }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    await signInAdmin(email, password);
    setSending(false);
  };

  return (
    <main className="min-h-screen bg-[#080A08] flex items-center justify-center p-5">
      <section className="glass-panel rounded-3xl p-7 sm:p-9 max-w-md w-full">
        <div className="text-[10px] font-mono font-bold text-[#C6FF00] tracking-widest">HOSTEL_ADMIN // SECURE SIGN-IN</div>
        <h1 className="text-2xl font-black text-[#F5F7F2] mt-3">ADMIN ACCESS</h1>
        <p className="text-sm text-[#9EA79C] mt-2">
          Sign in with your administrator email and password.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-xs font-bold text-[#9EA79C]">
            ADMIN EMAIL
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="glass-input mt-2 w-full rounded-xl px-4 py-3 text-sm text-[#F5F7F2] outline-none"
              placeholder="admin@example.com"
            />
          </label>
          <label className="block text-xs font-bold text-[#9EA79C]">
            PASSWORD
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="glass-input mt-2 w-full rounded-xl px-4 py-3 text-sm text-[#F5F7F2] outline-none"
              placeholder="Enter your password"
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-full bg-[#C6FF00] px-5 py-3 text-xs font-black text-[#080A08] disabled:opacity-60"
          >
            {sending ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
        </form>
        <button onClick={() => setCurrentPage('home')} className="mt-5 text-xs text-[#9EA79C] hover:text-[#F5F7F2]">
          ← Back to customer site
        </button>
      </section>
      <ToastContainer />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
