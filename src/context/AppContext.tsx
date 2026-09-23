import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  CartCustomizationSelection,
  Order,
  OrderStatus,
  OrderType,
  CustomerDetails,
  Review,
  RestaurantSettings,
  AppTab,
  MenuCategoryType,
  AppThemeId,
  AppFontId,
} from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { INITIAL_RESTAURANT_SETTINGS, INITIAL_REVIEWS } from '../data/restaurantData';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
} from 'firebase/firestore';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Navigation & View State
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedMenuType: MenuCategoryType;
  setSelectedMenuType: (type: MenuCategoryType) => void;
  selectedDishForDetail: MenuItem | null;
  setSelectedDishForDetail: (item: MenuItem | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Firebase Auth & Isolated User Data
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithEmailPassword: (emailOrUsername: string, password: string) => Promise<void>;
  registerWithEmailPassword: (name: string, emailOrUsername: string, password: string, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity: number,
    customizations?: CartCustomizationSelection[],
    specialInstructions?: string
  ) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartDeliveryFee: number;
  cartGrandTotal: number;
  cartTotalCount: number;

  // Checkout & Orders
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orders: Order[];
  activeOrderForTracking: Order | null;
  setActiveOrderForTracking: (order: Order | null) => void;
  placeOrder: (
    orderType: OrderType,
    customerDetails: CustomerDetails,
    paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Pay at Counter'
  ) => Order;
  reorder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;

  // Favourites
  favourites: string[];
  toggleFavourite: (itemId: string) => void;
  isFavourite: (itemId: string) => boolean;

  // Menu items list (can be modified by admin)
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (itemOrId: MenuItem | string, updates?: Partial<MenuItem>) => void;
  deleteMenuItem: (itemId: string) => void;
  toggleDishAvailability: (itemId: string) => void;

  // Restaurant Settings & Reviews
  restaurantSettings: RestaurantSettings;
  updateRestaurantSettings: (settings: RestaurantSettings) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Admin Access (Hidden)
  isAdminLoggedIn: boolean;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  adminLogin: (user: string, pass: string) => boolean;
  adminLogout: () => void;

  // Demo Theme & Font Customizer
  currentTheme: AppThemeId;
  setTheme: (theme: AppThemeId) => void;
  currentFont: AppFontId;
  setFont: (font: AppFontId) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  hasSelectedInitialTheme: boolean;
  setHasSelectedInitialTheme: (selected: boolean) => void;

  // Toast
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'madras_leaf_cart_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'madras_leaf_orders_v1';
const LOCAL_STORAGE_FAVS_KEY = 'madras_leaf_favs_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'madras_leaf_settings_v1';
const LOCAL_STORAGE_MENU_KEY = 'madras_leaf_menu_v1';
const LOCAL_STORAGE_REVIEWS_KEY = 'madras_leaf_reviews_v1';
const LOCAL_STORAGE_ADMIN_KEY = 'madras_leaf_admin_v1';
const LOCAL_STORAGE_THEME_KEY = 'demo_app_theme_v1';
const LOCAL_STORAGE_FONT_KEY = 'demo_app_font_v1';
const LOCAL_STORAGE_THEME_CONFIGURED_KEY = 'demo_app_theme_configured_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo Theme & Typography State
  const [currentTheme, setCurrentThemeState] = useState<AppThemeId>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as AppThemeId;
      return saved && ['emerald', 'saffron', 'midnight', 'ruby', 'ocean', 'charcoal'].includes(saved)
        ? saved
        : 'emerald';
    } catch {
      return 'emerald';
    }
  });

  const [currentFont, setCurrentFontState] = useState<AppFontId>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FONT_KEY) as AppFontId;
      return saved && ['cinzel', 'playfair', 'jakarta', 'outfit', 'inter'].includes(saved)
        ? saved
        : 'cinzel';
    } catch {
      return 'cinzel';
    }
  });

  // Firebase Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Demo Theme Modal State
  const [hasSelectedInitialTheme, setHasSelectedInitialThemeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_THEME_CONFIGURED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Prompt the user with theme and font selection on launch
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_THEME_CONFIGURED_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const setTheme = (theme: AppThemeId) => {
    setCurrentThemeState(theme);
    try {
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    } catch (e) {
      console.error(e);
    }
  };

  const setFont = (font: AppFontId) => {
    setCurrentFontState(font);
    try {
      localStorage.setItem(LOCAL_STORAGE_FONT_KEY, font);
    } catch (e) {
      console.error(e);
    }
  };

  const setHasSelectedInitialTheme = (val: boolean) => {
    setHasSelectedInitialThemeState(val);
    try {
      localStorage.setItem(LOCAL_STORAGE_THEME_CONFIGURED_KEY, val ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  };

  // Sync theme and font attributes to documentElement whenever they change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.documentElement.setAttribute('data-font', currentFont);
    }
  }, [currentTheme, currentFont]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMenuType, setSelectedMenuType] = useState<MenuCategoryType>('food');
  const [selectedDishForDetail, setSelectedDishForDetail] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 2800);
  };

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Orders State (Strictly real orders placed by user/admin, no fake/prepopulated orders)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (o: Order) =>
              o.id !== 'ord-sample-1' &&
              o.orderNumber !== 'ML-9241' &&
              o.customerDetails?.name !== 'Simran Singh'
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Favourites - starts empty, no fake pre-selected dishes
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const isOldMock =
            parsed.length === 3 &&
            parsed.includes('food-dosa-4') &&
            parsed.includes('food-curry-5') &&
            parsed.includes('bev-coffee-15');
          if (!isOldMock) return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Normalize email/username helper
  const normalizeEmail = (input: string) => {
    if (input.includes('@')) return input.trim().toLowerCase();
    const clean = input.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    return `${clean || 'user'}@restaurant.local`;
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            const initialProfile: UserProfile = {
              userId: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Diner',
              email: user.email || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Synchronize cart, orders, and favourites strictly isolated for the authenticated user
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    // Subscribe to current user's private cart in Firestore
    const cartCol = collection(db, 'users', currentUser.uid, 'cart');
    const unsubCart = onSnapshot(
      cartCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const userCart: CartItem[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              cartItemId: d.cartItemId,
              menuItem: d.menuItem,
              quantity: d.quantity,
              selectedCustomizations: d.selectedCustomizations || {},
              specialInstructions: d.specialInstructions || '',
              unitPrice: d.unitPrice,
              totalPrice: d.totalPrice,
            };
          });
          setCart(userCart);
        } else {
          // If Firestore cart is currently empty but local cart has guest items, persist them to Firestore
          const localSaved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
          if (localSaved) {
            try {
              const parsed: CartItem[] = JSON.parse(localSaved);
              if (parsed.length > 0) {
                parsed.forEach((item) => {
                  const itemRef = doc(db, 'users', currentUser.uid, 'cart', item.cartItemId);
                  setDoc(itemRef, {
                    cartItemId: item.cartItemId,
                    userId: currentUser.uid,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                    specialInstructions: item.specialInstructions || '',
                    menuItem: item.menuItem,
                    selectedCustomizations: item.selectedCustomizations || {},
                  }).catch((err) => {
                    handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/cart/${item.cartItemId}`);
                  });
                });
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/cart`);
      }
    );

    // Subscribe to current user's private orders
    const ordersCol = collection(db, 'users', currentUser.uid, 'orders');
    const unsubOrders = onSnapshot(
      ordersCol,
      (snapshot) => {
        const userOrders: Order[] = snapshot.docs.map((docSnap) => docSnap.data() as Order);
        userOrders.sort((a, b) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setOrders(userOrders);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/orders`);
      }
    );

    // Subscribe to current user's private favourites
    const favsCol = collection(db, 'users', currentUser.uid, 'favourites');
    const unsubFavs = onSnapshot(
      favsCol,
      (snapshot) => {
        const userFavs: string[] = snapshot.docs.map((docSnap) => docSnap.id);
        setFavourites(userFavs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/favourites`);
      }
    );

    return () => {
      unsubCart();
      unsubOrders();
      unsubFavs();
    };
  }, [currentUser]);

  // Auth helper methods
  const loginWithEmailPassword = async (emailOrUsername: string, pass: string) => {
    const email = normalizeEmail(emailOrUsername);
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    setCurrentUser(userCredential.user);
  };

  const registerWithEmailPassword = async (
    name: string,
    emailOrUsername: string,
    pass: string,
    phone?: string
  ) => {
    const email = normalizeEmail(emailOrUsername);
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    const profile: UserProfile = {
      userId: userCredential.user.uid,
      name,
      email: userCredential.user.email || email,
      phone: phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'users', userCredential.user.uid), profile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${userCredential.user.uid}`);
    }
    setUserProfile(profile);
    setCurrentUser(userCredential.user);
  };

  const loginWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    setCurrentUser(user);
    const profileRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(profileRef);
      if (!snap.exists()) {
        const profile: UserProfile = {
          userId: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(profileRef, profile);
        setUserProfile(profile);
      } else {
        setUserProfile(snap.data() as UserProfile);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setOrders([]);
    setFavourites([]);
    setCart([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ORDERS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_FAVS_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Logged out successfully', 'info');
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Checkout modal & active order tracking modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderForTracking, setActiveOrderForTracking] = useState<Order | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVS_KEY, JSON.stringify(favourites));
    } catch (e) {
      console.error(e);
    }
  }, [favourites]);

  const toggleFavourite = (itemId: string) => {
    const exists = favourites.includes(itemId);
    setFavourites((prev) => {
      const next = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      return next;
    });

    if (currentUser) {
      const favRef = doc(db, 'users', currentUser.uid, 'favourites', itemId);
      if (exists) {
        deleteDoc(favRef).catch((err) => {
          handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/favourites/${itemId}`);
        });
      } else {
        setDoc(favRef, { itemId, userId: currentUser.uid, addedAt: new Date().toISOString() }).catch((err) => {
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/favourites/${itemId}`);
        });
      }
    }

    showToast(exists ? 'Removed from favourites' : 'Added to favourites ❤️', 'info');
  };

  const isFavourite = (itemId: string) => favourites.includes(itemId);

  // Menu Items (Dynamic, defaults to MENU_ITEMS from Zomato menu)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MENU_KEY);
      return saved ? JSON.parse(saved) : MENU_ITEMS;
    } catch {
      return MENU_ITEMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MENU_KEY, JSON.stringify(menuItems));
    } catch (e) {
      console.error(e);
    }
  }, [menuItems]);

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [item, ...prev]);
    showToast(`Added "${item.name}" to menu`);
  };

  const updateMenuItem = (itemOrId: MenuItem | string, updates?: Partial<MenuItem>) => {
    if (typeof itemOrId === 'string' && updates) {
      setMenuItems((prev) =>
        prev.map((m) => (m.id === itemOrId ? { ...m, ...updates } : m))
      );
      showToast('Updated dish');
    } else if (typeof itemOrId === 'object') {
      setMenuItems((prev) => prev.map((m) => (m.id === itemOrId.id ? itemOrId : m)));
      showToast(`Updated "${itemOrId.name}"`);
    }
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));
    showToast('Dish removed from menu', 'info');
  };

  const toggleDishAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, available: !m.available } : m))
    );
  };

  // Restaurant Settings
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Madras Leaf') {
          return {
            ...parsed,
            name: INITIAL_RESTAURANT_SETTINGS.name,
            subtitle: INITIAL_RESTAURANT_SETTINGS.subtitle,
            location: INITIAL_RESTAURANT_SETTINGS.location,
            address: INITIAL_RESTAURANT_SETTINGS.address,
          };
        }
        return parsed;
      }
      return INITIAL_RESTAURANT_SETTINGS;
    } catch {
      return INITIAL_RESTAURANT_SETTINGS;
    }
  });

  const updateRestaurantSettings = (newSettings: RestaurantSettings) => {
    setRestaurantSettings(newSettings);
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
    showToast('Restaurant settings updated');
  };

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const addReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviews((prev) => [review, ...prev]);
    showToast('Thank you for your valuable review!', 'success');
  };

  // Admin Access
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const loginAdmin = (user: string, pass: string): boolean => {
    // Valid admin credentials:
    // Email: admin@madrasleaf.com or admin
    // Password: leaf123 or madrasleaf
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@madrasleaf.com') &&
      (cleanPass === 'leaf123' || cleanPass === 'madrasleaf')
    ) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      showToast('Admin logged in successfully', 'success');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Logged out of Admin Dashboard', 'info');
  };

  // Cart Operations
  const addToCart = (
    item: MenuItem,
    quantity: number,
    customizations: CartCustomizationSelection[] = [],
    specialInstructions?: string
  ) => {
    const deltaSum = customizations.reduce((sum, c) => sum + c.priceDelta, 0);
    const unitPrice = item.price + deltaSum;
    const customKey = customizations.map((c) => `${c.groupName}:${c.optionName}`).sort().join('|');
    const cartItemId = `${item.id}-${customKey}-${specialInstructions || ''}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            menuItem: item,
            quantity,
            selectedCustomizations: customizations,
            specialInstructions,
            unitPrice,
            totalPrice: unitPrice * quantity,
          },
        ];
      }
    });

    if (currentUser) {
      const existing = cart.find((ci) => ci.cartItemId === cartItemId);
      const newQty = (existing?.quantity || 0) + quantity;
      const itemRef = doc(db, 'users', currentUser.uid, 'cart', cartItemId);
      setDoc(itemRef, {
        cartItemId,
        userId: currentUser.uid,
        quantity: newQty,
        unitPrice,
        totalPrice: newQty * unitPrice,
        specialInstructions: specialInstructions || '',
        menuItem: item,
        selectedCustomizations: customizations || {},
      }).catch((err) => {
        handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/cart/${cartItemId}`);
      });
    }

    showToast(`Added ${quantity} × ${item.name} to cart ✓`);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const currentItem = cart.find((ci) => ci.cartItemId === cartItemId);
    const unitPrice = currentItem ? currentItem.unitPrice : 0;

    setCart((prev) =>
      prev.map((ci) => {
        if (ci.cartItemId === cartItemId) {
          return {
            ...ci,
            quantity: newQuantity,
            totalPrice: ci.unitPrice * newQuantity,
          };
        }
        return ci;
      })
    );

    if (currentUser) {
      const itemRef = doc(db, 'users', currentUser.uid, 'cart', cartItemId);
      setDoc(
        itemRef,
        {
          quantity: newQuantity,
          totalPrice: unitPrice * newQuantity,
        },
        { merge: true }
      ).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/cart/${cartItemId}`);
      });
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));

    if (currentUser) {
      const itemRef = doc(db, 'users', currentUser.uid, 'cart', cartItemId);
      deleteDoc(itemRef).catch((err) => {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/cart/${cartItemId}`);
      });
    }

    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);

    if (currentUser) {
      getDocs(collection(db, 'users', currentUser.uid, 'cart'))
        .then((snapshot) => {
          snapshot.forEach((d) => {
            deleteDoc(d.ref).catch((err) => {
              handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/cart/${d.id}`);
            });
          });
        })
        .catch((err) => {
          handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/cart`);
        });
    }
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartTax = Math.round((cartSubtotal * restaurantSettings.taxPercent) / 100);
  const cartDeliveryFee = cartSubtotal > 0 ? restaurantSettings.deliveryFee : 0;
  const cartGrandTotal = cartSubtotal + cartTax + (cartSubtotal > 0 ? cartDeliveryFee : 0);
  const cartTotalCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Place Order
  const placeOrder = (
    orderType: OrderType,
    customerDetails: CustomerDetails,
    paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Pay at Counter'
  ): Order => {
    const orderNumber = `ML-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveDeliveryFee = orderType === 'delivery' ? restaurantSettings.deliveryFee : 0;
    const finalTotal = cartSubtotal + cartTax + effectiveDeliveryFee;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      date: 'Just now',
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      deliveryFee: effectiveDeliveryFee,
      discount: 0,
      grandTotal: finalTotal,
      orderType,
      status: 'confirmed',
      customerDetails,
      paymentMethod,
      paymentStatus: paymentMethod === 'UPI' || paymentMethod === 'Card' ? 'completed' : 'pending',
      createdAt: new Date().toISOString(),
      estimatedTimeMinutes: orderType === 'delivery' ? 30 : 20,
      statusHistory: [
        { status: 'placed', timestamp: 'Just now' },
        { status: 'confirmed', timestamp: 'Just now' },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setActiveOrderForTracking(newOrder);

    // Save to Firestore under the authenticated user's private collection
    if (currentUser) {
      const orderRef = doc(db, 'users', currentUser.uid, 'orders', newOrder.id);
      setDoc(orderRef, {
        ...newOrder,
        userId: currentUser.uid,
      }).catch((err) => {
        handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/orders/${newOrder.id}`);
      });
    }

    showToast(`Order #${orderNumber} Confirmed! 🎉`, 'success');
    return newOrder;
  };

  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.menuItem, item.quantity, item.selectedCustomizations, item.specialInstructions);
    });
    setActiveTab('cart');
    showToast(`Items from Order #${order.orderNumber} added to cart`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (activeOrderForTracking && activeOrderForTracking.id === orderId) {
      setActiveOrderForTracking((prev) => (prev ? { ...prev, status } : null));
    }

    if (currentUser) {
      const orderRef = doc(db, 'users', currentUser.uid, 'orders', orderId);
      setDoc(orderRef, { status }, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/orders/${orderId}`);
      });
    }

    showToast(`Order status updated to "${status.toUpperCase()}"`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (activeOrderForTracking && activeOrderForTracking.id === orderId) {
      setActiveOrderForTracking(null);
    }

    if (currentUser) {
      const orderRef = doc(db, 'users', currentUser.uid, 'orders', orderId);
      deleteDoc(orderRef).catch((err) => {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/orders/${orderId}`);
      });
    }

    showToast('Order removed', 'info');
  };

  const clearAllOrders = () => {
    setOrders([]);
    setActiveOrderForTracking(null);
    showToast('All orders cleared', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        selectedMenuType,
        setSelectedMenuType,
        selectedDishForDetail,
        setSelectedDishForDetail,
        searchQuery,
        setSearchQuery,
        currentUser,
        userProfile,
        isAuthLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithEmailPassword,
        registerWithEmailPassword,
        loginWithGoogle,
        logoutUser,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTax,
        cartDeliveryFee,
        cartGrandTotal,
        cartTotalCount,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        activeOrderForTracking,
        setActiveOrderForTracking,
        placeOrder,
        reorder,
        updateOrderStatus,
        deleteOrder,
        clearAllOrders,
        favourites,
        toggleFavourite,
        isFavourite,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleDishAvailability,
        restaurantSettings,
        updateRestaurantSettings,
        reviews,
        addReview,
        isAdminLoggedIn,
        isAdminModalOpen,
        setIsAdminModalOpen,
        loginAdmin,
        logoutAdmin,
        adminLogin: loginAdmin,
        adminLogout: logoutAdmin,
        currentTheme,
        setTheme,
        currentFont,
        setFont,
        isThemeModalOpen,
        setIsThemeModalOpen,
        hasSelectedInitialTheme,
        setHasSelectedInitialTheme,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
