import React from 'react';
import { useApp } from '../context/AppContext';
import { isRestaurantOpen } from '../data/restaurantData';
import {
  Phone,
  ShoppingBag,
  Heart,
  Clock,
  Palette,
  User,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartTotalCount,
    favourites,
    restaurantSettings,
    setIsThemeModalOpen,
    orders,
    currentUser,
    userProfile,
    setIsAuthModalOpen,
    isSuperAdmin,
  } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  const { isOpen, message: openStatusMessage } = isRestaurantOpen();

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC8] transition-all"
    >
      {/* Top micro banner */}
      <div className="bg-[#143627] text-[#FAF7F2] text-xs py-1.5 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#235d43] text-emerald-100 font-semibold tracking-wide text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              100% Pure Veg
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-100/90 text-xs">
              <Clock className="w-3.5 h-3.5 text-[#C69234]" />
              Hours: {restaurantSettings.openingTime} – {restaurantSettings.closingTime}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="hidden md:inline-flex text-amber-200">
              Happy Hours: {restaurantSettings.happyHours}
            </span>
            <a
              id="header-phone-link"
              href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1 text-emerald-100 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C69234]" />
              <span>{restaurantSettings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo brand area */}
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group transition-transform active:scale-98 min-w-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#143627] to-[#235D43] p-0.5 shadow-md flex items-center justify-center shrink-0">
              {/* Custom leaf SVG motif */}
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-[#FAF7F2] transform group-hover:rotate-6 transition-transform"
              >
                <path
                  d="M18 4C9.5 4 4 11 4 19.5C4 28 11.5 32 18 32C24.5 32 32 28 32 19.5C32 11 26.5 4 18 4Z"
                  fill="#1B4D36"
                />
                <path
                  d="M18 6C25 12 28 18 28 22C28 26 23.5 29 18 29C12.5 29 8 26 8 22C8 18 11 12 18 6Z"
                  fill="#2E7D58"
                />
                <path
                  d="M18 7V28M18 13C21 15 24 16 26 16M18 17C14 19 11 19 9 20M18 21C22 22 25 22 26 23"
                  stroke="#E8F5E9"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-base sm:text-xl md:text-2xl font-bold tracking-wider text-[#143627] uppercase truncate">
                  {restaurantSettings.name}
                </span>
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-[#235D43] shrink-0" />
              </div>
              <p className="text-[10px] sm:text-xs font-medium text-[#65736C] tracking-wide uppercase truncate">
                {restaurantSettings.subtitle}
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'menu', label: 'Our Menu' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'about', label: 'About Us' },
              { id: 'location', label: 'Location' },
              { id: 'orders', label: 'My Orders' },
            ].map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => setActiveTab(link.id as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all relative flex items-center gap-1.5 ${
                  activeTab === link.id
                    ? 'bg-[#143627] text-white shadow-sm'
                    : 'text-[#2C3B34] hover:bg-[#EAE2D3] hover:text-[#143627]'
                }`}
              >
                <span>{link.label}</span>
                {link.id === 'orders' && activeOrdersCount > 0 && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </button>
            ))}

            {isSuperAdmin && (
              <button
                id="header-nav-admin"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all relative flex items-center gap-1.5 shadow-sm ${
                  activeTab === 'admin'
                    ? 'bg-[#C69234] text-[#143627] ring-2 ring-[#C69234]'
                    : 'bg-[#143627] text-[#FAF7F2] hover:bg-[#235D43]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#C69234]" />
                <span>Admin App</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Theme & Font Customizer Trigger Button */}
            <button
              id="header-theme-btn"
              onClick={() => setIsThemeModalOpen(true)}
              title="Customize App Theme & Font"
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[#E6DEC8] bg-white hover:bg-[#EAE2D3] text-[#143627] text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
            >
              <Palette className="w-4 h-4 text-[#C69234]" />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {/* Live Open / Closed Pill */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isOpen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span>{openStatusMessage}</span>
            </div>

            {/* Favourites Icon (Desktop & Tablet; on Mobile it is in BottomNav) */}
            <button
              id="header-favourites-btn"
              onClick={() => setActiveTab('favourites')}
              title="View Favourites"
              className="hidden sm:flex relative p-2 sm:p-2.5 rounded-xl text-[#235D43] hover:bg-[#EAE2D3] transition-colors shrink-0"
            >
              <Heart className="w-5 h-5" />
              {favourites.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* User Account / Firebase Sign In Button */}
            <button
              id="header-user-auth-btn"
              onClick={() => {
                if (currentUser) {
                  setActiveTab('account');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              title={currentUser ? `Logged in as ${userProfile?.name || currentUser.displayName || 'User'}` : 'Sign In / Register'}
              className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0 ${
                currentUser
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                  : 'bg-white border-[#E6DEC8] text-[#143627] hover:bg-[#EAE2D3]'
              }`}
            >
              {currentUser ? (
                isSuperAdmin ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-[#143627] text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      👑
                    </div>
                    <span className="hidden sm:inline line-clamp-1 max-w-[85px] text-[#143627]">
                      Admin
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {userProfile?.name?.charAt(0) || currentUser.displayName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:inline line-clamp-1 max-w-[80px]">
                      {userProfile?.name?.split(' ')[0] || currentUser.displayName?.split(' ')[0] || 'Account'}
                    </span>
                  </>
                )
              ) : (
                <>
                  <User className="w-4 h-4 text-[#C69234]" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setActiveTab('cart')}
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl bg-[#143627] text-[#FAF7F2] font-semibold text-xs sm:text-sm shadow-md hover:bg-[#235D43] transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-[#C69234]" />
              <span className="hidden sm:inline">Cart</span>
              {cartTotalCount > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#C69234] text-white text-xs font-bold">
                  {cartTotalCount}
                </span>
              ) : (
                <span className="hidden sm:inline text-xs text-emerald-200/80 font-normal">0</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
