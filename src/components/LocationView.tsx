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
  ShoppingBag,
  Truck,
  Utensils,
  Share2,
} from 'lucide-react';
import { WhatsAppIcon, getWhatsAppUrl } from './WhatsAppButton';

export const LocationView: React.FC = () => {
  const { restaurantSettings } = useApp();
  const { isOpen, message: openStatusMessage } = isRestaurantOpen();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Laa Mamma Mia Taste Of Singapore Booth No.20 Main Market Rajguru Nagar Ludhiana'
  )}`;

  return (
    <div id="location-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
          <span>🇸🇬 Booth No.20 · Rajguru Nagar Main Market</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143627] font-cinzel uppercase">
          Location & Directions
        </h1>
        <p className="text-xs sm:text-sm text-[#65736C] mt-1">
          Visit {restaurantSettings.name} in Rajguru Nagar, Ludhiana
        </p>
      </div>

      {/* Main Address Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC8] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              Storefront Address
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#143627] font-cinzel uppercase">
              {restaurantSettings.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5550] max-w-md leading-relaxed font-medium">
              {restaurantSettings.address}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-mono font-semibold mt-2">
              <Compass className="w-3.5 h-3.5 text-red-600" />
              <span>Plus Code: VQHP+GQ Ludhiana, Punjab</span>
            </div>
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
            className="px-5 py-3 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Navigation className="w-4 h-4 text-white" />
            <span>Open in Google Maps</span>
          </a>

          <a
            id="location-whatsapp-btn"
            href={getWhatsAppUrl('Hi Laa Mamma Mia! I would like directions / information about your Rajguru Nagar store.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            id="location-call-btn"
            href={`tel:${restaurantSettings.phone.replace(/\s+/g, '')}`}
            className="px-5 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC8] hover:bg-[#EAE2D3] text-[#143627] text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#DC2626]" />
            <span>Call: {restaurantSettings.phone}</span>
          </a>
        </div>

        {/* Service Options Badges */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#E6DEC8]">
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-50/60 border border-red-200 text-red-800 text-xs font-bold">
            <ShoppingBag className="w-4 h-4 text-red-600" />
            <span>Takeaway Available</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Delivery Available</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-800 text-xs font-bold">
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Order Online</span>
          </div>
        </div>

        {/* Interactive Map Graphic Representation */}
        <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 bg-[#FFF5F5] border border-red-200 flex items-center justify-center">
          {/* Map background illustration */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#DC2626_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

          {/* Road grid lines */}
          <div className="absolute top-1/2 left-0 right-0 h-12 bg-gray-200 -translate-y-1/2 border-y-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-[11px] font-bold text-gray-600 tracking-widest uppercase">
              Rajguru Nagar Main Market Road
            </span>
          </div>
          <div className="absolute top-0 bottom-0 left-1/3 w-10 bg-gray-200 border-x border-gray-300" />

          {/* Restaurant Marker Box */}
          <div className="relative z-10 p-5 rounded-2xl bg-white shadow-2xl border-2 border-[#DC2626] max-w-xs text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#DC2626] text-white flex items-center justify-center mx-auto shadow-md">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
            <h4 className="font-cinzel font-bold text-[#143627] text-sm">
              Laa Mamma Mia! Taste Of Singapore
            </h4>
            <p className="text-[11px] text-[#65736C]">
              Booth No.20, Main Market, Rajguru Nagar, Ludhiana, Punjab 141012
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[11px] font-bold text-[#DC2626] hover:underline"
            >
              Get Live GPS Navigation →
            </a>
          </div>
        </div>

        {/* Visiting Guidelines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E6DEC8] text-xs">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#143627] block">Hours</span>
              <span className="text-[#65736C]">
                Daily: {restaurantSettings.openingTime} – {restaurantSettings.closingTime}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#143627] block">Booth Location</span>
              <span className="text-[#65736C]">Booth No.20, Main Market</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#143627] block">Phone Contact</span>
              <span className="text-[#65736C]">{restaurantSettings.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
