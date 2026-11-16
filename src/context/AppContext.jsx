import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

const INITIAL_EQUIPMENT = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    name: 'ASUS TUF Gaming Laptop',
    assetCode: 'LAP-001',
    price: 50,
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
    price: 20,
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
    price: 80,
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

  // Booking Flow State
  const [selectedEquipment, setSelectedEquipment] = useState(() => INITIAL_EQUIPMENT[0]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentProofName, setPaymentProofName] = useState(null);
  const [latestBooking, setLatestBooking] = useState(null);

  // App Data (Loaded from LocalStorage cache with INITIAL_EQUIPMENT fallback)
  const [equipmentList, setEquipmentList] = useState(() => {
    try {
      const saved = localStorage.getItem('hostel_equipment_fleet');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_EQUIPMENT;
  });
  const [bookings, setBookings] = useState([]);
  const [timeSlots, setTimeSlots] = useState(INITIAL_TIME_SLOTS);

  // Sync equipment list to local storage so newly added equipment with photos persists immediately
  useEffect(() => {
    try {
      localStorage.setItem('hostel_equipment_fleet', JSON.stringify(equipmentList));
    } catch (e) {}
  }, [equipmentList]);

  // User Profile
  const [user, setUser] = useState({
    id: 'guest-student-001',
    name: 'Shashank R.',
    initial: 'S',
    room: 'Room 304, Block B',
    hostel: 'Block B',
    phone: '+91 98765 43210',
    role: 'student'
  });

  // Toast notification system
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
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
    const isLaptop = type === 'laptop';
    const isCombo = type === 'combo';
    const defaultPrice = isCombo ? 80 : isLaptop ? 50 : 20;

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
      status: item.status || 'Available',
      inventoryCount: item.inventory_count || item.inventoryCount || 1,
      image: item.image || item.image_url || item.imageUrl || defaultImage,
      badge: item.badge || (item.status === 'Maintenance' ? 'MAINTENANCE' : (isCombo ? 'TUF LAPTOP + 2x EVOFOX' : isLaptop ? 'RYZEN 7 7435HS + RTX 3050' : '2.4GHz HYPERCONNECT')),
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
    price: Number(b.total_amount || b.price || 50),
    duration: b.duration || '1 Hour',
    status: b.booking_status || b.status || 'Confirmed',
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
        // Fallback: keep empty so activeTimeSlotLabels falls back to DEFAULT_TIME_SLOTS
      } else if (data && data.length) {
        setTimeSlots(data.map(normalizeTimeSlot));
      }
    } catch (e) {
      console.error('fetchTimeSlots exception:', e);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
    fetchBookings();
    fetchTimeSlots();
  }, [fetchEquipment, fetchBookings, fetchTimeSlots]);

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
        console.warn('Supabase insert time_slots failed (using local fallback):', error.message);
        const fallbackItem = {
          id: `ts-${Date.now()}`,
          label: row.label,
          startTime: row.start_time,
          endTime: row.end_time,
          isActive: row.is_active,
          sortOrder: row.sort_order
        };
        setTimeSlots(prev => [...prev, fallbackItem].sort((a, b) => a.sortOrder - b.sortOrder));
        addToast(`Time slot "${slotData.label}" added locally!`, 'success');
        return;
      }

      const inserted = normalizeTimeSlot(data || row);
      setTimeSlots(prev => [...prev, inserted].sort((a, b) => a.sortOrder - b.sortOrder));
      addToast(`Time slot "${slotData.label}" added!`, 'success');
    } catch (e) {
      console.warn('addTimeSlot exception:', e);
      const fallbackItem = {
        id: `ts-${Date.now()}`,
        label: row.label,
        startTime: row.start_time,
        endTime: row.end_time,
        isActive: row.is_active,
        sortOrder: row.sort_order
      };
      setTimeSlots(prev => [...prev, fallbackItem].sort((a, b) => a.sortOrder - b.sortOrder));
      addToast(`Time slot "${slotData.label}" added!`, 'success');
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
        console.warn('Supabase update time_slots failed (using local fallback):', error.message);
        setTimeSlots(prev =>
          prev.map(s => s.id === id ? { ...s, ...fields } : s).sort((a, b) => a.sortOrder - b.sortOrder)
        );
        addToast('Time slot updated!', 'success');
        return;
      }

      const updated = normalizeTimeSlot(data);
      setTimeSlots(prev =>
        prev.map(s => s.id === id ? updated : s).sort((a, b) => a.sortOrder - b.sortOrder)
      );
      addToast('Time slot updated!', 'success');
    } catch (e) {
      console.warn('updateTimeSlot exception:', e);
      setTimeSlots(prev =>
        prev.map(s => s.id === id ? { ...s, ...fields } : s).sort((a, b) => a.sortOrder - b.sortOrder)
      );
      addToast('Time slot updated!', 'success');
    }
  };

  const deleteTimeSlot = async (id) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete time_slots failed (using local fallback):', error.message);
      }
    } catch (e) {
      console.warn('deleteTimeSlot exception:', e);
    }

    setTimeSlots(prev => prev.filter(s => s.id !== id));
    addToast('Time slot removed.', 'warning');
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
    return bookings.some((b) => {
      const sameEquip = b.equipmentId === equipId;
      const sameDate = b.dateISO === dateISO;
      const sameSlot = b.slot === slot;
      const isActive = b.status === 'Confirmed' || b.status === 'Pending Verification';
      return sameEquip && sameDate && sameSlot && isActive;
    });
  };

  // Create booking action
  const createBooking = async (paymentData = {}) => {
    const reference = `#GH${Math.floor(10000000 + Math.random() * 90000000)}`;
    const endSlot = getEndSlotTime(selectedSlot);

    // 1. Prevent duplicate / double booking check
    if (isSlotBooked(selectedEquipment.id, selectedDateISO, selectedSlot)) {
      addToast('Sorry, this slot was just booked by another student!', 'error');
      return null;
    }

    // 2. Booking status: UPI must be Pending Verification until verified; Cash is Confirmed with Pending payment
    const isUPI = paymentMethod === 'UPI';
    const initialStatus = isUPI ? 'Pending Verification' : 'Confirmed';
    const initialPaymentStatus = 'Pending';

    const newBookingRow = {
      booking_reference: reference,
      equipment_id: selectedEquipment.id,
      equipment_name: selectedEquipment.name,
      booking_date: selectedDateISO,
      time_range: `${selectedSlot} - ${endSlot}`,
      slot: selectedSlot,
      total_amount: selectedEquipment.price,
      duration: '1 Hour',
      booking_status: initialStatus,
      payment_status: initialPaymentStatus,
      payment_method: paymentMethod,
      utr: paymentData.utr || utrNumber || null,
      student_name: user.name,
      room_no: user.room,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      proof: paymentProofName || null
    };

    // Insert into Supabase bookings table
    const { data, error } = await supabase
      .from('bookings')
      .insert([newBookingRow])
      .select()
      .single();

    if (error) {
      console.error('Supabase booking insert error:', error);
      addToast('Failed to create booking in database. Please try again.', 'error');
      return null;
    }

    const inserted = normalizeBooking(data || newBookingRow);

    // Also record payment entry if payments table is used
    if (isUPI && (paymentData.utr || utrNumber)) {
      supabase.from('payments').insert([{
        booking_id: inserted.dbId,
        payment_method: 'UPI',
        utr_number: paymentData.utr || utrNumber,
        payment_proof_path: paymentProofName || null,
        amount: selectedEquipment.price,
        payment_status: 'Pending'
      }]).catch(() => {});
    }

    setBookings((prev) => [inserted, ...prev]);
    setLatestBooking(inserted);
    setCurrentPage('confirmation');
    addToast(`Booking ${reference} submitted successfully!`, 'success');
    return inserted;
  };

  // ---------- Admin Actions ----------
  const verifyPayment = async (bookingIdentifier) => {
    const target = bookings.find((b) => b.id === bookingIdentifier || b.dbId === bookingIdentifier);
    const dbId = target?.dbId || bookingIdentifier;

    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'Paid',
        booking_status: 'Confirmed'
      })
      .or(`id.eq.${dbId},booking_reference.eq.${bookingIdentifier}`);

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
    const dbId = target?.dbId || bookingIdentifier;

    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'Rejected',
        booking_status: 'Cancelled'
      })
      .or(`id.eq.${dbId},booking_reference.eq.${bookingIdentifier}`);

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
    const dbId = target?.dbId || bookingIdentifier;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          booking_status: 'Cancelled'
        })
        .or(`id.eq.${dbId},booking_reference.eq.${bookingIdentifier}`);

      if (error) {
        console.warn('Supabase booking cancellation warning:', error);
      }
    } catch (err) {
      console.warn('Supabase cancellation offline fallback:', err);
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingIdentifier || b.dbId === dbId
          ? { ...b, status: 'Cancelled' }
          : b
      )
    );
    addToast(`Booking ${bookingIdentifier} has been cancelled by Admin. Slot is now free.`, 'warning');
  };

  // ---------- Equipment CRUD ----------
  const addEquipment = async (newItem) => {
    const generatedId = newItem.id || `eq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const assetCode = newItem.assetCode || `EQP-${Math.floor(100 + Math.random() * 900)}`;
    const image = newItem.image || newItem.imageUrl || (
      newItem.type === 'combo' ? '/images/combo-setup.jpg' : newItem.type === 'controller' ? '/images/controller-hero.jpg' : '/images/laptop-hero.jpg'
    );

    const localItem = normalizeEquipment({
      id: generatedId,
      name: newItem.name,
      type: newItem.type || 'laptop',
      category: newItem.type || 'laptop',
      price: Number(newItem.price || 50),
      assetCode,
      status: newItem.status || 'Available',
      inventoryCount: newItem.inventoryCount || 1,
      description: newItem.description || '',
      specs: newItem.specs || '',
      image,
      badge: newItem.badge || (newItem.type === 'combo' ? 'COMBO STATION' : newItem.type === 'controller' ? 'PRO CONTROLLER' : 'GAMING RIG')
    });

    // Optimistically add to UI first so user and customer UI see it instantly
    setEquipmentList((prev) => [...prev, localItem]);

    // Backend sync to Supabase
    try {
      const itemToInsert = {
        name: newItem.name,
        category: newItem.type || 'laptop',
        type: newItem.type || 'laptop',
        price_per_hour: Number(newItem.price || 50),
        asset_code: assetCode,
        status: newItem.status || 'Available',
        inventory_count: newItem.inventoryCount || 1,
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
        console.warn('Supabase add equipment with image_url failed, attempting without image_url:', error.message);
        // Fallback in case image_url column isn't in remote schema yet
        const { data: fallbackData } = await supabase
          .from('equipment')
          .insert([{
            name: newItem.name,
            category: newItem.type || 'laptop',
            type: newItem.type || 'laptop',
            price_per_hour: Number(newItem.price || 50),
            asset_code: assetCode,
            status: newItem.status || 'Available',
            inventory_count: newItem.inventoryCount || 1,
            description: newItem.description || '',
            specs: newItem.specs || ''
          }])
          .select()
          .single();

        if (fallbackData) {
          setEquipmentList((prev) =>
            prev.map(it => it.id === generatedId ? { ...normalizeEquipment(fallbackData), image } : it)
          );
        }
      } else if (data) {
        const synced = normalizeEquipment({ ...data, image });
        setEquipmentList((prev) =>
          prev.map(it => it.id === generatedId ? synced : it)
        );
      }
    } catch (e) {
      console.warn('Exception during addEquipment sync:', e);
    }

    addToast(`${newItem.name} added to fleet with custom hardware photo!`, 'success');
  };

  const updateEquipment = async (id, updatedFields) => {
    const updatedImage = updatedFields.image || updatedFields.imageUrl;

    setEquipmentList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedFields,
              ...(updatedImage && { image: updatedImage })
            }
          : item
      )
    );

    try {
      const fieldsToUpdate = {
        ...(updatedFields.name && { name: updatedFields.name }),
        ...(updatedFields.type && { type: updatedFields.type, category: updatedFields.type }),
        ...(updatedFields.price && { price_per_hour: Number(updatedFields.price) }),
        ...(updatedFields.status && { status: updatedFields.status }),
        ...(updatedFields.description && { description: updatedFields.description }),
        ...(updatedFields.specs && { specs: updatedFields.specs }),
        ...(updatedFields.assetCode && { asset_code: updatedFields.assetCode }),
        ...(updatedImage && { image_url: updatedImage }),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('equipment')
        .update(fieldsToUpdate)
        .eq('id', id);

      if (error) {
        console.warn('Supabase update failed, retrying without image_url:', error.message);
        delete fieldsToUpdate.image_url;
        await supabase
          .from('equipment')
          .update(fieldsToUpdate)
          .eq('id', id);
      }
    } catch (e) {
      console.warn('Exception updating equipment:', e);
    }

    addToast('Equipment details and photo updated!', 'success');
  };

  const deleteEquipment = async (id) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete equipment error:', error);
      }
    } catch (e) {
      console.warn('Exception during deleteEquipment:', e);
    }

    setEquipmentList((prev) => prev.filter((item) => item.id !== id));
    addToast('Equipment deleted from inventory.', 'error');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        adminSubPage,
        setAdminSubPage,
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
        toasts,
        addToast,
        createBooking,
        verifyPayment,
        rejectPayment,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        cancelBooking,
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
