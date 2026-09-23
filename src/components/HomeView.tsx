import React from 'react';
import { useApp } from '../context/AppContext';
import { isRestaurantOpen, CUISINES_LIST } from '../data/restaurantData';
import {
  Utensils,
  BookOpen,
  MapPin,
  Phone,
  Sparkles,
  ChevronRight,
  Star,
  Plus,
  Heart,
  Clock,
  Check,
  Percent,
  Activity,
} from 'lucide-react';
import { MenuItem } from '../types';
import { OrderTrackingComponent } from './OrderTrackingComponent';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    setSelectedCategory,
    setSelectedMenuType,
    menuItems,
    addToCart,
    setSelectedDishForDetail,
    toggleFavourite,
    isFavourite,
    restaurantSettings,
    orders,
  } = useApp();

  const { isOpen, message: openMessage } = isRestaurantOpen();

  const activeOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );

  // Featured items selected from our authentic menu catalog
  const featuredDishes: MenuItem[] = menuItems.filter((i) => i.isSpecial).slice(0, 8);

  const categoryImages: Record<string, string> = {
    'South Indian':
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80',
    'North Indian':
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
    Chinese:
      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=80',
    'Fast Food':
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80',
    Biryani:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    Cafe:
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80',
    Coffee:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    Shakes:
      'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&auto=format&fit=crop&q=80',
  };

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    if (catName === 'Coffee' || catName === 'Shakes') {
      setSelectedMenuType('beverage');
    } else {
      setSelectedMenuType('food');
    }
    setActiveTab('menu');
  };

  return (
    <div id="home-view" className="space-y-10 sm:space-y-14 pb-12">
      {/* Top Location & Open Status Banner */}
      <section className="bg-white/80 border-b border-[#E6DEC8] py-3 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#2C3B34]">
            <MapPin className="w-4 h-4 text-[#2E7D58] shrink-0" />
            <span className="font-semibold text-[#143627]">
              {restaurantSettings.name}
            </span>
            <span className="text-[#65736C]">
              — {restaurantSettings.location}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isOpen
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpen ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'
                }`}
              />
              {openMessage}
            </span>
          </div>
        </div>
      </section>

      {/* Active Order Live Tracker (if diner has orders in progress) */}
      {activeOrders.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#143627]">
                  Active Kitchen Order in Progress
                </span>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-[#235D43] hover:text-[#143627] underline flex items-center gap-1"
              >
                <span>All Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <OrderTrackingComponent
              order={activeOrders[0]}
              allowSimulate={true}
              showLocationTracker={true}
            />
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#143627] via-[#1B4D36] to-[#2E7D58] text-white">
          {/* Subtle Background Pattern & Image */}
          <div className="absolute inset-0 mix-blend-overlay opacity-35 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1600&auto=format&fit=crop&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#143627]/95 via-[#143627]/60 to-transparent" />

          <div className="relative z-10 px-6 sm:px-12 py-12 sm:py-18 md:py-24 max-w-3xl">
            {/* 100% Pure Veg badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-emerald-200 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              100% PURE VEGETARIAN · MULTI CUISINE
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
              Taste Something Special
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-emerald-100/90 font-normal leading-relaxed">
              South Indian favourites, North Indian classics, Chinese dishes, fast food, biryani, coffee and refreshing beverages.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                id="hero-order-now-btn"
                onClick={() => setActiveTab('menu')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-[#C69234] hover:bg-[#d8a342] text-white font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Order Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                id="hero-view-menu-btn"
                onClick={() => setActiveTab('menu')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold text-sm sm:text-base transition-all active:scale-95"
              >
                View Menu
              </button>
            </div>

            {/* Quick Ratings Badge from provided data */}
            <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-emerald-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-md text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{restaurantSettings.diningRating}</span>
                </div>
                <span>Dining Rating ({restaurantSettings.diningRatingCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-md text-emerald-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{restaurantSettings.deliveryRating}</span>
                </div>
                <span>Delivery Rating ({restaurantSettings.deliveryRatingCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Quick Actions (4 Action Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {/* Card 1: Order Food */}
          <button
            id="quick-action-order"
            onClick={() => setActiveTab('menu')}
            className="flex flex-col items-start p-4 sm:p-5 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs hover:shadow-md hover:border-[#235D43] transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E2F4EA] text-[#235D43] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🍽️
            </div>
            <h2 className="mt-3.5 font-bold text-[#143627] text-base sm:text-lg">
              Order Food
            </h2>
            <p className="text-xs text-[#65736C] mt-1">
              Fresh & hot delivery, takeaway, or dine-in
            </p>
          </button>

          {/* Card 2: View Menu */}
          <button
            id="quick-action-menu"
            onClick={() => setActiveTab('menu')}
            className="flex flex-col items-start p-4 sm:p-5 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs hover:shadow-md hover:border-[#235D43] transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FAF0DC] text-[#C69234] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📖
            </div>
            <h2 className="mt-3.5 font-bold text-[#143627] text-base sm:text-lg">
              View Menu
            </h2>
            <p className="text-xs text-[#65736C] mt-1">
              Explore 9-page food & 2-page beverage menu
            </p>
          </button>

          {/* Card 3: Get Directions */}
          <button
            id="quick-action-directions"
            onClick={() => setActiveTab('location')}
            className="flex flex-col items-start p-4 sm:p-5 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs hover:shadow-md hover:border-[#235D43] transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E8EEF5] text-[#2563EB] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📍
            </div>
            <h2 className="mt-3.5 font-bold text-[#143627] text-base sm:text-lg">
              Get Directions
            </h2>
            <p className="text-xs text-[#65736C] mt-1">
              1st Floor, Wave Mall, Ferozpur Road
            </p>
          </button>

          {/* Card 4: Call Restaurant */}
          <a
            id="quick-action-call"
            href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
            className="flex flex-col items-start p-4 sm:p-5 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs hover:shadow-md hover:border-[#235D43] transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FDF2F4] text-[#E11D48] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📞
            </div>
            <h2 className="mt-3.5 font-bold text-[#143627] text-base sm:text-lg">
              Call Restaurant
            </h2>
            <p className="text-xs text-[#65736C] mt-1">
              Direct line: {restaurantSettings.phone}
            </p>
          </a>
        </div>
      </section>

      {/* Happy Hours & Parties Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 rounded-2xl bg-[#F4EFEA] border border-[#E6DEC8] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#143627] text-[#C69234] flex items-center justify-center shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#143627] text-base sm:text-lg">
                  Happy Hours Daily 4:00 PM – 6:00 PM
                </span>
                <span className="px-2 py-0.5 rounded bg-[#C69234] text-white text-[10px] font-bold uppercase tracking-wider">
                  Special
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#65736C] mt-0.5">
                Enjoy hot South Indian tiffin snacks and fresh coffees at special rates. Host Birthday & Kitty Parties: call {restaurantSettings.eventPhone}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('menu')}
            className="px-5 py-2.5 rounded-xl bg-[#143627] text-white text-xs sm:text-sm font-semibold hover:bg-[#235D43] transition-colors shrink-0"
          >
            Explore Specials
          </button>
        </div>
      </section>

      {/* Section 5: Popular Categories (Horizontal Scrolling) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#143627] font-cinzel">
              Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#65736C]">
              Discover multi-cuisine delicacies freshly prepared
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveTab('menu');
            }}
            className="text-xs sm:text-sm font-bold text-[#235D43] hover:underline flex items-center gap-1"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {CUISINES_LIST.map((category) => (
            <button
              key={category}
              id={`cat-card-${category.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleCategoryClick(category)}
              className="flex-shrink-0 w-32 sm:w-36 group text-center focus:outline-none"
            >
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-gray-100 border border-[#E6DEC8] shadow-xs group-hover:shadow-md group-hover:border-[#235D43] transition-all relative">
                <img
                  src={categoryImages[category] || categoryImages['South Indian']}
                  alt={category}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2 right-2 text-white font-bold text-xs sm:text-sm drop-shadow-md">
                  {category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Section 5: Featured Food (Large Horizontal Food Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C69234]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#143627] font-cinzel">
                Featured Dishes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#65736C]">
              Chef's recommended specialties directly from our authentic menu
            </p>
          </div>
          <button
            onClick={() => setActiveTab('menu')}
            className="text-xs sm:text-sm font-bold text-[#235D43] hover:underline flex items-center gap-1"
          >
            <span>Full Menu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Large Grid of Food Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredDishes.map((dish) => (
            <div
              key={dish.id}
              id={`featured-card-${dish.id}`}
              className="bg-white rounded-2xl border border-[#E6DEC8] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
            >
              <div
                className="relative h-48 sm:h-52 overflow-hidden cursor-pointer"
                onClick={() => setSelectedDishForDetail(dish)}
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#143627] shadow-sm">
                  {/* Vegetarian green dot indicator */}
                  <span className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-sm flex items-center justify-center p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <span>Pure Veg</span>
                </div>

                {/* Favourites heart button */}
                <button
                  id={`fav-btn-${dish.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(dish.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-md transition-transform active:scale-90"
                  title="Save to Favourites"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavourite(dish.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-600'
                    }`}
                  />
                </button>

                {dish.pageNumber && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white">
                    Menu p. {dish.pageNumber}
                  </span>
                )}
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedDishForDetail(dish)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-[#143627] text-base sm:text-lg group-hover:text-[#235D43] transition-colors leading-snug">
                      {dish.name}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-xs text-[#65736C] line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-[#143627]">₹</span>
                    <span className="text-xl font-extrabold text-[#143627]">
                      {dish.price}
                    </span>
                  </div>

                  <button
                    id={`add-featured-${dish.id}`}
                    onClick={() => {
                      if (dish.customizations && dish.customizations.length > 0) {
                        setSelectedDishForDetail(dish);
                      } else {
                        addToCart(dish, 1);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-[#C69234]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Trust & Ratings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DEC8] shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#E6DEC8]">
            {/* Box 1 */}
            <div className="pt-4 md:pt-0 md:pr-6 flex flex-col justify-center">
              <span className="text-xs uppercase font-bold tracking-widest text-[#2E7D58]">
                Authentic Taste
              </span>
              <h3 className="text-2xl font-extrabold text-[#143627] mt-1">
                100% Pure Veg
              </h3>
              <p className="text-xs text-[#65736C] mt-2 leading-relaxed">
                Dedicated multi-cuisine vegetarian kitchen honoring South Indian tradition alongside North Indian rich curries and Chinese wok creations.
              </p>
            </div>

            {/* Box 2 */}
            <div className="pt-4 md:pt-0 md:px-6 flex flex-col justify-center">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C69234]">
                Customer Ratings
              </span>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                <div>
                  <div className="flex items-center gap-1 text-lg font-extrabold text-[#143627]">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{restaurantSettings.diningRating}</span>
                  </div>
                  <span className="text-[11px] text-[#65736C]">Dining (4 ratings)</span>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <div className="flex items-center gap-1 text-lg font-extrabold text-[#143627]">
                    <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                    <span>{restaurantSettings.deliveryRating}</span>
                  </div>
                  <span className="text-[11px] text-[#65736C]">Delivery (86 ratings)</span>
                </div>
              </div>
            </div>

            {/* Box 3 */}
            <div className="pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
              <span className="text-xs uppercase font-bold tracking-widest text-[#2E7D58]">
                Prime Ludhiana Location
              </span>
              <h3 className="text-lg font-bold text-[#143627] mt-1">
                Wave Mall, Ferozpur Road
              </h3>
              <p className="text-xs text-[#65736C] mt-1">
                Open Daily: 10:00 AM – 10:00 PM
              </p>
              <button
                onClick={() => setActiveTab('location')}
                className="mt-3 text-xs font-bold text-[#235D43] hover:underline flex items-center justify-center md:justify-start gap-1"
              >
                <span>View Map & Directions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
