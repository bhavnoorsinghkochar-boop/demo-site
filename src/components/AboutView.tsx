import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Utensils, Clock, Phone, MapPin, CheckCircle2, HeartHandshake } from 'lucide-react';
import { CUISINES_LIST } from '../data/restaurantData';

export const AboutView: React.FC = () => {
  const { restaurantSettings, setActiveTab } = useApp();

  return (
    <div id="about-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-10">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#143627] text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase font-bold tracking-widest text-[#C69234]">
            Welcome to Our Kitchen
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-cinzel mt-2 leading-tight uppercase">
            {restaurantSettings.name}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 font-medium">
            {restaurantSettings.subtitle} · {restaurantSettings.location}
          </p>

          <p className="mt-6 text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            {restaurantSettings.name} is a premier pure vegetarian culinary destination, combining traditional South Indian mastery with North Indian clay-oven roasts, Chinese wok creations, hand-crafted cafe beverages, and aromatic biryanis under one roof.
          </p>
        </div>
      </div>

      {/* 100% Pure Vegetarian Assurance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC8] shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#E2F4EA] text-[#2E7D58] flex items-center justify-center shrink-0">
          <span className="text-3xl">🌱</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-emerald-600 rounded-sm flex items-center justify-center p-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </span>
            <h3 className="font-cinzel font-bold text-lg text-[#143627]">
              Strictly 100% Pure Vegetarian
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#65736C] mt-1 leading-relaxed">
            Our kitchen maintains uncompromising vegetarian standards. Every single meal is prepared using pure, freshly sourced ingredients, clarified butter, and time-honored authentic recipes.
          </p>
        </div>
      </div>

      {/* Multi-Cuisine Panorama */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#143627] font-cinzel">
          The Multi-Cuisine Experience
        </h2>
        <p className="text-xs sm:text-sm text-[#65736C]">
          Carefully curated recipes across 8 distinct cuisine traditions:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CUISINES_LIST.map((cuisine) => (
            <div
              key={cuisine}
              className="p-4 rounded-2xl bg-white border border-[#E6DEC8] text-center shadow-2xs hover:border-[#235D43] transition-colors"
            >
              <span className="text-2xl block mb-1">
                {cuisine === 'South Indian' && '🥞'}
                {cuisine === 'North Indian' && '🍛'}
                {cuisine === 'Chinese' && '🥢'}
                {cuisine === 'Fast Food' && '🍕'}
                {cuisine === 'Biryani' && '🍚'}
                {cuisine === 'Cafe' && '🥪'}
                {cuisine === 'Coffee' && '☕'}
                {cuisine === 'Shakes' && '🥤'}
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#143627]">
                {cuisine}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Special Highlights: Happy Hours & Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-[#FAF0DC] border border-[#C69234]/30 space-y-2">
          <div className="flex items-center gap-2 text-[#9A6B1A] font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>Happy Hours (4:00 PM – 6:00 PM)</span>
          </div>
          <h4 className="font-bold text-base text-[#143627]">
            Daily Afternoon Tiffin & Filter Coffee
          </h4>
          <p className="text-xs text-[#65736C] leading-relaxed">
            Unwind with hot crispy dosas, steaming filter coffee, and delightful cafe bites during our dedicated happy hours every afternoon.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#E2F4EA] border border-[#2E7D58]/30 space-y-2">
          <div className="flex items-center gap-2 text-[#1B4D36] font-bold text-sm">
            <Sparkles className="w-4 h-4 text-[#2E7D58]" />
            <span>Kitty Parties & Birthday Bookings</span>
          </div>
          <h4 className="font-bold text-base text-[#143627]">
            Celebrate at Wave Mall
          </h4>
          <p className="text-xs text-[#65736C] leading-relaxed">
            Host your special gatherings with our customized pure veg banquet service. Call <strong>{restaurantSettings.eventPhone}</strong> for event reservations.
          </p>
        </div>
      </div>

      {/* Visit Us CTA */}
      <div className="p-6 rounded-3xl bg-white border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base text-[#143627] font-cinzel">
            Visit Madras Leaf Today
          </h4>
          <p className="text-xs text-[#65736C] mt-0.5">
            1st Floor, Wave Mall, Ferozpur Road, Ludhiana · Open daily 10:00 AM – 10:00 PM
          </p>
        </div>

        <button
          onClick={() => setActiveTab('menu')}
          className="px-6 py-2.5 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs font-bold transition-all shadow-sm shrink-0"
        >
          View Full Menu
        </button>
      </div>
    </div>
  );
};
