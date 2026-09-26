import React from 'react';
import { useApp } from '../context/AppContext';
import { isRestaurantOpen } from '../data/restaurantData';
import { WhatsAppHeaderButton, WhatsAppIcon, getWhatsAppUrl } from './WhatsAppButton';
import {
  Phone,
  ShoppingBag,
  Heart,
  Clock,
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
      <div className="bg-[#DC2626] text-white text-xs py-1.5 font-medium shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white text-red-700 font-bold tracking-wide text-[11px] shadow-2xs">
              <span>⭐ 4.7 (65 Reviews)</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-white/95 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-white" />
              Hours: {restaurantSettings.openingTime} – {restaurantSettings.closingTime}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-semibold">
            <span className="hidden md:inline-flex text-white/90">
              Booth No.20, Rajguru Nagar, Ludhiana
            </span>

            {/* Direct WhatsApp link with WhatsApp Logo */}
            <a
              id="top-whatsapp-link"
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white hover:text-emerald-100 transition-colors bg-[#25D366] hover:bg-[#20ba59] px-2.5 py-0.5 rounded-md font-bold shadow-2xs"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Chat</span>
            </a>

            <a
              id="header-phone-link"
              href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1 text-white hover:text-red-100 transition-colors bg-black/15 px-2.5 py-0.5 rounded-md"
            >
              <Phone className="w-3 h-3 text-white" />
              <span>{restaurantSettings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Heading Area (No Logo Box, Large & High Visibility) */}
          <button
            id="brand-heading-btn"
            onClick={() => setActiveTab('home')}
            className="flex flex-col text-left group transition-transform active:scale-98 min-w-0 py-0.5"
          >
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#DC2626] uppercase leading-none drop-shadow-2xs group-hover:text-[#b91c1c] transition-colors">
                LAA MAMMA MIA!
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] sm:text-xs font-black uppercase tracking-wider border border-red-200">
                Taste Of Singapore
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-[#65736C] tracking-wide mt-1 truncate">
              <span className="sm:hidden font-bold text-red-700">Taste Of Singapore · </span>
              Desserts, Burgers & Shakes · Rajguru Nagar
            </p>
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
                    ? 'bg-[#DC2626] text-white shadow-sm'
                    : 'text-[#2C3B34] hover:bg-[#FEE2E2] hover:text-[#DC2626]'
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
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* WhatsApp Integration Button with WhatsApp Logo */}
            <WhatsAppHeaderButton />

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
              className="hidden sm:flex relative p-2 sm:p-2.5 rounded-xl text-[#DC2626] hover:bg-[#FEE2E2] transition-colors shrink-0"
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
                    <div className="w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {userProfile?.name?.charAt(0) || currentUser.displayName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:inline line-clamp-1 max-w-[80px]">
                      {userProfile?.name?.split(' ')[0] || currentUser.displayName?.split(' ')[0] || 'Account'}
                    </span>
                  </>
                )
              ) : (
                <>
                  <User className="w-4 h-4 text-[#143627]" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setActiveTab('cart')}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartTotalCount > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white text-[#DC2626] text-xs font-black shadow-xs">
                  {cartTotalCount}
                </span>
              ) : (
                <span className="hidden sm:inline text-xs text-red-200 font-normal">0</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
