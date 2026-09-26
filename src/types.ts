export type MenuCategoryType = 'food' | 'beverage';

export interface CustomizationOption {
  id: string;
  name: string;
  priceDelta: number; // e.g. 0 or +50 or +150
}

export interface CustomizationGroup {
  id: string;
  name: string; // e.g. "Size", "Add-on Flavor", "Cream Choice", "Stuffing Choice"
  required: boolean;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  menuType: MenuCategoryType;
  image: string;
  vegetarian: boolean; // True for veg items (churros, bubble waffles, sodas, etc.)
  available: boolean;
  customizations?: CustomizationGroup[];
  spicyLevel?: 0 | 1 | 2 | 3;
  isSpecial?: boolean;
  pageNumber?: number; // e.g. 2 for Coffee, 4 for Soups & Dimsums, 7 for Dosas
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartCustomizationSelection {
  groupName: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string; // unique for this combination
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations: CartCustomizationSelection[];
  specialInstructions?: string;
  unitPrice: number; // base price + selected options
  totalPrice: number; // unitPrice * quantity
}

export type OrderType = 'delivery' | 'takeaway' | 'dine-in';

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  tableNumber?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  orderType: OrderType;
  status: OrderStatus;
  customerDetails: CustomerDetails;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Pay at Counter';
  paymentStatus: 'pending' | 'completed';
  createdAt: string;
  estimatedTimeMinutes?: number;
  statusHistory?: { status: OrderStatus; timestamp: string }[];
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  type: 'dining' | 'delivery';
  date: string;
  comment: string;
  photoUrl?: string;
  verified?: boolean;
}

export interface RestaurantSettings {
  name: string;
  subtitle: string;
  location: string;
  address: string;
  openingTime: string; // "10:00 AM"
  closingTime: string; // "10:00 PM"
  openingHour24: number; // 10
  closingHour24: number; // 22
  phone: string;
  eventPhone: string;
  diningRating: number; // 4.1
  diningRatingCount: number; // 4
  deliveryRating: number; // 3.8
  deliveryRatingCount: number; // 86
  pureVeg: boolean;
  happyHours: string; // "4:00 PM - 6:00 PM"
  deliveryFee: number;
  taxPercent: number; // 5% GST
  deliveryEnabled: boolean;
  takeawayEnabled: boolean;
  dineInEnabled: boolean;
}

export type AppTab = 'home' | 'menu' | 'cart' | 'favourites' | 'account' | 'orders' | 'reviews' | 'about' | 'gallery' | 'location' | 'admin';

export type AppThemeId = 'emerald' | 'saffron' | 'midnight' | 'ruby' | 'ocean' | 'charcoal' | 'singapore';
export type AppFontId = 'cinzel' | 'playfair' | 'jakarta' | 'outfit' | 'inter';
export type DeviceViewMode = 'responsive' | 'mobile';
