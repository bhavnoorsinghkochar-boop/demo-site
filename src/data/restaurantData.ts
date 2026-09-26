import { RestaurantSettings, Review } from '../types';

export const INITIAL_RESTAURANT_SETTINGS: RestaurantSettings = {
  name: 'Laa Mamma Mia! Taste Of Singapore',
  subtitle: 'Taste Of Singapore · Desserts, Burgers & Shakes',
  location: 'Booth No.20, Main Market, Rajguru Nagar, Ludhiana',
  address: 'Booth No.20, Main Market, Rajguru Nagar, Ludhiana, Punjab 141012',
  openingTime: '11:00 AM',
  closingTime: '11:30 PM',
  openingHour24: 11,
  closingHour24: 23,
  phone: '062395 36737',
  eventPhone: '+91 62395 36737',
  diningRating: 4.7,
  diningRatingCount: 65,
  deliveryRating: 4.7,
  deliveryRatingCount: 65,
  pureVeg: false,
  happyHours: '4:00 PM – 7:00 PM',
  deliveryFee: 30,
  taxPercent: 5, // 5% GST
  deliveryEnabled: true,
  takeawayEnabled: true,
  dineInEnabled: true,
};

export const CUISINES_LIST = [
  'Stick Waffles & Crepes',
  'Bubble Waffles',
  'Handcrafted Churros',
  'Gourmet Burgers',
  'Artisanal Pizzas',
  'Fries & Twisted Potato',
  'Crispy Bites & Wings',
  'Artisan Coffee & Frappes',
  'Boba & Coolers',
  'Thick Shakes & Mojitos',
];

/**
 * Checks if the restaurant is currently open (11:00 AM to 11:30 PM)
 */
export function isRestaurantOpen(): { isOpen: boolean; message: string } {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const totalMinutes = currentHour * 60 + currentMinute;

  const openMinutes = 11 * 60; // 11:00 AM
  const closeMinutes = 23 * 60 + 30; // 11:30 PM

  if (totalMinutes >= openMinutes && totalMinutes < closeMinutes) {
    return { isOpen: true, message: 'Open Now · Closes 11:30 PM' };
  } else {
    return { isOpen: false, message: 'Closed · Opens at 11:00 AM' };
  }
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Harmanpreet Singh Bhatia',
    rating: 5,
    type: 'dining',
    date: '2 months ago',
    comment:
      'The smash burger was average, but a delicious smash tikki they have. Moreover, the lime soda was delicious and customised well. I just loved their churros, and order them every time .. keep it up ! Just a flaw that people roam and drink around this place.',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Rohit K Vlogs',
    rating: 5,
    type: 'dining',
    date: '2 years ago',
    comment:
      'Mamma Mia at Rajguru Nagar offers an unforgettable experience. I indulge in their Hawaiin pina colada and Chocolate bubble stick waffle. I must say both were exceptional. The service was impeccable. Perhaps owing to the owner\'s overseas culinary expertise.',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Amit Verma',
    rating: 5,
    type: 'dining',
    date: '9 months ago',
    comment:
      'Best cheese burgers and churros in town. It does taste like something unique. Good going Laa Mamma Mia! Real Singapore vibes and flavors.',
    verified: true,
  },
  {
    id: 'rev-4',
    author: 'Simranjeet Kaur',
    rating: 5,
    type: 'delivery',
    date: '1 month ago',
    comment:
      'The Korean Grilled Chicken Burger and cheese-filled chicken burger are packed with flavour! The delivery was swift and packaging was pristine. Best dessert & burger hub in Rajguru Nagar.',
    verified: true,
  },
  {
    id: 'rev-5',
    author: 'Karan Malhotra',
    rating: 5,
    type: 'dining',
    date: '3 weeks ago',
    comment:
      'Ordered the Nutella Churros and Belgian Bubble Waffle along with Fresh Lime Soda. Reasonable prices and incredible value for money. Cozy welcoming atmosphere!',
    verified: true,
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
    title: 'Signature Nutella & Cinnamon Churros',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=80',
    description: 'Crisp golden churros dusted with aromatic cinnamon sugar, served with warm Belgian chocolate & Nutella dip.',
  },
  {
    id: 'g-2',
    category: 'Food',
    title: 'Korean Grilled Chicken Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    description: 'Juicy chicken glazed in spicy-sweet Korean gochujang, topped with crisp slaw and toasted brioche buns.',
  },
  {
    id: 'g-3',
    category: 'Food',
    title: 'Chocolate Bubble Stick Waffle',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&auto=format&fit=crop&q=80',
    description: 'Freshly baked bubble waffle on a stick smothered in melted Belgian chocolate drizzle and rainbow crunch.',
  },
  {
    id: 'g-4',
    category: 'Food',
    title: 'Molten Cheese-Filled Chicken Burger',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    description: 'Crispy fried patty with a molten oozing cheddar center, pickled gherkins, and house secret sauce.',
  },
  {
    id: 'g-5',
    category: 'Ambience',
    title: 'Cozy Rajguru Nagar Booth Storefront',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    description: 'Booth No.20, Main Market, Rajguru Nagar. Warm neon red & white vibes with polite, welcoming service.',
  },
  {
    id: 'g-6',
    category: 'Food',
    title: 'Hawaiian Piña Colada & Hand-Crafted Lime Soda',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    description: 'Signature tropical coconut-pineapple cooler and hand-customized sweet & salted spiced lime sodas.',
  },
  {
    id: 'g-7',
    category: 'Food',
    title: 'Singapore Hawker Chili Bao & Sliders',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
    description: 'Fluffy steamed buns filled with fiery Singapore chili glaze, fresh scallions, and roasted sesame.',
  },
  {
    id: 'g-8',
    category: 'Ambience',
    title: 'Dessert & Mocktail Bar Counter',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    description: 'Watch your fresh bubble waffles, hot churros, and shakes crafted live at our counter.',
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
    url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=80',
    title: 'Crispy Cinnamon Churros with Nutella',
    tag: 'food',
  },
  {
    id: 'gp-2',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    title: 'Korean Grilled Chicken Burger',
    tag: 'food',
  },
  {
    id: 'gp-3',
    url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&auto=format&fit=crop&q=80',
    title: 'Chocolate Bubble Stick Waffle',
    tag: 'food',
  },
  {
    id: 'gp-4',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    title: 'Hawaiian Piña Colada Cooler',
    tag: 'beverage',
  },
  {
    id: 'gp-5',
    url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    title: 'Cheese-Filled Chicken Burger',
    tag: 'food',
  },
  {
    id: 'gp-6',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    title: 'Hand-Crafted Customized Lime Soda',
    tag: 'beverage',
  },
  {
    id: 'gp-7',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    title: 'Booth No.20, Rajguru Nagar Storefront',
    tag: 'ambience',
  },
  {
    id: 'gp-8',
    url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&auto=format&fit=crop&q=80',
    title: 'Singapore Milo Dinosaur & Shakes',
    tag: 'beverage',
  },
];
