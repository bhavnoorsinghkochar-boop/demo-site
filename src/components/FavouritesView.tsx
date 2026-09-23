import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Plus, ArrowRight, Trash2 } from 'lucide-react';

export const FavouritesView: React.FC = () => {
  const {
    favourites,
    menuItems,
    toggleFavourite,
    addToCart,
    setSelectedDishForDetail,
    setActiveTab,
    currentUser,
    userProfile,
    setIsAuthModalOpen,
  } = useApp();

  const favDishes = menuItems.filter((m) => favourites.includes(m.id));

  if (favDishes.length === 0) {
    return (
      <div id="favourites-empty" className="max-w-2xl mx-auto px-4 py-20 text-center pb-24">
        <div className="w-18 h-18 rounded-full bg-[#FAF0DC] text-[#C69234] flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Heart className="w-9 h-9 stroke-[1.8]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#143627] font-cinzel">
          No Favourites Saved Yet
        </h2>
        <p className="mt-2 text-sm text-[#65736C] max-w-sm mx-auto">
          Your favourite dishes will appear here. Tap the heart icon on any dish in the menu to save it for quick reordering.
        </p>
        <button
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
    <div id="favourites-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143627] font-cinzel">
            My Favourites
          </h1>
          <p className="text-xs text-[#65736C]">
            {favDishes.length} saved dish{favDishes.length > 1 ? 'es' : ''} ready to order
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
            <span>Sign In to save across devices</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {favDishes.map((dish) => (
          <div
            key={dish.id}
            id={`fav-card-${dish.id}`}
            className="bg-white rounded-2xl border border-[#E6DEC8] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div
              className="relative h-44 sm:h-48 overflow-hidden cursor-pointer"
              onClick={() => setSelectedDishForDetail(dish)}
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-[#143627] shadow-sm">
                <span className="w-3 h-3 border-2 border-emerald-600 rounded-sm flex items-center justify-center p-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-600" />
                </span>
                <span>Pure Veg</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavourite(dish.id);
                }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-md"
                title="Remove from Favourites"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div
                className="cursor-pointer"
                onClick={() => setSelectedDishForDetail(dish)}
              >
                <h3 className="font-bold text-[#143627] text-sm sm:text-base group-hover:text-[#235D43] transition-colors leading-snug">
                  {dish.name}
                </h3>
                <p className="mt-1 text-xs text-[#65736C] line-clamp-2">
                  {dish.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#65736C]">₹</span>
                  <span className="text-lg font-extrabold text-[#143627] ml-0.5">
                    {dish.price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (dish.customizations && dish.customizations.length > 0) {
                      setSelectedDishForDetail(dish);
                    } else {
                      addToCart(dish, 1);
                    }
                  }}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C69234]" />
                  <span>+ Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
