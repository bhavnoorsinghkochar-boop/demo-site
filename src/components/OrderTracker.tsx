import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ChefHat,
  ShoppingBag,
  Bike,
  Sparkles,
  UtensilsCrossed,
  Receipt,
  AlertCircle,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerProps {
  orderId?: string;
  compact?: boolean;
  allowSimulate?: boolean;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orderId,
  compact = false,
  allowSimulate = true,
}) => {
  const { orders, updateOrderStatus, restaurantSettings, setActiveTab } = useApp();

  // Find target order: either specified by props or the latest active order, or latest order overall
  const activeOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orderId || (activeOrders.length > 0 ? activeOrders[0].id : orders[0]?.id || '')
  );

  const [showDetails, setShowDetails] = useState<boolean>(!compact);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Keep selectedOrderId in sync if activeOrders changes
  useEffect(() => {
    if (orderId) {
      setSelectedOrderId(orderId);
    } else if (
      !selectedOrderId ||
      !orders.some((o) => o.id === selectedOrderId)
    ) {
      if (activeOrders.length > 0) {
        setSelectedOrderId(activeOrders[0].id);
      } else if (orders.length > 0) {
        setSelectedOrderId(orders[0].id);
      }
    }
  }, [orderId, orders, activeOrders, selectedOrderId]);

  const currentOrder: Order | undefined = orders.find((o) => o.id === selectedOrderId);

  // Status Flow steps definition as requested: Placed, Confirmed, Preparing, Ready, Completed
  const STATUS_FLOW: {
    status: OrderStatus;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      status: 'placed',
      label: 'Placed',
      sublabel: 'Order received at Laa Mamma Mia',
      icon: Receipt,
    },
    {
      status: 'confirmed',
      label: 'Confirmed',
      sublabel: 'Kitchen accepted & verified',
      icon: ChefHat,
    },
    {
      status: 'preparing',
      label: 'Preparing',
      sublabel: 'Freshly cooking in our kitchen',
      icon: UtensilsCrossed,
    },
    {
      status: 'ready',
      label: 'Ready',
      sublabel:
        currentOrder?.orderType === 'delivery'
          ? 'Out with delivery rider'
          : currentOrder?.orderType === 'dine-in'
          ? 'Serving to your table'
          : 'Ready at Booth No.20, Rajguru Nagar counter',
      icon: currentOrder?.orderType === 'delivery' ? Bike : ShoppingBag,
    },
    {
      status: 'completed',
      label: 'Completed',
      sublabel: 'Fulfilled & enjoyed by diner',
      icon: Sparkles,
    },
  ];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = currentOrder ? getStepIndex(currentOrder.status) : 0;
  const isCancelled = currentOrder?.status === 'cancelled';

  // Calculate percentage for the visual progress bar line
  // 5 steps: 0% -> 25% -> 50% -> 75% -> 100%
  const progressPercent = isCancelled
    ? 0
    : Math.min(100, Math.max(0, (currentIndex / (STATUS_FLOW.length - 1)) * 100));

  // Simulation timer for demoing the live flow
  useEffect(() => {
    if (!isSimulating || !currentOrder || currentOrder.status === 'completed' || currentOrder.status === 'cancelled') {
      setIsSimulating(false);
      return;
    }

    const nextStatuses: Record<OrderStatus, OrderStatus | null> = {
      placed: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'completed',
      completed: null,
      cancelled: null,
    };

    const nextStatus = nextStatuses[currentOrder.status];
    if (!nextStatus) {
      setIsSimulating(false);
      return;
    }

    const timer = setTimeout(() => {
      updateOrderStatus(currentOrder.id, nextStatus);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isSimulating, currentOrder, updateOrderStatus]);

  if (!currentOrder) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-[#E6DEC8] text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#65736C] flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-[#143627]">No Active Orders Being Tracked</h4>
        <p className="text-xs text-[#65736C] max-w-sm mx-auto">
          Place an order from our authentic multi-cuisine menu to watch real-time kitchen preparation status.
        </p>
        <button
          onClick={() => setActiveTab('menu')}
          className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold transition-all"
        >
          Explore Laa Mamma Mia Menu
        </button>
      </div>
    );
  }

  return (
    <div
      id={`order-tracker-${currentOrder.orderNumber}`}
      className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E6DEC8] shadow-sm space-y-6 transition-all"
    >
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DEC8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2E7D58]">
              Live Order Tracker
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <h3 className="font-mono text-xl sm:text-2xl font-extrabold text-[#143627]">
              #{currentOrder.orderNumber}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E6DEC8] text-[#143627] text-xs font-bold capitalize">
              {currentOrder.orderType}
            </span>
            {currentOrder.customerDetails?.tableNumber && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                Table {currentOrder.customerDetails?.tableNumber}
              </span>
            )}
          </div>
        </div>

        {/* If multiple active orders, let diner pick which one to track */}
        {activeOrders.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-[#65736C] font-semibold shrink-0">Switch Order:</span>
            {activeOrders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrderId(ord.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                  ord.id === currentOrder.id
                    ? 'bg-[#143627] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#4A5550] hover:bg-[#EAE2D3]'
                }`}
              >
                #{ord.orderNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cancelled State Display */}
      {isCancelled ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">This order has been cancelled.</p>
            <p className="text-rose-600 mt-0.5">
              Contact our team at {restaurantSettings.phone} if you need assistance or refund support.
            </p>
          </div>
        </div>
      ) : (
        /* VISUAL PROGRESS BAR COMPONENT */
        <div className="space-y-6 pt-2">
          {/* Status Label & ETA Banner */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#143627] text-white flex items-center justify-center font-bold shadow-xs">
                {React.createElement(STATUS_FLOW[Math.max(0, currentIndex)].icon, {
                  className: 'w-5 h-5 text-[#C69234]',
                })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#65736C]">Current Status:</span>
                  <span className="font-extrabold text-sm sm:text-base text-[#143627] capitalize">
                    {STATUS_FLOW[Math.max(0, currentIndex)].label}
                  </span>
                </div>
                <p className="text-xs text-[#2E7D58] font-medium">
                  {STATUS_FLOW[Math.max(0, currentIndex)].sublabel}
                </p>
              </div>
            </div>

            {/* Estimated Time Badge */}
            {currentOrder.status !== 'completed' && (
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#E6DEC8] self-start sm:self-auto">
                <Clock className="w-4 h-4 text-[#C69234] animate-spin" />
                <div>
                  <span className="text-[10px] text-[#65736C] block leading-tight">Estimated Time</span>
                  <span className="text-xs font-extrabold text-[#143627]">
                    ~{currentOrder.estimatedTimeMinutes || 25} Mins
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar Container */}
          <div className="relative pt-4 pb-2 px-2 sm:px-4">
            {/* Background Track Line */}
            <div className="absolute top-8 sm:top-8 left-6 right-6 h-1.5 bg-[#E6DEC8] rounded-full -translate-y-1/2 z-0" />

            {/* Animated Filled Progress Line */}
            <div
              className="absolute top-8 sm:top-8 left-6 h-1.5 bg-gradient-to-r from-[#2E7D58] to-[#143627] rounded-full -translate-y-1/2 z-0 transition-all duration-700 ease-out"
              style={{
                width: `calc(${progressPercent}% * (100% - 3rem) / 100)`,
              }}
            />

            {/* Step Nodes Grid */}
            <div className="relative z-10 grid grid-cols-5 gap-1">
              {STATUS_FLOW.map((step, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isUpcoming = idx > currentIndex;
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center text-center cursor-pointer group"
                    onClick={() => {
                      if (allowSimulate) {
                        updateOrderStatus(currentOrder.id, step.status);
                      }
                    }}
                    title={allowSimulate ? `Click to switch status to ${step.label}` : step.label}
                  >
                    {/* Node Circle */}
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#143627] text-white ring-4 ring-[#2E7D58]/30 shadow-md scale-110'
                          : isPassed
                          ? 'bg-[#2E7D58] text-white shadow-xs'
                          : 'bg-white border-2 border-[#E6DEC8] text-[#93A199] group-hover:border-[#143627]'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
                      ) : (
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`mt-2.5 text-[11px] sm:text-xs font-bold leading-tight transition-colors ${
                        isCurrent
                          ? 'text-[#143627]'
                          : isPassed
                          ? 'text-[#2E7D58]'
                          : 'text-[#93A199]'
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* Active Pulse Pill */}
                    {isCurrent && (
                      <span className="mt-1 hidden sm:inline-block px-1.5 py-0.5 rounded-full bg-[#E2F4EA] text-[#2E7D58] text-[9px] font-bold uppercase tracking-wider animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          {allowSimulate && (
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E6DEC8]/60 text-xs">
              <span className="text-[11px] text-[#65736C]">
                💡 Interactive demo: Click steps above or simulate kitchen flow
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    isSimulating
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                      : 'bg-[#FAF7F2] hover:bg-[#EAE2D3] text-[#143627] border border-[#E6DEC8]'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isSimulating ? 'Simulating (~4s/step)...' : 'Auto-Simulate Kitchen'}</span>
                </button>

                <button
                  onClick={() => updateOrderStatus(currentOrder.id, 'placed')}
                  className="p-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EAE2D3] text-[#65736C] border border-[#E6DEC8]"
                  title="Reset to Placed"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion: Order Dishes & Summary */}
      <div className="border border-[#E6DEC8] rounded-2xl overflow-hidden bg-[#FAF7F2]/50">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#143627]">
            <Receipt className="w-4 h-4 text-[#C69234]" />
            <span>
              Order Summary ({currentOrder.items.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-[#235D43] font-extrabold">₹{currentOrder.grandTotal}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#65736C] font-semibold">
            <span>{showDetails ? 'Hide Details' : 'View Details'}</span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {showDetails && (
          <div className="p-4 pt-0 space-y-4 border-t border-[#E6DEC8]">
            {/* Customer & Location Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs bg-white p-3.5 rounded-xl border border-[#E6DEC8]">
              <div>
                <span className="text-[#65736C] block text-[11px]">Customer Contact</span>
                <span className="font-bold text-[#143627]">
                  {currentOrder.customerDetails?.name || 'Customer'} ({currentOrder.customerDetails?.phone || 'On file'})
                </span>
              </div>

              <div>
                <span className="text-[#65736C] block text-[11px]">
                  {currentOrder.orderType === 'delivery'
                    ? 'Delivery Destination'
                    : currentOrder.orderType === 'dine-in'
                    ? 'Dining Table'
                    : 'Collection Point'}
                </span>
                <span className="font-bold text-[#143627]">
                  {currentOrder.orderType === 'delivery'
                    ? currentOrder.customerDetails?.address || 'Ludhiana'
                    : currentOrder.orderType === 'dine-in'
                    ? `Table ${currentOrder.customerDetails?.tableNumber || 'Main Dining Hall'}`
                    : 'Booth No.20, Main Market, Rajguru Nagar, Ludhiana'}
                </span>
              </div>

              {currentOrder.customerDetails?.notes && (
                <div className="sm:col-span-2 text-gray-600 bg-[#FAF7F2] p-2 rounded-lg">
                  <strong>Special Instructions:</strong> {currentOrder.customerDetails.notes}
                </div>
              )}
            </div>

            {/* Items Listing */}
            <div className="divide-y divide-[#E6DEC8] bg-white rounded-xl border border-[#E6DEC8] px-3.5">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#143627]">
                        {item.quantity}× {item.menuItem.name}
                      </span>
                    </div>
                    {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                      <p className="text-[11px] text-[#65736C]">
                        {item.selectedCustomizations.map((c) => c.optionName).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-[#143627]">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#4A5550] px-1">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span>₹{currentOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{currentOrder.tax}</span>
              </div>
              {currentOrder.orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery & Packaging</span>
                  <span>₹{currentOrder.deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-[#143627] pt-2 border-t border-[#E6DEC8]">
                <span>Total Amount Paid ({currentOrder.paymentMethod})</span>
                <span className="text-[#235D43]">₹{currentOrder.grandTotal}</span>
              </div>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <a
                href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
                className="px-4 py-2 rounded-xl bg-white border border-[#E6DEC8] hover:bg-[#FAF7F2] text-[#143627] text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#2E7D58]" />
                <span>Call Restaurant ({restaurantSettings.phone})</span>
              </a>

              <a
                href="https://maps.google.com/?q=Laa+Mamma+Mia+Rajguru+Nagar+Ludhiana"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EAE2D3] text-[#143627] text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Rajguru Nagar Directions</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
