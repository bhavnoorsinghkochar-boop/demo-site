export type AppThemeId = 'emerald' | 'saffron' | 'midnight' | 'ruby' | 'ocean' | 'charcoal';
export type AppFontId = 'cinzel' | 'playfair' | 'jakarta' | 'outfit' | 'inter';

export interface ThemeConfig {
  id: AppThemeId;
  name: string;
  subtitle: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  cardBg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  isDark?: boolean;
}

export interface FontConfig {
  id: AppFontId;
  name: string;
  style: string;
  description: string;
  fontFamily: string;
  sampleText: string;
}

export interface DemoBrandPreset {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  badge: string;
}

export const THEMES: Record<AppThemeId, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Heritage Emerald',
    subtitle: 'Forest Green & Royal Gold',
    description: 'Classic heritage aesthetic. Ideal for authentic traditional, pure vegetarian & organic concepts.',
    primary: '#143627',
    secondary: '#235D43',
    accent: '#C69234',
    bg: '#FAF7F2',
    cardBg: '#FFFFFF',
    border: '#E6DEC8',
    text: '#143627',
    badgeBg: '#E2F4EA',
    badgeText: '#235D43',
  },
  saffron: {
    id: 'saffron',
    name: 'Royal Saffron',
    subtitle: 'Terracotta, Amber & Spices',
    description: 'Warm & aromatic palette. Perfect for North Indian, Mughlai, Tandoor & Biryani specialists.',
    primary: '#7C2D12',
    secondary: '#C2410C',
    accent: '#D97706',
    bg: '#FFFDF9',
    cardBg: '#FFFFFF',
    border: '#FED7AA',
    text: '#431407',
    badgeBg: '#FFEDD5',
    badgeText: '#9A3412',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Luxe',
    subtitle: 'Obsidian Slate & Champagne Gold',
    description: 'Ultra-luxurious dark mode experience. Suited for fine dining, evening cocktail lounges & rooftop bars.',
    primary: '#0F172A',
    secondary: '#334155',
    accent: '#F59E0B',
    bg: '#090D16',
    cardBg: '#111827',
    border: '#1F2937',
    text: '#F8FAFC',
    badgeBg: '#1E293B',
    badgeText: '#FCD34D',
    isDark: true,
  },
  ruby: {
    id: 'ruby',
    name: 'Bistro Crimson',
    subtitle: 'Ruby Wine & Warm Vanilla',
    description: 'Vibrant, appetite-stimulating palette. Perfect for pan-Asian woks, Italian pizzerias & modern bistros.',
    primary: '#881337',
    secondary: '#BE123C',
    accent: '#E11D48',
    bg: '#FFF5F5',
    cardBg: '#FFFFFF',
    border: '#FECDD3',
    text: '#4C0519',
    badgeBg: '#FFE4E6',
    badgeText: '#9F1239',
  },
  ocean: {
    id: 'ocean',
    name: 'Coastal Teal',
    subtitle: 'Deep Marine & Coral Bloom',
    description: 'Refreshing, breezy modern palette. Great for artisan cafes, coffee roasters, shakes & coastal dining.',
    primary: '#0F4C5C',
    secondary: '#1A7589',
    accent: '#FB8B24',
    bg: '#F4F9F9',
    cardBg: '#FFFFFF',
    border: '#CFE5E7',
    text: '#0A323D',
    badgeBg: '#E0F2FE',
    badgeText: '#075985',
  },
  charcoal: {
    id: 'charcoal',
    name: 'Minimal Carbon',
    subtitle: 'Matte Charcoal & Warm Bronze',
    description: 'Contemporary Scandinavian minimalism. Clean, neutral and sophisticated for any multi-cuisine brand.',
    primary: '#18181B',
    secondary: '#3F3F46',
    accent: '#D97706',
    bg: '#FAFAFA',
    cardBg: '#FFFFFF',
    border: '#E4E4E7',
    text: '#09090B',
    badgeBg: '#F4F4F5',
    badgeText: '#18181B',
  },
};

export const FONTS: Record<AppFontId, FontConfig> = {
  cinzel: {
    id: 'cinzel',
    name: 'Cinzel',
    style: 'Classical Roman Serif',
    description: 'Timeless Roman proportions, regal elegance, and distinctive luxury character.',
    fontFamily: "'Cinzel', serif",
    sampleText: 'Gourmet Multi Cuisine Experience',
  },
  playfair: {
    id: 'playfair',
    name: 'Playfair Display',
    style: 'Editorial Luxury Serif',
    description: 'High-contrast editorial serif, evoking European bistros and Michelin hospitality.',
    fontFamily: "'Playfair Display', Georgia, serif",
    sampleText: 'Artisan Culinary Craftsmanship',
  },
  jakarta: {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    style: 'Modern Geometric Sans',
    description: 'Crisp, contemporary geometric sans designed for modern consumer applications.',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    sampleText: 'Contemporary Digital Ordering',
  },
  outfit: {
    id: 'outfit',
    name: 'Outfit',
    style: 'Warm Rounded Sans',
    description: 'Inviting, friendly letterforms with soft curves, ideal for casual and lively dining.',
    fontFamily: "'Outfit', system-ui, sans-serif",
    sampleText: 'Delicious Moments, Fresh Everyday',
  },
  inter: {
    id: 'inter',
    name: 'Inter',
    style: 'Clean Swiss Minimalist',
    description: 'Ultra-legible, precise Swiss-style typography with maximum clarity on any screen.',
    fontFamily: "'Inter', system-ui, sans-serif",
    sampleText: 'Pure Flavours & Fast Kitchen Flow',
  },
};

export const DEMO_BRAND_PRESETS: DemoBrandPreset[] = [
  {
    id: 'white-label',
    name: 'Your Restaurant Name',
    subtitle: 'A Multi Cuisine Dining Experience',
    location: 'Your City Centre & Delivery Hub',
    badge: 'White-Label Demo',
  },
  {
    id: 'showcase',
    name: 'Restaurant Showcase Demo',
    subtitle: 'Interactive Mobile & Web Ordering App',
    location: '1st Floor Food Gallery, City Centre',
    badge: 'Universal Demo',
  },
  {
    id: 'heritage',
    name: 'The Heritage Kitchen',
    subtitle: 'Authentic Multi-Cuisine & Cafe',
    location: 'Mall Promenade, Central District',
    badge: 'Heritage Preset',
  },
  {
    id: 'urban',
    name: 'Urban Bistro & Lounge',
    subtitle: 'Craft Kitchen, Shakes & Coffee Bar',
    location: 'Wave Walk, West Avenue',
    badge: 'Modern Preset',
  },
];
