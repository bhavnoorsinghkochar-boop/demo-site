import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { OrderTrackingComponent } from './OrderTrackingComponent';
import {
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  Bike,
  Compass,
  ChevronUp,
  ChevronDown,
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  ArrowRight,
  MapPin,
  Flame,
  ChevronRight,
} from 'lucide-react';

export const LiveOrderPopup: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    restaurantSettings,
    showToast,
  } = useApp();

  // Find all active in-progress orders (placed, confirmed, preparing, ready)
  const activeOrders = (orders || []).filter(
    (o) => o && o.status && o.status !== 'completed' && o.status !== 'cancelled'
  );

  const [activeOrderIndex, setActiveOrderIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // If there are no active orders, do not render the popup
  if (activeOrders.length === 0) return null;

  // Selected active order (default to first active order, clamp index)
  const safeIndex = Math.min(activeOrderIndex, activeOrders.length - 1);
  const currentOrder: Order = activeOrders[safeIndex] || activeOrders[0];
  if (!currentOrder) return null;

  const stages: { key: OrderStatus; label: string; index: number }[] = [
    { key: 'placed', label: 'Placed', index: 0 },
    { key: 'confirmed', label: 'Confirmed', index: 1 },
    { key: 'preparing', label: 'Preparing', index: 2 },
    { key: 'ready', label: 'Ready', index: 3 },
    { key: 'completed', label: 'Completed', index: 4 },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === currentOrder.status);
  const safeStageIndex = currentStageIndex >= 0 ? currentStageIndex : 0;
  const progressPercent = Math.min(100, Math.max(10, ((safeStageIndex) / (stages.length - 1)) * 100));

  // Quick simulate next stage for demo presentation
  const handleQuickAdvance = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatuses: Record<OrderStatus, OrderStatus> = {
      placed: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: 'completed',
      cancelled: 'cancelled',
    };

    const nextStatus = nextStatuses[currentOrder.status];
    if (nextStatus && nextStatus !== currentOrder.status) {
      updateOrderStatus(currentOrder.id, nextStatus);
      showToast(
        `Order #${currentOrder.orderNumber} advanced to ${nextStatus.toUpperCase()}`,
        'success'
      );
    }
  };

  const getStatusVisuals = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return {
          title: 'Order Placed',
          subtitle: 'Awaiting restaurant confirmation',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          pulseColor: 'bg-blue-500',
          icon: Clock,
          nextActionText: 'Advance to Confirmed',
        };
      case 'confirmed':
        return {
          title: 'Order Confirmed',
          subtitle: 'Kitchen received your ticket',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          pulseColor: 'bg-emerald-500',
          icon: CheckCircle2,
          nextActionText: 'Advance to Preparing',
        };
      case 'preparing':
        return {
          title: 'Preparing Food',
          subtitle: 'Chef is crafting your fresh order',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          pulseColor: 'bg-amber-500',
          icon: Flame,
          nextActionText: 'Advance to Ready',
        };
      case 'ready':
        return {
          title: currentOrder.orderType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup',
          subtitle: currentOrder.orderType === 'delivery' ? 'Courier en route to you' : 'Please collect at counter',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          pulseColor: 'bg-purple-500',
          icon: Bike,
          nextActionText: 'Complete Order',
        };
      default:
        return {
          title: 'Order in Progress',
          subtitle: 'Processing your dining request',
          badgeBg: 'bg-gray-100 text-gray-700 border-gray-200',
          pulseColor: 'bg-gray-400',
          icon: Clock,
          nextActionText: 'Advance',
        };
    }
  };

  const visuals = getStatusVisuals(currentOrder.status);
  const StatusIcon = visuals.icon;

  const itemsSummary = Array.isArray(currentOrder?.items)
    ? currentOrder.items
        .map((i) => `${i?.quantity || 1}x ${i?.menuItem?.name || 'Dish'}`)
        .join(', ')
    : 'Order in preparation';

  return (
    <>
      {/* Floating Pop-Up Container */}
      <aside
        id="live-order-persistent-popup"
        aria-label="Active order tracker notification"
        className="fixed z-40 bottom-20 lg:bottom-6 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-[430px] w-auto transition-all duration-300"
      >
        {isMinimized ? (
          /* Minimized Compact Pill Mode */
          <div
            onClick={() => setIsMinimized(false)}
            className="group cursor-pointer bg-white/95 backdrop-blur-md border border-[#E6DEC8] shadow-xl rounded-full p-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 ring-2 ring-emerald-600/20 hover:border-emerald-600 transition-all hover:scale-102"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${visuals.pulseColor} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-3 w-3 ${visuals.pulseColor}`} />
              </span>

              <div className="text-left truncate">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-mono text-xs font-bold text-[#143627]">
                    #{currentOrder.orderNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-[#2E7D58]">
                    · {visuals.title}
                  </span>
                </div>
                <p className="text-[10px] text-[#65736C] truncate mt-0.5">
                  Tap to view live order progression & map
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailModalOpen(true);
                }}
                className="p-1.5 rounded-full bg-[#143627] text-white hover:bg-[#235D43] transition-colors"
                title="Expand full map"
              >
                <Compass className="w-3.5 h-3.5 text-[#C69234]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(false);
                }}
                className="p-1.5 rounded-full text-[#65736C] hover:bg-gray-100 transition-colors"
                title="Expand widget"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Full Elegant Floating Card Mode */
          <div
            className="bg-white/95 backdrop-blur-md border border-[#E6DEC8] shadow-2xl rounded-3xl p-4 sm:p-5 ring-1 ring-black/5 animate-in slide-in-from-bottom-5 duration-200"
          >
            {/* Top Bar inside Card */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E6DEC8]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${visuals.pulseColor} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${visuals.pulseColor}`} />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#143627] flex items-center gap-1">
                  Active Live Order
                </span>

                {activeOrders.length > 1 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {safeIndex + 1}/{activeOrders.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {/* Previous/Next Switcher if multiple active orders */}
                {activeOrders.length > 1 && (
                  <div className="flex items-center mr-1">
                    <button
                      type="button"
                      onClick={() => setActiveOrderIndex((prev) => (prev > 0 ? prev - 1 : activeOrders.length - 1))}
                      className="px-1.5 py-0.5 text-xs text-[#65736C] hover:text-[#143627] font-bold"
                      title="Previous active order"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveOrderIndex((prev) => (prev < activeOrders.length - 1 ? prev + 1 : 0))}
                      className="px-1.5 py-0.5 text-xs text-[#65736C] hover:text-[#143627] font-bold"
                      title="Next active order"
                    >
                      ›
                    </button>
                  </div>
                )}

                {/* Minimize Button */}
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-[#65736C] transition-colors"
                  title="Minimize popup"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Order Main Content */}
            <div className="pt-3 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-mono text-base font-extrabold text-[#143627]">
                      Order #{currentOrder.orderNumber}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E6DEC8] text-[#143627] text-[10px] font-bold uppercase">
                      {currentOrder.orderType}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#2E7D58]">
                    {visuals.title} · <span className="text-[#65736C] font-normal">{visuals.subtitle}</span>
                  </p>
                </div>

                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${visuals.badgeBg}`}>
                  <StatusIcon className="w-4 h-4" />
                </div>
              </div>

              {/* Items summary */}
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC8]/60 text-xs text-[#4A5550]">
                <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                  <span className="text-[#65736C]">Items ({currentOrder.items.length})</span>
                  <span className="font-bold text-[#143627]">₹{currentOrder.grandTotal}</span>
                </div>
                <p className="truncate text-xs text-[#143627] font-medium" title={itemsSummary}>
                  {itemsSummary}
                </p>
              </div>

              {/* Horizontal Progress Bar inside Pop-up */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#65736C]">
                  <span>Progress</span>
                  <span className="text-[#143627] font-mono">{Math.round(progressPercent)}%</span>
                </div>

                <div className="w-full bg-[#EAE2D3] h-2 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#2E7D58] to-[#C69234] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* 5 Step Mini-Labels */}
                <div className="flex items-center justify-between text-[9px] text-[#65736C] font-medium pt-0.5">
                  {stages.map((st, idx) => {
                    const isDone = idx <= safeStageIndex;
                    const isCurrent = idx === safeStageIndex;
                    return (
                      <span
                        key={st.key}
                        className={`transition-colors ${
                          isCurrent
                            ? 'font-bold text-[#143627] underline decoration-[#2E7D58] decoration-2'
                            : isDone
                            ? 'text-emerald-700 font-semibold'
                            : 'text-gray-400'
                        }`}
                      >
                        {st.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Track Full Map & Quick Advance */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  id="live-order-popup-view-map-btn"
                  type="button"
                  onClick={() => setIsDetailModalOpen(true)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Compass className="w-3.5 h-3.5 text-[#C69234]" />
                  <span>View Live Map & Stages</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
                </button>

                {currentOrder.status !== 'completed' && (
                  <button
                    id="live-order-popup-quick-advance-btn"
                    type="button"
                    onClick={handleQuickAdvance}
                    title="Simulate advancing to next stage"
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Next Stage</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Full Dedicated Tracking Modal Pop-up on Demand */}
      {isDetailModalOpen && (
        <div
          id="live-order-full-tracking-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E6DEC8] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#143627] text-white p-5 sm:p-6 relative shrink-0 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                    Live Order Tracker
                  </span>
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold mt-1">
                  Order #{currentOrder.orderNumber}
                </h3>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  {restaurantSettings.name} · {restaurantSettings.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Close tracker modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Tracker Component */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <OrderTrackingComponent
                order={currentOrder}
                allowSimulate={true}
                showLocationTracker={true}
              />
            </div>

            {/* Sticky Modal Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#E6DEC8] flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-[#65736C]">
                Status: <strong className="text-[#143627] uppercase">{currentOrder.status}</strong>
              </span>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#143627] text-white text-xs font-bold hover:bg-[#235D43] transition-colors"
              >
                Close Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
