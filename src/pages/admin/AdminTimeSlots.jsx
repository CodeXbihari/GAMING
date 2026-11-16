import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  X,
  Crosshair,
  Power,
  Check,
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';

export const AdminTimeSlots = () => {
  const {
    timeSlots,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    toggleTimeSlot,
    addToast
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    label: '',
    startTime: '09:00',
    endTime: '10:00',
    sortOrder: 1,
    isActive: true
  });

  const totalSlots = timeSlots.length;
  const activeSlotsCount = timeSlots.filter((s) => s.isActive).length;
  const inactiveSlotsCount = totalSlots - activeSlotsCount;

  const handleOpenAdd = () => {
    setEditingItem(null);
    const nextOrder = timeSlots.length > 0 ? Math.max(...timeSlots.map((s) => s.sortOrder || 0)) + 1 : 1;
    setFormData({
      label: '06:00 PM',
      startTime: '18:00',
      endTime: '19:00',
      sortOrder: nextOrder,
      isActive: true
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (slot) => {
    setEditingItem(slot);
    setFormData({
      label: slot.label,
      startTime: slot.startTime || '09:00',
      endTime: slot.endTime || '10:00',
      sortOrder: slot.sortOrder || 1,
      isActive: slot.isActive !== false
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      addToast('Please enter a slot label (e.g. 09:00 AM)', 'warning');
      return;
    }

    if (editingItem) {
      await updateTimeSlot(editingItem.id, formData);
    } else {
      await addTimeSlot(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-mono">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111512] border border-[#C6FF00]/40 text-xs font-bold text-[#C6FF00] mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>SLOT_CONFIGURATOR // ADMIN_PROTOCOL</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F5F7F2]">
            TIME SLOT MANAGEMENT
          </h1>
          <p className="text-xs text-[#9EA79C] mt-1">
            Configure hourly reservation windows available to students on the booking calendar
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-mono font-black text-xs tracking-wider uppercase shadow-lime-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD TIME SLOT</span>
        </button>
      </div>

      {/* Telemetry Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl p-5 shadow-2xl">
          <div className="text-xs text-[#9EA79C] font-bold uppercase mb-1">TOTAL SLOTS</div>
          <div className="text-3xl font-black text-[#F5F7F2]">{totalSlots}</div>
          <div className="text-[11px] text-[#687366] mt-1">REGISTERED WINDOWS</div>
        </div>

        <div className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl p-5 shadow-2xl">
          <div className="text-xs text-[#9EA79C] font-bold uppercase mb-1">ACTIVE FOR BOOKING</div>
          <div className="text-3xl font-black text-[#C6FF00]">{activeSlotsCount}</div>
          <div className="text-[11px] text-[#C6FF00]/80 mt-1">LIVE ON STUDENT CALENDAR</div>
        </div>

        <div className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl p-5 shadow-2xl">
          <div className="text-xs text-[#9EA79C] font-bold uppercase mb-1">MUTED / INACTIVE</div>
          <div className="text-3xl font-black text-[#687366]">{inactiveSlotsCount}</div>
          <div className="text-[11px] text-[#687366] mt-1">PAUSED / BLOCKED</div>
        </div>
      </div>

      {/* Slots Table */}
      <div className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#C6FF00]" />
            <h2 className="text-sm font-black text-[#F5F7F2] tracking-wider uppercase">
              DISPATCH SCHEDULE MATRIX
            </h2>
          </div>
          <span className="text-[10px] text-[#687366] uppercase">[CLICK TOGGLE TO INSTANTLY ENABLE/DISABLE]</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[#687366] font-bold uppercase tracking-wider text-[10px] bg-[#080A08]/60">
                <th className="py-4 px-6 text-center w-16">
                  <div className="flex items-center justify-center gap-1">
                    <ArrowUpDown className="w-3 h-3" />
                    <span>#</span>
                  </div>
                </th>
                <th className="py-4 px-6">DISPLAY LABEL</th>
                <th className="py-4 px-6">START TIME</th>
                <th className="py-4 px-6">END TIME</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">CONTROLS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {timeSlots.map((slot) => {
                const isActive = slot.isActive !== false;

                return (
                  <tr
                    key={slot.id}
                    className="hover:bg-white/[0.04] transition-colors"
                  >
                    {/* Sort Order */}
                    <td className="py-4 px-6 text-center font-bold text-[#687366]">
                      {slot.sortOrder}
                    </td>

                    {/* Display Label */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isActive ? 'bg-[#C6FF00] shadow-lime-sm' : 'bg-[#363E37]'
                          }`}
                        />
                        <span className="font-black text-sm text-[#F5F7F2]">
                          {slot.label}
                        </span>
                      </div>
                    </td>

                    {/* Start Time */}
                    <td className="py-4 px-6 font-mono text-[#9EA79C]">
                      {slot.startTime || '—'}
                    </td>

                    {/* End Time */}
                    <td className="py-4 px-6 font-mono text-[#9EA79C]">
                      {slot.endTime || '—'}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleTimeSlot(slot.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#171D18] text-[#C6FF00] border border-[#C6FF00]/40 hover:bg-[#1E261F]'
                            : 'bg-[#141815] text-[#687366] border border-white/[0.08] hover:text-[#F5F7F2]'
                        }`}
                        title="Click to toggle active status"
                      >
                        <Power className="w-3 h-3" />
                        <span>{isActive ? 'ACTIVE' : 'MUTED'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(slot)}
                        className="p-2 rounded-xl text-[#9EA79C] hover:text-[#C6FF00] bg-[#171D18] hover:bg-white/[0.08] transition-colors cursor-pointer"
                        title="Edit Slot"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove time slot "${slot.label}"?`)) {
                            deleteTimeSlot(slot.id);
                          }
                        }}
                        className="p-2 rounded-xl text-[#9EA79C] hover:text-[#FF453A] bg-[#171D18] hover:bg-[#220F12] transition-colors cursor-pointer"
                        title="Delete Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {timeSlots.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#687366]">
                    No time slots configured. Click "ADD TIME SLOT" above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111512] border-2 border-white/[0.12] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-[#9EA79C] hover:text-[#F5F7F2] p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171D18] border border-[#C6FF00]/40 text-[10px] font-bold text-[#C6FF00] mb-3">
              <Crosshair className="w-3 h-3" />
              <span>{editingItem ? 'EDIT_SLOT_PROFILE' : 'NEW_SLOT_REGISTRATION'}</span>
            </div>

            <h3 className="text-xl font-black text-[#F5F7F2] mb-5">
              {editingItem ? 'Edit Time Slot' : 'Add New Time Slot'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                  Slot Display Label
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. 09:00 AM, 06:30 PM"
                  className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                    Start Time (24h)
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                    End Time (24h)
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <div>
                  <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-sm"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 accent-[#C6FF00] rounded cursor-pointer"
                    />
                    <span className="font-bold text-[#F5F7F2] uppercase">Active for Booking</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-full text-[#9EA79C] hover:text-[#F5F7F2] transition-colors cursor-pointer font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-black shadow-lime-sm transition-all cursor-pointer uppercase tracking-wider"
                >
                  SAVE SLOT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
