import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Zap, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { EquipmentVisual } from '../components/EquipmentVisual';

export const HomePage = () => {
  const { setCurrentPage } = useApp();

  const featurePills = [
    { icon: Zap, text: '1 Hour Slots' },
    { icon: ShieldCheck, text: 'Secure Booking' },
    { icon: CreditCard, text: 'UPI & Cash Payment' },
    { icon: Sparkles, text: 'Premium Equipment' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden">
      {/* Background Cinematic Lighting Gradients matching reference */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-radial from-[#36D98A]/18 via-[#0B3D2B]/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-radial from-[#16B86A]/08 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 z-10 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#F4F4EF] leading-[1.15]">
              Your Hostel<br />
              <span className="text-[#36D98A] drop-shadow-[0_0_25px_rgba(54,217,138,0.4)]">
                Gaming Hub
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#A7ADA8] max-w-md mx-auto lg:mx-0 font-normal leading-relaxed">
              Reserve Laptops & Controllers for Your Gaming Sessions
            </p>

            {/* Action Buttons matching reference */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setCurrentPage('equipment')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#36D98A] hover:bg-[#16B86A] text-[#080D0B] font-bold text-xs sm:text-sm tracking-wide shadow-emerald-glow transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setCurrentPage('equipment')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#111815]/80 hover:bg-[#171E1A] text-[#F4F4EF] border border-[#2B3530] hover:border-[#36D98A]/50 font-medium text-xs sm:text-sm transition-all duration-300"
              >
                <span>Learn More</span>
              </button>
            </div>
          </div>

          {/* Right Hero Equipment Visual Stage matching reference */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient Backlight Halo behind equipment */}
            <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full bg-gradient-to-tr from-[#36D98A]/20 via-[#0B3D2B]/30 to-transparent blur-3xl -z-10" />

            {/* Laptop + Controller seamless cinematic display */}
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl aspect-[16/11] flex items-center justify-center">
              <EquipmentVisual type="combo" className="h-full w-full" />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Feature Strip matching reference image */}
      <div className="w-full bg-[#0D1511]/90 border-t border-[#171E1A] py-3.5 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-4 sm:gap-8">
          {featurePills.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 text-[#F4F4EF] hover:text-[#36D98A] transition-colors"
              >
                <Icon className="w-4 h-4 text-[#36D98A]" />
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  {feature.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
