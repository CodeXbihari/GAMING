import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Clock, ArrowRight, Calendar as CalendarIcon, Zap, Crosshair, Shield } from 'lucide-react';

export const DateTimeSelection = () => {
  const {
    selectedEquipment,
    selectedDate,
    setSelectedDate,
    selectedDateISO,
    selectedDateFormatted,
    selectedSlot,
    setSelectedSlot,
    setCurrentPage,
    isSlotBooked,
    activeTimeSlotLabels,
    addToast
  } = useApp();

  // Local calendar view navigation state (year & month)
  const initialDate = selectedDate instanceof Date && !isNaN(selectedDate) ? selectedDate : new Date();
  const [clockNow, setClockNow] = useState(() => new Date());
  const [viewDate, setViewDate] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [serverBookedSlots, setServerBookedSlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setClockNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    setAvailabilityLoading(true);
    setAvailabilityError(false);
    setServerBookedSlots([]);

    supabase.functions.invoke('booking_availability', {
      body: { equipment_id: selectedEquipment?.id, date_iso: selectedDateISO }
    }).then(({ data, error }) => {
      if (!active) return;
      if (error || !Array.isArray(data?.unavailable_slots)) {
        setAvailabilityError(true);
        return;
      }
      setServerBookedSlots(data.unavailable_slots);
    }).catch(() => {
      if (active) setAvailabilityError(true);
    }).finally(() => {
      if (active) setAvailabilityLoading(false);
    });

    return () => { active = false; };
  }, [selectedEquipment?.id, selectedDateISO]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Month title e.g. "NOVEMBER 2026"
  const monthTitle = useMemo(() => {
    return viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
  }, [viewDate]);

  // Today at midnight for disabling past dates
  const todayAtMidnight = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Customers can book today and the following two calendar days.
  const maxBookableDate = useMemo(() => {
    const d = new Date(todayAtMidnight);
    d.setDate(d.getDate() + 2);
    return d;
  }, [todayAtMidnight]);

  // Check if we can go to previous month (don't allow going before current month)
  const canGoPrevMonth = useMemo(() => {
    const currentMonthStart = new Date(todayAtMidnight.getFullYear(), todayAtMidnight.getMonth(), 1);
    return viewDate > currentMonthStart;
  }, [viewDate, todayAtMidnight]);

  const canGoNextMonth = useMemo(() => {
    const lastBookableMonthStart = new Date(maxBookableDate.getFullYear(), maxBookableDate.getMonth(), 1);
    return viewDate < lastBookableMonthStart;
  }, [viewDate, maxBookableDate]);

  const handlePrevMonth = () => {
    if (canGoPrevMonth) {
      setViewDate(new Date(viewYear, viewMonth - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (canGoNextMonth) {
      setViewDate(new Date(viewYear, viewMonth + 1, 1));
    }
  };

  // Generate dynamic calendar matrix
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const fullDate = new Date(viewYear, viewMonth - 1, d);
      days.push({
        num: d,
        date: fullDate,
        isCurrentMonth: false,
        disabled: true
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const fullDate = new Date(viewYear, viewMonth, d);
      const isPast = fullDate < todayAtMidnight;
      const outsideBookingWindow = fullDate > maxBookableDate;
      days.push({
        num: d,
        date: fullDate,
        isCurrentMonth: true,
        disabled: isPast || outsideBookingWindow
      });
    }

    // Trailing days from next month to complete standard grid (multiple of 7)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const trailingCount = totalCells - days.length;
    for (let t = 1; t <= trailingCount; t++) {
      const fullDate = new Date(viewYear, viewMonth + 1, t);
      days.push({
        num: t,
        date: fullDate,
        isCurrentMonth: false,
        disabled: fullDate < todayAtMidnight || fullDate > maxBookableDate
      });
    }

    return days;
  }, [viewYear, viewMonth, todayAtMidnight, maxBookableDate]);

  // Slots to display
  const availableSlots = activeTimeSlotLabels && activeTimeSlotLabels.length > 0
    ? activeTimeSlotLabels
    : ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  const indiaClockParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(clockNow);
  const indiaPart = (type) => indiaClockParts.find((part) => part.type === type)?.value || '00';
  const indiaTodayISO = `${indiaPart('year')}-${indiaPart('month')}-${indiaPart('day')}`;
  const indiaCurrentMinutes = Number(indiaPart('hour')) * 60 + Number(indiaPart('minute'));
  const isSlotPast = (slot) => {
    if (selectedDateISO < indiaTodayISO) return true;
    if (selectedDateISO > indiaTodayISO) return false;
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.trim());
    if (!match) return true;
    let hours = Number(match[1]) % 12;
    if (match[3].toUpperCase() === 'PM') hours += 12;
    const startMinutes = hours * 60 + Number(match[2]);
    return startMinutes <= indiaCurrentMinutes;
  };

  const handleDateSelect = (fullDate) => {
    setSelectedDate(fullDate);
  };

  const handleContinue = () => {
    if (availabilityLoading) {
      addToast('Checking live slot availability. Please wait a moment.', 'warning');
      return;
    }
    if (!selectedSlot) {
      addToast('Please select a 1-hour session slot.', 'warning');
      return;
    }
    if (isSlotPast(selectedSlot)) {
      addToast('That time slot has already started. Choose a later slot.', 'warning');
      return;
    }
    if (isSlotBooked && isSlotBooked(selectedEquipment?.id, selectedDateISO, selectedSlot)) {
      addToast('Selected slot is already reserved. Please pick another slot.', 'warning');
      return;
    }
    if (availabilityError) {
      // The booking endpoint rechecks availability and the database prevents
      // duplicate active reservations. Keep checkout usable if this optional
      // availability read endpoint has not been deployed yet.
      addToast('Live availability is unavailable. The booking service will recheck the slot at confirmation.', 'warning');
    }
    setCurrentPage('checkout');
  };

  const getEquipmentImage = () => {
    if (selectedEquipment?.image) return selectedEquipment.image;
    if (selectedEquipment?.type === 'controller') return '/images/controller-hero.jpg';
    if (selectedEquipment?.type === 'combo') return '/images/combo-setup.jpg';
    return '/images/laptop-hero.jpg';
  };

  const isDaySelected = (dayDate) => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) return false;
    return (
      dayDate.getFullYear() === selectedDate.getFullYear() &&
      dayDate.getMonth() === selectedDate.getMonth() &&
      dayDate.getDate() === selectedDate.getDate()
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-radial from-[#C6FF00]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Cyber-Tech Editorial Header */}
      <div className="mb-8 border-b border-white/[0.08] pb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono font-bold text-[#C6FF00] mb-2 shadow-lime-sm">
            <Crosshair className="w-3.5 h-3.5" />
            <span>TIME_CALENDAR_LOCK // PROTOCOL_02</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F7F2]">
            SELECT DATE & 1-HR SLOT
          </h1>
        </div>

        <div className="text-xs font-mono text-[#9EA79C] flex items-center gap-2">
          <span>CONFLICT_CHECK: </span>
          <span className="px-2.5 py-0.5 rounded-full glass-pill text-[#C6FF00] font-bold">AUTOMATED_ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Left Calendar & Right Available Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        {/* Left Section: Monthly Calendar */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl relative">
          <div className="absolute top-3 right-3 text-[9px] font-mono text-[#687366] uppercase">[CALENDAR_MATRIX]</div>

          {/* Calendar Header with Controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              disabled={!canGoPrevMonth}
              aria-label="Previous Month"
              className={`p-2 rounded-xl transition-colors ${
                canGoPrevMonth
                  ? 'text-[#9EA79C] hover:text-[#F5F7F2] glass-pill hover:bg-white/[0.08] cursor-pointer'
                  : 'text-[#363E37] bg-white/[0.02] cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-mono font-black text-[#F5F7F2] tracking-wider">
              {monthTitle}
            </span>
            <button
              onClick={handleNextMonth}
              disabled={!canGoNextMonth}
              aria-label="Next Month"
              className={`p-2 rounded-xl transition-colors ${
                canGoNextMonth
                  ? 'text-[#9EA79C] hover:text-[#F5F7F2] glass-pill hover:bg-white/[0.08] cursor-pointer'
                  : 'text-[#363E37] bg-white/[0.02] cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-[10px] font-mono font-bold uppercase tracking-wider text-[#687366] mb-3">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-mono font-bold">
            {calendarDays.map((day, idx) => {
              const isSelected = isDaySelected(day.date);
              const isDisabled = day.disabled;

              return (
                <div key={idx} className="flex items-center justify-center py-0.5">
                  <button
                    disabled={isDisabled}
                    onClick={() => handleDateSelect(day.date)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#C6FF00] text-[#080A08] font-black shadow-lime-sm scale-110 cursor-pointer'
                        : isDisabled
                        ? 'text-[#363E37] cursor-default'
                        : 'text-[#F5F7F2] hover:bg-white/[0.08] hover:text-[#C6FF00] cursor-pointer'
                    }`}
                  >
                    {day.num}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Available Slots */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl relative">
          <div className="absolute top-3 right-3 text-[9px] font-mono text-[#687366] uppercase">[SLOT_DISPATCHER]</div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-black text-[#F5F7F2]">
              HOURLY SESSIONS (1-HR)
            </h3>
            <span className="text-xs font-mono font-bold text-[#C6FF00] glass-pill px-3 py-1 rounded-full border-[#C6FF00]/30 shadow-lime-sm">
              {selectedDateFormatted ? selectedDateFormatted.toUpperCase() : 'SELECTED DATE'}
            </span>
          </div>

          {/* Slot Grid (dynamic rows of 3 columns) */}
          <div className="grid grid-cols-3 gap-3">
            {availableSlots.map((slot) => {
              const isBooked = (isSlotBooked && isSlotBooked(selectedEquipment?.id, selectedDateISO, slot))
                || serverBookedSlots.includes(slot);
              const hasPassed = isSlotPast(slot);
              const isUnavailable = isBooked || hasPassed || availabilityLoading;
              const isSelected = selectedSlot === slot && !isUnavailable;

              return (
                <button
                  key={slot}
                  disabled={isUnavailable}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3.5 px-2 rounded-2xl text-xs font-mono font-bold tracking-wide transition-all border flex flex-col items-center justify-center gap-1 ${
                    isUnavailable
                      ? 'bg-white/[0.02] text-[#4D5750] border-white/[0.04] cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#C6FF00] text-[#080A08] border-[#C6FF00] font-black shadow-lime-glow scale-102 cursor-pointer'
                      : 'glass-pill text-[#F5F7F2] hover:border-[#C6FF00]/50 hover:bg-white/[0.08] cursor-pointer'
                  }`}
                >
                  <span>{slot}</span>
                  {isBooked ? (
                    <span className="text-[8px] text-[#FF453A] font-bold uppercase tracking-wider">BOOKED</span>
                  ) : hasPassed ? (
                    <span className="text-[8px] text-[#687366] font-bold uppercase tracking-wider">PASSED</span>
                  ) : availabilityLoading ? (
                    <span className="text-[8px] text-[#687366] font-bold uppercase tracking-wider">CHECKING</span>
                  ) : (
                    <span className="text-[8px] text-[#C6FF00]/80 font-mono">1-HOUR</span>
                  )}
                </button>
              );
            })}
          </div>

          {availableSlots.length === 0 && (
            <div className="text-center py-8 text-xs font-mono text-[#687366]">
              NO ACTIVE SLOTS CONFIGURED BY ADMIN
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: 3D Stone Podium Rig Preview Bar */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Rig Details with Stone Slab Preview */}
        <div className="flex items-center gap-5 w-full lg:w-auto">
          {/* Stone Podium Mini Stage */}
          <div className="relative w-24 h-16 rounded-xl bg-[#040504] border border-[#C6FF00]/30 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lime-sm">
            <div className="absolute inset-x-0 bottom-0 h-6 bg-cover bg-bottom opacity-70 pointer-events-none" style={{ backgroundImage: "url('/images/stone-pedestal.jpg')" }} />
            <img src={getEquipmentImage()} alt="Rig" className="w-[85%] h-auto max-h-12 object-contain z-10" />
            <div className="absolute inset-0 bg-radial from-[#C6FF00]/20 via-transparent to-transparent pointer-events-none" />
          </div>

          <div>
            <div className="text-[10px] font-mono text-[#687366] font-bold uppercase tracking-wider">
              RESERVED RIG & STONE DOCK
            </div>
            <div className="text-base font-black text-[#F5F7F2]">
              {selectedEquipment?.name || 'ASUS TUF Gaming Laptop'}
            </div>
            <div className="text-xs font-mono font-bold text-[#C6FF00]">
              ₹{selectedEquipment?.price || 50} / hour
            </div>
          </div>
        </div>

        {/* Duration & Slot Readout */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#9EA79C]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C6FF00]" />
            <span className="text-[#F5F7F2] font-bold">{selectedSlot || '11:00 AM'} (1-HR BLOCK)</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#C6FF00]" />
            <span>INSTANT SESSION ACTIVATION</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full lg:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-mono font-black text-xs tracking-wider uppercase shadow-lime-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <span>PROCEED TO PAYMENT</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
