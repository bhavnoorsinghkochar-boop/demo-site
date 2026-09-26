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
  Navigation,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Compass,
  ArrowRight,
  RefreshCw,
  Radio,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { SimulatedDeliveryMapView } from './SimulatedDeliveryMapView';

export interface OrderTrackingComponentProps {
  order: Order;
  allowSimulate?: boolean;
  showLocationTracker?: boolean;
  className?: string;
  onStatusChange?: (newStatus: OrderStatus) => void;
}

export const OrderTrackingComponent: React.FC<OrderTrackingComponentProps> = ({
  order: propOrder,
  allowSimulate = true,
  showLocationTracker = true,
  className = '',
  onStatusChange,
}) => {
  const { orders, updateOrderStatus, restaurantSettings, showToast } = useApp();

  // Keep state mapped to the real orders array in AppContext
  const currentOrder = orders.find((o) => o.id === propOrder.id) || propOrder;

  const [copied, setCopied] = useState(false);
  const [activeRouteTab, setActiveRouteTab] = useState<'map' | 'details'>('map');

  // Stages definition matching user's exact specification:
  // Placed -> Confirmed -> Preparing -> Ready -> Completed
  const STAGES: {
    status: OrderStatus;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      status: 'placed',
      label: 'Placed',
      description: 'Order received & logged in system',
      icon: Receipt,
    },
    {
      status: 'confirmed',
      label: 'Confirmed',
      description: 'Accepted & verified by kitchen team',
      icon: ChefHat,
    },
    {
      status: 'preparing',
      label: 'Preparing',
      description: 'Freshly cooking your food in kitchen',
      icon: UtensilsCrossed,
    },
    {
      status: 'ready',
      label: 'Ready',
      description:
        currentOrder.orderType === 'delivery'
          ? 'Handed over to rider for delivery'
          : currentOrder.orderType === 'dine-in'
          ? 'Freshly plated & serving to table'
          : 'Packed & ready at Booth No.20, Rajguru Nagar counter',
      icon: currentOrder.orderType === 'delivery' ? Bike : ShoppingBag,
    },
    {
      status: 'completed',
      label: 'Completed',
      description: 'Successfully delivered & enjoyed',
      icon: Sparkles,
    },
  ];

  const getStageIndex = (status: OrderStatus): number => {
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

  const currentIndex = getStageIndex(currentOrder.status);
  const isCancelled = currentOrder.status === 'cancelled';

  // Calculate percentage of progress for the horizontal bar line
  // 5 stages -> 0% (index 0), 25% (index 1), 50% (index 2), 75% (index 3), 100% (index 4)
  const progressPercentage = isCancelled
    ? 0
    : Math.min(100, Math.max(0, (currentIndex / (STAGES.length - 1)) * 100));

  const handleStageClick = (status: OrderStatus) => {
    if (allowSimulate) {
      updateOrderStatus(currentOrder.id, status);
      if (onStatusChange) onStatusChange(status);
    }
  };

  // Easy location address generation
  const originAddress = `${restaurantSettings.name}, ${restaurantSettings.location}`;
  const destinationAddress =
    currentOrder.orderType === 'delivery'
      ? currentOrder.customerDetails?.address || 'Aggar Nagar, Ludhiana'
      : currentOrder.orderType === 'dine-in'
      ? `Table ${currentOrder.customerDetails?.tableNumber || '4'}, ${restaurantSettings.location}`
      : `Takeaway Counter, ${restaurantSettings.location}`;

  // One-tap Google Maps Navigation URL
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    `${restaurantSettings.name} ${restaurantSettings.location}`
  )}&destination=${encodeURIComponent(destinationAddress)}`;

  const googleMapsRestaurantUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${restaurantSettings.name} ${restaurantSettings.location}`
  )}`;

  const handleCopyTrackingInfo = () => {
    const text = `Order #${currentOrder.orderNumber} Status: ${currentOrder.status.toUpperCase()} | From: ${restaurantSettings.name} | Destination: ${destinationAddress}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast('Tracking details copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      id={`order-tracking-component-${currentOrder.orderNumber}`}
      className={`space-y-6 bg-white rounded-3xl border border-[#E6DEC8] p-5 sm:p-7 shadow-xs ${className}`}
    >
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E6DEC8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2E7D58]">
              Live Order Progression
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
            <h3 className="font-mono text-xl sm:text-2xl font-extrabold text-[#143627]">
              Order #{currentOrder.orderNumber}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E6DEC8] text-[#143627] text-xs font-bold capitalize">
              {currentOrder.orderType}
            </span>
            {currentOrder.customerDetails?.tableNumber && currentOrder.orderType === 'dine-in' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                Table {currentOrder.customerDetails?.tableNumber}
              </span>
            )}
          </div>
          <p className="text-xs text-[#65736C] mt-0.5">
            Placed on {currentOrder.date} {currentOrder.time ? `at ${currentOrder.time}` : ''}
          </p>
        </div>

        {/* Current Status Pill & Estimated Time */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {!isCancelled && currentOrder.status !== 'completed' && (
            <div className="flex items-center gap-2 bg-[#FAF7F2] px-3.5 py-2 rounded-2xl border border-[#E6DEC8]">
              <Clock className="w-4 h-4 text-[#C69234] animate-spin" />
              <div>
                <span className="text-[10px] text-[#65736C] block leading-none">ETA</span>
                <span className="text-xs font-extrabold text-[#143627]">
                  ~{currentOrder.estimatedTimeMinutes || 25} Mins
                </span>
              </div>
            </div>
          )}

          <div className="px-3 py-1.5 rounded-2xl bg-[#E2F4EA] border border-[#2E7D58]/20 text-[#143627] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E7D58]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {currentOrder.status}
            </span>
          </div>
        </div>
      </div>

      {/* Cancelled Alert Banner if Order is Cancelled */}
      {isCancelled ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Order Cancelled</h4>
            <p className="text-xs text-rose-700 mt-1">
              This order has been cancelled. For help or queries, please contact our restaurant desk at{' '}
              <a href={`tel:${restaurantSettings.phone}`} className="font-bold underline">
                {restaurantSettings.phone}
              </a>
              .
            </p>
          </div>
        </div>
      ) : (
        /* HORIZONTAL PROGRESS BAR: Placed -> Confirmed -> Preparing -> Ready -> Completed */
        <div className="space-y-4 pt-2">
          {/* Active Stage Banner */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#143627] text-[#C69234] flex items-center justify-center font-bold shadow-xs shrink-0">
                {React.createElement(STAGES[Math.max(0, currentIndex)].icon, {
                  className: 'w-5 h-5',
                })}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#65736C] font-semibold block">
                  Stage {Math.max(0, currentIndex) + 1} of 5
                </span>
                <h4 className="font-extrabold text-base text-[#143627]">
                  {STAGES[Math.max(0, currentIndex)].label}
                </h4>
                <p className="text-xs text-[#2E7D58] font-medium">
                  {STAGES[Math.max(0, currentIndex)].description}
                </p>
              </div>
            </div>

            {allowSimulate && currentOrder.status !== 'completed' && (
              <button
                id="next-stage-btn"
                onClick={() => {
                  const nextIndex = Math.min(STAGES.length - 1, currentIndex + 1);
                  handleStageClick(STAGES[nextIndex].status);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <span>Advance Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Horizontal Progress Track & Step Nodes */}
          <div className="relative pt-6 pb-4 px-2 sm:px-6">
            {/* Background Horizontal Line */}
            <div
              className="absolute top-11 sm:top-12 left-6 sm:left-12 right-6 sm:right-12 h-1.5 bg-[#E6DEC8] rounded-full z-0"
              aria-hidden="true"
            />

            {/* Filled Animated Horizontal Progress Bar Line */}
            <div
              className="absolute top-11 sm:top-12 left-6 sm:left-12 h-1.5 bg-gradient-to-r from-[#2E7D58] via-[#235D43] to-[#143627] rounded-full z-0 transition-all duration-700 ease-out"
              style={{
                width: `calc(${progressPercentage}% * (100% - 3rem) / 100)`,
              }}
              aria-hidden="true"
            />

            {/* 5 Stage Nodes across the horizontal axis */}
            <div className="relative z-10 grid grid-cols-5 gap-1">
              {STAGES.map((stage, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isUpcoming = idx > currentIndex;
                const StageIcon = stage.icon;

                return (
                  <div
                    key={stage.status}
                    className="flex flex-col items-center text-center cursor-pointer group"
                    onClick={() => handleStageClick(stage.status)}
                    title={allowSimulate ? `Click to switch status to ${stage.label}` : stage.label}
                  >
                    {/* Node Badge */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#143627] text-white ring-4 ring-[#2E7D58]/30 shadow-md scale-110'
                          : isPassed
                          ? 'bg-[#2E7D58] text-white shadow-xs'
                          : 'bg-white border-2 border-[#E6DEC8] text-[#93A199] group-hover:border-[#143627] group-hover:text-[#143627]'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-100" />
                      ) : (
                        <StageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>

                    {/* Step Text Label */}
                    <span
                      className={`mt-2.5 text-[11px] sm:text-xs font-bold leading-tight transition-colors ${
                        isCurrent
                          ? 'text-[#143627]'
                          : isPassed
                          ? 'text-[#2E7D58]'
                          : 'text-[#93A199]'
                      }`}
                    >
                      {stage.label}
                    </span>

                    {/* Stage status indicator badge */}
                    {isCurrent && (
                      <span className="mt-1 px-1.5 py-0.5 rounded-full bg-[#E2F4EA] text-[#2E7D58] text-[9px] font-bold uppercase tracking-wider">
                        Current
                      </span>
                    )}
                    {isPassed && (
                      <span className="mt-1 text-[9px] text-[#2E7D58] font-semibold hidden sm:inline-block">
                        Done
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="mt-1 text-[9px] text-gray-400 font-normal hidden sm:inline-block">
                        Pending
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* EASY LOCATION TRACKING MODULE */}
      {showLocationTracker && (
        <div
          id="easy-location-tracking-card"
          className="rounded-3xl border border-[#E6DEC8] bg-[#FAF7F2]/60 overflow-hidden shadow-xs space-y-4 p-5"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6DEC8]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#143627] text-[#C69234] flex items-center justify-center">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#143627]">
                  Easy Location & Live Routing
                </h4>
                <p className="text-[11px] text-[#65736C]">
                  {currentOrder.orderType === 'delivery'
                    ? 'Track dispatch and destination along Ferozpur Road'
                    : currentOrder.orderType === 'dine-in'
                    ? 'Rajguru Nagar table & dining location'
                    : 'Booth No.20, Rajguru Nagar pickup counter'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleCopyTrackingInfo}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E6DEC8] hover:bg-[#EAE2D3] text-xs text-[#143627] font-semibold flex items-center gap-1 transition-colors"
                title="Copy tracking address info"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#65736C]" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#235D43] hover:bg-[#143627] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Compass className="w-3.5 h-3.5 text-[#C69234]" />
                <span>Open in GPS</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            </div>
          </div>

          {/* Map / Corridor View Tabs */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center rounded-2xl bg-white border border-[#E6DEC8] p-1 shadow-2xs">
              <button
                id="tab-interactive-map"
                onClick={() => setActiveRouteTab('map')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeRouteTab === 'map'
                    ? 'bg-[#143627] text-white shadow-xs'
                    : 'text-[#65736C] hover:text-[#143627]'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulated Interactive GPS Map</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
              <button
                id="tab-corridor-view"
                onClick={() => setActiveRouteTab('details')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeRouteTab === 'details'
                    ? 'bg-[#143627] text-white shadow-xs'
                    : 'text-[#65736C] hover:text-[#143627]'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Corridor Schematic</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#2E7D58] font-semibold bg-white px-3 py-1.5 rounded-xl border border-[#E6DEC8]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Real-Time Rider Radar</span>
            </div>
          </div>

          {/* Interactive Simulated Map View */}
          {activeRouteTab === 'map' ? (
            <SimulatedDeliveryMapView
              order={currentOrder}
              destinationAddress={destinationAddress}
              restaurantLocation={restaurantSettings.location}
              restaurantName={restaurantSettings.name}
            />
          ) : (
            /* Interactive Visual Route Map Illustration */
            <div className="relative rounded-2xl bg-gradient-to-br from-[#143627] via-[#1B4D36] to-[#2E7D58] p-5 text-white overflow-hidden shadow-inner">
              {/* Abstract Street Grid / Route Overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 space-y-4">
                {/* Route Summary Metrics */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-semibold text-emerald-200">
                      {currentOrder.status === 'ready'
                        ? 'Rider Dispatched · En Route'
                        : currentOrder.status === 'completed'
                        ? 'Order Reached Destination'
                        : 'Preparing at Laa Mamma Mia Kitchen'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-emerald-100/90 font-mono text-[11px]">
                    <span>Est. Distance: ~2.4 km</span>
                    <span>·</span>
                    <span>Via Ferozpur Rd</span>
                  </div>
                </div>

                {/* Graphical Path Visualizer */}
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                  <div className="flex items-center justify-between relative">
                    {/* Dashed Road Line */}
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/30 z-0" />

                    {/* Origin Point */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-emerald-800 border-2 border-[#C69234] text-white flex items-center justify-center shadow-md">
                        <UtensilsCrossed className="w-4 h-4 text-[#C69234]" />
                      </div>
                      <span className="text-[10px] font-bold text-white mt-1.5 uppercase">
                        {restaurantSettings.name}
                      </span>
                      <span className="text-[9px] text-emerald-200/80">Kitchen</span>
                    </div>

                    {/* Dynamic Courier / Food Bike Marker on Route */}
                    <div
                      className={`relative z-10 flex flex-col items-center transition-all duration-700 ${
                        currentOrder.status === 'placed' || currentOrder.status === 'confirmed'
                          ? 'translate-x-0'
                          : currentOrder.status === 'preparing'
                          ? 'translate-x-0'
                          : currentOrder.status === 'ready'
                          ? 'scale-110 animate-bounce'
                          : 'translate-x-0'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-[#FAF7F2] text-[#143627] flex items-center justify-center shadow-lg border-2 border-emerald-400">
                        {currentOrder.orderType === 'delivery' ? (
                          <Bike className="w-4 h-4 text-[#2E7D58]" />
                        ) : (
                          <ShoppingBag className="w-4 h-4 text-[#2E7D58]" />
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold text-[#C69234] mt-1">
                        {currentOrder.status === 'ready'
                          ? 'On Route'
                          : currentOrder.status === 'completed'
                          ? 'Arrived'
                          : 'In Kitchen'}
                      </span>
                    </div>

                    {/* Destination Point: Customer Address / Table */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-white text-[#143627] border-2 border-white flex items-center justify-center shadow-md">
                        <MapPin className="w-4 h-4 text-rose-600" />
                      </div>
                      <span className="text-[10px] font-bold text-white mt-1.5 truncate max-w-[90px]">
                        {currentOrder.orderType === 'delivery'
                          ? 'Destination'
                          : currentOrder.orderType === 'dine-in'
                          ? 'Table'
                          : 'Pickup'}
                      </span>
                      <span className="text-[9px] text-emerald-200/80 truncate max-w-[90px]">
                        {currentOrder.orderType === 'delivery'
                          ? currentOrder.customerDetails?.address?.split(',')[0] || 'Ludhiana'
                          : 'Rajguru Nagar'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Call & Google Maps Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-[11px] text-emerald-100/80">
                    Ludhiana Traffic: <strong>Normal flow in Rajguru Nagar</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
                      className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-[#C69234]" />
                      <span>Call Support</span>
                    </a>

                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white text-[#143627] hover:bg-emerald-50 text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Navigation className="w-3 h-3 text-[#2E7D58]" />
                      <span>Live GPS Track</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Origin & Destination Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            {/* Origin */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E6DEC8] space-y-1">
              <div className="flex items-center gap-2 text-[#2E7D58] font-bold text-[11px]">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>PICKUP / ORIGIN</span>
              </div>
              <p className="font-bold text-[#143627] text-xs">
                {restaurantSettings.name}
              </p>
              <p className="text-[#65736C] text-[11px] leading-relaxed">
                {restaurantSettings.location}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={googleMapsRestaurantUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#235D43] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>View Store on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Destination */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E6DEC8] space-y-1">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-[11px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {currentOrder.orderType === 'delivery'
                    ? 'DELIVERY DESTINATION'
                    : currentOrder.orderType === 'dine-in'
                    ? 'DINE-IN TABLE'
                    : 'COUNTER COLLECTION'}
                </span>
              </div>
              <p className="font-bold text-[#143627] text-xs">
                {currentOrder.customerDetails?.name || 'Customer'} {currentOrder.customerDetails?.phone ? `(${currentOrder.customerDetails.phone})` : ''}
              </p>
              <p className="text-[#65736C] text-[11px] leading-relaxed">
                {destinationAddress}
              </p>
              {currentOrder.customerDetails?.notes && (
                <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-lg">
                  <strong>Notes:</strong> {currentOrder.customerDetails.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
