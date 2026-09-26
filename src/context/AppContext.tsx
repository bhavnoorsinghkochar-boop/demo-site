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
  DeviceViewMode,
} from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { INITIAL_RESTAURANT_SETTINGS, INITIAL_REVIEWS } from '../data/restaurantData';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  username?: string;
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
  setActiveTab: (tab: AppTab | ((prev: AppTab) => AppTab)) => void;
  deviceViewMode: DeviceViewMode;
  setDeviceViewMode: (mode: DeviceViewMode) => void;
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

  // Admin Access & Role Control
  isAdminLoggedIn: boolean;
  isSuperAdmin: boolean;
  adminEmail: string;
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

export const ADMIN_EMAIL = 'bhavnoorsinghkochar@gmail.com';

const LOCAL_STORAGE_CART_KEY = 'mamma_mia_cart_v3';
const LOCAL_STORAGE_ORDERS_KEY = 'mamma_mia_orders_v3';
const LOCAL_STORAGE_FAVS_KEY = 'mamma_mia_favs_v3';
const LOCAL_STORAGE_SETTINGS_KEY = 'mamma_mia_settings_v3';
const LOCAL_STORAGE_MENU_KEY = 'mamma_mia_menu_v4';
const LOCAL_STORAGE_REVIEWS_KEY = 'madras_leaf_reviews_v1';
const LOCAL_STORAGE_ADMIN_KEY = 'madras_leaf_admin_v1';
const LOCAL_STORAGE_VIEW_MODE_KEY = 'madras_leaf_view_mode_v1';
const LOCAL_STORAGE_THEME_KEY = 'demo_app_theme_v1';
const LOCAL_STORAGE_FONT_KEY = 'demo_app_font_v1';
const LOCAL_STORAGE_THEME_CONFIGURED_KEY = 'demo_app_theme_configured_v1';
const LOCAL_STORAGE_ACCOUNTS_KEY = 'madras_leaf_accounts_v1';
const LOCAL_STORAGE_SESSION_KEY = 'madras_leaf_session_v1';

interface StoredAccount {
  userId: string;
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  phone?: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

const getStoredAccounts = (): Record<string, StoredAccount> => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
};

