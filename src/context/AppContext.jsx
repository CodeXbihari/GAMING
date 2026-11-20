import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

const INITIAL_EQUIPMENT = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    name: 'ASUS TUF Gaming Laptop',
    assetCode: 'LAP-001',
    price: 60,
    unit: 'hour',
    description: 'AMD Ryzen 7 7435HS • NVIDIA RTX 3050 4GB • 16GB RAM • 512GB SSD',
    specs: 'Ryzen 7 7435HS • RTX 3050 4GB • 16GB RAM • 512GB SSD • 144Hz FHD',
    type: 'laptop',
    status: 'Available',
    inventoryCount: 3,
    image: '/images/laptop-hero.jpg',
    badge: 'RYZEN 7 7435HS + RTX 3050'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    name: 'EvoFox Elite Ops Wireless',
    assetCode: 'CON-001',
    price: 30,
    unit: 'hour',
    description: 'EvoFox Hyperconnect 2.4GHz Wireless Gamepad',
    specs: 'Hyperconnect™ 2.4GHz USB • Dual Rumble Motors • Textured Grips',
    type: 'controller',
    status: 'Available',
    inventoryCount: 5,
    image: '/images/controller-hero.jpg',
    badge: '2.4GHz HYPERCONNECT'
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    name: 'Battle Station Combo',
    assetCode: 'CMB-001',
    price: 90,
    unit: 'hour',
    description: 'Complete Dual Setup (ASUS TUF Laptop + 2x EvoFox Gamepads)',
    specs: 'TUF Ryzen 7 7435HS • RTX 3050 4GB + 2x EvoFox Hyperconnect Gamepads',
    type: 'combo',
    status: 'Available',
    isPopular: true,
    inventoryCount: 2,
    image: '/images/combo-setup.jpg',
    badge: 'TUF LAPTOP + 2x EVOFOX'
  }
];

const DEFAULT_TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM',
  '03:00 PM', '04:00 PM', '05:00 PM'
];

const normalizeEquipmentStatus = (status) => {
  const value = String(status || 'Available');
  if (value.toLowerCase() === 'available') return 'Available';
  if (value.toLowerCase() === 'maintenance') return 'Maintenance';
  return value;
};

const normalizeBookingStatus = (status) => {
  const value = String(status || 'Confirmed');
  const normalized = value.toLowerCase().replaceAll('_', ' ').trim();
  if (normalized === 'pending payment' || normalized === 'pending verification') return 'Pending Verification';
  if (normalized === 'confirmed') return 'Confirmed';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'Cancelled';
  if (normalized === 'completed') return 'Completed';
  return value;
};

const INITIAL_TIME_SLOTS = [
  { id: 'ts-1', label: '09:00 AM', startTime: '09:00', endTime: '10:00', isActive: true, sortOrder: 1 },
  { id: 'ts-2', label: '10:00 AM', startTime: '10:00', endTime: '11:00', isActive: true, sortOrder: 2 },
  { id: 'ts-3', label: '11:00 AM', startTime: '11:00', endTime: '12:00', isActive: true, sortOrder: 3 },
  { id: 'ts-4', label: '12:00 PM', startTime: '12:00', endTime: '13:00', isActive: true, sortOrder: 4 },
  { id: 'ts-5', label: '01:00 PM', startTime: '13:00', endTime: '14:00', isActive: true, sortOrder: 5 },
  { id: 'ts-6', label: '02:00 PM', startTime: '14:00', endTime: '15:00', isActive: true, sortOrder: 6 },
  { id: 'ts-7', label: '03:00 PM', startTime: '15:00', endTime: '16:00', isActive: true, sortOrder: 7 },
  { id: 'ts-8', label: '04:00 PM', startTime: '16:00', endTime: '17:00', isActive: true, sortOrder: 8 },
  { id: 'ts-9', label: '05:00 PM', startTime: '17:00', endTime: '18:00', isActive: true, sortOrder: 9 }
];

