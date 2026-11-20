import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, X, Gamepad2, Crosshair, Wrench, Check, Upload, Image as ImageIcon, Link, Sparkles, RefreshCw } from 'lucide-react';
import { EquipmentVisual } from '../../components/EquipmentVisual';

const createAssetCode = (items = []) => {
  const existingCodes = new Set(items.map((item) => String(item.assetCode || '').toUpperCase()));
  let code;
  do {
    const randomPart = globalThis.crypto?.randomUUID?.().replaceAll('-', '').slice(0, 10)
      || `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    code = `EQP-${randomPart.toUpperCase()}`;
  } while (existingCodes.has(code));
  return code;
};

export const AdminEquipment = () => {
  const { equipmentList, addEquipment, updateEquipment, deleteEquipment, addToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [photoMode, setPhotoMode] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    assetCode: '',
    type: 'laptop',
    price: 50,
    status: 'Available',
    description: '',
    specs: '',
    image: '',
    badge: ''
  });

  const PRESETS = [
    { label: 'ASUS TUF Laptop', url: '/images/laptop-hero.jpg', type: 'laptop', badge: 'RYZEN 7 7435HS + RTX 3050' },
    { label: 'EvoFox Controller', url: '/images/controller-hero.jpg', type: 'controller', badge: '2.4GHz HYPERCONNECT' },
    { label: 'Neon EvoFox Controller', url: '/images/controller-evofox-neon.png', type: 'controller', badge: 'WIRELESS • NEON DOCK' },
    { label: 'Battle Station Combo', url: '/images/combo-setup.jpg', type: 'combo', badge: 'TUF LAPTOP + 2x EVOFOX' }
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setPhotoMode('upload');
    setFormData({
      name: '',
      assetCode: createAssetCode(equipmentList),
      type: 'laptop',
      price: 50,
      status: 'Available',
      description: 'AMD Ryzen 7 7435HS • NVIDIA RTX 3050 4GB • 16GB RAM • 512GB SSD',
      specs: 'Ryzen 7 7435HS • RTX 3050 4GB • 16GB RAM • 512GB SSD • 144Hz FHD',
      image: '/images/laptop-hero.jpg',
      badge: 'RYZEN 7 7435HS + RTX 3050'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setPhotoMode(item.image?.startsWith('data:') ? 'upload' : 'url');
    setFormData({
      name: item.name,
      assetCode: item.assetCode,
      type: item.type,
      price: item.price,
      status: item.status,
      description: item.description || '',
      specs: item.specs || '',
      image: item.image || item.image_url || '',
      badge: item.badge || ''
    });
    setModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size exceeds 5MB limit. Please select a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        image: event.target?.result
      }));
      addToast('Hardware photo uploaded and staged for preview!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      image: preset.url,
      type: preset.type,
      badge: preset.badge
    }));
    addToast(`Applied ${preset.label} photo preset!`, 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!formData.name.trim()) {
      addToast('Please enter an equipment name.', 'warning');
      return;
    }

    const payload = {
      ...formData,
      image: formData.image || (
        formData.type === 'combo' ? '/images/combo-setup.jpg' : formData.type === 'controller' ? '/images/controller-hero.jpg' : '/images/laptop-hero.jpg'
      )
    };

    setSaving(true);
    try {
      const saved = editingItem
        ? await updateEquipment(editingItem.id, payload)
        : await addEquipment(payload);
      if (saved) setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-mono">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111512] border border-[#C6FF00]/40 text-xs font-bold text-[#C6FF00] mb-2 shadow-lime-sm">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>INVENTORY_MATRIX // HARDWARE_FLEET</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#F5F7F2]">
            EQUIPMENT & RIG FLEET
          </h1>
          <p className="text-xs text-[#9EA79C] mt-1">
            Add new gaming hardware with live photos, calibrate stone docks, and synchronize fleet to the customer UI
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-mono font-black text-xs tracking-wider uppercase shadow-lime-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD HARDWARE RIG</span>
        </button>
      </div>

      {/* Equipment Table */}
      <div className="bg-[#111512] border-2 border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[#687366] font-bold uppercase tracking-wider text-[10px] bg-[#080A08]/60">
                <th className="py-4 px-6">DOCK PHOTO</th>
                <th className="py-4 px-6">RIG NAME & SPECS</th>
                <th className="py-4 px-6">ASSET CODE</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">HOURLY RATE</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {equipmentList.map((item) => {
                const isAvailable = item.status === 'Available';
                const isMaintenance = item.status === 'Maintenance';
                const itemPhoto = item.image || item.image_url;

                return (
                  <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                    {/* Visual Photo on Stone Dock */}
                    <td className="py-4 px-6">
                      <div className="relative w-16 h-14 rounded-xl bg-[#080A08] border border-white/[0.1] p-1 flex items-center justify-center overflow-hidden shrink-0 group shadow-sm">
                        {/* Mini Stone Dock Foundation */}
                        <div 
                          className="absolute inset-x-0 bottom-0 h-4 bg-cover bg-bottom opacity-70 pointer-events-none" 
                          style={{ backgroundImage: "url('/images/stone-pedestal.jpg')" }} 
                        />
                        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#C6FF00]/50" />
                        
                        {itemPhoto ? (
                          <img 
                            src={itemPhoto} 
                            alt={item.name} 
                            className="w-full h-full object-contain z-10 filter contrast-110 brightness-105 group-hover:scale-110 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="z-10 w-full h-full flex items-center justify-center">
                            <EquipmentVisual type={item.type || 'laptop'} className="h-full w-full" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-radial from-[#C6FF00]/15 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </td>

                    {/* Name & Specs */}
                    <td className="py-4 px-6">
                      <div className="font-black text-sm text-[#F5F7F2] flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#171D18] border border-[#C6FF00]/40 text-[#C6FF00]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#9EA79C] mt-0.5 line-clamp-1 max-w-sm">
                        {item.specs || item.description || 'Pro Gaming Rig'}
                      </div>
                    </td>

                    {/* Asset Code */}
                    <td className="py-4 px-6 font-mono font-bold text-[#C6FF00]">
                      {item.assetCode}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isAvailable
                            ? 'bg-[#171D18] text-[#C6FF00] border border-[#C6FF00]/40'
                            : isMaintenance
                            ? 'bg-[#171D18] text-[#E5B84C] border border-[#E5B84C]/40'
                            : 'bg-[#171D18] text-[#60A5FA] border border-[#60A5FA]/40'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-black text-sm text-[#F5F7F2]">
                      ₹{item.price} / hr
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-xl text-[#9EA79C] hover:text-[#C6FF00] bg-[#171D18] hover:bg-white/[0.08] transition-colors cursor-pointer"
                        title="Edit hardware details & photo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${item.name} from inventory fleet?`)) {
                            deleteEquipment(item.id);
                          }
                        }}
                        className="p-2 rounded-xl text-[#9EA79C] hover:text-[#FF453A] bg-[#171D18] hover:bg-[#220F12] transition-colors cursor-pointer"
                        title="Delete from fleet"
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

      {/* Add / Edit Hardware Rig Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-[#111512] border-2 border-white/[0.12] rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-[#9EA79C] hover:text-[#F5F7F2] p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171D18] border border-[#C6FF00]/40 text-[10px] font-bold text-[#C6FF00] mb-2 shadow-lime-sm">
              <Crosshair className="w-3 h-3" />
              <span>{editingItem ? 'EDIT_HARDWARE_NODE' : 'REGISTER_NEW_RIG'}</span>
            </div>

            <h3 className="text-xl font-black text-[#F5F7F2] mb-1">
              {editingItem ? 'Edit Hardware Rig' : 'Add New Hardware Rig'}
            </h3>
            <p className="text-xs text-[#9EA79C] mb-6">
              Saved hardware automatically appears in the customer UI with its live stone dock presentation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
              
              {/* ======================================================== */}
              {/* HARDWARE PHOTO UPLOAD & PREVIEW SECTION                 */}
              {/* ======================================================== */}
              <div className="p-4 rounded-2xl bg-[#080A08] border border-white/[0.1] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[#C6FF00] font-bold uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Hardware Photo</span>
                  </label>
                  <span className="text-[10px] text-[#687366] uppercase">Syncs to Customer UI</span>
                </div>

                {/* Live Stone Dock Showcase Preview */}
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-[#040504] border border-[#C6FF00]/30 flex items-center justify-center shadow-inner">
                  {/* Basalt stone dock base */}
                  <div 
                    className="absolute inset-x-0 bottom-0 h-14 bg-cover bg-bottom opacity-75 pointer-events-none z-10" 
                    style={{ backgroundImage: "url('/images/stone-pedestal.jpg')" }} 
                  />
                  <div className="absolute inset-x-0 bottom-14 h-[1.5px] bg-gradient-to-r from-transparent via-[#C6FF00] to-transparent shadow-[0_0_8px_#C6FF00] z-10" />
                  
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Hardware Preview" 
                      className="w-[75%] h-auto max-h-28 object-contain z-20 filter contrast-110 brightness-105 drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]" 
                    />
                  ) : (
                    <div className="z-20 text-center text-[#687366]">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-[10px]">No hardware photo selected</span>
                    </div>
                  )}

                  {/* Neon Lime underglow */}
                  <div className="absolute inset-0 bg-radial from-[#C6FF00]/15 via-transparent to-transparent pointer-events-none" />

                  {/* Preview Status Pill */}
                  <div className="absolute top-2 left-2 z-20 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-[#C6FF00] border border-[#C6FF00]/30">
                    LIVE DOCK PREVIEW
                  </div>

                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 z-20 bg-red-950/80 hover:bg-red-800 text-red-300 text-[10px] px-2 py-0.5 rounded border border-red-500/40 transition-colors cursor-pointer"
                    >
                      Clear Photo
                    </button>
                  )}
                </div>

                {/* Photo Input Mode Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111512] border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setPhotoMode('upload')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      photoMode === 'upload' ? 'bg-[#C6FF00] text-[#080A08]' : 'text-[#9EA79C] hover:text-[#F5F7F2]'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoMode('url')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      photoMode === 'url' ? 'bg-[#C6FF00] text-[#080A08]' : 'text-[#9EA79C] hover:text-[#F5F7F2]'
                    }`}
                  >
                    <Link className="w-3 h-3" />
                    <span>Image URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoMode('presets')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      photoMode === 'presets' ? 'bg-[#C6FF00] text-[#080A08]' : 'text-[#9EA79C] hover:text-[#F5F7F2]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Presets</span>
                  </button>
                </div>

                {/* Upload from Device */}
                {photoMode === 'upload' && (
                  <div>
                    <label className="block w-full border border-dashed border-[#C6FF00]/40 hover:border-[#C6FF00] rounded-xl p-3 text-center cursor-pointer transition-colors bg-[#111512] hover:bg-[#171D18]">
                      <Upload className="w-4 h-4 mx-auto text-[#C6FF00] mb-1" />
                      <span className="text-[11px] font-bold text-[#F5F7F2] block">Choose Hardware Photo from Device</span>
                      <span className="text-[9px] text-[#687366] block">Supports JPG, PNG, WEBP (Max 5MB)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}

                {/* Paste Direct URL */}
                {photoMode === 'url' && (
                  <div className="space-y-1">
                    <input
                      type="url"
                      placeholder="Paste image URL (e.g. https://... or /images/laptop-hero.jpg)"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full bg-[#111512] border border-white/[0.1] rounded-xl px-3 py-2 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] text-xs font-mono"
                    />
                    <span className="text-[9px] text-[#687366]">Paste any valid public image link</span>
                  </div>
                )}

                {/* Preset Fast Choices */}
                {photoMode === 'presets' && (
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className="p-2 rounded-xl bg-[#111512] hover:bg-[#171D18] border border-white/[0.08] hover:border-[#C6FF00] text-left transition-all cursor-pointer group"
                      >
                        <div className="text-[10px] font-bold text-[#F5F7F2] group-hover:text-[#C6FF00] truncate">{p.label}</div>
                        <div className="text-[8px] text-[#687366] mt-0.5 uppercase">Apply Preset</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Equipment Name */}
              <div>
                <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ASUS TUF Gaming Laptop"
                  className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-sm"
                />
              </div>

              {/* Asset Code & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                    Asset Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.assetCode}
                    onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })}
                    className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                    Rate (₹ / hr) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-sm"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                    Category Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-sm cursor-pointer"
                  >
                    <option value="laptop">Gaming Laptop</option>
                    <option value="controller">Controller</option>
                    <option value="combo">Combo Station</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                    Operational Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-sm cursor-pointer"
                  >
                    <option value="Available">Available (Online)</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Badge & Highlight Tag */}
              <div>
                <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                  Badge / Highlight Tag
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. RYZEN 7 7435HS + RTX 3050 or NEW ARRIVAL"
                  className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-xs"
                />
              </div>

              {/* Technical Specifications */}
              <div>
                <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                  Specs & Features (Separated by •)
                </label>
                <input
                  type="text"
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  placeholder="e.g. Ryzen 7 7435HS • RTX 3050 4GB • 16GB RAM • 512GB SSD"
                  className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-xs"
                />
              </div>

              {/* Customer Description */}
              <div>
                <label className="block text-[#9EA79C] font-bold uppercase tracking-wider mb-1.5">
                  Customer UI Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description displayed to customers on the rig card..."
                  className="w-full bg-[#171D18] border border-white/[0.1] rounded-2xl px-4 py-3 text-[#F5F7F2] focus:outline-none focus:border-[#C6FF00] font-mono text-xs resize-none"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-full text-[#9EA79C] hover:text-[#F5F7F2] transition-colors cursor-pointer font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-full bg-[#C6FF00] hover:bg-[#D4FF33] text-[#080A08] font-black shadow-lime-sm transition-all cursor-pointer uppercase tracking-wider disabled:opacity-60 disabled:cursor-wait"
                >
                  {saving ? 'SAVING RIG…' : 'SAVE & SYNC TO CUSTOMER UI'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