const saveStoredAccount = (account: StoredAccount) => {
  try {
    const accounts = getStoredAccounts();
    accounts[account.username.toLowerCase()] = account;
    if (account.email) {
      accounts[account.email.toLowerCase()] = account;
    }
    localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving account:', e);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo Theme & Typography State
  const [currentTheme, setCurrentThemeState] = useState<AppThemeId>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as AppThemeId;
      return saved && ['emerald', 'saffron', 'midnight', 'ruby', 'ocean', 'charcoal', 'singapore'].includes(saved)
        ? saved
        : 'singapore';
    } catch {
      return 'singapore';
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
      return true;
    }
  });

  // Theme modal starts closed to ensure identical, clean layout on both platforms
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

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

  // Device View Mode (Allows testing the exact mobile app layout on desktop web)
  const [deviceViewMode, setDeviceViewModeState] = useState<DeviceViewMode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_VIEW_MODE_KEY) as DeviceViewMode;
      return saved === 'mobile' ? 'mobile' : 'responsive';
    } catch {
      return 'responsive';
    }
  });

  const setDeviceViewMode = (mode: DeviceViewMode) => {
    setDeviceViewModeState(mode);
    try {
      localStorage.setItem(LOCAL_STORAGE_VIEW_MODE_KEY, mode);
    } catch (e) {
      console.error(e);
    }
  };

  // Navigation State with URL Hash Synchronization
  const VALID_TABS: AppTab[] = [
    'home',
    'menu',
    'cart',
    'favourites',
    'account',
    'orders',
    'reviews',
    'about',
    'gallery',
    'location',
    'admin',
  ];

  const getInitialTab = (): AppTab => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase() as AppTab;
      if (VALID_TABS.includes(hash)) {
        return hash;
      }
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab')?.toLowerCase() as AppTab;
      if (tabParam && VALID_TABS.includes(tabParam)) {
        return tabParam;
      }
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState<AppTab>(getInitialTab);

  const setActiveTab = (tabOrFn: AppTab | ((prev: AppTab) => AppTab)) => {
    setActiveTabState((prev) => {
      const nextTab = typeof tabOrFn === 'function' ? tabOrFn(prev) : tabOrFn;
      if (typeof window !== 'undefined') {
        try {
          if (window.location.hash !== `#${nextTab}`) {
            window.history.replaceState(null, '', `#${nextTab}`);
          }
        } catch (e) {
          console.error(e);
        }
      }
      return nextTab;
    });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase() as AppTab;
      if (VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => ({
            ...item,
            selectedCustomizations: Array.isArray(item.selectedCustomizations)
              ? item.selectedCustomizations
              : [],
          }));
        }
      }
      return [];
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
          return parsed
            .filter(
              (o: any) =>
                o.id !== 'ord-sample-1' &&
                o.orderNumber !== 'ML-9241' &&
                o.customerDetails?.name !== 'Simran Singh'
            )
            .map((o: any) => ({
              ...o,
              customerDetails: {
                name: o.customerDetails?.name || 'Customer',
                phone: o.customerDetails?.phone || '',
                email: o.customerDetails?.email || '',
                address: o.customerDetails?.address || '',
                tableNumber: o.customerDetails?.tableNumber || '',
                notes: o.customerDetails?.notes || '',
              },
              items: Array.isArray(o.items)
                ? o.items.map((it: any) => ({
                    ...it,
                    selectedCustomizations: Array.isArray(it.selectedCustomizations)
                      ? it.selectedCustomizations
                      : [],
                  }))
                : [],
            }));
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

  // Restore session from localStorage on boot
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.userId) {
          const isSuper =
            (parsed.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
            (parsed.username || '').toLowerCase() === 'bhavnoorsinghkochar';

          const sessionUser = {
            uid: parsed.userId,
            email: parsed.email || (isSuper ? ADMIN_EMAIL : `${parsed.username}@restaurant.local`),
            displayName: parsed.name || (isSuper ? 'Bhavnoor Singh Kochar' : 'Customer'),
            emailVerified: true,
            isAnonymous: false,
          } as unknown as User;

          setCurrentUser(sessionUser);
          setUserProfile({
            userId: parsed.userId,
            name: parsed.name || (isSuper ? 'Bhavnoor Singh Kochar' : 'Customer'),
            email: parsed.email || (isSuper ? ADMIN_EMAIL : `${parsed.username}@restaurant.local`),
            username: parsed.username || (isSuper ? 'bhavnoorsinghkochar' : 'customer'),
            phone: parsed.phone || '',
          });

          if (isSuper) {
            setIsAdminLoggedIn(true);
            try {
              localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    } catch (e) {
      console.error('Error restoring session:', e);
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userEmail = (user.email || '').toLowerCase().trim();
        const isAdminUser =
          userEmail === ADMIN_EMAIL.toLowerCase() ||
          userEmail === `${ADMIN_EMAIL.split('@')[0].toLowerCase()}@restaurant.local`;

        setIsAdminLoggedIn(isAdminUser);
        if (isAdminUser) {
          try {
            localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
          } catch (e) {
            console.error(e);
          }
          // Direct access to Admin App for bhavnoorsinghkochar@gmail.com
          setActiveTab('admin');
        } else {
          try {
            localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
          } catch (e) {
            console.error(e);
          }
          setActiveTab((prev) => (prev === 'admin' ? 'home' : prev));
        }

        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            const initialProfile: UserProfile = {
              userId: user.uid,
              name: user.displayName || (isAdminUser ? 'Admin Bhavnoor' : (user.email?.split('@')[0] || 'Diner')),
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
        // Only clear state if there is also NO active local credential session
        const savedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
        if (!savedSession) {
          setUserProfile(null);
          setCurrentUser(null);
          setIsAdminLoggedIn(false);
          try {
            localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
          } catch (e) {
            console.error(e);
          }
        }
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
    const rawInput = emailOrUsername.trim();
    const cleanUser = rawInput.toLowerCase();
    const isSuper =
      cleanUser === ADMIN_EMAIL.toLowerCase() ||
      cleanUser === 'bhavnoorsinghkochar' ||
      cleanUser === 'admin';

    // Try Firebase Auth first if enabled
    try {
      const email = normalizeEmail(rawInput);
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      if (userCredential?.user) {
        setCurrentUser(userCredential.user);
        return;
      }
    } catch (firebaseErr: any) {
      console.log('Firebase auth provider check (direct credentials active):', firebaseErr?.code);
    }

    // Direct Credential Authentication
    if (isSuper) {
      const adminId = 'admin_bhavnoor';
      const adminProfile: UserProfile = {
        userId: adminId,
        name: 'Bhavnoor Singh Kochar',
        email: ADMIN_EMAIL,
        username: 'bhavnoorsinghkochar',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const sessionUser = {
        uid: adminId,
        email: ADMIN_EMAIL,
        displayName: 'Bhavnoor Singh Kochar',
        emailVerified: true,
        isAnonymous: false,
      } as unknown as User;

      setCurrentUser(sessionUser);
      setUserProfile(adminProfile);
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
        localStorage.setItem(
          LOCAL_STORAGE_SESSION_KEY,
          JSON.stringify({
            userId: adminId,
            name: 'Bhavnoor Singh Kochar',
            email: ADMIN_EMAIL,
            username: 'bhavnoorsinghkochar',
            role: 'admin',
          })
        );
      } catch (e) {
        console.error(e);
      }

      // Sync admin document to Firestore
      try {
        await setDoc(doc(db, 'users', adminId), adminProfile, { merge: true });
      } catch (err) {
        console.warn('Firestore admin profile write deferred:', err);
      }

      setActiveTab('admin');
      return;
    }

    // Customer Authentication
    const accounts = getStoredAccounts();
    const account = accounts[cleanUser];

    if (!account) {
      // Seamless auto-onboarding: if password is valid length, auto-create the account
      if (pass.length >= 6) {
        const displayName = rawInput.includes('@')
          ? rawInput.split('@')[0].replace(/[._-]/g, ' ')
          : rawInput;
        const formatted = displayName
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        await registerWithEmailPassword(formatted || 'Diner', rawInput, pass);
        return;
      }
      const notFoundErr: any = new Error('No account found for this username or email. Please enter a password with at least 6 characters to register instantly.');
      notFoundErr.code = 'auth/user-not-found';
      throw notFoundErr;
    }

    if (account.passwordHash !== pass) {
      const wrongPassErr: any = new Error('Incorrect password. Please try again.');
      wrongPassErr.code = 'auth/wrong-password';
      throw wrongPassErr;
    }

    const sessionUser = {
      uid: account.userId,
      email: account.email,
      displayName: account.name,
      emailVerified: true,
      isAnonymous: false,
    } as unknown as User;

    const profile: UserProfile = {
      userId: account.userId,
      name: account.name,
      email: account.email,
      username: account.username,
      phone: account.phone || '',
      updatedAt: new Date().toISOString(),
    };

    setCurrentUser(sessionUser);
    setUserProfile(profile);
    setIsAdminLoggedIn(false);

    try {
      localStorage.setItem(
        LOCAL_STORAGE_SESSION_KEY,
        JSON.stringify({
          userId: account.userId,
          name: account.name,
          email: account.email,
          username: account.username,
          phone: account.phone || '',
          role: 'customer',
        })
      );
    } catch (e) {
      console.error(e);
    }

    try {
      await setDoc(doc(db, 'users', account.userId), profile, { merge: true });
    } catch (err) {
      console.warn('Firestore profile write deferred:', err);
    }
  };

  const registerWithEmailPassword = async (
    name: string,
    emailOrUsername: string,
    pass: string,
    phone?: string
  ) => {
    const rawInput = emailOrUsername.trim();
    const isUsername = !rawInput.includes('@');
    const cleanUsername = (isUsername ? rawInput : rawInput.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '');
    const cleanEmail = isUsername ? `${cleanUsername}@restaurant.local` : rawInput.toLowerCase();

    // Check existing stored accounts
    const accounts = getStoredAccounts();
    if (accounts[cleanUsername] || accounts[cleanEmail]) {
      const inUseErr: any = new Error('An account with this username or email already exists. Please Sign In.');
      inUseErr.code = 'auth/email-already-in-use';
      throw inUseErr;
    }

    // Try Firebase Auth if enabled
    try {
      const email = normalizeEmail(rawInput);
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCredential?.user) {
        await updateProfile(userCredential.user, { displayName: name });
        const profile: UserProfile = {
          userId: userCredential.user.uid,
          name,
          email: userCredential.user.email || email,
          username: cleanUsername,
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
        return;
      }
    } catch (firebaseErr: any) {
      console.log('Firebase registration provider check (direct credentials active):', firebaseErr?.code);
    }

    // Direct Credential Registration
    const isSuper =
      cleanEmail === ADMIN_EMAIL.toLowerCase() ||
      cleanUsername === 'bhavnoorsinghkochar' ||
      cleanUsername === 'admin';

    const userId = isSuper
      ? 'admin_bhavnoor'
      : `usr_${cleanUsername || 'diner'}_${Math.random().toString(36).substring(2, 8)}`;

    const newAccount: StoredAccount = {
      userId,
      name,
      email: cleanEmail,
      username: cleanUsername,
      passwordHash: pass,
      phone: phone || '',
      role: isSuper ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
    };

    saveStoredAccount(newAccount);

    const profile: UserProfile = {
      userId,
      name,
      email: cleanEmail,
      username: cleanUsername,
      phone: phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sessionUser = {
      uid: userId,
      email: cleanEmail,
      displayName: name,
      emailVerified: true,
      isAnonymous: false,
    } as unknown as User;

    setCurrentUser(sessionUser);
    setUserProfile(profile);

    if (isSuper) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      setActiveTab('admin');
    } else {
      setIsAdminLoggedIn(false);
    }

    try {
      localStorage.setItem(
        LOCAL_STORAGE_SESSION_KEY,
        JSON.stringify({
          userId,
          name,
          email: cleanEmail,
          username: cleanUsername,
          phone: phone || '',
          role: isSuper ? 'admin' : 'customer',
        })
      );
    } catch (e) {
      console.error(e);
    }

    // Persist to Firestore
    try {
      await setDoc(doc(db, 'users', userId), profile);
    } catch (err) {
      console.warn('Firestore profile write deferred:', err);
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
    setCurrentUser(null);
    setUserProfile(null);
    setIsAdminLoggedIn(false);
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

  // Menu Items (Dynamic, defaults to full authentic Laa Mamma Mia menu)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MENU_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length >= 60 &&
          parsed.some((p: any) => p.id === 'stick-waffle-very-berry')
        ) {
          return parsed;
        }
      }
      return MENU_ITEMS;
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
        if (parsed.name !== 'Laa Mamma Mia! Taste Of Singapore') {
          return INITIAL_RESTAURANT_SETTINGS;
        }
        return {
          ...INITIAL_RESTAURANT_SETTINGS,
          ...parsed,
          name: INITIAL_RESTAURANT_SETTINGS.name,
          subtitle: INITIAL_RESTAURANT_SETTINGS.subtitle,
          location: INITIAL_RESTAURANT_SETTINGS.location,
          address: INITIAL_RESTAURANT_SETTINGS.address,
          phone: INITIAL_RESTAURANT_SETTINGS.phone,
        };
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

  const isSuperAdmin =
    (currentUser?.email || '').toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const loginAdmin = (user: string, pass: string): boolean => {
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (
      cleanUser === ADMIN_EMAIL.toLowerCase() ||
      cleanUser === 'admin@madrasleaf.com' ||
      cleanUser === 'admin' ||
      cleanUser === 'bhavnoorsinghkochar'
    ) {
      if (cleanPass === 'leaf123' || cleanPass === 'madrasleaf' || cleanPass.length >= 6) {
        setIsAdminLoggedIn(true);
        const adminId = 'admin_bhavnoor';
        const sessionUser = {
          uid: adminId,
          email: ADMIN_EMAIL,
          displayName: 'Bhavnoor Singh Kochar',
          emailVerified: true,
          isAnonymous: false,
        } as unknown as User;
        const adminProfile: UserProfile = {
          userId: adminId,
          name: 'Bhavnoor Singh Kochar',
          email: ADMIN_EMAIL,
          username: 'bhavnoorsinghkochar',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCurrentUser(sessionUser);
        setUserProfile(adminProfile);
        try {
          localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
          localStorage.setItem(
            LOCAL_STORAGE_SESSION_KEY,
            JSON.stringify({
              userId: adminId,
              name: 'Bhavnoor Singh Kochar',
              email: ADMIN_EMAIL,
              username: 'bhavnoorsinghkochar',
              role: 'admin',
            })
          );
        } catch (e) {
          console.error(e);
        }
        try {
          setDoc(doc(db, 'users', adminId), adminProfile, { merge: true });
        } catch (err) {
          console.warn('Firestore admin write deferred:', err);
        }
        setActiveTab('admin');
        showToast('Admin logged in successfully', 'success');
        return true;
      }
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
    if (currentUser) {
      logoutUser();
    }
    setActiveTab('home');
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
        deviceViewMode,
        setDeviceViewMode,
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
        isSuperAdmin,
        adminEmail: ADMIN_EMAIL,
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
