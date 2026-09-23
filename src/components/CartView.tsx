import React from 'react';
import { useApp } from '../context/AppContext';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTax,
    cartDeliveryFee,
    cartGrandTotal,
    setActiveTab,
    setIsCheckoutOpen,
    restaurantSettings,
    currentUser,
    userProfile,
    setIsAuthModalOpen,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div id="cart-view-empty" className="max-w-2xl mx-auto px-4 py-20 text-center pb-24">
        <div className="w-20 h-20 rounded-full bg-[#EAE2D3] text-[#235D43] flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#143627] font-cinzel">
          Your Cart is Empty
        </h2>
        <p className="mt-2 text-sm text-[#65736C] max-w-sm mx-auto">
          Explore Madras Leaf's delicious 100% pure veg multi-cuisine menu and add your favourite dishes.
        </p>
        <button
          id="cart-explore-menu-btn"
          onClick={() => setActiveTab('menu')}
          className="mt-6 px-6 py-3 rounded-2xl bg-[#143627] hover:bg-[#235D43] text-white font-bold text-sm shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
        >
          <span>Explore Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div id="cart-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DEC8] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143627] font-cinzel">
            Your Cart
          </h1>
          <p className="text-xs text-[#65736C]">
            {cart.length} item{cart.length > 1 ? 's' : ''} from Madras Leaf, Wave Mall
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              <span>Sign In to save cart</span>
            </button>
          )}

          <button
            id="clear-cart-btn"
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-3">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              id={`cart-item-${item.cartItemId}`}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs flex items-center justify-between gap-3"
            >
              {/* Thumbnail */}
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
              />

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-emerald-600 rounded-sm flex items-center justify-center p-0.5 shrink-0">
                    <span className="w-1 h-1 rounded-full bg-emerald-600" />
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-[#143627] truncate">
                    {item.menuItem.name}
                  </h3>
                </div>

                {/* Customizations tags */}
                {item.selectedCustomizations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.selectedCustomizations.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#E2F4EA] text-[#143627] px-2 py-0.5 rounded-md font-medium"
                      >
                        {c.groupName}: {c.optionName} {c.priceDelta > 0 && `(+₹${c.priceDelta})`}
                      </span>
                    ))}
                  </div>
                )}

                {item.specialInstructions && (
                  <p className="text-[11px] text-gray-500 italic mt-0.5 truncate">
                    Note: "{item.specialInstructions}"
                  </p>
                )}

                <div className="mt-2 text-xs font-semibold text-[#143627]">
                  ₹{item.unitPrice} each
                </div>
              </div>

              {/* Quantity Controls [-] 1 [+] and Total */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-extrabold text-sm sm:text-base text-[#143627]">
                  ₹{item.totalPrice}
                </span>

                <div className="flex items-center gap-2 bg-[#FAF7F2] px-2 py-1 rounded-xl border border-[#E6DEC8]">
                  <button
                    id={`cart-qty-minus-${item.cartItemId}`}
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 hover:bg-[#EAE2D3]"
                  >
                    {item.quantity === 1 ? (
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                  </button>
                  <span className="text-xs font-bold w-4 text-center text-[#143627]">
                    {item.quantity}
                  </span>
                  <button
                    id={`cart-qty-plus-${item.cartItemId}`}
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 hover:bg-[#EAE2D3]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add more items link */}
          <button
            onClick={() => setActiveTab('menu')}
            className="w-full py-3 rounded-xl border border-dashed border-[#235D43] text-[#235D43] hover:bg-[#E2F4EA]/50 font-bold text-xs transition-colors"
          >
            + Add more dishes from menu
          </button>
        </div>

        {/* Bill Summary & Proceed Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E6DEC8] shadow-xs space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#143627] border-b border-[#E6DEC8] pb-3">
              Bill Summary
            </h3>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-[#4A5550]">
                <span>Item Total</span>
                <span className="font-semibold text-[#143627]">₹{cartSubtotal}</span>
              </div>

              <div className="flex justify-between text-[#4A5550]">
                <span>Taxes & GST ({restaurantSettings.taxPercent}%)</span>
                <span className="font-semibold text-[#143627]">₹{cartTax}</span>
              </div>

              <div className="flex justify-between text-[#4A5550]">
                <span>Estimated Delivery / Packaging</span>
                <span className="font-semibold text-[#143627]">
                  {cartDeliveryFee > 0 ? `₹${cartDeliveryFee}` : 'FREE'}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E6DEC8] flex justify-between text-base font-extrabold text-[#143627]">
                <span>Grand Total</span>
                <span className="text-xl text-[#235D43]">₹{cartGrandTotal}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC8] flex items-center gap-2 text-[11px] text-[#65736C]">
              <ShieldCheck className="w-4 h-4 text-[#2E7D58] shrink-0" />
              <span>100% Pure Veg Kitchen · Prepared fresh upon ordering</span>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#143627] hover:bg-[#235D43] text-white font-bold text-sm sm:text-base shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#C69234]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
