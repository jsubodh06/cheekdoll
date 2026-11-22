import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/catalog';
import {
  CartItem,
  InfoPageKey,
  Order,
  ProductCategory,
  SavedAddress,
  SizeOption,
  UserAccount,
} from '../types';

interface ToastMessage {
  id: number;
  text: string;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlistIds: string[];
  orders: Order[];
  addresses: SavedAddress[];
  user: UserAccount;
  couponCode: string;
  appliedCoupon: { code: string; percent: number } | null;
  cartCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  finalTotal: number;
  freeShippingThreshold: number;
  activeRackFilter: 'All Pieces' | ProductCategory;
  selectedRackProductId: string;
  isRackSpotlightActive: boolean;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isCheckoutOpen: boolean;
  isAccountOpen: boolean;
  activeInfoPage: InfoPageKey;
  toast: ToastMessage | null;
  setActiveRackFilter: (filter: 'All Pieces' | ProductCategory) => void;
  selectRackProduct: (productId: string, scrollToDetail?: boolean) => void;
  setIsRackSpotlightActive: (active: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAccountOpen: (open: boolean) => void;
  setActiveInfoPage: (page: InfoPageKey) => void;
  addToCart: (item: Omit<CartItem, 'key'>) => void;
  addLookBundleToCart: (items: Array<Omit<CartItem, 'key'>>, lookTitle: string) => void;
  removeFromCart: (key: string) => void;
  updateCartQuantity: (key: string, quantity: number) => void;
  updateCartSize: (key: string, size: SizeOption) => void;
  clearCart: () => void;
  toggleWishlist: (id: string, label?: string) => void;
  isWishlisted: (id: string) => boolean;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  placeOrder: (address: SavedAddress, paymentMethod: string) => Order;
  signIn: (name: string, email: string, phone: string) => void;
  signOut: () => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  showToast: (text: string) => void;
  jumpToSection: (sectionId: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const FREE_SHIPPING_THRESHOLD = 5000;

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Home · Mumbai',
    fullName: 'Ananya Sharma',
    phone: '+91 98204 51209',
    line1: '14B Lotus Enclave, Pali Hill, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isDefault: true,
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'CD-2026-8419',
    date: '14 Nov 2026',
    status: 'Delivered',
    items: [
      {
        key: 'cd-blush-lehenga::5–6Y',
        productId: 'cd-blush-lehenga',
        name: 'Blush Zari Organza Lehenga',
        price: 5490,
        originalPrice: 6200,
        size: '5–6Y',
        quantity: 1,
        image: PRODUCTS[0].image,
        category: 'Lehenga Sets',
      },
    ],
    subtotal: 5490,
    discount: 0,
    shipping: 0,
    total: 5490,
    paymentMethod: 'UPI · Verified',
    address: DEFAULT_ADDRESSES[0],
  },
];

const VALID_COUPONS: Record<string, number> = {
  CHEEKDOLL10: 10,
  FESTIVE15: 15,
  LITTLEMAGIC: 12,
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => readStorage('cd_cart_v1', []));
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    readStorage('cd_wishlist_v1', ['cd-blush-lehenga', 'cd-ivory-zari-anarkali'])
  );
  const [orders, setOrders] = useState<Order[]>(() => readStorage('cd_orders_v1', DEFAULT_ORDERS));
  const [addresses, setAddresses] = useState<SavedAddress[]>(() =>
    readStorage('cd_addresses_v1', DEFAULT_ADDRESSES)
  );
  const [user, setUser] = useState<UserAccount>(() =>
    readStorage('cd_user_v1', {
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.in',
      phone: '+91 98204 51209',
      isSignedIn: false,
    })
  );

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [activeRackFilter, setActiveRackFilter] = useState<'All Pieces' | ProductCategory>('All Pieces');
  const [selectedRackProductId, setSelectedRackProductId] = useState<string>('cd-floral-party-dress');
  const [isRackSpotlightActive, setIsRackSpotlightActive] = useState<boolean>(true);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activeInfoPage, setActiveInfoPage] = useState<InfoPageKey>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('cd_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_wishlist_v1', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_orders_v1', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_addresses_v1', JSON.stringify(addresses));
    } catch {
      // ignore
    }
  }, [addresses]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_user_v1', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  const showToast = (text: string) => {
    const id = Date.now();
    setToast({ id, text });
    window.setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3200);
  };

  const addToCart = (item: Omit<CartItem, 'key'>) => {
    const key = `${item.productId}::${item.size}`;
    setCart((prev) => {
      const existing = prev.find((c) => c.key === key);
      if (existing) {
        return prev.map((c) =>
          c.key === key ? { ...c, quantity: c.quantity + item.quantity } : c
        );
      }
      return [...prev, { ...item, key }];
    });
    showToast(`Added ${item.name} (${item.size}) to your bag`);
  };

  const addLookBundleToCart = (items: Array<Omit<CartItem, 'key'>>, lookTitle: string) => {
    setCart((prev) => {
      const next = [...prev];
      for (const item of items) {
        const key = `${item.productId}::${item.size}`;
        const existingIdx = next.findIndex((c) => c.key === key);
        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + item.quantity,
          };
        } else {
          next.push({ ...item, key });
        }
      }
      return next;
    });
    showToast(`Added complete "${lookTitle}" look with 10% bundle savings`);
    setIsCartOpen(true);
  };

  const removeFromCart = (key: string) => {
    setCart((prev) => prev.filter((c) => c.key !== key));
  };

  const updateCartQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }
    setCart((prev) => prev.map((c) => (c.key === key ? { ...c, quantity } : c)));
  };

  const updateCartSize = (key: string, newSize: SizeOption) => {
    setCart((prev) => {
      const target = prev.find((c) => c.key === key);
      if (!target) return prev;
      const newKey = `${target.productId}::${newSize}`;
      if (newKey === key) return prev;
      const existingWithNewSize = prev.find((c) => c.key === newKey);
      if (existingWithNewSize) {
        return prev
          .filter((c) => c.key !== key)
          .map((c) =>
            c.key === newKey ? { ...c, quantity: c.quantity + target.quantity } : c
          );
      }
      return prev.map((c) => (c.key === key ? { ...c, key: newKey, size: newSize } : c));
    });
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (id: string, label?: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(label ? `Removed ${label} from wishlist` : 'Removed from wishlist');
        return prev.filter((item) => item !== id);
      }
      showToast(label ? `Saved ${label} to wishlist` : 'Saved to wishlist');
      return [id, ...prev];
    });
  };

  const isWishlisted = (id: string) => wishlistIds.includes(id);

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const percent = VALID_COUPONS[normalized];
    if (!percent) {
      return {
        ok: false,
        message: 'Try CHEEKDOLL10 (10% off) or FESTIVE15 (15% off).',
      };
    }
    setCouponCode(normalized);
    setAppliedCoupon({ code: normalized, percent });
    showToast(`Applied ${normalized} — ${percent}% off`);
    return { ok: true, message: `${percent}% off applied!` };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.round((subtotal * appliedCoupon.percent) / 100);
  }, [subtotal, appliedCoupon]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  }, [subtotal, discountAmount]);

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const placeOrder = (address: SavedAddress, paymentMethod: string): Order => {
    const newOrder: Order = {
      id: `CD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Order Confirmed',
      items: [...cart],
      subtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: finalTotal,
      paymentMethod,
      address,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    removeCoupon();
    showToast(`Order ${newOrder.id} confirmed!`);
    return newOrder;
  };

  const signIn = (name: string, email: string, phone: string) => {
    setUser({ name, email, phone, isSignedIn: true });
    showToast(`Welcome back, ${name}`);
  };

  const signOut = () => {
    setUser((prev) => ({ ...prev, isSignedIn: false }));
    showToast('Signed out of Cheekdoll Atelier');
  };

  const addAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = { ...addr, id: `addr-${Date.now()}` };
    setAddresses((prev) => [newAddr, ...prev]);
    showToast('Saved new shipping address');
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const jumpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectRackProduct = (productId: string, scrollToDetail = true) => {
    setSelectedRackProductId(productId);
    setIsRackSpotlightActive(true);
    if (scrollToDetail) {
      window.setTimeout(() => {
        jumpToSection('rack-detail');
      }, 60);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlistIds,
        orders,
        addresses,
        user,
        couponCode,
        appliedCoupon,
        cartCount,
        subtotal,
        discountAmount,
        shippingFee,
        finalTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        activeRackFilter,
        selectedRackProductId,
        isRackSpotlightActive,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        isCheckoutOpen,
        isAccountOpen,
        activeInfoPage,
        toast,
        setActiveRackFilter,
        selectRackProduct,
        setIsRackSpotlightActive,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsSearchOpen,
        setIsCheckoutOpen,
        setIsAccountOpen,
        setActiveInfoPage,
        addToCart,
        addLookBundleToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartSize,
        clearCart,
        toggleWishlist,
        isWishlisted,
        applyCoupon,
        removeCoupon,
        placeOrder,
        signIn,
        signOut,
        addAddress,
        removeAddress,
        showToast,
        jumpToSection,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
