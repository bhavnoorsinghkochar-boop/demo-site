import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  SlidersHorizontal,
  Plus,
  Heart,
  Sparkles,
  Coffee,
  UtensilsCrossed,
  Filter,
} from 'lucide-react';
import { MenuItem, MenuCategoryType } from '../types';

export const MenuView: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    selectedMenuType,
    setSelectedMenuType,
    searchQuery,
    setSearchQuery,
    setSelectedDishForDetail,
    addToCart,
    toggleFavourite,
    isFavourite,
  } = useApp();

  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [onlySpecials, setOnlySpecials] = useState<boolean>(false);

  // Derive available categories for the active menuType (Food vs Beverage)
  const availableCategories = useMemo(() => {
    const items = (menuItems || []).filter((i) => i.menuType === selectedMenuType);
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ['All', ...cats];
  }, [menuItems, selectedMenuType]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    let result = menuItems.filter((item) => {
      // 1. Menu Type Filter
      if (item.menuType !== selectedMenuType) {
        return false;
      }
      // 2. Category Filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // 3. Specials only
      if (onlySpecials && !item.isSpecial) {
        return false;
      }
      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        return matchName || matchCat || matchDesc;
      }
      return true;
    });

    // Sort by price
    if (priceSort === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [menuItems, selectedMenuType, selectedCategory, searchQuery, onlySpecials, priceSort]);

  return (
    <div id="menu-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🇸🇬</span>
            <span className="text-xs uppercase font-bold tracking-widest text-[#DC2626]">
              Taste Of Singapore · Desserts & Burgers
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#143627] font-cinzel mt-1">
            Our Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#65736C] mt-1">
            Handcrafted churros, bubble waffles, signature burgers, Asian bowls, and refreshing sodas
          </p>
        </div>

        {/* Food vs Beverage Main Tabs (Reflecting 9 Pages Food / 2 Pages Beverage) */}
        <div className="flex p-1 bg-[#EAE2D3] rounded-2xl self-start md:self-auto border border-[#DDD2BE]">
          <button
            id="tab-food-menu"
            onClick={() => {
              setSelectedMenuType('food');
              setSelectedCategory('All');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              selectedMenuType === 'food'
                ? 'bg-[#143627] text-white shadow-md'
                : 'text-[#2C3B34] hover:text-[#143627]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Food Menu (9 Pages)</span>
          </button>

          <button
            id="tab-beverage-menu"
            onClick={() => {
              setSelectedMenuType('beverage');
              setSelectedCategory('All');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              selectedMenuType === 'beverage'
                ? 'bg-[#143627] text-white shadow-md'
                : 'text-[#2C3B34] hover:text-[#143627]'
            }`}
          >
            <Coffee className="w-4 h-4 text-[#C69234]" />
            <span>Beverages (2 Pages)</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Filters Row */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="menu-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks and more..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl text-sm focus:outline-none focus:border-[#235D43] transition-colors"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Toggles */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Specials button */}
            <button
              id="filter-specials-btn"
              onClick={() => setOnlySpecials(!onlySpecials)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                onlySpecials
                  ? 'bg-[#FAF0DC] text-[#9A6B1A] border-[#C69234]'
                  : 'bg-[#FAF7F2] text-[#65736C] border-[#E6DEC8] hover:border-gray-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C69234]" />
              <span>Chef's Specials</span>
            </button>

            {/* Price Sort */}
            <button
              id="filter-price-sort-btn"
              onClick={() => {
                if (priceSort === 'none') setPriceSort('asc');
                else if (priceSort === 'asc') setPriceSort('desc');
                else setPriceSort('none');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                priceSort !== 'none'
                  ? 'bg-[#E2F4EA] text-[#143627] border-[#2E7D58]'
                  : 'bg-[#FAF7F2] text-[#65736C] border-[#E6DEC8] hover:border-gray-400'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                {priceSort === 'none'
                  ? 'Price'
                  : priceSort === 'asc'
                  ? 'Price: Low to High'
                  : 'Price: High to Low'}
              </span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal scrolling) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#143627] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#2C3B34] border border-[#E6DEC8] hover:bg-[#EAE2D3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search results counter */}
      <div className="flex items-center justify-between text-xs text-[#65736C] px-1">
        <span>
          Showing <strong>{filteredDishes.length}</strong> items in{' '}
          <span className="text-[#143627] font-semibold">
            {selectedMenuType === 'food' ? 'Food Menu' : 'Beverages'}
          </span>
          {selectedCategory !== 'All' && ` · ${selectedCategory}`}
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#235D43] font-bold hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Dish List or Empty State */}
      {filteredDishes.length === 0 ? (
        <div
          id="menu-empty-state"
          className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E6DEC8] shadow-xs"
        >
          <div className="w-16 h-16 rounded-full bg-[#FAF0DC] text-[#C69234] flex items-center justify-center mx-auto text-3xl mb-4">
            🍽️
          </div>
          <h3 className="text-xl font-bold text-[#143627]">No dishes found</h3>
          <p className="text-sm text-[#65736C] mt-2 max-w-sm mx-auto">
            Try searching for another dish or category, or clear your active filters.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOnlySpecials(false);
                setPriceSort('none');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#143627] text-white text-xs font-bold hover:bg-[#235D43] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              id={`food-card-${dish.id}`}
              className="bg-white rounded-2xl border border-[#E6DEC8] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#DC2626]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header row: Veg/Non-Veg icon, Category, and Heart */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {/* Authentic Veg / Non-Veg dot badge */}
                    <span
                      title={dish.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                      className={`w-4 h-4 border-2 rounded-xs flex items-center justify-center p-0.5 shrink-0 ${
                        dish.vegetarian ? 'border-emerald-600' : 'border-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dish.vegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#65736C]">
                      {dish.category}
                    </span>

                    {dish.isSpecial && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase tracking-wide">
                        Special
                      </span>
                    )}
                  </div>

                  <button
                    id={`card-fav-btn-${dish.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(dish.id);
                    }}
                    className="p-1 rounded-full text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Toggle Favourite"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavourite(dish.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Dish Name */}
                <h3
                  onClick={() => setSelectedDishForDetail(dish)}
                  className="font-black text-[#143627] text-base sm:text-lg group-hover:text-[#DC2626] transition-colors leading-snug cursor-pointer uppercase tracking-tight"
                >
                  {dish.name}
                </h3>

                {/* Dish Description */}
                <p className="mt-1 text-xs text-[#65736C] leading-relaxed">
                  {dish.description}
                </p>
              </div>

              {/* Bottom Row: Price & Action */}
              <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-xs font-bold text-[#DC2626]">₹</span>
                    <span className="text-xl font-black text-[#143627] ml-0.5">
                      {dish.price}
                    </span>
                  </div>
                  {dish.customizations && dish.customizations.length > 0 && (
                    <span className="block text-[10px] font-bold text-[#2E7D58]">
                      Customizable
                    </span>
                  )}
                </div>

                <button
                  id={`menu-add-btn-${dish.id}`}
                  onClick={() => {
                    if (dish.customizations && dish.customizations.length > 0) {
                      setSelectedDishForDetail(dish);
                    } else {
                      addToCart(dish, 1);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
