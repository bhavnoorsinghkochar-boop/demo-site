import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, BookOpen, ShoppingBag, Heart, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartTotalCount, orders, currentUser, userProfile } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: BookOpen },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartTotalCount },
    { id: 'favourites', label: 'Favourites', icon: Heart },
    {
      id: 'account',
      label: currentUser ? (userProfile?.name?.split(' ')[0] || 'Account') : 'Account',
      icon: User,
      hasLiveOrder: activeOrdersCount > 0,
      isLoggedIn: !!currentUser,
    },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E6DEC8] shadow-lg py-2 px-2"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                isActive ? 'text-[#143627]' : 'text-[#65736C] hover:text-[#235D43]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] flex items-center justify-center px-1 rounded-full bg-[#C69234] text-white text-[10px] font-bold shadow-sm">
                    {item.badge}
                  </span>
                )}
                {item.hasLiveOrder && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
                  </span>
                )}
                {!item.hasLiveOrder && item.isLoggedIn && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                )}
              </div>
              <span
                className={`text-[11px] mt-1 font-medium transition-colors ${
                  isActive ? 'font-bold text-[#143627]' : 'text-[#65736C]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
