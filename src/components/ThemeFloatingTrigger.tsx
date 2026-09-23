import React from 'react';
import { useApp } from '../context/AppContext';
import { THEMES, FONTS } from '../data/themeData';
import { Palette, Sparkles, ChevronRight } from 'lucide-react';

export const ThemeFloatingTrigger: React.FC = () => {
  const { isThemeModalOpen, setIsThemeModalOpen, currentTheme, currentFont, restaurantSettings } = useApp();

  if (isThemeModalOpen) return null;

  const themeConfig = THEMES[currentTheme];
  const fontConfig = FONTS[currentFont];

  return (
    <aside
      aria-label="Demo customization panel"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center"
    >
      <button
        id="floating-theme-customizer-btn"
        onClick={() => setIsThemeModalOpen(true)}
        className="group px-3.5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E6DEC8] shadow-lg hover:shadow-xl text-[#143627] text-xs font-bold transition-all flex items-center gap-2.5 hover:scale-105 active:scale-95"
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full shadow-2xs"
            style={{ backgroundColor: themeConfig.primary }}
          />
          <span
            className="w-3 h-3 rounded-full shadow-2xs"
            style={{ backgroundColor: themeConfig.accent }}
          />
        </div>

        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1 leading-none">
            <span className="text-[10px] font-semibold text-[#65736C] uppercase tracking-wider">
              Demo Style
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#143627] block">
            {themeConfig.name} · {fontConfig.name}
          </span>
        </div>

        <div className="w-7 h-7 rounded-xl bg-[#143627] text-white flex items-center justify-center shrink-0">
          <Palette className="w-3.5 h-3.5 text-[#C69234]" />
        </div>
      </button>
    </aside>
  );
};
