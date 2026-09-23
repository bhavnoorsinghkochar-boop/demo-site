import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Heart,
  MapPin,
  Star,
  Info,
  Phone,
  ShieldCheck,
  ChevronRight,
  User,
  Lock,
  ExternalLink,
  Crown,
  LogIn,
} from 'lucide-react';
import { AdminLoginModal } from './AdminLoginModal';

export const AccountView: React.FC = () => {
  const {
    setActiveTab,
    favourites,
    orders,
    restaurantSettings,
    isAdminLoggedIn,
    adminLogout,
    currentUser,
    userProfile,
    setIsAuthModalOpen,
    logoutUser,
    showToast,
    isSuperAdmin,
    adminEmail,
  } = useApp();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const dinerName = isSuperAdmin
    ? 'Bhavnoor Singh Kochar'
    : userProfile?.name || currentUser?.displayName || orders[0]?.customerDetails?.name || 'Guest Diner';
  const dinerPhone = userProfile?.phone || orders[0]?.customerDetails?.phone;

  const activeOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );

  return (
    <div id="account-view" className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-28 space-y-6">
      {/* Active Order Spotlight Banner if order is going on */}
      {activeOrders.length > 0 && (
        <div
          onClick={() => setActiveTab('orders')}
          className="p-4 rounded-3xl bg-gradient-to-r from-[#143627] to-[#235D43] text-white shadow-lg cursor-pointer hover:shadow-xl transition-all flex items-center justify-between gap-4 border border-emerald-400/20"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  Order #{activeOrders[0].orderNumber} in Progress!
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[10px] font-bold uppercase">
                  {activeOrders[0].status}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Tap here to view real-time progression & live map
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-300 shrink-0" />
        </div>
      )}

        {/* Profile Header & Firebase Account Session */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6DEC8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md ${
                isSuperAdmin
                  ? 'bg-[#143627] text-amber-300 ring-2 ring-amber-400'
                  : 'bg-gradient-to-br from-[#143627] to-[#235D43] text-white'
              }`}>
                {isSuperAdmin ? (
                  <span>👑</span>
                ) : currentUser ? (
                  <span>{userProfile?.name?.charAt(0) || currentUser.displayName?.charAt(0) || 'U'}</span>
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#143627] font-cinzel">
                    {dinerName}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSuperAdmin
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : currentUser
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isSuperAdmin ? 'Administrator' : currentUser ? 'Customer Account' : 'Guest'}
                  </span>
                </div>
                <p className="text-xs text-[#65736C] mt-0.5">
                  {currentUser?.email || (dinerPhone ? `${dinerPhone} · ` : '') + `${restaurantSettings.location}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSuperAdmin ? (
                <button
                  id="account-open-admin-btn"
                  onClick={() => setActiveTab('admin')}
                  className="px-4 py-2 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Admin App</span>
                </button>
              ) : null}

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DEC8] hover:bg-[#EAE2D3] text-[#143627] text-xs font-bold transition-colors shrink-0 shadow-2xs"
              >
                {currentUser ? 'Switch User' : 'Sign In / Register'}
              </button>
            </div>
          </div>

          {/* Data Isolation / Role Status Notice */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
            isSuperAdmin ? 'bg-amber-50/70 border-amber-200' : 'bg-[#FAF7F2] border-[#E6DEC8]'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isSuperAdmin ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-[#2C3B34] font-medium">
                {isSuperAdmin ? (
                  <>
                    Logged in with <strong className="text-[#143627]">{adminEmail}</strong>. You have direct and full access to manage restaurant operations, incoming orders, and menu items.
                  </>
                ) : currentUser ? (
                  <>
                    Logged in as <strong className="text-[#143627]">{userProfile?.name || currentUser.displayName}</strong>. Your cart, order history, and favourites are saved separately in Firestore scoped to your User ID.
                  </>
                ) : (
                  'Sign in with your username/email and password to keep your cart, order history, and favourites saved.'
                )}
              </span>
            </div>

            {currentUser && (
              <button
                onClick={async () => {
                  await logoutUser();
                  showToast('Logged out from account', 'info');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold shrink-0 underline cursor-pointer"
              >
                Log Out
              </button>
            )}
          </div>
        </div>

      {/* Account Quick Options Menu */}
      <div className="bg-white rounded-3xl border border-[#E6DEC8] shadow-xs overflow-hidden divide-y divide-[#E6DEC8]">
        {/* My Orders */}
        <button
          id="account-link-orders"
          onClick={() => setActiveTab('orders')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E2F4EA] text-[#2E7D58] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#143627]">My Orders</span>
              <p className="text-xs text-[#65736C]">
                {orders.length} order{orders.length !== 1 ? 's' : ''} placed
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* Favourites */}
        <button
          id="account-link-favourites"
          onClick={() => setActiveTab('favourites')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF0DC] text-[#C69234] flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#143627]">Saved Favourites</span>
              <p className="text-xs text-[#65736C]">
                {favourites.length} saved item{favourites.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* Location & Directions */}
        <button
          id="account-link-location"
          onClick={() => setActiveTab('location')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8EEF5] text-[#2563EB] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#143627]">Location & Directions</span>
              <p className="text-xs text-[#65736C]">
                Wave Mall, 1st Floor, Ferozpur Road, Ludhiana
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* Reviews */}
        <button
          id="account-link-reviews"
          onClick={() => setActiveTab('reviews')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#143627]">Reviews & Ratings</span>
              <p className="text-xs text-[#65736C]">
                Dining 4.1 · Delivery 3.8 ratings
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* About Restaurant */}
        <button
          id="account-link-about"
          onClick={() => setActiveTab('about')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#143627]">About {restaurantSettings.name}</span>
              <p className="text-xs text-[#65736C]">
                Multi Cuisine history & food philosophy
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Support and Direct Call */}
      <div className="p-5 rounded-3xl bg-[#FAF7F2] border border-[#E6DEC8] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-[#2E7D58]" />
          <div>
            <span className="font-bold text-xs sm:text-sm text-[#143627] block">
              Direct Restaurant Contact
            </span>
            <span className="text-xs text-[#65736C]">
              {restaurantSettings.phone} · 10 AM to 10 PM
            </span>
          </div>
        </div>

        <a
          href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
          className="px-4 py-2 rounded-xl bg-[#143627] text-white text-xs font-bold hover:bg-[#235D43] transition-colors shrink-0"
        >
          Call Now
        </a>
      </div>

      {/* Role-Based Access Notice & Direct Admin Control */}
      <div className="p-5 rounded-3xl bg-white border border-[#E6DEC8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C69234]" />
            <h3 className="text-xs font-bold text-[#143627] uppercase tracking-wider">
              Platform Access & Roles
            </h3>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {restaurantSettings.name} v1.0
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin App Access</span>
            </div>
            <p className="text-[11px] text-amber-900/80 leading-relaxed">
              Exclusively authorized for <strong className="text-amber-950">{adminEmail}</strong>. Direct access to live orders, kitchen status, menu updates, and restaurant timings.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>Customer App Access</span>
            </div>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              All other Gmail accounts and guests access the Customer App with isolated personal carts, favourites, and delivery tracking.
            </p>
          </div>
        </div>

        {isSuperAdmin ? (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>You are currently authorized as the Administrator</span>
            </div>
            <button
              onClick={() => setActiveTab('admin')}
              className="px-4 py-2 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch Admin Dashboard</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#65736C]">
              Are you the owner? Sign in with your admin email to manage the app.
            </span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Sign In</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Login Modal (for password-based fallback if needed) */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          setActiveTab('admin');
        }}
      />
    </div>
  );
};
