import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowRight } from 'lucide-react';
import { OrderTrackingComponent } from './OrderTrackingComponent';

export const OrderConfirmationModal: React.FC = () => {
  const {
    activeOrderForTracking,
    setActiveOrderForTracking,
    setActiveTab,
    restaurantSettings,
  } = useApp();

  if (!activeOrderForTracking) return null;

  const order = activeOrderForTracking;

  return (
    <div
      id="order-confirmation-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setActiveOrderForTracking(null)}
    >
      <div
        id="order-confirmation-content"
        className="bg-white rounded-3xl overflow-hidden max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E6DEC8] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#143627] text-white p-6 text-center relative shrink-0">
          <button
            onClick={() => setActiveOrderForTracking(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 bg-emerald-500/20 text-[#74C69D] rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-400/30">
            <span className="text-2xl">🎉</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-cinzel tracking-wide uppercase">
            Order Confirmed!
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1">
            Thank you for choosing {restaurantSettings.name}
          </p>
        </div>

        {/* Scrollable Order Tracker */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <OrderTrackingComponent order={order} allowSimulate={true} showLocationTracker={true} />
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E6DEC8] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setActiveOrderForTracking(null)}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#E6DEC8] bg-white text-xs font-bold text-[#2C3B34] hover:bg-[#EAE2D3] transition-colors"
          >
            Continue Browsing
          </button>

          <button
            onClick={() => {
              setActiveOrderForTracking(null);
              setActiveTab('orders');
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
