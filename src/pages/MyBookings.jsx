import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, ArrowRight, X, Crosshair, Terminal } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const MyBookings = () => {
  const { authSession, setProfileModalOpen, setUser } = useApp();
  const [bookings, setBookings] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBookingModal, setSelectedBookingModal] = useState(null);

  useEffect(() => {
    let active = true;
    if (!authSession?.user?.id) {
      setBookings([]);
      setStudentProfile(null);
      return () => { active = false; };
    }
    setLoading(true);
    Promise.all([
      supabase.from('student_booking_profiles').select('full_name, room_no, phone_number').eq('id', authSession.user.id).maybeSingle(),
      supabase.from('bookings').select('*').eq('student_id', authSession.user.id).order('created_at', { ascending: false })
    ]).then(([profileResult, bookingsResult]) => {
      if (!active) return;
      if (profileResult.error) setMessage('Could not load your student profile. Please try again.');
      else {
        setStudentProfile(profileResult.data || null);
        if (profileResult.data) {
          setName(profileResult.data.full_name);
          setRoom(profileResult.data.room_no);
        }
      }
      if (bookingsResult.error) setMessage('Could not load your booking history. Please refresh.');
      else setBookings((bookingsResult.data || []).map((b) => ({
        id: b.booking_reference || b.id,
        dbId: b.id,
        equipmentId: b.equipment_id,
        equipmentName: b.equipment_name || 'Equipment',
        date: b.booking_date,
        time: b.time_range || `${b.start_time || ''} - ${b.end_time || ''}`,
        price: Number(b.total_amount || 0),
        status: String(b.booking_status || 'Pending Verification').replaceAll('_', ' '),
        paymentStatus: b.payment_status || 'Pending'
      })));
      setLoading(false);
    }).catch(() => {
      if (active) { setMessage('Could not load your booking history. Please refresh.'); setLoading(false); }
    });
    return () => { active = false; };
  }, [authSession?.user?.id]);

  const normalizePhone = (value) => {
    const cleaned = value.trim();
    if (cleaned.startsWith('+')) return `+${cleaned.slice(1).replace(/\D/g, '')}`;
    const digits = cleaned.replace(/\D/g, '');
    return digits.length === 10 ? `+91${digits}` : `+${digits}`;
  };

  const requestCode = async (event) => {
    event.preventDefault();
    const normalized = normalizePhone(phone);
    if (!/^\+[1-9]\d{7,14}$/.test(normalized)) { setMessage('Enter a valid international mobile number.'); return; }
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signInWithOtp({ phone: normalized });
    setLoading(false);
    if (error) setMessage('Could not send a code. Check your number and SMS provider setup.');
    else { setPhone(normalized); setCodeSent(true); setMessage('Verification code sent by SMS.'); }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) { setMessage('Enter the 6-digit SMS code.'); return; }
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.verifyOtp({ phone: normalizePhone(phone), token: code.trim(), type: 'sms' });
    setLoading(false);
    if (error) setMessage('That code could not be verified. Request a new code and try again.');
  };

  const saveStudentProfile = async (event) => {
    event.preventDefault();
    if (!authSession?.user?.id || !authSession.user.phone) return;
    if (!name.trim() || !room.trim()) { setMessage('Enter your name and room number.'); return; }
    setSaving(true); setMessage('');
    const { data, error } = await supabase.from('student_booking_profiles').upsert({
      id: authSession.user.id,
      phone_number: authSession.user.phone,
      full_name: name.trim(),
      room_no: room.trim()
    }, { onConflict: 'id' }).select('full_name, room_no, phone_number').single();
    setSaving(false);
    if (error) setMessage('Could not save your profile. Please try again.');
    else {
      setStudentProfile(data);
      setUser({ name: data.full_name, room: data.room_no, phone: data.phone_number, initial: data.full_name[0]?.toUpperCase() || '', role: 'student' });
    }
  };

  const upcomingList = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending Verification');
  const pastList = bookings.filter((b) => ['Completed', 'Cancelled', 'Canceled'].includes(b.status));

  const getDisplayedList = () => {
    if (activeTab === 'past') return pastList;
    if (activeTab === 'all') return bookings;
    return upcomingList;
  };

  const getEquipmentImage = (type) => {
    if (type === 'controller') return '/images/controller-hero.jpg';
    if (type === 'combo') return '/images/combo-setup.jpg';
    return '/images/laptop-hero.jpg';
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-start">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#C6FF00]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {!authSession?.user?.id || !authSession?.user?.phone ? (
        <section className="glass-panel rounded-3xl p-6 sm:p-9 max-w-xl mx-auto w-full">
          <div className="text-[10px] font-mono font-bold text-[#C6FF00] tracking-widest">VERIFIED_STUDENT_ACCESS</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F2] mt-3">SHOW MY BOOKING HISTORY</h1>
          <p className="text-sm text-[#9EA79C] mt-3">Verify your mobile number with a one-time SMS code to access your bookings on any device.</p>
          <form onSubmit={codeSent ? verifyCode : requestCode} className="mt-6 space-y-4">
            <label className="block text-xs font-bold text-[#9EA79C]">MOBILE NUMBER
              <input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" className="glass-input mt-2 w-full rounded-xl px-4 py-3 text-sm text-[#F5F7F2] outline-none" />
            </label>
            {codeSent && <label className="block text-xs font-bold text-[#9EA79C]">SMS CODE
              <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} placeholder="Enter 6-digit code" className="glass-input mt-2 w-full rounded-xl px-4 py-3 text-sm text-[#F5F7F2] outline-none" />
            </label>}
            <button disabled={loading} className="w-full rounded-full bg-[#C6FF00] px-5 py-3 text-xs font-black text-[#080A08] disabled:opacity-60">{loading ? 'PLEASE WAIT…' : codeSent ? 'VERIFY CODE' : 'SEND SMS CODE'}</button>
          </form>
          {message && <p role="status" className="text-xs text-[#C6FF00] mt-4">{message}</p>}
        </section>
      ) : <>
      {!studentProfile && (
        <section className="glass-panel rounded-3xl p-6 sm:p-9 max-w-xl mx-auto w-full">
          <div className="text-[10px] font-mono font-bold text-[#C6FF00] tracking-widest">VERIFIED_STUDENT_PROFILE</div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F2] mt-3">COMPLETE YOUR PROFILE</h1>
          <p className="text-sm text-[#9EA79C] mt-3">Your mobile number is verified. Add your name and room number to connect new bookings to this history.</p>
          <form onSubmit={saveStudentProfile} className="mt-6 space-y-4">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Student name" className="glass-input w-full rounded-xl px-4 py-3 text-sm text-[#F5F7F2] outline-none" />
            <input value={room} onChange={(event) => setRoom(event.target.value)} placeholder="Room number and block" className="glass-input w-full rounded-xl px-4 py-3 text-sm text-[#F5F7F2] outline-none" />
            <button disabled={saving} className="w-full rounded-full bg-[#C6FF00] px-5 py-3 text-xs font-black text-[#080A08] disabled:opacity-60">{saving ? 'SAVING…' : 'SAVE PROFILE'}</button>
          </form>
          {message && <p role="status" className="text-xs text-[#C6FF00] mt-4">{message}</p>}
        </section>
      )}
      {/* Cyber-Tech Editorial Header */}
      <div className="mb-8 border-b border-white/[0.08] pb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono font-bold text-[#C6FF00] mb-2 shadow-lime-sm">
            <Crosshair className="w-3.5 h-3.5" />
            <span>STUDENT_RESERVATIONS // COMMAND_DECK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F7F2]">
            MY RESERVATIONS
          </h1>
        </div>

        <div className="text-xs font-mono text-[#9EA79C] flex items-center gap-2">
          <span>STUDENT: </span>
          <span className="px-2.5 py-0.5 rounded-full glass-pill text-[#C6FF00] font-bold">{studentProfile?.room_no || room || 'PROFILE INCOMPLETE'}</span>
          <button onClick={() => setProfileModalOpen(true)} className="underline hover:text-[#C6FF00]">EDIT PROFILE</button>
        </div>
      </div>

      {/* Neo-Brutalist Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-full glass-pill w-fit mb-8 font-mono">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
              : 'text-[#9EA79C] hover:text-[#F5F7F2]'
          }`}
        >
          UPCOMING ({upcomingList.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all ${
            activeTab === 'past'
              ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm'
              : 'text-[#9EA79C] hover:text-[#F5F7F2]'
          }`}
        >
          PAST ({pastList.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all ${activeTab === 'all' ? 'bg-[#C6FF00] text-[#080A08] shadow-lime-sm' : 'text-[#9EA79C] hover:text-[#F5F7F2]'}`}
        >
          ALL ({bookings.length})
        </button>
      </div>

      {/* Bookings List with 3D Stone Podium Cards */}
      <div className="space-y-4">
        {loading ? <div className="text-center py-16 text-xs font-mono text-[#9EA79C]">LOADING BOOKING HISTORY…</div> : getDisplayedList().length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl p-8">
            <p className="text-xs font-mono text-[#9EA79C]">NO ACTIVE SLOTS FOUND IN THIS PROTOCOL FILTER.</p>
          </div>
        ) : (
          getDisplayedList().map((item) => {
            const isConfirmed = item.status === 'Confirmed';
            const isPaid = item.paymentStatus === 'Paid';

            return (
              <div
                key={item.id}
                className="glass-panel hover:border-[#C6FF00]/50 rounded-3xl p-6 shadow-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
              >
                {/* 3D Stone Podium Thumbnail + Details */}
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-20 rounded-2xl bg-[#040504] border border-[#C6FF00]/30 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lime-sm group-hover:border-[#C6FF00] transition-all">
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-cover bg-bottom opacity-70" style={{ backgroundImage: "url('/images/stone-pedestal.jpg')" }} />
                    <img src={getEquipmentImage(item.equipmentId)} alt="Rig" className="w-[85%] h-auto max-h-14 object-contain z-10" />
                    <div className="absolute inset-0 bg-radial from-[#C6FF00]/20 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="space-y-1 font-mono">
                    <div className="text-xs font-mono font-bold text-[#C6FF00]">
                      {item.id}
                    </div>
                    <div className="text-lg font-black text-[#F5F7F2]">
                      {item.equipmentName}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#9EA79C]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C6FF00]" />
                        <span>{item.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C6FF00]" />
                        <span>{item.time}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Telemetry Badges & Action */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.06] font-mono">
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[10px] px-3 py-1 rounded-full font-black glass-pill text-[#C6FF00] uppercase border-[#C6FF00]/40">
                      {item.status || 'CONFIRMED'}
                    </span>
                    <span className="text-[10px] px-3 py-1 rounded-full font-black glass-pill text-[#C6FF00] uppercase border-[#C6FF00]/40">
                      {item.paymentStatus || 'PAID'}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedBookingModal(item)}
                    className="inline-flex items-center gap-2 text-xs font-mono font-black text-[#080A08] bg-[#C6FF00] hover:bg-[#D4FF33] px-5 py-3 rounded-full transition-all shadow-lime-glow hover:scale-102 cursor-pointer"
                  >
                    <span>VIEW PASS</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
          <div className="glass-modal rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedBookingModal(null)}
              className="absolute top-4 right-4 text-[#9EA79C] hover:text-[#F5F7F2]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-16 rounded-xl bg-[#040504] border border-[#C6FF00]/40 p-1 flex items-center justify-center overflow-hidden shrink-0">
                <div className="absolute inset-x-0 bottom-0 h-6 bg-cover bg-bottom opacity-70" style={{ backgroundImage: "url('/images/stone-pedestal.jpg')" }} />
                <img src={getEquipmentImage(selectedBookingModal.equipmentId)} alt="Rig" className="w-[85%] h-auto max-h-11 object-contain z-10" />
              </div>
              <div>
                <span className="text-xs font-mono text-[#C6FF00] font-bold">
                  {selectedBookingModal.id}
                </span>
                <h3 className="text-base font-black text-[#F5F7F2]">
                  {selectedBookingModal.equipmentName}
                </h3>
              </div>
            </div>

            <div className="glass-pill rounded-2xl p-5 space-y-3 text-xs border border-white/[0.08]">
              <div className="flex justify-between">
                <span className="text-[#9EA79C]">SCHEDULE SLOT:</span>
                <span className="text-[#F5F7F2] font-bold">{selectedBookingModal.date} • {selectedBookingModal.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9EA79C]">SETTLEMENT:</span>
                <span className="text-[#C6FF00] font-black text-sm">₹{selectedBookingModal.price}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/[0.08]">
                <span className="text-[#9EA79C] font-bold">BOOKING STATUS:</span>
                <span className="text-xs font-mono font-black text-[#C6FF00] glass-pill px-3.5 py-1.5 rounded-xl border-[#C6FF00]/50 shadow-lime-sm">
                  {selectedBookingModal.status || 'CONFIRMED'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080A08] border border-white/[0.06] text-[11px] text-[#9EA79C] leading-relaxed">
              Present this pass at <span className="text-[#C6FF00] font-bold">ROOM 207</span> to launch your session.
            </div>

            <button
              onClick={() => setSelectedBookingModal(null)}
              className="w-full py-3.5 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-black text-xs tracking-wider uppercase shadow-lime-sm transition-all"
            >
              CLOSE PASS
            </button>
          </div>
        </div>
      )}
      </>}
    </div>
  );
};
