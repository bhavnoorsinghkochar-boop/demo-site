/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { CartView } from './components/CartView';
import { OrdersView } from './components/OrdersView';
import { FavouritesView } from './components/FavouritesView';
import { ReviewsView } from './components/ReviewsView';
import { AboutView } from './components/AboutView';
import { LocationView } from './components/LocationView';
import { GalleryView } from './components/GalleryView';
import { AccountView } from './components/AccountView';
import { AdminDashboard } from './components/AdminDashboard';
import { FoodDetailModal } from './components/FoodDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { ThemeFloatingTrigger } from './components/ThemeFloatingTrigger';
import { LiveOrderPopup } from './components/LiveOrderPopup';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Phone, MapPin, Clock, Heart, ShieldAlert, ShieldCheck, LogIn, ArrowRight } from 'lucide-react';

const AdminRestrictedView: React.FC = () => {
  const { currentUser, setIsAuthModalOpen, setActiveTab, adminEmail } = useApp();

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm border border-amber-200">
        <ShieldAlert className="w-8 h-8 text-amber-700" />
      </div>

      <div className="space-y-2">
        <h2 className="font-cinzel text-2xl font-bold text-[#143627]">
          Administrator Access Required
        </h2>
        <p className="text-xs sm:text-sm text-[#65736C] leading-relaxed max-w-md mx-auto">
          The Admin Portal is exclusively accessible to the authorized owner (<span className="font-semibold text-[#143627]">{adminEmail}</span>).
        </p>
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 max-w-md mx-auto text-left space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <span>Current Status:</span>
            {currentUser ? (
              <span className="text-emerald-700">Logged in as {currentUser.email} (Customer App)</span>
            ) : (
              <span className="text-amber-800">Browsing as Guest</span>
            )}
          </p>
          <p className="text-[11px] text-amber-800/80">
            All other Gmail accounts and guests are routed to the Customer App to view menus, place orders, and track deliveries.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <LogIn className="w-4 h-4 text-[#C69234]" />
          <span>Sign In with {adminEmail}</span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-[#E6DEC8] hover:bg-[#FAF7F2] text-[#143627] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <span>Return to Customer App</span>
          <ArrowRight className="w-4 h-4 text-[#65736C]" />
        </button>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, restaurantSettings, isSuperAdmin, adminEmail } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3B34] flex flex-col font-sans selection:bg-[#2E7D58] selection:text-white">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Persistent Administrator Bar for bhavnoorsinghkochar@gmail.com */}
      {isSuperAdmin && (
        <div className="bg-[#C69234] text-[#143627] px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-sm z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#143627] animate-ping" />
            <ShieldCheck className="w-4 h-4 text-[#143627]" />
            <span>
              Administrator Session: <strong>{adminEmail}</strong>
              {activeTab === 'admin' ? ' · (Admin App Active)' : ' · (Previewing Customer App)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {activeTab !== 'admin' ? (
              <button
                id="top-switch-to-admin-btn"
                onClick={() => setActiveTab('admin')}
                className="px-3 py-1 rounded-lg bg-[#143627] text-white text-[11px] font-bold hover:bg-[#235D43] transition-colors shadow-xs"
              >
                Go to Admin App →
              </button>
            ) : (
              <button
                id="top-switch-to-customer-btn"
                onClick={() => setActiveTab('home')}
                className="px-3 py-1 rounded-lg bg-[#143627] text-white text-[11px] font-bold hover:bg-[#235D43] transition-colors shadow-xs"
              >
                Preview Customer App →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main App Header */}
      <Header />

      {/* Dynamic Content Views */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'menu' && <MenuView />}
        {activeTab === 'cart' && <CartView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'favourites' && <FavouritesView />}
        {activeTab === 'reviews' && <ReviewsView />}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'location' && <LocationView />}
        {activeTab === 'gallery' && <GalleryView />}
        {activeTab === 'account' && <AccountView />}
        {activeTab === 'admin' && (isSuperAdmin ? <AdminDashboard /> : <AdminRestrictedView />)}
      </main>

      {/* Footer (Section 21) */}
      <footer
        id="app-footer"
        className="bg-[#143627] text-white pt-12 pb-24 lg:pb-12 border-t border-[#1B4D36]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#235D43]">
            {/* Col 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xl font-bold tracking-wider text-white uppercase">
                  {restaurantSettings.name}
                </span>
              </div>
              <p className="text-xs uppercase font-semibold tracking-wider text-[#C69234]">
                {restaurantSettings.subtitle}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                100% Pure Vegetarian
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Combining authentic South Indian heritage with North Indian tandoor, Asian woks, and handcrafted cafe beverages.
              </p>
            </div>

            {/* Col 2: Location & Contact */}
            <div className="space-y-2.5 text-xs text-emerald-100/90">
              <h4 className="font-cinzel font-bold text-sm text-white">Contact & Visit</h4>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C69234] shrink-0 mt-0.5" />
                <span>{restaurantSettings.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C69234] shrink-0" />
                <a
                  href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white underline underline-offset-2"
                >
                  {restaurantSettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C69234] shrink-0" />
                <span>
                  Daily: {restaurantSettings.openingTime} – {restaurantSettings.closingTime}
                </span>
              </div>
            </div>

            {/* Col 3: Quick Navigation */}
            <div className="space-y-2 text-xs">
              <h4 className="font-cinzel font-bold text-sm text-white">Explore</h4>
              <ul className="space-y-1.5 text-emerald-100/80">
                <li>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="hover:text-white transition-colors"
                  >
                    Food Menu (9 Pages)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="hover:text-white transition-colors"
                  >
                    Beverages (2 Pages)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="hover:text-white transition-colors"
                  >
                    Reviews (Dining 4.1 · Delivery 3.8)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="hover:text-white transition-colors"
                  >
                    Restaurant & Food Gallery
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('location')}
                    className="hover:text-white transition-colors"
                  >
                    Google Maps & Directions
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Cuisines & Parties */}
            <div className="space-y-2 text-xs text-emerald-100/80">
              <h4 className="font-cinzel font-bold text-sm text-white">Cuisine Traditions</h4>
              <p className="leading-relaxed">
                South Indian · North Indian · Chinese · Fast Food · Biryani · Cafe · Coffee · Shakes
              </p>
              <div className="pt-2">
                <span className="text-[#C69234] font-bold block">Birthday & Kitty Parties:</span>
                <span>Call {restaurantSettings.eventPhone}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/70">
            <p>© {new Date().getFullYear()} {restaurantSettings.name}. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Pure vegetarian culinary experience · {restaurantSettings.location}</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Overlays */}
      <FoodDetailModal />
      <CheckoutModal />
      <OrderConfirmationModal />
      <ThemeCustomizerModal />
      <ThemeFloatingTrigger />
      <LiveOrderPopup />
      <AuthModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
