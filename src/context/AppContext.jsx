import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_EQUIPMENT = [
  {
    id: 'laptop',
    name: 'Gaming Laptop',
    assetCode: 'LAP-001',
    price: 50,
    unit: 'hour',
    description: 'High-performance laptop for gaming',
    specs: 'RTX 4060 • 144Hz FHD • 16GB DDR5',
    type: 'laptop',
    status: 'Available',
    inventoryCount: 3
  },
  {
    id: 'controller',
    name: 'Gaming Controller',
    assetCode: 'CON-001',
    price: 20,
    unit: 'hour',
    description: 'Play with precision',
    specs: 'Hall Effect Triggers • Zero Latency • Ergonomic Grip',
    type: 'controller',
    status: 'Available',
    inventoryCount: 5
  },
  {
    id: 'combo',
    name: 'Laptop + Controller',
    assetCode: 'CMB-001',
    price: 60,
    unit: 'hour',
    description: 'Complete Gaming Setup',
    specs: 'High-FPS Laptop + Wireless Controller + Gaming Headset',
    type: 'combo',
    status: 'Available',
    isPopular: true,
    inventoryCount: 2
  },
  {
    id: 'laptop-2',
    name: 'Gaming Laptop 2',
    assetCode: 'LAP-002',
    price: 50,
    unit: 'hour',
    description: 'High-performance laptop for gaming',
    specs: 'RTX 3070 • 165Hz QHD • 32GB RAM',
    type: 'laptop',
    status: 'Maintenance',
    inventoryCount: 1
  },
  {
    id: 'controller-2',
    name: 'Controller 2',
    assetCode: 'CON-002',
    price: 20,
    unit: 'hour',
    description: 'Play with precision',
    specs: 'Xbox Elite Wireless • Hair Trigger Locks',
    type: 'controller',
    status: 'Available',
    inventoryCount: 4
  }
];

const INITIAL_BOOKINGS = [
  {
    id: '#GH250415007',
    equipmentId: 'laptop',
    equipmentName: 'Gaming Laptop',
    date: 'Sat, 15 Nov 2026',
    dateISO: '2026-11-15',
    time: '11:00 AM - 12:00 PM',
    slot: '11:00 AM',
    price: 50,
    duration: '1 Hour',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    utr: '5189473621',
    submittedAt: '15 Nov, 10:45 AM',
    studentName: 'Shashank R.',
    roomNo: 'Room 304, Block B',
    pin: '4829'
  },
  {
    id: '#GH250415008',
    equipmentId: 'laptop',
    equipmentName: 'Gaming Laptop',
    date: 'Sat, 15 Nov 2026',
    dateISO: '2026-11-15',
    time: '12:00 PM - 01:00 PM',
    slot: '12:00 PM',
    price: 50,
    duration: '1 Hour',
    status: 'Pending Verification',
    paymentStatus: 'Pending',
    paymentMethod: 'UPI',
    utr: '5189473621',
    submittedAt: '15 Nov, 10:45 AM',
    studentName: 'Aman K.',
    roomNo: 'Room 412, Block C',
    pin: '9182'
  },
  {
    id: '#GH250415009',
    equipmentId: 'combo',
    equipmentName: 'Laptop + Controller',
    date: 'Sat, 15 Nov 2026',
    dateISO: '2026-11-15',
    time: '01:00 PM - 02:00 PM',
    slot: '01:00 PM',
    price: 60,
    duration: '1 Hour',
    status: 'Pending Verification',
    paymentStatus: 'Pending',
    paymentMethod: 'UPI',
    utr: '5189473622',
    submittedAt: '15 Nov, 11:00 AM',
    studentName: 'Dev V.',
    roomNo: 'Room 201, Block A',
    pin: '3341'
  },
  {
    id: '#GH250415006',
    equipmentId: 'combo',
    equipmentName: 'Laptop + Controller',
    date: 'Fri, 14 Nov 2026',
    dateISO: '2026-11-14',
    time: '10:00 AM - 11:00 AM',
    slot: '10:00 AM',
    price: 60,
    duration: '1 Hour',
    status: 'Completed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    utr: '5189473589',
    submittedAt: '14 Nov, 09:40 AM',
    studentName: 'Kavya S.',
    roomNo: 'Room 210, Block A',
    pin: '7721'
  },
  {
    id: '#GH250415005',
    equipmentId: 'controller',
    equipmentName: 'Gaming Controller',
    date: 'Thu, 13 Nov 2026',
    dateISO: '2026-11-13',
    time: '09:00 AM - 10:00 AM',
    slot: '09:00 AM',
    price: 20,
    duration: '1 Hour',
    status: 'Completed',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    submittedAt: '13 Nov, 08:50 AM',
    studentName: 'Rahul M.',
    roomNo: 'Room 105, Block B',
    pin: '1092'
  }
];

