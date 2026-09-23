import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ZoomIn } from 'lucide-react';
import { GALLERY_PHOTOS, GalleryPhoto } from '../data/restaurantData';

export const GalleryView: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<'All' | 'food' | 'beverage' | 'ambience'>('All');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredPhotos: GalleryPhoto[] =
    selectedTag === 'All'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p: GalleryPhoto) => p.tag === selectedTag);

  return (
    <div id="gallery-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143627] font-cinzel">
            Gallery & Ambience
          </h1>
          <p className="text-xs sm:text-sm text-[#65736C] mt-1">
            Glimpses of authentic food creations and dining at Wave Mall
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['All', 'food', 'beverage', 'ambience'] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${
                selectedTag === tag
                  ? 'bg-[#143627] text-white shadow-xs'
                  : 'bg-white border border-[#E6DEC8] text-[#2C3B34] hover:bg-[#EAE2D3]'
              }`}
            >
              {tag === 'All' ? 'All Photos' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((item: GalleryPhoto) => (
          <div
            key={item.id}
            id={`gallery-item-${item.id}`}
            onClick={() => setLightboxImage(item.url)}
            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer bg-gray-100 border border-[#E6DEC8] shadow-2xs hover:shadow-lg transition-all"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <div className="text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C69234] block">
                  {item.tag}
                </span>
                <h4 className="font-bold text-sm">{item.title}</h4>
              </div>
              <ZoomIn className="w-5 h-5 text-white/80 ml-auto shrink-0 mb-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 text-white p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Preview"
            className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
