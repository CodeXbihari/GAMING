import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, X, Gamepad2 } from 'lucide-react';
import { EquipmentVisual } from '../../components/EquipmentVisual';

export const AdminEquipment = () => {
  const { equipmentList, addEquipment, updateEquipment, deleteEquipment } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    assetCode: '',
    type: 'laptop',
    price: 50,
    status: 'Available',
    description: '',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      assetCode: `EQP-${Math.floor(100 + Math.random() * 900)}`,
      type: 'laptop',
      price: 50,
      status: 'Available',
      description: 'High-performance gear for hostel gamers',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      assetCode: item.assetCode,
      type: item.type,
      price: item.price,
      status: item.status,
      description: item.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateEquipment(editingItem.id, formData);
    } else {
      addEquipment(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header with Add Equipment button matching Frame 8 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F4EF]">
            Equipment Management
          </h1>
          <p className="text-xs text-[#A7ADA8] mt-0.5">
            Manage your gaming inventory
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#36D98A] hover:bg-[#16B86A] text-[#080D0B] font-bold text-xs shadow-emerald-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Equipment Table matching Frame 8 */}
      <div className="bg-[#111815] border border-[#1E2822] rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1C2621] text-[#777F79] font-semibold text-[11px] bg-[#0D1511]/60">
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Asset Code</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2621]">
              {equipmentList.map((item) => {
                const isAvailable = item.status === 'Available';
                const isMaintenance = item.status === 'Maintenance';

                return (
                  <tr key={item.id} className="hover:bg-[#171E1A]/50 transition-colors">
                    {/* Image */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-10 rounded-lg bg-[#0D1511] border border-[#1E2B23] p-0.5 flex items-center justify-center overflow-hidden">
                        <EquipmentVisual type={item.type || 'laptop'} className="h-full w-full" />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-semibold text-[#F4F4EF]">
                      {item.name}
                    </td>

                    {/* Asset Code */}
                    <td className="py-3 px-4 font-mono text-[#A7ADA8]">
                      {item.assetCode}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isAvailable
                            ? 'bg-[#0B3D2B]/80 text-[#36D98A] border border-[#36D98A]/30'
                            : isMaintenance
                            ? 'bg-[#2B2310] text-[#E5B84C] border border-[#E5B84C]/30'
                            : 'bg-[#17202A] text-[#60A5FA] border border-[#60A5FA]/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-[#F4F4EF]">
                      ₹{item.price}/hr
                    </td>

                    {/* Actions matching Frame 8 */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 rounded text-[#A7ADA8] hover:text-[#36D98A] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${item.name}?`)) {
                            deleteEquipment(item.id);
                          }
                        }}
                        className="p-1 rounded text-[#A7ADA8] hover:text-[#F04444] transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111815] border border-[#2C3830] rounded-2xl p-5 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#A7ADA8] hover:text-[#F4F4EF]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-[#F4F4EF] mb-3">
              {editingItem ? 'Edit Equipment' : 'Add New Equipment'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#A7ADA8] mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Gaming Laptop 3"
                  className="w-full bg-[#171E1A] border border-[#2C3830] rounded-xl px-3 py-2 text-[#F4F4EF] focus:outline-none focus:border-[#36D98A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#A7ADA8] mb-1">Asset Code</label>
                  <input
                    type="text"
                    required
                    value={formData.assetCode}
                    onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })}
                    className="w-full bg-[#171E1A] border border-[#2C3830] rounded-xl px-3 py-2 text-[#F4F4EF] focus:outline-none focus:border-[#36D98A]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7ADA8] mb-1">Price (₹ / hr)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#171E1A] border border-[#2C3830] rounded-xl px-3 py-2 text-[#F4F4EF] focus:outline-none focus:border-[#36D98A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#A7ADA8] mb-1">Category Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#171E1A] border border-[#2C3830] rounded-xl px-3 py-2 text-[#F4F4EF] focus:outline-none focus:border-[#36D98A]"
                  >
                    <option value="laptop">Gaming Laptop</option>
                    <option value="controller">Controller</option>
                    <option value="combo">Combo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7ADA8] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#171E1A] border border-[#2C3830] rounded-xl px-3 py-2 text-[#F4F4EF] focus:outline-none focus:border-[#36D98A]"
                  >
                    <option value="Available">Available</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-[#A7ADA8] hover:text-[#F4F4EF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#36D98A] text-[#080D0B] font-bold shadow-emerald-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
