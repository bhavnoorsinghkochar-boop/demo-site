import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THEMES, FONTS, DEMO_BRAND_PRESETS, AppThemeId, AppFontId } from '../data/themeData';
import {
  Sparkles,
  Palette,
  Type,
  Store,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Wand2,
} from 'lucide-react';

export const ThemeCustomizerModal: React.FC = () => {
  const {
    isThemeModalOpen,
    setIsThemeModalOpen,
    currentTheme,
    setTheme,
    currentFont,
    setFont,
    restaurantSettings,
    updateRestaurantSettings,
    showToast,
    setHasSelectedInitialTheme,
  } = useApp();

  const [tempTheme, setTempTheme] = useState<AppThemeId>(currentTheme);
  const [tempFont, setTempFont] = useState<AppFontId>(currentFont);
  const [tempName, setTempName] = useState<string>(restaurantSettings.name);
  const [tempSubtitle, setTempSubtitle] = useState<string>(restaurantSettings.subtitle);

  if (!isThemeModalOpen) return null;

  const handleApply = () => {
    setTheme(tempTheme);
    setFont(tempFont);
    if (tempName.trim()) {
      updateRestaurantSettings({
        ...restaurantSettings,
        name: tempName.trim(),
        subtitle: tempSubtitle.trim() || 'A Multi Cuisine Dining Experience',
      });
    }
    setHasSelectedInitialTheme(true);
    setIsThemeModalOpen(false);
    showToast(`Applied ${THEMES[tempTheme].name} with ${FONTS[tempFont].name}`, 'success');
  };

  const handleSelectPreset = (name: string, subtitle: string) => {
    setTempName(name);
    setTempSubtitle(subtitle);
  };

  const activeThemeConfig = THEMES[tempTheme];
  const activeFontConfig = FONTS[tempFont];

  return (
    <div
      id="theme-customizer-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsThemeModalOpen(false)}
    >
      <div
        id="theme-customizer-dialog"
        className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E6DEC8] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6 text-white relative shrink-0 transition-colors duration-300"
          style={{ backgroundColor: activeThemeConfig.primary }}
        >
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
              White-Label Demo Showcase
            </span>
          </div>

          <h2
            className="text-xl sm:text-2xl font-bold tracking-wide transition-all"
            style={{ fontFamily: activeFontConfig.fontFamily }}
          >
            Customize Demo: Theme & Font
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-md leading-relaxed">
            Select your preferred visual style, typography, and restaurant name to show different clients and audiences.
          </p>
        </div>

        {/* Scrollable Configuration Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-7 flex-1">
          {/* Section 1: Themes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#2E7D58]" />
              <h3 className="font-bold text-sm text-[#143627]">
                1. Which Theme Color Palette do you like?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(THEMES) as AppThemeId[]).map((themeKey) => {
                const th = THEMES[themeKey];
                const isSelected = tempTheme === themeKey;

                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTempTheme(th.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#143627] bg-[#FAF7F2] shadow-sm ring-2 ring-[#2E7D58]/20'
                        : 'border-[#E6DEC8] bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#143627]">
                            {th.name}
                          </span>
                          {th.isDark && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-bold">
                              Dark
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#65736C]">
                          {th.subtitle}
                        </p>
                      </div>

                      {/* Swatches */}
                      <div className="flex items-center gap-1 shrink-0 mt-0.5">
                        <span
                          className="w-4 h-4 rounded-full shadow-2xs border border-white"
                          style={{ backgroundColor: th.primary }}
                          title="Primary color"
                        />
                        <span
                          className="w-4 h-4 rounded-full shadow-2xs border border-white"
                          style={{ backgroundColor: th.secondary }}
                          title="Secondary color"
                        />
                        <span
                          className="w-4 h-4 rounded-full shadow-2xs border border-white"
                          style={{ backgroundColor: th.accent }}
                          title="Accent color"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                      {th.description}
                    </p>

                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#143627] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Typography / Fonts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-[#C69234]" />
              <h3 className="font-bold text-sm text-[#143627]">
                2. Which Typography & Font style do you prefer?
              </h3>
            </div>

            <div className="space-y-2.5">
              {(Object.keys(FONTS) as AppFontId[]).map((fontKey) => {
                const ft = FONTS[fontKey];
                const isSelected = tempFont === fontKey;

                return (
                  <button
                    key={ft.id}
                    type="button"
                    onClick={() => setTempFont(ft.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#143627] bg-[#FAF7F2] shadow-sm ring-2 ring-[#2E7D58]/20'
                        : 'border-[#E6DEC8] bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#143627]">
                            {ft.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                            {ft.style}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#65736C] mt-0.5">
                          {ft.description}
                        </p>
                      </div>

                      {/* Live Typography Preview String */}
                      <div
                        className="text-sm sm:text-base font-bold text-[#143627] truncate sm:max-w-[220px] bg-white/70 px-2.5 py-1 rounded-lg border border-[#E6DEC8]/60"
                        style={{ fontFamily: ft.fontFamily }}
                      >
                        {ft.sampleText}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#143627] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Brand Name & Presets (White-Label for Different People) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#2E7D58]" />
                <h3 className="font-bold text-sm text-[#143627]">
                  3. Restaurant Display Name (White-Label)
                </h3>
              </div>
              <span className="text-[11px] text-[#65736C]">Customizable for demos</span>
            </div>

            {/* Quick Demo Presets */}
            <div className="flex flex-wrap items-center gap-2">
              {DEMO_BRAND_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.name, preset.subtitle)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    tempName === preset.name
                      ? 'bg-[#143627] text-white border-[#143627] shadow-2xs'
                      : 'bg-[#FAF7F2] text-[#143627] border-[#E6DEC8] hover:bg-[#EAE2D3]'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-[#65736C] block mb-1">
                  Brand Name (or any client name):
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Your Restaurant Name / Spice House"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DEC8] text-xs font-semibold text-[#143627] focus:outline-none focus:border-[#2E7D58] bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#65736C] block mb-1">
                  Subtitle / Tagline:
                </label>
                <input
                  type="text"
                  value={tempSubtitle}
                  onChange={(e) => setTempSubtitle(e.target.value)}
                  placeholder="e.g. A Multi Cuisine Experience"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6DEC8] text-xs font-semibold text-[#143627] focus:outline-none focus:border-[#2E7D58] bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#65736C] self-start sm:self-auto">
            <span>Current Preview:</span>
            <strong className="text-[#143627]">
              {THEMES[tempTheme].name} · {FONTS[tempFont].name}
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setTempTheme('emerald');
                setTempFont('cinzel');
                setTempName('Your Restaurant Name');
                setTempSubtitle('A Multi Cuisine Dining Experience');
              }}
              className="px-3.5 py-2 rounded-xl border border-[#E6DEC8] bg-white hover:bg-gray-100 text-xs font-semibold text-[#4A5550] transition-colors"
            >
              Reset Defaults
            </button>

            <button
              id="apply-theme-and-font-btn"
              onClick={handleApply}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              style={{ backgroundColor: activeThemeConfig.primary }}
            >
              <span>Apply Theme & Explore App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
