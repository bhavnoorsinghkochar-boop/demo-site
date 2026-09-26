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
import { WhatsAppIcon, getWhatsAppUrl } from './WhatsAppButton';

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
  const featuredDishes: MenuItem[] = (menuItems || []).filter((i) => i.isSpecial).slice(0, 8);

  const categoryImages: Record<string, string> = {
    'Stick Waffles & Crepes':
      'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80',
    'Bubble Waffles':
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80',
    'Handcrafted Churros':
      'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&auto=format&fit=crop&q=80',
    'Gourmet Burgers':
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    'Artisanal Pizzas':
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    'Fries & Twisted Potato':
      'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    'Crispy Bites & Wings':
      'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
    'Artisan Coffee & Frappes':
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80',
    'Boba & Coolers':
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80',
    'Thick Shakes & Mojitos':
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80',
  };

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    if (
      catName === 'Artisan Coffee & Frappes' ||
      catName === 'Boba & Coolers' ||
      catName === 'Thick Shakes & Mojitos'
    ) {
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
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white">
          {/* Subtle Background Pattern & Image */}
          <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=1600&auto=format&fit=crop&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#7F1D1D]/90 via-[#991B1B]/50 to-transparent" />

          <div className="relative z-10 px-6 sm:px-12 py-12 sm:py-18 md:py-24 max-w-3xl">
            {/* Singapore Flag & Theme badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold tracking-wide text-white mb-4">
              <span>🇸🇬 TASTE OF SINGAPORE · DESSERTS & BURGERS</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
              Laa Mamma Mia!
            </h1>

            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-red-100 font-medium leading-relaxed">
              Taste Of Singapore in Rajguru Nagar, Ludhiana. Famous for our Korean Grilled Chicken Burger, molten cheese-filled chicken burgers, handcrafted churros, chocolate bubble stick waffles, Hawaiian piña colada and iced lime soda.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                id="hero-order-now-btn"
                onClick={() => setActiveTab('menu')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-white hover:bg-red-50 text-[#DC2626] font-extrabold text-sm sm:text-base shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Order Now</span>
                <ChevronRight className="w-4 h-4 text-[#DC2626]" />
              </button>

              <button
                id="hero-view-menu-btn"
                onClick={() => setActiveTab('menu')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 text-white font-bold text-sm sm:text-base transition-all active:scale-95"
              >
                View Menu
              </button>
            </div>

            {/* Quick Ratings Badge from Google Reviews */}
            <div className="mt-8 pt-6 border-t border-white/25 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-red-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-400 text-amber-950 px-2.5 py-1 rounded-md font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.7</span>
                </div>
                <span className="font-semibold">Google Rating (65 Verified Reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold">Booth No.20, Rajguru Nagar · Open till 11:30 PM</span>
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
              Booth No.20, Main Market, Rajguru Nagar
            </p>
          </button>

          {/* Card 4: WhatsApp & Call */}
          <a
            id="quick-action-whatsapp"
            href={getWhatsAppUrl('Hi Laa Mamma Mia! I would like to order food or inquire about desserts & burgers.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start p-4 sm:p-5 rounded-2xl bg-white border border-[#E6DEC8] shadow-xs hover:shadow-md hover:border-[#25D366] transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
              <WhatsAppIcon className="w-7 h-7 fill-current" />
            </div>
            <h2 className="mt-3.5 font-bold text-[#143627] text-base sm:text-lg flex items-center gap-1.5">
              <span>WhatsApp Chat</span>
            </h2>
            <p className="text-xs text-[#65736C] mt-1">
              Order or chat: {restaurantSettings.phone}
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

        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {CUISINES_LIST.map((category) => (
            <button
              key={category}
              id={`cat-card-${category.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleCategoryClick(category)}
              className="flex-shrink-0 px-4 py-3 rounded-2xl bg-white border border-[#E6DEC8] shadow-2xs hover:shadow-md hover:border-[#DC2626] transition-all text-left group cursor-pointer"
            >
              <span className="block font-black text-xs sm:text-sm text-[#143627] group-hover:text-[#DC2626] transition-colors whitespace-nowrap">
                {category}
              </span>
              <span className="text-[10px] font-semibold text-[#65736C]">
                Explore Items →
              </span>
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

        {/* Clean Text Food Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredDishes.map((dish) => (
            <div
              key={dish.id}
              id={`featured-card-${dish.id}`}
              className="bg-white rounded-2xl border border-[#E6DEC8] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#DC2626]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
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

                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase tracking-wide">
                      Chef Special
                    </span>
                  </div>

                  <button
                    id={`fav-btn-${dish.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavourite(dish.id);
                    }}
                    className="p-1 rounded-full text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Save to Favourites"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavourite(dish.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-rose-500'
                      }`}
                    />
                  </button>
                </div>

                <h3
                  onClick={() => setSelectedDishForDetail(dish)}
                  className="font-black text-[#143627] text-base sm:text-lg group-hover:text-[#DC2626] transition-colors leading-snug cursor-pointer uppercase tracking-tight"
                >
                  {dish.name}
                </h3>

                <p className="mt-1 text-xs text-[#65736C] leading-relaxed">
                  {dish.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
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
                  id={`add-featured-${dish.id}`}
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
      </section>

      {/* Customer Trust & Ratings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DEC8] shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-[#E6DEC8]">
            {/* Box 1 */}
            <div className="pt-4 md:pt-0 md:pr-6 flex flex-col justify-center">
              <span className="text-xs uppercase font-bold tracking-widest text-[#DC2626]">
                Singapore Street Food
              </span>
              <h3 className="text-2xl font-extrabold text-[#143627] mt-1">
                Desserts & Burgers
              </h3>
              <p className="text-xs text-[#65736C] mt-2 leading-relaxed">
                Handcrafted Spanish churros with Belgian chocolate, molten cheese-filled chicken burgers, Korean grilled chicken burgers, and crisp bubble waffles.
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
                Main Market, Rajguru Nagar
              </h3>
              <p className="text-xs text-[#65736C] mt-1">
                Open Daily: 11:00 AM – 11:30 PM
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
