import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { clearStudentGuestProfile } from '../lib/studentGuestProfile';
import { User, ShieldCheck, Menu, X, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Navbar = () => {
  const { currentPage, setCurrentPage, user, setUser, authSession, profileModalOpen, setProfileModalOpen, addToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [profileDraft, setProfileDraft] = useState({ name: '', room: '', phone: '' });
  const [profileRequest, setProfileRequest] = useState('');
  const [profileRequestError, setProfileRequestError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const requestInProgress = useRef(false);
  const profileButtonRef = useRef(null);
  const closeProfile = () => {
    if (requestInProgress.current) return;
    setProfileModalOpen(false);
    profileButtonRef.current?.focus();
  };

  useEffect(() => {
    if (!profileModalOpen) return;
    setProfileErrors({});
    setProfileRequestError('');
    setProfileDraft({ name: user?.name || '', room: user?.room || '', phone: user?.phone || '' });
    const onKeyDown = (event) => { if (event.key === 'Escape') closeProfile(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [profileModalOpen]);

  const runProfileRequest = async (operation, request) => {
    if (requestInProgress.current) return false;
    requestInProgress.current = true;
    setProfileRequest(operation);
    setProfileRequestError('');
    try {
      await request();
      return true;
    } catch {
      setProfileRequestError(operation === 'save'
        ? 'Could not save your profile. Please try again.'
        : 'Could not clear your profile. Please try again.');
      return false;
    } finally {
      requestInProgress.current = false;
      setProfileRequest('');
    }
  };

  const normalizePhone = (value) => {
    const trimmed = value.trim();
    if (trimmed.startsWith('+')) return `+${trimmed.slice(1).replace(/\D/g, '')}`;
    const digits = trimmed.replace(/\D/g, '');
    return digits.length === 10 ? `+91${digits}` : `+${digits}`;
  };

  const saveVerifiedProfile = async (authUser, name, room) => {
    if (!authUser?.id || !authUser.phone) throw new Error('Verify your mobile number first.');
    const { error } = await supabase.from('student_booking_profiles').upsert({
      id: authUser.id,
      phone_number: authUser.phone,
      full_name: name,
      room_no: room
    }, { onConflict: 'id' });
    if (error) throw error;
    setUser({ name, room, phone: authUser.phone, initial: name[0].toUpperCase(), role: 'student' });
  };

  const sendProfileOtp = async () => {
    const phone = normalizePhone(profileDraft.phone);
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      setProfileErrors({ ...profileErrors, phone: 'Enter a valid international mobile number.' });
      return;
    }
    setProfileRequestError('');
    setProfileRequest('otp');
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setProfileRequest('');
    if (error) {
      setProfileRequestError('Could not send a code. Check the number and SMS setup, then try again.');
      return;
    }
    setProfileDraft((draft) => ({ ...draft, phone }));
    setOtpSent(true);
    setProfileRequestError('Verification code sent by SMS.');
  };

  const verifyProfileOtp = async () => {
    const phone = normalizePhone(profileDraft.phone);
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setProfileRequestError('Enter the 6-digit code sent to your phone.');
      return;
    }
    setProfileRequest('verify');
    setProfileRequestError('');
    const { data, error } = await supabase.auth.verifyOtp({ phone, token: otpCode.trim(), type: 'sms' });
    if (error || !data.user) {
      setProfileRequest('');
      setProfileRequestError('That code could not be verified. Request a new code and try again.');
      return;
    }
    const name = profileDraft.name.trim();
    const room = profileDraft.room.trim();
    if (!name || !room) {
      setProfileRequest('');
      setProfileRequestError('Enter your name and room, then save your profile.');
      return;
    }
    try {
      await saveVerifiedProfile(data.user, name, room);
      setOtpSent(false);
      setOtpCode('');
      addToast('Mobile verified and student profile saved.', 'success');
      setProfileModalOpen(false);
    } catch {
      setProfileRequestError('Your number is verified, but your profile could not be saved. Try Save again.');
    } finally { setProfileRequest(''); }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    const name = profileDraft.name.trim();
    const room = profileDraft.room.trim();
    const phone = profileDraft.phone.trim();
    const errors = {};
    if (!name || Array.from(name).length > 120 || /[\x00-\x1F\x7F]/.test(name)) {
      errors.name = 'Enter a name of 1–120 characters.';
    }
    if (!room || Array.from(room).length > 40 || /[\x00-\x1F\x7F]/.test(room)) {
      errors.room = 'Enter a room number of 1–40 characters.';
    }
    if (phone.length > 40 || !/^\+?[\d ()-]+$/.test(phone)
      || !/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) {
      errors.phone = 'Enter a mobile number with 7–15 digits.';
    }
    setProfileErrors(errors);
    if (Object.keys(errors).length) return;
    const normalizedPhone = normalizePhone(phone);
    if (authSession?.user?.phone === normalizedPhone) {
      if (!await runProfileRequest('save', () => saveVerifiedProfile(authSession.user, name, room))) return;
      addToast('Student profile saved.', 'success');
      closeProfile();
      return;
    }
    await sendProfileOtp();
  };

  const handleProfileClear = async () => {
    if (!await runProfileRequest('clear', async () => {
      if (authSession?.user?.id) {
        const { error } = await supabase.from('student_booking_profiles').delete().eq('id', authSession.user.id);
        if (error) throw error;
      }
      await clearStudentGuestProfile();
    })) return;
    setUser({ name: '', room: '', phone: '', initial: '', role: 'student' });
    setProfileDraft({ name: '', room: '', phone: '' });
    setProfileErrors({});
  };

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
              ref={profileButtonRef}
              onClick={() => setProfileModalOpen(true)}
              aria-label={user?.name ? `Student profile for ${user.name}` : 'Open student profile'}
              aria-haspopup="dialog"
              className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-xs font-bold text-[#F5F7F2] hover:border-[#C6FF00] hover:text-[#C6FF00] hover:shadow-lime-sm transition-all"
              title="Student Profile"
            >
              {user?.name?.trim()?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onMouseDown={(event) => { if (event.target === event.currentTarget) closeProfile(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="student-profile-title" className="glass-modal rounded-3xl p-6 max-w-xs w-full relative text-xs" onMouseDown={(event) => event.stopPropagation()}>
            <button 
              onClick={closeProfile}
              aria-label="Close student profile"
              className="absolute top-4 right-4 text-[#9EA79C] hover:text-[#F5F7F2]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 id="student-profile-title" className="text-base font-bold text-[#F5F7F2] mb-1">Student Profile</h3>
            <p className="text-[11px] text-[#9EA79C] mb-4">Set your hostel details for instant desk identification.</p>

            <form onSubmit={handleProfileSave} aria-busy={Boolean(profileRequest)}>
              <fieldset disabled={Boolean(profileRequest)} className="space-y-3.5">
                <div>
                  <label htmlFor="profile-name" className="block text-[#9EA79C] mb-1 font-semibold uppercase tracking-wider text-[10px]">Student Name</label>
                  <input
                    type="text"
                    id="profile-name"
                    aria-invalid={Boolean(profileErrors.name)}
                    aria-describedby={profileErrors.name ? "profile-name-error" : undefined}
                    value={profileDraft.name}
                    placeholder="Enter your full name"
                    onChange={(e) => { setProfileDraft({ ...profileDraft, name: e.target.value }); setProfileErrors({ ...profileErrors, name: undefined }); }}
                    autoComplete="name"
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-[#F5F7F2] focus:outline-none"
                  />
                  {profileErrors.name && <p id="profile-name-error" role="alert" className="mt-1 text-red-400">{profileErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="profile-room" className="block text-[#9EA79C] mb-1 font-semibold uppercase tracking-wider text-[10px]">Room Number</label>
                  <input
                    type="text"
                    id="profile-room"
                    aria-invalid={Boolean(profileErrors.room)}
                    aria-describedby={profileErrors.room ? "profile-room-error" : undefined}
                    value={profileDraft.room}
                    placeholder="Enter your room number and block"
                    onChange={(e) => { setProfileDraft({ ...profileDraft, room: e.target.value }); setProfileErrors({ ...profileErrors, room: undefined }); }}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-[#F5F7F2] focus:outline-none"
                  />
                  {profileErrors.room && <p id="profile-room-error" role="alert" className="mt-1 text-red-400">{profileErrors.room}</p>}
                </div>

                <div>
                  <label htmlFor="profile-phone" className="block text-[#9EA79C] mb-1 font-semibold uppercase tracking-wider text-[10px]">Mobile Number</label>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    id="profile-phone"
                    aria-invalid={Boolean(profileErrors.phone)}
                    aria-describedby={profileErrors.phone ? "profile-phone-error" : undefined}
                    value={profileDraft.phone}
                    placeholder="Enter your mobile number"
                    onChange={(e) => { setProfileDraft({ ...profileDraft, phone: e.target.value }); setProfileErrors({ ...profileErrors, phone: undefined }); }}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-[#F5F7F2] focus:outline-none"
                  />
                  {profileErrors.phone && <p id="profile-phone-error" role="alert" className="mt-1 text-red-400">{profileErrors.phone}</p>}
                </div>

                {otpSent && authSession?.user?.phone !== normalizePhone(profileDraft.phone) && (
                  <div>
                    <label htmlFor="profile-otp" className="block text-[#9EA79C] mb-1 font-semibold uppercase tracking-wider text-[10px]">SMS Verification Code</label>
                    <input id="profile-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otpCode} onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ''))} placeholder="6-digit code" className="w-full glass-input rounded-xl px-3.5 py-2 text-[#F5F7F2] focus:outline-none" />
                    <button type="button" onClick={verifyProfileOtp} className="w-full mt-2 py-2.5 rounded-xl bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-extrabold tracking-wide shadow-lime-glow transition-all">{profileRequest === 'verify' ? 'Verifying…' : 'Verify & Save Profile'}</button>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-extrabold tracking-wide shadow-lime-glow transition-all"
                >
                  {profileRequest === 'save' ? 'Saving…' : authSession?.user?.phone === normalizePhone(profileDraft.phone) ? 'Save & Close' : otpSent ? 'Send a new code' : 'Verify mobile & save'}
                </button>
                <button type="button" onClick={handleProfileClear} className="w-full py-2 text-[#9EA79C] hover:text-[#F5F7F2]">
                  {profileRequest === 'clear' ? 'Clearing…' : 'Clear saved profile'}
                </button>
                {profileRequestError && <p role="status" className={profileRequestError.startsWith('Verification code sent') ? 'text-[#C6FF00]' : 'text-red-400'}>{profileRequestError}</p>}
              </fieldset>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
