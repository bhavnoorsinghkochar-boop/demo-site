import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Utensils, Clock, Phone, MapPin, CheckCircle2, HeartHandshake, Star } from 'lucide-react';
import { CUISINES_LIST } from '../data/restaurantData';
import { WhatsAppIcon, getWhatsAppUrl } from './WhatsAppButton';

export const AboutView: React.FC = () => {
  const { restaurantSettings, setActiveTab } = useApp();

  return (
    <div id="about-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-10">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#143627] text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-red-200 uppercase tracking-widest mb-3">
            <span>🇸🇬 Authentic Singapore Food & Dessert Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-cinzel mt-2 leading-tight uppercase">
            {restaurantSettings.name}
          </h1>
          <p className="text-sm sm:text-base text-red-100/90 mt-2 font-medium">
            {restaurantSettings.subtitle} · {restaurantSettings.location}
          </p>

          <p className="mt-6 text-xs sm:text-sm text-red-100/80 leading-relaxed">
            Welcome to {restaurantSettings.name}, Ludhiana's favourite destination for unique Singaporean flavours, gourmet smash burgers, handcrafted cinnamon churros, and decadent bubble waffles. Inspired by Singapore's vibrant street markets and dessert culture, every recipe is crafted to deliver exceptional taste and warm memories.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.7 Rating (65 Verified Reviews)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <Clock className="w-4 h-4 text-red-300" />
              <span>Open Daily Until 11:30 PM</span>
            </span>
          </div>
        </div>
      </div>

      {/* Culinary Identity Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC8] shadow-xs flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 text-2xl font-bold border border-red-200">
            🧇
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-lg text-[#143627]">
              Signature Churros & Bubble Waffles
            </h3>
            <p className="text-xs sm:text-sm text-[#65736C] mt-1 leading-relaxed">
              Hand-pressed, golden-crisp Spanish churros rolled in cinnamon sugar with warm Belgian chocolate & Nutella dips, alongside our iconic Chocolate Bubble Stick Waffles and Belgian waffle platters.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC8] shadow-xs flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 text-2xl font-bold border border-red-200">
            🍔
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-lg text-[#143627]">
              Unique & Flavorful Burgers
            </h3>
            <p className="text-xs sm:text-sm text-[#65736C] mt-1 leading-relaxed">
              Renowned for the Korean Grilled Chicken Burger, Cheese-Filled Chicken Burger with molten cheddar core, and the local favourite Crispy Smash Tikki Burger on toasted brioche buns.
            </p>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#143627] font-cinzel">
          The Singapore Culinary Collection
        </h2>
        <p className="text-xs sm:text-sm text-[#65736C]">
          Carefully curated dishes and refreshing coolers for every craving:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CUISINES_LIST.map((cuisine) => (
            <div
              key={cuisine}
              className="p-4 rounded-2xl bg-white border border-[#E6DEC8] text-center shadow-2xs hover:border-[#DC2626] transition-colors cursor-pointer"
              onClick={() => setActiveTab('menu')}
            >
              <span className="text-2xl block mb-1">
                {cuisine.includes('Churros') && '🥨'}
                {cuisine.includes('Burgers') && '🍔'}
                {cuisine.includes('Desserts') && '🧇'}
                {cuisine.includes('Singapore') && '🍜'}
                {cuisine.includes('Shakes') && '🥤'}
                {cuisine.includes('Beverages') && '🍹'}
                {cuisine.includes('Hawker') && '🥢'}
                {cuisine.includes('Snacks') && '🍟'}
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#143627]">
                {cuisine}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights: Reviews & Atmosphere */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200 space-y-2">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <HeartHandshake className="w-4 h-4" />
            <span>Customer Love & Rave Reviews</span>
          </div>
          <h4 className="font-bold text-base text-[#143627]">
            4.7 ★ Based on 65 Diner Reviews
          </h4>
          <p className="text-xs text-[#65736C] leading-relaxed">
            "Best cheese burgers and churros in town. Unforgettable experience with the Hawaiian Piña Colada and Chocolate Bubble Stick Waffle!" — verified diner reviews on Google.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E6DEC8] space-y-2">
          <div className="flex items-center gap-2 text-[#143627] font-bold text-sm">
            <Sparkles className="w-4 h-4 text-[#DC2626]" />
            <span>Cozy Vibe & Quick Service</span>
          </div>
          <h4 className="font-bold text-base text-[#143627]">
            Takeaway, Delivery & Dine-In
          </h4>
          <p className="text-xs text-[#65736C] leading-relaxed">
            Conveniently located at Booth No.20, Main Market, Rajguru Nagar. Enjoy quick counter service, swift local home deliveries, or cozy seating.
          </p>
        </div>
      </div>

      {/* Visit Us CTA */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base text-[#143627] font-cinzel">
            Visit {restaurantSettings.name}
          </h4>
          <p className="text-xs text-[#65736C] mt-0.5">
            {restaurantSettings.address} · Call: {restaurantSettings.phone} · Open Daily until 11:30 PM
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            id="about-whatsapp-btn"
            href={getWhatsAppUrl('Hi Laa Mamma Mia! I would like to know more about your menu and visit your Rajguru Nagar store.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
            <span>Chat on WhatsApp</span>
          </a>

          <button
            onClick={() => setActiveTab('menu')}
            className="px-6 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold transition-all shadow-sm shrink-0"
          >
            View Full Menu
          </button>
        </div>
      </div>
    </div>
  );
};