export const AppProvider = ({ children }) => {
  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState('home');
  const [adminSubPage, setAdminSubPage] = useState('dashboard');

  // Supabase Auth is used for real admin access; the demo student profile below
  // remains separate from the authenticated admin identity.
  const [authSession, setAuthSession] = useState(null);
  const [authSessionReady, setAuthSessionReady] = useState(false);
  const [authProfile, setAuthProfile] = useState(null);
  const [authProfileLoading, setAuthProfileLoading] = useState(false);
  const [authProfileError, setAuthProfileError] = useState('');

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) console.warn('Could not restore Supabase session:', error.message);
      setAuthSession(data?.session || null);
      setAuthSessionReady(true);
    }).catch((error) => {
      if (!mounted) return;
      console.warn('Could not restore Supabase session:', error);
      setAuthSessionReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      setAuthSessionReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let current = true;
    if (!authSessionReady) return () => { current = false; };
    if (!authSession?.user?.id) {
      setAuthProfile(null);
      setAuthProfileError('');
      setAuthProfileLoading(false);
      return () => { current = false; };
    }

    setAuthProfileLoading(true);
    setAuthProfileError('');
    supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', authSession.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!current) return;
        setAuthProfile(data || null);
        setAuthProfileError(error?.message || '');
        setAuthProfileLoading(false);
      }).catch((error) => {
        if (!current) return;
        setAuthProfile(null);
        setAuthProfileError(error?.message || 'Could not read admin profile.');
        setAuthProfileLoading(false);
      });

    return () => { current = false; };
  }, [authSessionReady, authSession?.user?.id]);

  // Booking Flow State
  const [selectedEquipment, setSelectedEquipment] = useState(() => INITIAL_EQUIPMENT[0]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentProofName, setPaymentProofName] = useState(null);
  const [latestBooking, setLatestBooking] = useState(() => {
    try {
      const saved = sessionStorage.getItem('hostel_latest_booking');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // App Data (Loaded from LocalStorage cache with INITIAL_EQUIPMENT fallback)
  const [equipmentList, setEquipmentList] = useState(() => {
    try {
      const saved = localStorage.getItem('hostel_equipment_fleet');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({ ...item, status: normalizeEquipmentStatus(item.status) }));
        }
      }
    } catch (e) {}
    return INITIAL_EQUIPMENT;
  });
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = sessionStorage.getItem('hostel_guest_bookings');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [timeSlots, setTimeSlots] = useState(INITIAL_TIME_SLOTS);

  // Sync equipment list to local storage so newly added equipment with photos persists immediately
  useEffect(() => {
    try {
      localStorage.setItem('hostel_equipment_fleet', JSON.stringify(equipmentList));
    } catch (e) {}
  }, [equipmentList]);

  // User Profile
  const [user, setUser] = useState(() => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem('hostel_student_profile') || 'null');
      if (savedProfile?.name?.trim() && savedProfile?.room?.trim() && savedProfile?.phone?.trim()
        && savedProfile.name !== 'Shashank R.' && savedProfile.name !== 'Punit'
        && savedProfile.phone !== '+91 98765 43210') return savedProfile;
    } catch {}
    return { name: '', initial: '', room: '', phone: '', role: 'student' };
  });
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('hostel_student_profile', JSON.stringify(user));
    } catch (error) {
      console.warn('Could not persist student profile:', error);
    }
  }, [user]);

  // Toast notification system
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const signInAdmin = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      addToast('Enter your admin email and password.', 'warning');
      return false;
    }

    let error;
    try {
      ({ error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      }));
    } catch (requestError) {
      addToast('Could not sign in. Check your details and try again.', 'error');
      return false;
    }

    if (error) {
      addToast('Sign-in failed. Check your email and password.', 'error');
      return false;
    }
    addToast('Signed in. Checking administrator access…', 'success');
    return true;
  };

  const signOutAdmin = async () => {
    let error;
    try {
      ({ error } = await supabase.auth.signOut());
    } catch (signOutError) {
      addToast('Could not sign out. Please try again.', 'error');
      return false;
    }
    if (error) {
      addToast('Could not sign out. Please try again.', 'error');
      return false;
    }
    setCurrentPage('home');
    addToast('Signed out of the admin area.', 'success');
    return true;
  };

  // ---------- Date Helpers ----------
  const selectedDateISO = useMemo(() => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) return '';
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  const selectedDateFormatted = useMemo(() => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[selectedDate.getDay()]}, ${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  }, [selectedDate]);

  // Active time slot labels (for backward compat with DateTimeSelection)
  const activeTimeSlotLabels = useMemo(() => {
    if (timeSlots.length > 0) {
      return timeSlots.filter(s => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder).map(s => s.label);
    }
    return DEFAULT_TIME_SLOTS;
  }, [timeSlots]);

  // ---------- Normalizers ----------
  const normalizeEquipment = (item) => {
    const type = (item.type || item.category || 'laptop').toLowerCase();
    const normalizedStatus = normalizeEquipmentStatus(item.status);
    const isLaptop = type === 'laptop';
    const isCombo = type === 'combo';
    const defaultPrice = isCombo ? 90 : isLaptop ? 60 : 30;

    const defaultImage = isCombo 
      ? '/images/combo-setup.jpg' 
      : isLaptop 
      ? '/images/laptop-hero.jpg' 
      : '/images/controller-hero.jpg';

    return {
      id: item.id || `eq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: item.name || (isCombo ? 'Battle Station Combo' : isLaptop ? 'ASUS TUF Gaming Laptop' : 'EvoFox Elite Ops Wireless'),
      assetCode: item.asset_code || item.assetCode || (isCombo ? 'CMB-001' : isLaptop ? 'LAP-001' : 'CON-001'),
      type: item.type || item.category || (isCombo ? 'combo' : 'laptop'),
      category: item.category || item.type || (isCombo ? 'combo' : 'laptop'),
      price: Number(item.price_per_hour || item.price || defaultPrice),
      status: normalizedStatus,
      inventoryCount: item.inventory_count || item.inventoryCount || 1,
      image: item.image || item.image_url || item.imageUrl || defaultImage,
      badge: item.badge || (normalizedStatus === 'Maintenance' ? 'MAINTENANCE' : (isCombo ? 'TUF LAPTOP + 2x EVOFOX' : isLaptop ? 'RYZEN 7 7435HS + RTX 3050' : '2.4GHz HYPERCONNECT')),
      description: item.description || (isCombo
        ? 'Full Battle Station • ASUS TUF Laptop + 2x EvoFox Gamepads on Stone Dock'
        : isLaptop 
        ? 'AMD Ryzen 7 7435HS • NVIDIA RTX 3050 4GB • 16GB RAM • 512GB SSD' 
        : 'EvoFox Hyperconnect 2.4GHz Wireless Gamepad'),
      specs: item.specs || (isCombo
        ? 'TUF Ryzen 7 7435HS • RTX 3050 4GB + 2x EvoFox Wireless Gamepads'
        : isLaptop
        ? 'Ryzen 7 7435HS • RTX 3050 4GB • 16GB RAM • 512GB SSD • 144Hz FHD'
        : 'Hyperconnect™ 2.4GHz Wireless • Dual Vibration'),
      unit: 'hour'
    };
  };

  const normalizeBooking = (b) => ({
    id: b.booking_reference || b.id,
    dbId: b.id,
    equipmentId: b.equipment_id || b.equipmentId,
    equipmentName: b.equipment_name || b.equipmentName || 'Equipment',
    date: b.date || b.booking_date,
    dateISO: b.booking_date || b.date_iso || b.dateISO,
    time: b.time_range || b.time || `${b.start_time || ''} - ${b.end_time || ''}`,
    slot: b.slot || b.start_time || '11:00 AM',
    startTime: b.start_time || null,
    endTime: b.end_time || null,
    price: Number(b.total_amount || b.price || 50),
    duration: b.duration || '1 Hour',
    status: normalizeBookingStatus(b.booking_status || b.status),
    paymentStatus: b.payment_status || b.paymentStatus || 'Pending',
    paymentMethod: b.payment_method || b.paymentMethod || 'UPI',
    utr: b.utr,
    submittedAt: b.created_at || b.submitted_at || b.submittedAt,
    studentName: b.student_name || b.studentName || 'Student',
    roomNo: b.room_no || b.roomNo || 'Room 304, Block B',
    pin: b.pin || '4829',
    proof: b.proof
  });

  const normalizeTimeSlot = (row) => ({
    id: row.id,
    label: row.label,
    startTime: row.start_time,
    endTime: row.end_time,
    isActive: row.is_active !== false,
    sortOrder: row.sort_order || 0
  });

  // ---------- Data Fetching ----------
  const fetchEquipment = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('name');
      if (error) {
        console.error('Supabase equipment fetch error:', error);
      } else if (data && data.length) {
        const normalized = data.map(normalizeEquipment);
        setEquipmentList(normalized);
      }
    } catch (e) {
      console.error('fetchEquipment exception:', e);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase bookings fetch error:', error);
      } else if (data) {
        const normalized = data.map(normalizeBooking);
        setBookings(normalized);
      }
    } catch (e) {
      console.error('fetchBookings exception:', e);
    }
  }, []);

  const fetchTimeSlots = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) {
        console.error('Supabase time_slots fetch error:', error);
        // Keep the existing schedule available if the backend is temporarily unreachable.
      } else if (data) {
        setTimeSlots(data.map(normalizeTimeSlot));
      }
    } catch (e) {
      console.error('fetchTimeSlots exception:', e);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
    fetchTimeSlots();
  }, [fetchEquipment, fetchTimeSlots]);

  useEffect(() => {
    if (!authSessionReady) return;
    if (authProfile?.role === 'admin') {
      fetchBookings();
      return;
    }
    try {
      const saved = sessionStorage.getItem('hostel_guest_bookings');
      const parsed = saved ? JSON.parse(saved) : [];
      setBookings(Array.isArray(parsed) ? parsed : []);
    } catch {
      setBookings([]);
    }
  }, [authSessionReady, authProfile?.role, fetchBookings]);

  // ---------- Time Slot CRUD ----------
  const addTimeSlot = async (slotData) => {
    const row = {
      label: slotData.label,
      start_time: slotData.startTime || '09:00',
      end_time: slotData.endTime || '10:00',
      is_active: slotData.isActive !== false,
      sort_order: slotData.sortOrder !== undefined ? Number(slotData.sortOrder) : (timeSlots.length + 1)
    };

    try {
      const { data, error } = await supabase
        .from('time_slots')
        .insert([row])
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert time_slots failed:', error.message);
        addToast(`Could not save time slot: ${error.message}`, 'error');
        return false;
      }

      const inserted = normalizeTimeSlot(data || row);
      setTimeSlots(prev => [...prev, inserted].sort((a, b) => a.sortOrder - b.sortOrder));
      addToast(`Time slot "${slotData.label}" added!`, 'success');
      return true;
    } catch (e) {
      console.warn('addTimeSlot exception:', e);
      addToast('Could not save the time slot. Check your connection and admin access.', 'error');
      return false;
    }
  };

  const updateTimeSlot = async (id, fields) => {
    const updateObj = {};
    if (fields.label !== undefined) updateObj.label = fields.label;
    if (fields.startTime !== undefined) updateObj.start_time = fields.startTime;
    if (fields.endTime !== undefined) updateObj.end_time = fields.endTime;
    if (fields.isActive !== undefined) updateObj.is_active = fields.isActive;
    if (fields.sortOrder !== undefined) updateObj.sort_order = Number(fields.sortOrder);

    try {
      const { data, error } = await supabase
        .from('time_slots')
        .update(updateObj)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn('Supabase update time_slots failed:', error.message);
        addToast(`Could not update time slot: ${error.message}`, 'error');
        return false;
      }

      const updated = normalizeTimeSlot(data);
      setTimeSlots(prev =>
        prev.map(s => s.id === id ? updated : s).sort((a, b) => a.sortOrder - b.sortOrder)
      );
      addToast('Time slot updated!', 'success');
      return true;
    } catch (e) {
      console.warn('updateTimeSlot exception:', e);
      addToast('Could not update the time slot. Check your connection and admin access.', 'error');
      return false;
    }
  };

  const deleteTimeSlot = async (id) => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .update({ is_active: false })
        .eq('id', id)
        .select('id, label, is_active')
        .single();

      if (error) {
        console.warn('Supabase cancel time slot failed:', error.message);
        addToast(`Could not cancel time slot: ${error.message}`, 'error');
        return false;
      }

      const cancelledSlot = data || timeSlots.find((slot) => slot.id === id);
      setTimeSlots((prev) => prev.map((slot) => (
        slot.id === id ? { ...slot, isActive: false } : slot
      )));
      addToast(`Time slot "${cancelledSlot?.label || ''}" cancelled. Students will see it as unavailable.`, 'success');
      return true;
    } catch (e) {
      console.warn('cancelTimeSlot exception:', e);
      addToast('Could not cancel the time slot. Check your connection and admin access.', 'error');
      return false;
    }
  };

  const toggleTimeSlot = async (id) => {
    const slot = timeSlots.find(s => s.id === id);
    if (!slot) return;

    const newActive = !slot.isActive;
    await updateTimeSlot(id, { isActive: newActive });
  };

  // ---------- Booking Helpers ----------
  const getEndSlotTime = (slotStr) => {
    if (!slotStr) return '12:00 PM';
    const [time, period] = slotStr.split(' ');
    let [hours] = time.split(':').map(Number);
    let nextPeriod = period;
    if (hours === 11 && period === 'AM') {
      return '12:00 PM';
    }
    if (hours === 12 && period === 'PM') {
      return '01:00 PM';
    }
    hours = hours + 1;
    if (hours > 12) hours = 1;
    return `${String(hours).padStart(2, '0')}:00 ${nextPeriod}`;
  };

  const isSlotBooked = (equipId, dateISO, slot) => {
    const selectedTimeSlot = timeSlots.find((item) => item.label === slot);
    return bookings.some((b) => {
      const sameDate = b.dateISO === dateISO;
      const sameSlot = b.slot === slot;
      const isActive = b.status === 'Confirmed' || b.status === 'Pending Verification';
      const overlaps = Boolean(
        selectedTimeSlot?.startTime && selectedTimeSlot?.endTime
        && b.startTime && b.endTime
        && selectedTimeSlot.startTime < b.endTime
        && selectedTimeSlot.endTime > b.startTime
      );
      return sameDate && (sameSlot || overlaps) && isActive;
    });
  };

  // Create booking action
  const createBooking = async (paymentData = {}) => {
    if (!user?.name?.trim() || !user?.room?.trim() || !user?.phone?.trim()) {
      addToast('Complete your name, room number, and mobile number in Profile before booking.', 'warning');
      setProfileModalOpen(true);
      return null;
    }
    const utr = String(paymentData.utr ?? utrNumber).trim();

    // 1. Prevent duplicate / double booking check
    if (isSlotBooked(selectedEquipment.id, selectedDateISO, selectedSlot)) {
      addToast('Sorry, this slot was just booked by another student!', 'error');
      return null;
    }

    // Both methods reserve the slot; UPI payment remains pending admin verification.
    const isUPI = paymentMethod === 'UPI';
    if (isUPI && !/^\d{4}$/.test(utr)) {
      addToast('Enter the last 4 digits of your UPI transaction reference.', 'warning');
      return null;
    }

    const { data, error } = await supabase.functions.invoke('bookings_create', {
      body: {
        equipment_id: selectedEquipment.id,
        date_iso: selectedDateISO,
        slot: selectedSlot,
        payment_method: paymentMethod,
        utr_last4: isUPI ? utr : null,
        student_name: user.name,
        room_no: user.room
      }
    });

    if (error || !data?.booking || !data?.booking_access_token) {
      let backendMessage = data?.error;
      if (error?.context instanceof Response) {
        try {
          const errorBody = await error.context.clone().json();
          if (typeof errorBody?.error === 'string') backendMessage = errorBody.error;
        } catch {
          // Fall back to the generic message below when the function response
          // is unavailable or not JSON.
        }
      }
      console.error('Booking service request failed:', error?.message || backendMessage || 'Invalid response');
      const message = backendMessage === 'This slot is already booked'
        ? 'That slot was just reserved. Choose another time.'
        : backendMessage === 'Equipment is unavailable'
          ? 'This equipment is not available. Refresh and choose another rig.'
          : backendMessage === 'Booking date is outside the allowed window'
            ? 'Bookings are available for today and the next two days.'
            : backendMessage === 'This time slot has already started'
              ? 'That time slot has already started. Choose a later slot.'
              : backendMessage === 'Booking backend is out of date. Apply the Supabase migrations and redeploy the booking function.'
                ? 'The booking service needs its latest database update. Contact the site administrator.'
                : 'Could not save the reservation. Please try again.';
      addToast(message, 'error');
      return null;
    }

    const inserted = normalizeBooking(data.booking);
    const bookingWithAccessToken = { ...inserted, bookingAccessToken: data.booking_access_token };
    const confirmationBooking = bookingWithAccessToken;

    try {
      const saved = sessionStorage.getItem('hostel_guest_bookings');
      const previousGuestBookings = saved ? JSON.parse(saved) : [];
      const nextGuestBookings = [bookingWithAccessToken, ...(Array.isArray(previousGuestBookings) ? previousGuestBookings : [])
        .filter((booking) => booking.id !== inserted.id)].slice(0, 20);
      sessionStorage.setItem('hostel_guest_bookings', JSON.stringify(nextGuestBookings));
      sessionStorage.setItem('hostel_latest_booking', JSON.stringify(confirmationBooking));
    } catch {
      // Booking success must not depend on browser session storage being available.
    }
    setBookings((prev) => [bookingWithAccessToken, ...prev.filter((booking) => booking.id !== inserted.id)]);
    setLatestBooking(confirmationBooking);
    setCurrentPage('confirmation');
    addToast(`Booking ${inserted.id} submitted successfully!`, 'success');
    return inserted;
  };

  // ---------- Admin Actions ----------
  const verifyPayment = async (bookingIdentifier) => {
    const target = bookings.find((b) => b.id === bookingIdentifier || b.dbId === bookingIdentifier);
    const dbId = target?.dbId;
    if (!dbId) {
      addToast('Could not find the reservation to verify.', 'error');
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'Paid',
        booking_status: 'Confirmed'
      })
      .eq('id', dbId);

    if (error) {
      console.error('Error verifying payment in Supabase:', error);
      addToast('Failed to update payment status in database.', 'error');
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingIdentifier || b.dbId === dbId
          ? { ...b, paymentStatus: 'Paid', status: 'Confirmed' }
          : b
      )
    );
    addToast(`Payment for ${bookingIdentifier} verified and marked Paid!`, 'success');
  };

  const rejectPayment = async (bookingIdentifier) => {
    const target = bookings.find((b) => b.id === bookingIdentifier || b.dbId === bookingIdentifier);
    const dbId = target?.dbId;
    if (!dbId) {
      addToast('Could not find the reservation to reject.', 'error');
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'Rejected',
        booking_status: 'Cancelled'
      })
      .eq('id', dbId);

    if (error) {
      console.error('Error rejecting payment in Supabase:', error);
      addToast('Failed to update status in database.', 'error');
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingIdentifier || b.dbId === dbId
          ? { ...b, paymentStatus: 'Rejected', status: 'Cancelled' }
          : b
      )
    );
    addToast(`Payment for ${bookingIdentifier} rejected.`, 'error');
  };

  const cancelBooking = async (bookingIdentifier) => {
    const target = bookings.find((b) => b.id === bookingIdentifier || b.dbId === bookingIdentifier);
    const dbId = target?.dbId;
    if (!dbId) {
      addToast('Could not find the reservation to cancel.', 'error');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          booking_status: 'Cancelled'
        })
        .eq('id', dbId)
        .in('booking_status', ['Confirmed', 'Pending Verification', 'confirmed', 'pending_verification', 'pending_payment'])
        .select('id')
        .maybeSingle();

      if (error || !data) {
        console.warn('Supabase booking cancellation failed:', error?.code || 'not updated');
        addToast('Could not cancel the reservation. Refresh and try again.', 'error');
        return false;
      }
    } catch (err) {
      console.warn('Supabase cancellation failed:', err instanceof Error ? err.name : 'Unknown error');
      addToast('Could not cancel the reservation. Check your connection and try again.', 'error');
      return false;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingIdentifier || b.dbId === dbId
          ? { ...b, status: 'Cancelled' }
          : b
      )
    );
    addToast(`Booking ${bookingIdentifier} has been cancelled. Its slot is available again.`, 'success');
    return true;
  };

  const refreshGuestBookingStatuses = useCallback(async () => {
    if (authProfile?.role === 'admin') return;
    const tokenById = new Map();
    bookings.forEach((booking) => {
      if (booking.bookingAccessToken) tokenById.set(booking.id, booking.bookingAccessToken);
    });
    const latest = (() => {
      try { return JSON.parse(sessionStorage.getItem('hostel_latest_booking') || 'null'); } catch { return null; }
    })();
    if (latest?.id && latest.bookingAccessToken) tokenById.set(latest.id, latest.bookingAccessToken);

    const statusUpdates = await Promise.all(bookings.map(async (booking) => {
      const accessToken = tokenById.get(booking.id);
      if (!accessToken) return null;
      const { data, error } = await supabase.functions.invoke('booking_status', {
        body: { booking_id: booking.id, booking_access_token: accessToken }
      });
      if (error || !data?.booking_status) return null;
      return [booking.id, { status: normalizeBookingStatus(data.booking_status), paymentStatus: data.payment_status || booking.paymentStatus }];
    }));
    const updates = new Map(statusUpdates.filter(Boolean));
    if (!updates.size) return;
    setBookings((previous) => {
      const changed = previous.some((booking) => {
        const update = updates.get(booking.id);
        return update && (booking.status !== update.status || booking.paymentStatus !== update.paymentStatus);
      });
      if (!changed) return previous;
      const next = previous.map((booking) => updates.has(booking.id) ? { ...booking, ...updates.get(booking.id) } : booking);
      try { sessionStorage.setItem('hostel_guest_bookings', JSON.stringify(next)); } catch {}
      return next;
    });
  }, [authProfile?.role, bookings]);

  // ---------- Equipment CRUD ----------
  const addEquipment = async (newItem) => {
    const assetCode = newItem.assetCode || `EQP-${Math.floor(100 + Math.random() * 900)}`;
    const image = newItem.image || newItem.imageUrl || (
      newItem.type === 'combo' ? '/images/combo-setup.jpg' : newItem.type === 'controller' ? '/images/controller-hero.jpg' : '/images/laptop-hero.jpg'
    );
    const price = Number(newItem.price);
    const inventoryCount = Number(newItem.inventoryCount || 1);
    if (!newItem.name?.trim() || !Number.isFinite(price) || price < 0
      || !Number.isInteger(inventoryCount) || inventoryCount < 1) {
      addToast('Enter a name, non-negative price, and positive inventory count.', 'error');
      return false;
    }

    try {
      const itemToInsert = {
        name: newItem.name.trim(),
        category: newItem.type || 'laptop',
        type: newItem.type || 'laptop',
        price_per_hour: price,
        asset_code: assetCode,
        status: newItem.status || 'Available',
        inventory_count: inventoryCount,
        description: newItem.description || '',
        specs: newItem.specs || '',
        image_url: image
      };

      const { data, error } = await supabase
        .from('equipment')
        .insert([itemToInsert])
        .select()
        .single();

      if (error) {
        console.error('Supabase equipment insert failed:', error.code ?? 'unknown');
        addToast('Could not save the equipment. Check your connection and admin access.', 'error');
        return false;
      }

      if (!data) {
        addToast('The equipment was not returned by the database. Refresh and check the inventory.', 'error');
        return false;
      }
      setEquipmentList((prev) => [...prev, normalizeEquipment({ ...data, image })]);
      addToast(`${newItem.name.trim()} added to the fleet.`, 'success');
      return true;
    } catch (e) {
      console.error('Equipment insert request failed:', e instanceof Error ? e.name : 'Unknown error');
      addToast('Could not save the equipment. Check your connection and admin access.', 'error');
      return false;
    }
  };

  const updateEquipment = async (id, updatedFields) => {
    const updatedImage = updatedFields.image || updatedFields.imageUrl;
    try {
      const fieldsToUpdate = {
        ...(updatedFields.name !== undefined && { name: updatedFields.name.trim() }),
        ...(updatedFields.type !== undefined && { type: updatedFields.type, category: updatedFields.type }),
        ...(updatedFields.price !== undefined && { price_per_hour: Number(updatedFields.price) }),
        ...(updatedFields.status !== undefined && { status: updatedFields.status }),
        ...(updatedFields.description !== undefined && { description: updatedFields.description }),
        ...(updatedFields.specs !== undefined && { specs: updatedFields.specs }),
        ...(updatedFields.assetCode !== undefined && { asset_code: updatedFields.assetCode }),
        ...(updatedFields.inventoryCount !== undefined && { inventory_count: Number(updatedFields.inventoryCount) }),
        ...(updatedImage !== undefined && { image_url: updatedImage }),
        updated_at: new Date().toISOString()
      };
      if (fieldsToUpdate.name !== undefined && !fieldsToUpdate.name) {
        addToast('Equipment name cannot be empty.', 'error');
        return false;
      }
      if (fieldsToUpdate.price_per_hour !== undefined
        && (!Number.isFinite(fieldsToUpdate.price_per_hour) || fieldsToUpdate.price_per_hour < 0)) {
        addToast('Enter a valid non-negative hourly price.', 'error');
        return false;
      }
      if (fieldsToUpdate.inventory_count !== undefined
        && (!Number.isInteger(fieldsToUpdate.inventory_count) || fieldsToUpdate.inventory_count < 1)) {
        addToast('Inventory count must be a positive whole number.', 'error');
        return false;
      }

      const { data, error } = await supabase
        .from('equipment')
        .update(fieldsToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        console.error('Equipment update failed:', error?.code ?? 'no row returned');
        addToast('Could not update equipment. Refresh and try again.', 'error');
        return false;
      }

      setEquipmentList((prev) => prev.map((item) => item.id === id
        ? normalizeEquipment({ ...data, image: updatedImage || data.image_url })
        : item));
      addToast('Equipment details and photo updated.', 'success');
      return true;
    } catch (e) {
      console.error('Equipment update request failed:', e instanceof Error ? e.name : 'Unknown error');
      addToast('Could not update equipment. Check your connection and admin access.', 'error');
      return false;
    }
  };

  const deleteEquipment = async (id) => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

      if (error || !data) {
        console.error('Equipment delete failed:', error?.code ?? 'no row deleted');
        addToast('Could not delete equipment. Refresh and try again.', 'error');
        return false;
      }
    } catch (e) {
      console.error('Equipment delete request failed:', e instanceof Error ? e.name : 'Unknown error');
      addToast('Could not delete equipment. Check your connection and admin access.', 'error');
      return false;
    }

    setEquipmentList((prev) => prev.filter((item) => item.id !== id));
    addToast('Equipment deleted from inventory.', 'success');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        adminSubPage,
        setAdminSubPage,
        authSession,
        authProfile,
        authLoading: !authSessionReady || authProfileLoading,
        authProfileError,
        signInAdmin,
        signOutAdmin,
        selectedEquipment,
        setSelectedEquipment,
        selectedDate,
        setSelectedDate,
        selectedSlot,
        setSelectedSlot,
        selectedDateISO,
        selectedDateFormatted,
        paymentMethod,
        setPaymentMethod,
        utrNumber,
        setUtrNumber,
        paymentProofName,
        setPaymentProofName,
        latestBooking,
        setLatestBooking,
        equipmentList,
        bookings,
        timeSlots,
        activeTimeSlotLabels,
        user,
        setUser,
        profileModalOpen,
        setProfileModalOpen,
        toasts,
        addToast,
        createBooking,
        verifyPayment,
        rejectPayment,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        cancelBooking,
        refreshGuestBookingStatuses,
        getEndSlotTime,
        isSlotBooked,
        fetchBookings,
        fetchEquipment,
        fetchTimeSlots,
        addTimeSlot,
        updateTimeSlot,
        deleteTimeSlot,
        toggleTimeSlot
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
