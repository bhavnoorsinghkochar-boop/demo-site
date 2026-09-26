import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { CartCustomizationSelection } from '../types';

export const FoodDetailModal: React.FC = () => {
  const {
    selectedDishForDetail,
    setSelectedDishForDetail,
    addToCart,
    toggleFavourite,
    isFavourite,
  } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    CartCustomizationSelection[]
  >([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);

  // Initialize defaults whenever dish changes
  useEffect(() => {
    if (selectedDishForDetail) {
      setQuantity(1);
      setSpecialInstructions('');
      setIsAddedSuccess(false);

      // Default required customizations (like Pizza medium size or Cream soup choice)
      const initialCustoms: CartCustomizationSelection[] = [];
      if (selectedDishForDetail.customizations) {
        selectedDishForDetail.customizations.forEach((group) => {
          if (group.required && group.options.length > 0) {
            initialCustoms.push({
              groupName: group.name,
              optionName: group.options[0].name,
              priceDelta: group.options[0].priceDelta,
            });
          }
        });
      }
      setSelectedCustomizations(initialCustoms);
    }
  }, [selectedDishForDetail]);

  if (!selectedDishForDetail) return null;

  const dish = selectedDishForDetail;

  // Calculate dynamic price
  const deltaTotal = selectedCustomizations.reduce((acc, c) => acc + c.priceDelta, 0);
  const unitPrice = dish.price + deltaTotal;
  const totalPrice = unitPrice * quantity;

  const handleOptionToggle = (
    groupName: string,
    optionName: string,
    priceDelta: number,
    required: boolean
  ) => {
    setSelectedCustomizations((prev) => {
      const existingInGroup = prev.find((c) => c.groupName === groupName);

      if (required) {
        // Replace selection in this required group
        const withoutGroup = prev.filter((c) => c.groupName !== groupName);
        return [...withoutGroup, { groupName, optionName, priceDelta }];
      } else {
        // Optional toggle
        if (existingInGroup && existingInGroup.optionName === optionName) {
          return prev.filter((c) => !(c.groupName === groupName && c.optionName === optionName));
        } else {
          const withoutGroup = prev.filter((c) => c.groupName !== groupName);
          return [...withoutGroup, { groupName, optionName, priceDelta }];
        }
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(dish, quantity, selectedCustomizations, specialInstructions);
    setIsAddedSuccess(true);
    setTimeout(() => {
      setSelectedDishForDetail(null);
    }, 700);
  };

  return (
    <div
      id="food-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setSelectedDishForDetail(null)}
    >
      <div
        id="food-detail-modal-content"
        className="bg-white rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E6DEC8] relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-food-detail-btn"
          onClick={() => setSelectedDishForDetail(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clean Text Header (No Photo) */}
        <div className="bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white p-5 sm:p-6 shrink-0 relative">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-full text-xs font-bold text-[#143627] shadow-sm">
                {dish.vegetarian ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-sm flex items-center justify-center p-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </span>
                    <span className="text-emerald-800">Veg</span>
                  </>
                ) : (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-rose-600 rounded-sm flex items-center justify-center p-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    </span>
                    <span className="text-rose-700">Non-Veg</span>
                  </>
                )}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs text-white font-medium">
                {dish.category}
              </span>
            </div>

            <div className="flex items-center gap-2 mr-8">
              {/* Favourite toggle */}
              <button
                id="food-detail-fav-btn"
                onClick={() => toggleFavourite(dish.id)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform active:scale-90"
                title="Save Favourite"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavourite(dish.id) ? 'fill-white text-white' : 'text-white'
                  }`}
                />
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {dish.name}
          </h2>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Price & Description */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#235D43]">₹</span>
              <span className="text-3xl font-extrabold text-[#143627]">
                {unitPrice}
              </span>
              {deltaTotal > 0 && (
                <span className="text-xs text-[#65736C]">
                  (Base ₹{dish.price} + ₹{deltaTotal} options)
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-[#4A5550] leading-relaxed">
              {dish.description}
            </p>

            {dish.pageNumber && (
              <p className="mt-1 text-[11px] text-[#65736C]">
                Official Menu · Laa Mamma Mia! Taste Of Singapore
              </p>
            )}
          </div>

          {/* Customization Options */}
          {Array.isArray(dish.customizations) && dish.customizations.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-[#E6DEC8]">
              {dish.customizations.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#143627]">
                      {group.name}
                    </span>
                    <span className="text-[11px] text-[#65736C]">
                      {group.required ? 'Required (Select 1)' : 'Optional'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.isArray(group.options) && group.options.map((opt) => {
                      const isSelected = selectedCustomizations.some(
                        (c) => c.groupName === group.name && c.optionName === opt.name
                      );
                      return (
                        <button
                          key={opt.id}
                          id={`custom-opt-${opt.id}`}
                          onClick={() =>
                            handleOptionToggle(
                              group.name,
                              opt.name,
                              opt.priceDelta,
                              group.required
                            )
                          }
                          className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-[#E2F4EA] border-[#2E7D58] text-[#143627] font-bold shadow-xs'
                              : 'bg-[#FAF7F2] border-[#E6DEC8] text-[#2C3B34] hover:bg-[#EAE2D3]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? 'border-[#2E7D58] bg-[#2E7D58] text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span>{opt.name}</span>
                          </div>
                          {opt.priceDelta > 0 ? (
                            <span className="text-emerald-700 font-semibold">
                              +₹{opt.priceDelta}
                            </span>
                          ) : (
                            <span className="text-gray-400">Included</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cooking Instructions / Notes */}
          <div className="pt-2 border-t border-[#E6DEC8]">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#143627] mb-1.5">
              Special Instructions (Optional)
            </label>
            <input
              id="dish-special-instructions"
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less spicy, extra coconut chutney, crispy roast..."
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#235D43]"
            />
          </div>
        </div>

        {/* Modal Sticky Footer with Quantity Selector and Add to Cart */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E6DEC8] flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Controls [-] 1 [+] */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-[#E6DEC8] shadow-xs">
            <button
              id="food-detail-qty-minus"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:bg-[#EAE2D3] active:scale-90 transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-extrabold text-sm sm:text-base text-[#143627]">
              {quantity}
            </span>
            <button
              id="food-detail-qty-plus"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-700 hover:bg-[#EAE2D3] active:scale-90 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            id="food-detail-add-cart-btn"
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-5 rounded-2xl font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 ${
              isAddedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#143627] hover:bg-[#235D43] text-white active:scale-98'
            }`}
          >
            {isAddedSuccess ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added to cart ✓</span>
              </>
            ) : (
              <>
                <span>Add to Cart</span>
                <span>·</span>
                <span>₹{totalPrice}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
