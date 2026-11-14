import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { EquipmentVisual } from '../components/EquipmentVisual';

export const DateTimeSelection = () => {
  const {
    selectedEquipment,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    setCurrentPage
  } = useApp();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(1);
  const monthNames = ['October 2026', 'November 2026', 'December 2026'];

  // Days in November 2026 matching reference
  const days = [
    { num: 26, isCurrentMonth: false, disabled: true },
    { num: 27, isCurrentMonth: false, disabled: true },
    { num: 28, isCurrentMonth: false, disabled: true },
    { num: 29, isCurrentMonth: false, disabled: true },
    { num: 30, isCurrentMonth: false, disabled: true },
    { num: 31, isCurrentMonth: false, disabled: true },
    { num: 1, isCurrentMonth: true, disabled: true },
    { num: 2, isCurrentMonth: true, disabled: true },
    { num: 3, isCurrentMonth: true, disabled: true },
    { num: 4, isCurrentMonth: true, disabled: true },
    { num: 5, isCurrentMonth: true, disabled: true },
    { num: 6, isCurrentMonth: true, disabled: true },
    { num: 7, isCurrentMonth: true, disabled: true },
    { num: 8, isCurrentMonth: true, disabled: true },
    { num: 9, isCurrentMonth: true, disabled: true },
    { num: 10, isCurrentMonth: true, disabled: true },
    { num: 11, isCurrentMonth: true, disabled: true },
    { num: 12, isCurrentMonth: true, disabled: true },
    { num: 13, isCurrentMonth: true, disabled: true },
    { num: 14, isCurrentMonth: true, disabled: true },
    { num: 15, isCurrentMonth: true, disabled: false }, // Today / Reference active day
    { num: 16, isCurrentMonth: true, disabled: false },
    { num: 17, isCurrentMonth: true, disabled: false },
    { num: 18, isCurrentMonth: true, disabled: false },
    { num: 19, isCurrentMonth: true, disabled: false },
    { num: 20, isCurrentMonth: true, disabled: false },
    { num: 21, isCurrentMonth: true, disabled: false },
    { num: 22, isCurrentMonth: true, disabled: false },
    { num: 23, isCurrentMonth: true, disabled: false },
    { num: 24, isCurrentMonth: true, disabled: false },
    { num: 25, isCurrentMonth: true, disabled: false },
    { num: 26, isCurrentMonth: true, disabled: false },
    { num: 27, isCurrentMonth: true, disabled: false },
    { num: 28, isCurrentMonth: true, disabled: false },
    { num: 29, isCurrentMonth: true, disabled: false },
    { num: 30, isCurrentMonth: true, disabled: false },
    { num: 1, isCurrentMonth: false, disabled: true },
    { num: 2, isCurrentMonth: false, disabled: true },
    { num: 3, isCurrentMonth: false, disabled: true },
    { num: 4, isCurrentMonth: false, disabled: true },
    { num: 5, isCurrentMonth: false, disabled: true },
    { num: 6, isCurrentMonth: false, disabled: true },
  ];

  // Exactly 9 hourly slots (3x3 grid) matching Frame 3 in reference
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleContinue = () => {
    setCurrentPage('checkout');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-between overflow-hidden">
      {/* Hooded gamer ambient silhouette artwork in top-right matching reference image */}
      <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-20 -z-10 overflow-hidden">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#36D98A]">
          <path d="M 60 180 C 60 120 70 80 100 40 C 130 80 140 120 140 180 Z" fill="currentColor" opacity="0.4" />
          <circle cx="100" cy="70" r="25" fill="#080D0B" />
          <path d="M 75 80 C 85 60 115 60 125 80" stroke="currentColor" strokeWidth="3" fill="none" />
        </svg>
      </div>
      <div className="absolute top-4 right-8 w-64 h-64 bg-radial from-[#36D98A]/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header matching reference */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F4EF]">
          Select Date & Time
        </h2>
        <p className="text-xs sm:text-sm text-[#A7ADA8] mt-0.5">
          Pick your preferred slot
        </p>
      </div>

      {/* Main Grid: Left Calendar & Right Available Slots */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-6">
        
        {/* Left Section: Monthly Calendar */}
        <div className="md:col-span-6 bg-[#111815] border border-[#1E2822] rounded-2xl p-5 shadow-card">
          {/* Calendar Header with Controls */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
              className="p-1 rounded text-[#A7ADA8] hover:text-[#F4F4EF] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-[#F4F4EF]">
              {monthNames[currentMonthIndex]}
            </span>
            <button
              onClick={() => setCurrentMonthIndex((prev) => Math.min(2, prev + 1))}
              className="p-1 rounded text-[#A7ADA8] hover:text-[#F4F4EF] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-[#777F79] mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-medium">
            {days.map((day, idx) => {
              const isSelected = day.num === selectedDate && day.isCurrentMonth;
              const isDisabled = day.disabled || !day.isCurrentMonth;

              return (
                <div key={idx} className="flex items-center justify-center py-1">
                  <button
                    disabled={isDisabled}
                    onClick={() => setSelectedDate(day.num)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#36D98A] text-[#080D0B] font-bold shadow-emerald-glow scale-105'
                        : isDisabled
                        ? 'text-[#444D47] cursor-default'
                        : 'text-[#F4F4EF] hover:bg-[#171E1A] hover:text-[#36D98A]'
                    }`}
                  >
                    {day.num}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Available Slots matching reference */}
        <div className="md:col-span-6 bg-[#111815] border border-[#1E2822] rounded-2xl p-5 shadow-card">
          <h3 className="text-sm font-bold text-[#F4F4EF] mb-4">
            Available Slots
          </h3>

          {/* 3x3 Slot Grid */}
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = selectedSlot === slot;

              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold tracking-wide transition-all border ${
                    isSelected
                      ? 'bg-[#36D98A] text-[#080D0B] border-[#36D98A] font-bold shadow-emerald-glow'
                      : 'bg-[#171E1A] text-[#F4F4EF] border-[#222E27] hover:border-[#36D98A]/50 hover:bg-[#1A241F]'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Selected Equipment Summary Bar matching reference */}
      <div className="bg-[#111815] border border-[#1E2822] rounded-2xl p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Item Details */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Small thumbnail */}
          <div className="w-14 h-11 rounded-lg bg-[#0D1511] border border-[#1E2B23] p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
            <EquipmentVisual type={selectedEquipment?.type || 'laptop'} className="h-full w-full" />
          </div>

          <div>
            <div className="text-[11px] text-[#777F79] font-medium">
              Selected Equipment
            </div>
            <div className="text-sm font-bold text-[#F4F4EF]">
              {selectedEquipment?.name || 'Gaming Laptop'}
            </div>
            <div className="text-xs font-semibold text-[#36D98A]">
              ₹{selectedEquipment?.price || 50} / hour
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-xs text-[#A7ADA8]">
          <Clock className="w-3.5 h-3.5 text-[#36D98A]" />
          <span>Duration: 1 Hour</span>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-[#36D98A] hover:bg-[#16B86A] text-[#080D0B] font-bold text-xs shadow-emerald-sm hover:shadow-emerald-glow transition-all"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
