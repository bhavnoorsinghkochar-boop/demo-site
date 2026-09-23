import { RestaurantSettings, Review } from '../types';

export const INITIAL_RESTAURANT_SETTINGS: RestaurantSettings = {
  name: 'Your Restaurant Name',
  subtitle: 'A Multi Cuisine Dining Experience',
  location: 'City Centre Food District & Express Delivery',
  address: '1st Floor Food Gallery, City Centre Promenade, Punjab, India',
  openingTime: '10:00 AM',
  closingTime: '10:00 PM',
  openingHour24: 10,
  closingHour24: 22,
  phone: '+91 86992 01881',
  eventPhone: '+91 72219 76976',
  diningRating: 4.1,
  diningRatingCount: 4,
  deliveryRating: 3.8,
  deliveryRatingCount: 86,
  pureVeg: true,
  happyHours: '4:00 PM – 6:00 PM',
  deliveryFee: 40,
  taxPercent: 5, // 5% GST
  deliveryEnabled: true,
  takeawayEnabled: true,
  dineInEnabled: true,
};

export const CUISINES_LIST = [
  'South Indian',
  'North Indian',
  'Chinese',
  'Fast Food',
  'Biryani',
  'Cafe',
  'Coffee',
  'Shakes',
];

/**
 * Checks if the restaurant is currently open (10:00 AM to 10:00 PM)
 */
export function isRestaurantOpen(): { isOpen: boolean; message: string } {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const totalMinutes = currentHour * 60 + currentMinute;

  const openMinutes = 10 * 60; // 10:00 AM
  const closeMinutes = 22 * 60; // 10:00 PM

  if (totalMinutes >= openMinutes && totalMinutes < closeMinutes) {
    return { isOpen: true, message: 'Open Now until 10:00 PM' };
  } else {
    return { isOpen: false, message: 'Closed · Opens at 10:00 AM' };
  }
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Harpreet Singh',
    rating: 5,
    type: 'dining',
    date: '12 Sep 2026',
    comment: 'Exceptional South Indian taste in Ludhiana! The Mysore Masala Dosa and Madras Filter Coffee were absolutely authentic. Great family ambiance at Wave Mall.',
  },
  {
    id: 'rev-2',
    author: 'Neha Sharma',
    rating: 4,
    type: 'dining',
    date: '28 Aug 2026',
    comment: 'Loved the 100% pure veg multi-cuisine concept. The Paneer Butter Masala with Chur-Chur Naan is a must-try. Clean and quick service.',
  },
  {
    id: 'rev-3',
    author: 'Rajesh Verma',
    rating: 4,
    type: 'delivery',
    date: '19 Aug 2026',
    comment: 'Ordered Hyderabadi Dum Biryani and Crispy Chilly Potato. Food was hot, neatly packaged in spill-proof containers, and arrived right on time.',
  },
  {
    id: 'rev-4',
    author: 'Simran Kaur',
    rating: 5,
    type: 'dining',
    date: '05 Aug 2026',
    comment: 'The Never Ending Family Dosa is a showstopper when you visit with children! Also very nice Cold Coffee with Ice Cream during Happy Hours.',
  },
  {
    id: 'rev-5',
    author: 'Amanpreet Gill',
    rating: 4,
    type: 'delivery',
    date: '22 Jul 2026',
    comment: 'Regular customer for their Dosa and Idli Sambar for breakfast and evening snacks. Authentic sambar taste with fresh coconut chutney.',
  },
];

export interface GalleryItem {
  id: string;
  category: 'Food' | 'Restaurant' | 'Ambience';
  title: string;
  image: string;
  description: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    category: 'Food',
    title: 'Signature Mysore Masala Dosa',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    description: 'Crisp golden crepe roasted with pure ghee, red spicy chutney, and potato masala.',
  },
  {
    id: 'g-2',
    category: 'Food',
    title: 'Authentic Madras Filter Coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    description: 'Freshly decocted chicory-blend coffee frothed in traditional brass davarah and tumbler.',
  },
  {
    id: 'g-3',
    category: 'Ambience',
    title: 'Dining Hall at Wave Mall',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    description: 'Warm lighting, leaf-themed accents, comfortable booth seating for families.',
  },
  {
    id: 'g-4',
    category: 'Food',
    title: 'Special Indian Thali',
    image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800&auto=format&fit=crop&q=80',
    description: 'Grand assortment with Paneer butter masala, Dal makhani, breads, rice, raita and dessert.',
  },
  {
    id: 'g-5',
    category: 'Restaurant',
    title: 'Modern Multi-Cuisine Live Counter',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    description: 'Hygienic 100% Pure Veg kitchen preparing fresh dosas, tandoor items, and sizzlers.',
  },
  {
    id: 'g-6',
    category: 'Food',
    title: 'Paneer Tikka Sizzler',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80',
    description: 'Smoky tandoori paneer skewers served sizzling hot with mint dip and onion rings.',
  },
  {
    id: 'g-7',
    category: 'Ambience',
    title: 'Cozy Cafe & Shake Corner',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    description: 'Relaxed space perfect for afternoon coffee meetings and Happy Hours.',
  },
  {
    id: 'g-8',
    category: 'Food',
    title: 'Deluxe Kurkure Dimsums',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
    description: 'Crispy crunchy battered dumplings served with spicy garlic schezwan dip.',
  },
];

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  tag: 'food' | 'beverage' | 'ambience';
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gp-1',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    title: 'Signature Mysore Masala Dosa',
    tag: 'food',
  },
  {
    id: 'gp-2',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    title: 'Authentic Madras Filter Coffee',
    tag: 'beverage',
  },
  {
    id: 'gp-3',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    title: 'Dining Ambience at Wave Mall',
    tag: 'ambience',
  },
  {
    id: 'gp-4',
    url: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800&auto=format&fit=crop&q=80',
    title: 'Grand Indian Thali',
    tag: 'food',
  },
  {
    id: 'gp-5',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    title: 'Modern Live Kitchen Counter',
    tag: 'ambience',
  },
  {
    id: 'gp-6',
    url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80',
    title: 'Smoky Paneer Tikka Sizzler',
    tag: 'food',
  },
  {
    id: 'gp-7',
    url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&auto=format&fit=crop&q=80',
    title: 'Thick Chocolate & Oreo Shake',
    tag: 'beverage',
  },
  {
    id: 'gp-8',
    url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
    title: 'Planet Chinese Dimsums & Noodles',
    tag: 'food',
  },
];

