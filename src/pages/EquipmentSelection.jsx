import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { EquipmentVisual } from '../components/EquipmentVisual';

export const EquipmentSelection = () => {
  const { equipmentList, selectedEquipment, setSelectedEquipment, setCurrentPage } = useApp();

  const handleSelect = (item) => {
    setSelectedEquipment(item);
    setCurrentPage('datetime');
  };

  const laptopItem = equipmentList.find((e) => e.type === 'laptop') || equipmentList[0];
  const controllerItem = equipmentList.find((e) => e.type === 'controller') || equipmentList[1];
  const comboItem = equipmentList.find((e) => e.type === 'combo') || equipmentList[2];

  const cards = [
    {
      ...laptopItem,
      name: 'Gaming Laptop',
      price: 50,
      description: 'High-performance laptop for gaming',
      isGold: false,
    },
    {
      ...controllerItem,
      name: 'Gaming Controller',
      price: 20,
      description: 'Play with precision',
      isGold: false,
    },
    {
      ...comboItem,
      name: 'Laptop + Controller',
      price: 60,
      description: 'Complete Gaming Setup',
      isGold: true,
      badge: 'Most Popular',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col justify-center">
      {/* Background ambient lighting matching reference */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial from-[#36D98A]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Heading matching reference image */}
      <div className="text-center mb-10 space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F4EF]">
          Choose Your Equipment
        </h2>
        <p className="text-xs sm:text-sm text-[#A7ADA8]">
          Select what you want to book
        </p>
      </div>

      {/* 3 Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
        {cards.map((card) => {
          const isSelected = selectedEquipment?.id === card.id || selectedEquipment?.type === card.type;
          const isGold = card.isGold;

          return (
            <div
              key={card.id || card.type}
              onClick={() => setSelectedEquipment(card)}
              className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 cursor-pointer group ${
                isGold
                  ? 'bg-[#111815] border border-[#8D7845] shadow-gold-sm hover:border-[#D8B45A] hover:shadow-gold-glow'
                  : 'bg-[#111815] border border-[#1E2822] hover:border-[#36D98A]/60 hover:shadow-emerald-glow'
              } ${
                isSelected && !isGold
                  ? 'border-[#36D98A] shadow-emerald-glow ring-1 ring-[#36D98A]'
                  : isSelected && isGold
                  ? 'border-[#D8B45A] shadow-gold-glow ring-1 ring-[#D8B45A]'
                  : ''
              }`}
            >
              {/* Most Popular Badge for Combo at top-right */}
              {card.badge && (
                <div className="absolute top-4 right-4 px-3 py-0.5 rounded-full bg-[#D8B45A] text-[#080D0B] text-[11px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                  <span>{card.badge}</span>
                </div>
              )}

              <div>
                {/* Product Image Stage: seamless floating visual */}
                <div className="w-full h-44 mb-4 flex items-center justify-center relative overflow-hidden">
                  <EquipmentVisual type={card.type} className="h-full w-full" />
                </div>

                {/* Card Title & Pricing */}
                <div className="space-y-1 mb-2">
                  <h3 className="text-base font-bold text-[#F4F4EF] tracking-tight group-hover:text-[#36D98A] transition-colors">
                    {card.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1 text-xl font-extrabold text-[#F4F4EF]">
                    <span>₹{card.price}</span>
                    <span className="text-xs font-normal text-[#777F79]">/ hour</span>
                  </div>
                </div>

                {/* Subtitle / Description */}
                <p className="text-xs text-[#A7ADA8] mb-6 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(card);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    isGold
                      ? 'bg-[#D8B45A] hover:bg-[#E5B84C] text-[#080D0B] shadow-gold-sm hover:shadow-gold-glow'
                      : 'bg-[#36D98A] hover:bg-[#16B86A] text-[#080D0B] shadow-emerald-sm hover:shadow-emerald-glow'
                  } group-hover:scale-[1.01] active:scale-95`}
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
