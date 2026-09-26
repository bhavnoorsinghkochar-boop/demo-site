import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Truck,
  ShoppingBag,
  UtensilsCrossed,
  CheckCircle,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { OrderType } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartGrandTotal,
    cartSubtotal,
    cartTax,
    restaurantSettings,
    placeOrder,
    currentUser,
    userProfile,
    setIsAuthModalOpen,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Customer Details Form (prefills from authenticated profile if available)
  const [name, setName] = useState<string>(() => userProfile?.name || currentUser?.displayName || '');
  const [phone, setPhone] = useState<string>(() => userProfile?.phone || '');
  const [address, setAddress] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');

  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash' | 'Pay at Counter'>('UPI');
  const [formError, setFormError] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const handleNextStep = () => {
    setFormError('');
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!name.trim()) {
        setFormError('Please enter your full name');
        return;
      }
      if (!phone.trim()) {
        setFormError('Please provide a contact phone number');
        return;
      }
      if (orderType === 'delivery' && !address.trim()) {
        setFormError('Please provide your complete delivery address in Ludhiana');
        return;
      }
      setStep(3);
    }
  };

  const handlePlaceOrder = () => {
    placeOrder(
      orderType,
      {
        name,
        phone,
        address: orderType === 'delivery' ? address : undefined,
        tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
        notes: instructions,
      },
      paymentMethod
    );
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsCheckoutOpen(false)}
    >
      <div
        id="checkout-modal-card"
        className="bg-white rounded-3xl overflow-hidden max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E6DEC8] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#143627] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C69234]">
              Step {step} of 3
            </span>
            <h2 className="text-xl font-bold font-cinzel">
              {step === 1 && 'Select Order Type'}
              {step === 2 && 'Customer & Contact Details'}
              {step === 3 && 'Payment Method'}
            </h2>
          </div>

          <button
            id="close-checkout-btn"
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-3 bg-[#EAE2D3] h-1.5 shrink-0">
          <div className="bg-[#2E7D58]" />
          <div className={step >= 2 ? 'bg-[#2E7D58]' : 'bg-transparent'} />
          <div className={step === 3 ? 'bg-[#2E7D58]' : 'bg-transparent'} />
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          {/* STEP 1: Order Type */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-[#65736C]">
                How would you like to enjoy your order from {restaurantSettings.name}, Rajguru Nagar?
              </p>

              {/* Delivery */}
              <button
                id="order-type-delivery"
                onClick={() => setOrderType('delivery')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  orderType === 'delivery'
                    ? 'border-[#2E7D58] bg-[#E2F4EA] text-[#143627] shadow-xs'
                    : 'border-[#E6DEC8] bg-[#FAF7F2] text-[#2C3B34] hover:bg-[#EAE2D3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2E7D58] shadow-xs">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Doorstep Delivery</h4>
                    <p className="text-xs text-[#65736C]">
                      Delivered hot to your location in Ludhiana (~30 mins)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#235D43]">
                    ₹{restaurantSettings.deliveryFee}
                  </span>
                </div>
              </button>

              {/* Takeaway */}
              <button
                id="order-type-takeaway"
                onClick={() => setOrderType('takeaway')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  orderType === 'takeaway'
                    ? 'border-[#2E7D58] bg-[#E2F4EA] text-[#143627] shadow-xs'
                    : 'border-[#E6DEC8] bg-[#FAF7F2] text-[#2C3B34] hover:bg-[#EAE2D3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#C69234] shadow-xs">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Takeaway / Pickup</h4>
                    <p className="text-xs text-[#65736C]">
                      Pick up directly from Booth No.20, Rajguru Nagar counter
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">FREE</span>
              </button>

              {/* Dine-In */}
              <button
                id="order-type-dine-in"
                onClick={() => setOrderType('dine-in')}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  orderType === 'dine-in'
                    ? 'border-[#2E7D58] bg-[#E2F4EA] text-[#143627] shadow-xs'
                    : 'border-[#E6DEC8] bg-[#FAF7F2] text-[#2C3B34] hover:bg-[#EAE2D3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2563EB] shadow-xs">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Dine-In at Restaurant</h4>
                    <p className="text-xs text-[#65736C]">
                      Served fresh to your table at Rajguru Nagar store
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">No Extra Fee</span>
              </button>
            </div>
          )}

          {/* STEP 2: Customer Details */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Account sync badge */}
              {currentUser ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-emerald-950 font-medium">
                      Ordering as <strong>{userProfile?.name || currentUser.displayName}</strong> (Saved to your account)
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Firestore Sync
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC8] flex items-center justify-between text-xs">
                  <span className="text-[#65736C]">
                    Ordering as guest. Have an account?
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="font-bold text-[#143627] hover:underline"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
                  Full Name *
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-sm focus:outline-none focus:border-[#235D43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
                  Phone Number (for order status SMS/Call) *
                </label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-sm focus:outline-none focus:border-[#235D43]"
                  required
                />
              </div>

              {orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
                    Delivery Address in {restaurantSettings.location} *
                  </label>
                  <textarea
                    id="checkout-address-input"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={`House/Flat No., Street, Landmark, ${restaurantSettings.location}`}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-sm focus:outline-none focus:border-[#235D43]"
                    required
                  />
                </div>
              )}

              {orderType === 'dine-in' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
                    Table Number
                  </label>
                  <input
                    id="checkout-table-input"
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 6"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-sm focus:outline-none focus:border-[#235D43]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1">
                  Order Note / Landmark (Optional)
                </label>
                <input
                  id="checkout-notes-input"
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Near mall parking entrance, ring bell..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-sm focus:outline-none focus:border-[#235D43]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-[#65736C]">
                Select your preferred payment method:
              </p>

              <div className="space-y-2.5">
                {/* UPI Option */}
                <button
                  id="pay-method-upi"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#2E7D58] bg-[#E2F4EA] text-[#143627] shadow-xs'
                      : 'border-[#E6DEC8] bg-[#FAF7F2] text-[#2C3B34]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#2E7D58]" />
                    <div>
                      <h4 className="font-bold text-sm">UPI / QR Code</h4>
                      <p className="text-[11px] text-[#65736C]">
                        Google Pay, PhonePe, Paytm, BHIM UPI
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'UPI' && (
                    <CheckCircle className="w-5 h-5 text-[#2E7D58]" />
                  )}
                </button>

                {/* Cards Option */}
                <button
                  id="pay-method-card"
                  onClick={() => setPaymentMethod('Card')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-[#2E7D58] bg-[#E2F4EA] text-[#143627] shadow-xs'
                      : 'border-[#E6DEC8] bg-[#FAF7F2] text-[#2C3B34]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#2E7D58]" />
                    <div>
                      <h4 className="font-bold text-sm">Credit / Debit Card</h4>
                      <p className="text-[11px] text-[#65736C]">
                        Visa, Mastercard, RuPay
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'Card' && (
                    <CheckCircle className="w-5 h-5 text-[#2E7D58]" />
                  )}
                </button>

                {/* Cash on Delivery / Pay at Counter */}
                <button
                  id="pay-method-cash"
                  onClick={() => setPaymentMethod('Cash')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    paymentMethod === 'Cash'
                      ? 'border-[#2E7D58] bg-[#E2F4EA] text-[#143627] shadow-xs'
                      : 'border-[#E6DEC8] bg-[#FAF7F2] text-[#2C3B34]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-[#2E7D58]" />
                    <div>
                      <h4 className="font-bold text-sm">
                        {orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter'}
                      </h4>
                      <p className="text-[11px] text-[#65736C]">
                        Pay directly upon delivery or pickup
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'Cash' && (
                    <CheckCircle className="w-5 h-5 text-[#2E7D58]" />
                  )}
                </button>
              </div>

              {/* Order total recap */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC8] text-xs space-y-1">
                <div className="flex justify-between text-[#65736C]">
                  <span>Order Type:</span>
                  <span className="font-bold text-[#143627] capitalize">{orderType}</span>
                </div>
                <div className="flex justify-between text-[#65736C]">
                  <span>Amount to Pay:</span>
                  <span className="font-bold text-[#235D43] text-sm">₹{cartGrandTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E6DEC8] flex items-center justify-between gap-3 shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2.5 rounded-xl border border-[#E6DEC8] bg-white text-xs font-bold text-[#2C3B34] hover:bg-[#EAE2D3] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-[#E6DEC8] bg-white text-xs font-bold text-[#65736C] hover:bg-[#EAE2D3]"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              id="checkout-next-btn"
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5 ml-auto"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="checkout-place-order-btn"
              onClick={handlePlaceOrder}
              className="px-6 py-3 rounded-xl bg-[#C69234] hover:bg-[#d8a342] text-white font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-95 flex items-center gap-2 ml-auto"
            >
              <span>Place Order</span>
              <span>·</span>
              <span>₹{cartGrandTotal}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
