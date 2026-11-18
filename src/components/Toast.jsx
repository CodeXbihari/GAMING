import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-slide-in ${
              isSuccess
                ? 'bg-[#0D1E16]/95 border-[#36D98A]/40 text-[#F4F4EF] shadow-[#36D98A]/10'
                : isError
                ? 'bg-[#220F12]/95 border-[#F04444]/40 text-[#F4F4EF] shadow-[#F04444]/10'
                : 'bg-[#1C180E]/95 border-[#E5B84C]/40 text-[#F4F4EF] shadow-[#E5B84C]/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#36D98A] flex-shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#F04444] flex-shrink-0" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-[#E5B84C] flex-shrink-0" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
