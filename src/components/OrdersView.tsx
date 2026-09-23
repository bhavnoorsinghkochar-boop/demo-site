import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Activity,
  ArrowLeft,
  Receipt,
  Phone,
  MapPin,
  UtensilsCrossed,
  Printer,
  Compass,
} from 'lucide-react';
import { Order } from '../types';
import { OrderTrackingComponent } from './OrderTrackingComponent';

export const OrdersView: React.FC = () => {
  const {
    orders,
    setActiveOrderForTracking,
    reorder,
    setActiveTab,
    restaurantSettings,
    showToast,
    currentUser,
    userProfile,
    setIsAuthModalOpen,
  } = useApp();
  const [activeTab, setActiveOrderTab] = useState<'active' | 'previous'>('active');
  const [selectedOrderForDetailsId, setSelectedOrderForDetailsId] = useState<string | null>(null);

  const activeOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );
  const previousOrders = orders.filter(
    (o) => o.status === 'completed' || o.status === 'cancelled'
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : previousOrders;

  // Find order selected for detailed view
  const selectedOrderForDetails = orders.find((o) => o.id === selectedOrderForDetailsId);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'ready':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // If a specific order is selected for 'Order Details', render the dedicated Order Details view
  if (selectedOrderForDetails) {
    const destinationAddress =
      selectedOrderForDetails.orderType === 'delivery'
        ? selectedOrderForDetails.customerDetails.address || 'Aggar Nagar, Ludhiana'
        : selectedOrderForDetails.orderType === 'dine-in'
        ? `Table ${selectedOrderForDetails.customerDetails.tableNumber || '4'}, 1st Floor Dining Hall, Wave Mall`
        : '1st Floor Counter, Wave Mall, Ludhiana';

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      'Madras Leaf Wave Mall Ferozpur Road Ludhiana'
    )}&destination=${encodeURIComponent(destinationAddress)}`;

    return (
      <div id="order-details-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#E6DEC8]">
          <button
            id="back-to-orders-btn"
            onClick={() => setSelectedOrderForDetailsId(null)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E6DEC8] hover:bg-[#FAF7F2] text-xs font-bold text-[#143627] transition-all shadow-2xs active:scale-98"
          >
            <ArrowLeft className="w-4 h-4 text-[#2E7D58]" />
            <span>Back to All Orders</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                selectedOrderForDetails.status
              )}`}
            >
              {selectedOrderForDetails.status}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E6DEC8] text-xs font-semibold capitalize text-[#143627]">
              {selectedOrderForDetails.orderType}
            </span>
          </div>
        </div>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143627] font-cinzel">
              Order Details
            </h1>
            <p className="text-xs text-[#65736C]">
              Invoice & live preparation tracking for #{selectedOrderForDetails.orderNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showToast('Receipt printed to browser console', 'info');
                window.print();
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E6DEC8] hover:bg-[#FAF7F2] text-xs font-bold text-[#143627] flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#65736C]" />
              <span className="hidden sm:inline">Print Receipt</span>
            </button>

            <button
              id="details-reorder-btn"
              onClick={() => {
                reorder(selectedOrderForDetails);
                setSelectedOrderForDetailsId(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#C69234]" />
              <span>Reorder Entire Order</span>
            </button>
          </div>
        </div>

        {/* INTEGRATED ORDER TRACKING COMPONENT WITH HORIZONTAL PROGRESS BAR & EASY LOCATION TRACKING */}
        <OrderTrackingComponent
          order={selectedOrderForDetails}
          allowSimulate={true}
          showLocationTracker={true}
        />

        {/* Itemized Order Receipt Card */}
        <div className="bg-white rounded-3xl border border-[#E6DEC8] p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E6DEC8] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF0DC] text-[#C69234] flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-[#143627]">Itemized Receipt</h3>
            </div>
            <span className="text-xs text-[#65736C] font-mono">
              {selectedOrderForDetails.items.reduce((s, i) => s + i.quantity, 0)} Items Total
            </span>
          </div>

          {/* Dishes Table */}
          <div className="divide-y divide-[#E6DEC8]">
            {selectedOrderForDetails.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-start justify-between gap-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#143627]">
                      {item.quantity} × {item.menuItem.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                      Pure Veg
                    </span>
                  </div>
                  {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                    <p className="text-xs text-[#65736C]">
                      Custom: {item.selectedCustomizations.map((c) => `${c.optionName}${c.priceDelta > 0 ? ` (+₹${c.priceDelta})` : ''}`).join(', ')}
                    </p>
                  )}
                  {item.specialInstructions && (
                    <p className="text-xs text-amber-700 italic">
                      “{item.specialInstructions}”
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-[#143627]">₹{item.totalPrice}</span>
                  <span className="text-[11px] text-[#65736C] block">
                    (₹{item.unitPrice} each)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary Breakdown */}
          <div className="pt-4 border-t border-[#E6DEC8] space-y-2 text-xs sm:text-sm text-[#4A5550]">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-semibold text-[#143627]">₹{selectedOrderForDetails.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5% Restaurant Food Tax)</span>
              <span className="font-semibold text-[#143627]">₹{selectedOrderForDetails.tax}</span>
            </div>
            {selectedOrderForDetails.orderType === 'delivery' && (
              <div className="flex justify-between">
                <span>Ludhiana Express Delivery & Eco Packaging</span>
                <span className="font-semibold text-[#143627]">₹{selectedOrderForDetails.deliveryFee}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-3 border-t border-[#E6DEC8] text-base font-extrabold text-[#143627]">
              <div>
                <span>Grand Total Paid</span>
                <span className="text-xs font-normal text-[#65736C] block">
                  via {selectedOrderForDetails.paymentMethod} · Payment {selectedOrderForDetails.paymentStatus}
                </span>
              </div>
              <span className="text-xl font-extrabold text-[#235D43]">
                ₹{selectedOrderForDetails.grandTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Diner & Delivery Destination Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#E6DEC8] p-5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D58]">
              Recipient Details
            </span>
            <h4 className="font-bold text-sm text-[#143627]">
              {selectedOrderForDetails.customerDetails.name}
            </h4>
            <p className="text-xs text-[#65736C]">
              Phone: <strong>{selectedOrderForDetails.customerDetails.phone}</strong>
            </p>
            <div className="pt-2">
              <a
                href={`tel:${selectedOrderForDetails.customerDetails.phone}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#235D43] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Contact Number</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DEC8] p-5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
              {selectedOrderForDetails.orderType === 'delivery'
                ? 'Delivery Address'
                : selectedOrderForDetails.orderType === 'dine-in'
                ? 'Table Location'
                : 'Pickup Point'}
            </span>
            <p className="font-bold text-xs text-[#143627]">
              {destinationAddress}
            </p>
            {selectedOrderForDetails.customerDetails.notes && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg">
                <strong>Notes:</strong> {selectedOrderForDetails.customerDetails.notes}
              </p>
            )}
            <div className="pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D58] hover:underline"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Open in Google Maps Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT LIST VIEW: Active & Previous Orders
  return (
    <div id="orders-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143627] font-cinzel">
            My Orders
          </h1>
          <p className="text-xs text-[#65736C]">
            Track live food preparation stages and reorder your past favorites
          </p>
        </div>

        {currentUser ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Saved in Firebase for <strong>{userProfile?.name || currentUser.displayName}</strong></span>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E6DEC8] hover:bg-[#FAF7F2] text-xs font-bold text-[#143627] transition-all shadow-2xs"
          >
            <span>Sign In to save orders separately</span>
          </button>
        )}
      </div>

      {/* Featured Live Tracker for Active Orders */}
      {activeOrders.length > 0 && activeTab === 'active' && (
        <div className="space-y-3">
          <OrderTrackingComponent
            order={activeOrders[0]}
            allowSimulate={true}
            showLocationTracker={true}
          />
        </div>
      )}

      {/* Tabs: Active | Previous */}
      <div className="flex border-b border-[#E6DEC8]">
        <button
          id="orders-tab-active"
          onClick={() => setActiveOrderTab('active')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'active'
              ? 'border-[#235D43] text-[#143627]'
              : 'border-transparent text-[#65736C] hover:text-[#143627]'
          }`}
        >
          <span>Active Orders</span>
          {activeOrders.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#235D43] text-white text-[11px]">
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          id="orders-tab-previous"
          onClick={() => setActiveOrderTab('previous')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'previous'
              ? 'border-[#235D43] text-[#143627]'
              : 'border-transparent text-[#65736C] hover:text-[#143627]'
          }`}
        >
          <span>Previous Orders</span>
          {previousOrders.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#EAE2D3] text-[#143627] text-[11px]">
              {previousOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E6DEC8] shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#65736C] flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#143627]">
            No {activeTab === 'active' ? 'active' : 'previous'} orders
          </h3>
          <p className="text-xs text-[#65736C] mt-1 max-w-xs mx-auto">
            {activeTab === 'active'
              ? 'Your active orders will show live status and stage progress here.'
              : 'Past fulfilled orders will be listed here for quick 1-tap reordering.'}
          </p>
          <button
            onClick={() => setActiveTab('menu')}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#65736C] pt-2">
            {activeTab === 'active' ? 'Active Order History' : 'Past Order Receipts'}
          </h3>
          {displayedOrders.map((order) => (
            <div
              key={order.id}
              id={`order-card-${order.orderNumber}`}
              className="p-5 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs space-y-4 hover:border-[#2E7D58] transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6DEC8] pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-[#143627]">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-[#65736C]">{order.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#65736C] capitalize font-medium">
                    {order.orderType}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 text-xs sm:text-sm">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[#2C3B34]">
                    <span>
                      {item.quantity} × {item.menuItem.name}
                    </span>
                    <span className="font-semibold text-[#143627]">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Amount & Actions */}
              <div className="pt-3 border-t border-[#E6DEC8] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-[#65736C]">Grand Total:</span>
                  <span className="text-base font-extrabold text-[#235D43] ml-1.5">
                    ₹{order.grandTotal}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => setSelectedOrderForDetailsId(order.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#E2F4EA] text-[#235D43] hover:bg-[#235D43] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Track Stage</span>
                    </button>
                  )}

                  <button
                    id={`view-order-details-${order.orderNumber}`}
                    onClick={() => setSelectedOrderForDetailsId(order.id)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DEC8] hover:bg-[#EAE2D3] text-[#143627] text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Order Details</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#2E7D58]" />
                  </button>

                  <button
                    id={`reorder-btn-${order.orderNumber}`}
                    onClick={() => reorder(order)}
                    className="px-4 py-2 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#C69234]" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