export const AppProvider = ({ children }) => {
  // Navigation & Page State
  // Pages: 'home', 'equipment', 'datetime', 'checkout', 'confirmation', 'bookings', 'admin'
  const [currentPage, setCurrentPage] = useState('home');
  const [adminSubPage, setAdminSubPage] = useState('dashboard'); // 'dashboard', 'equipment', 'payments', 'bookings'

  // Booking Flow State
  const [selectedEquipment, setSelectedEquipment] = useState(() => INITIAL_EQUIPMENT[0]); // default to laptop
  const [selectedDate, setSelectedDate] = useState(15); // 15 Nov 2026 as in reference
  const [selectedMonth, setSelectedMonth] = useState('November 2026');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM'); // 11:00 AM as in reference
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' or 'Cash'
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentProofName, setPaymentProofName] = useState(null);
  const [latestBooking, setLatestBooking] = useState(null);

  // App Data
  const [equipmentList, setEquipmentList] = useState(() => {
    const saved = localStorage.getItem('hgh_equipment');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('hgh_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // User Profile
  const [user, setUser] = useState({
    name: 'Shashank R.',
    initial: 'S',
    room: 'Room 304, Block B',
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

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('hgh_equipment', JSON.stringify(equipmentList));
  }, [equipmentList]);

  useEffect(() => {
    localStorage.setItem('hgh_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Actions
  const createBooking = (paymentData = {}) => {
    const reference = `#GH${Math.floor(10000000 + Math.random() * 90000000)}`;
    const endSlot = getEndSlotTime(selectedSlot);
    const newBooking = {
      id: reference,
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      date: `Sat, ${selectedDate} Nov 2026`,
      dateISO: `2026-11-${String(selectedDate).padStart(2, '0')}`,
      time: `${selectedSlot} - ${endSlot}`,
      slot: selectedSlot,
      price: selectedEquipment.price,
      duration: '1 Hour',
      status: paymentMethod === 'UPI' ? 'Confirmed' : 'Confirmed',
      paymentStatus: paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      paymentMethod,
      utr: paymentData.utr || utrNumber || '5189473621',
      submittedAt: 'Just now',
      studentName: user.name,
      roomNo: user.room,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      proof: paymentProofName || 'upi_payment_receipt.jpg'
    };

    setBookings((prev) => [newBooking, ...prev]);
    setLatestBooking(newBooking);
    setCurrentPage('confirmation');
    addToast(`Booking ${reference} successfully confirmed!`, 'success');
    return newBooking;
  };

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

  // Admin Actions
  const verifyPayment = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, paymentStatus: 'Paid', status: 'Confirmed' }
          : b
      )
    );
    addToast(`Payment for ${bookingId} verified and marked Paid!`, 'success');
  };

  const rejectPayment = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, paymentStatus: 'Rejected', status: 'Cancelled' }
          : b
      )
    );
    addToast(`Payment for ${bookingId} rejected.`, 'error');
  };

  const addEquipment = (newItem) => {
    const item = {
      ...newItem,
      id: newItem.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      inventoryCount: newItem.inventoryCount || 1
    };
    setEquipmentList((prev) => [...prev, item]);
    addToast(`${newItem.name} added to equipment inventory!`, 'success');
  };

  const updateEquipment = (id, updatedFields) => {
    setEquipmentList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    addToast('Equipment details updated successfully!', 'success');
  };

  const deleteEquipment = (id) => {
    setEquipmentList((prev) => prev.filter((item) => item.id !== id));
    addToast('Equipment deleted from inventory.', 'error');
  };

  const cancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
    addToast(`Booking ${bookingId} cancelled.`, 'warning');
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
        selectedMonth,
        setSelectedMonth,
        selectedSlot,
        setSelectedSlot,
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
        getEndSlotTime
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
