import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      id="toast-notification"
      className="fixed bottom-20 md:bottom-8 right-4 left-4 md:left-auto md:max-w-md z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border bg-[#143627] text-white border-[#2e7d58] transition-all animate-bounce"
    >
      {toast.type === 'error' ? (
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
      ) : toast.type === 'info' ? (
        <Info className="w-5 h-5 text-[#e2f4ea] shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-[#74C69D] shrink-0" />
      )}
      <p className="text-sm font-medium tracking-wide leading-snug">{toast.message}</p>
    </div>
  );
};
