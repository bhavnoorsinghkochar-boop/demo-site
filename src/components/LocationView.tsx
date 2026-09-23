import React from 'react';
import { useApp } from '../context/AppContext';
import { isRestaurantOpen } from '../data/restaurantData';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Car,
  Compass,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const LocationView: React.FC = () => {
  const { restaurantSettings } = useApp();
  const { isOpen, message: openStatusMessage } = isRestaurantOpen();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${restaurantSettings.name} ${restaurantSettings.location}`
  )}`;

  return (
    <div id="location-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143627] font-cinzel uppercase">
          Location & Directions
        </h1>
        <p className="text-xs sm:text-sm text-[#65736C] mt-1">
          Visit {restaurantSettings.name} at {restaurantSettings.location}
        </p>
      </div>

      {/* Main Address Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC8] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D58]">
              Full Address
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#143627] font-cinzel uppercase">
              {restaurantSettings.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5550] max-w-md leading-relaxed">
              {restaurantSettings.location}
            </p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-full text-xs font-bold border self-start ${
              isOpen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {openStatusMessage}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            id="google-maps-directions-link"
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#143627] hover:bg-[#235D43] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Navigation className="w-4 h-4 text-[#C69234]" />
            <span>Open in Google Maps</span>
          </a>

          <a
            id="location-call-btn"
            href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
            className="px-5 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC8] hover:bg-[#EAE2D3] text-[#143627] text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#2E7D58]" />
            <span>Call: {restaurantSettings.phone}</span>
          </a>
        </div>

        {/* Interactive Map Graphic Representation */}
        <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 bg-[#E8EDE8] border border-[#D5DDD5] flex items-center justify-center">
          {/* Map background illustration */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2E7D58_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

          {/* Road grid lines */}
          <div className="absolute top-1/2 left-0 right-0 h-12 bg-gray-200 -translate-y-1/2 border-y-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
              Ferozpur Road (NH 5)
            </span>
          </div>
          <div className="absolute top-0 bottom-0 left-1/3 w-10 bg-gray-200 border-x border-gray-300" />

          {/* Mall Marker Box */}
          <div className="relative z-10 p-5 rounded-2xl bg-white shadow-2xl border-2 border-[#235D43] max-w-xs text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#143627] text-[#C69234] flex items-center justify-center mx-auto shadow-md">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
            <h4 className="font-cinzel font-bold text-[#143627] text-sm">
              Madras Leaf Restaurant
            </h4>
            <p className="text-[11px] text-[#65736C]">
              1st Floor Food & Dining Area, Wave Mall, Aggar Nagar, Ludhiana
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[11px] font-bold text-[#235D43] hover:underline"
            >
              Get Live GPS Navigation →
            </a>
          </div>
        </div>

        {/* Mall & Visiting Guidelines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E6DEC8] text-xs">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#2E7D58] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#143627] block">Hours</span>
              <span className="text-[#65736C]">
                {restaurantSettings.openingTime} – {restaurantSettings.closingTime} Daily
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building className="w-4 h-4 text-[#2E7D58] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#143627] block">Floor</span>
              <span className="text-[#65736C]">1st Floor, Near Central Escalators</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Car className="w-4 h-4 text-[#2E7D58] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#143627] block">Parking</span>
              <span className="text-[#65736C]">Wave Mall Basement & Surface Parking available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
