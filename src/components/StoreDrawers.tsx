import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Heart,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  User,
  X,
} from 'lucide-react';
import {
  ALL_SIZES,
  PRODUCTS,
  RACK_FILTERS,
  SIZE_GUIDE_ROWS,
  formatINR,
} from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { Order, ProductCategory, SavedAddress, SizeOption } from '../types';

export const StoreDrawers: React.FC = () => {
  const {
    cart,
    wishlistIds,
    orders,
    addresses,
    user,
    appliedCoupon,
    subtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    freeShippingThreshold,
    isCartOpen,
    isWishlistOpen,
    isSearchOpen,
    isCheckoutOpen,
    isAccountOpen,
    activeInfoPage,
    toast,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsCheckoutOpen,
    setIsAccountOpen,
    setActiveInfoPage,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateCartSize,
    toggleWishlist,
    isWishlisted,
    applyCoupon,
    removeCoupon,
    placeOrder,
    signIn,
    signOut,
    addAddress,
    removeAddress,
    selectRackProduct,
    showToast,
  } = useStore();

  // Coupon state inside cart/checkout
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState<'All Pieces' | ProductCategory>('All Pieces');
  const [filterSize, setFilterSize] = useState<'All' | SizeOption>('All');
  const [filterColor, setFilterColor] = useState<string>('All');
  const [filterOccasion, setFilterOccasion] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(8000);

  // Checkout states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || 'new');
  const [checkoutForm, setCheckoutForm] = useState<Omit<SavedAddress, 'id'>>({
    label: 'Home',
    fullName: user.name || '',
    phone: user.phone || '',
    line1: addresses[0]?.line1 || '',
    city: addresses[0]?.city || 'Mumbai',
    state: addresses[0]?.state || 'Maharashtra',
    pincode: addresses[0]?.pincode || '400050',
  });
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Account modal states
  const [accountTab, setAccountTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [authName, setAuthName] = useState(user.name);
  const [authEmail, setAuthEmail] = useState(user.email);
  const [authPhone, setAuthPhone] = useState(user.phone);
  const [newAddrForm, setNewAddrForm] = useState({
    label: 'Boutique Delivery',
    fullName: user.name,
    phone: user.phone,
    line1: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Contact form state
  const [contactSent, setContactSent] = useState(false);

  const uniqueColors = useMemo(
    () => ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.color)))],
    []
  );
  const uniqueOccasions = useMemo(
    () => ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.occasion)))],
    []
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (filterCat !== 'All Pieces' && !p.categories.includes(filterCat)) return false;
      if (filterSize !== 'All' && !p.availableSizes.includes(filterSize)) return false;
      if (filterColor !== 'All' && p.color !== filterColor) return false;
      if (filterOccasion !== 'All' && p.occasion !== filterOccasion) return false;
      if (p.price > maxPrice) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.ageGroup.toLowerCase().includes(q) ||
        p.occasion.toLowerCase().includes(q) ||
        p.availableSizes.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, filterCat, filterSize, filterColor, filterOccasion, maxPrice]);

  const wishlistedProducts = useMemo(
    () => PRODUCTS.filter((p) => wishlistIds.includes(p.id)),
    [wishlistIds]
  );

  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - Math.max(0, subtotal - discountAmount)
  );
  const freeShippingProgress = Math.min(
    100,
    ((subtotal - discountAmount) / freeShippingThreshold) * 100
  );

  const handleApplyCoupon = () => {
    const res = applyCoupon(couponInput);
    setCouponFeedback(res.message);
    if (res.ok) setCouponInput('');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenAddr =
      addresses.find((a) => a.id === selectedAddressId) || {
        ...checkoutForm,
        id: `addr-${Date.now()}`,
      };
    if (!chosenAddr.fullName || !chosenAddr.line1 || !chosenAddr.city) {
      showToast('Please complete recipient name, street address, and city.');
      return;
    }
    const methodLabel =
      paymentMethod === 'UPI'
        ? 'UPI · Instant Verified'
        : paymentMethod === 'Card'
        ? 'Credit / Debit Card'
        : 'Cash on Delivery (COD)';
    const order = placeOrder(chosenAddr, methodLabel);
    setConfirmedOrder(order);
  };

  return (
    <>
      {/* Subtle Floating Toast Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[70] max-w-sm px-5 py-3.5 rounded-2xl bg-[#282326] text-[#FFFDF9] text-xs font-medium shadow-2xl border border-[#C6A46A]/45 flex items-center gap-2.5"
        >
          <Check className="w-4 h-4 text-[#C6A46A] shrink-0" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* 1. SHOPPING BAG DRAWER */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex justify-end"
          onClick={() => setIsCartOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FFFDF9] h-full flex flex-col shadow-2xl border-l border-[#E6D6DE]"
          >
            <div className="px-6 py-5 border-b border-[#EFE2E7] flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[#702D45]">
                  Your Shopping Bag
                </h2>
                <p className="text-xs text-[#282326]/60 tabular-nums">
                  {cart.reduce((s, i) => s + i.quantity, 0)} items selected
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close shopping bag"
                className="w-9 h-9 rounded-full hover:bg-[#F6DDE4]/60 flex items-center justify-center text-[#282326]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="px-6 py-3 bg-[#FAF3F5] border-b border-[#EFE2E7]">
              <div className="flex items-center gap-2 text-xs text-[#702D45] font-medium">
                <Truck className="w-4 h-4 shrink-0" />
                {remainingForFreeShipping === 0 && subtotal > 0 ? (
                  <span>Complimentary express shipping unlocked!</span>
                ) : (
                  <span className="tabular-nums">
                    Add {formatINR(remainingForFreeShipping)} more for free express shipping
                  </span>
                )}
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-[#E9D5DC] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#702D45] transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#F2E6EA]">
              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag className="w-10 h-10 mx-auto text-[#C98FA1] mb-3" />
                  <p className="font-editorial text-xl text-[#702D45] font-semibold">
                    Your bag is currently empty
                  </p>
                  <p className="mt-1.5 text-xs text-[#282326]/60 max-w-xs mx-auto">
                    Explore our festive lehengas, Anarkalis, and birthday frocks on The Rack.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="mt-5 px-6 py-2.5 rounded-full bg-[#702D45] text-white text-xs font-semibold"
                  >
                    Explore Boutique
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.key} className="py-4 flex gap-3.5">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#FAF5F0] border border-[#EAE0D8] shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#282326] leading-snug">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="text-[#282326]/40 hover:text-[#8A1C33] p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-1.5 flex items-center gap-2">
                        <label className="text-[11px] text-[#282326]/60">Size:</label>
                        <select
                          value={item.size}
                          onChange={(e) =>
                            updateCartSize(item.key, e.target.value as SizeOption)
                          }
                          aria-label={`Select size for ${item.name}`}
                          className="text-[11px] font-semibold text-[#702D45] bg-[#FAF3F5] border border-[#E6CFD7] rounded-md px-2 py-0.5 focus:outline-none"
                        >
                          {ALL_SIZES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {item.isBundleItem && (
                          <span className="text-[10px] font-semibold text-[#9A7432]">
                            10% Look Savings
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-[#E5D7DD] bg-white">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.key, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#282326]/70 hover:text-[#702D45]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.key, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#282326]/70 hover:text-[#702D45]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right tabular-nums">
                          <span className="text-sm font-bold text-[#702D45]">
                            {formatINR(item.price * item.quantity)}
                          </span>
                          {item.originalPrice && (
                            <span className="block text-[11px] text-[#282326]/40 line-through">
                              {formatINR(item.originalPrice * item.quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#FAF6F2] border-t border-[#EAE0D8] space-y-4">
                {/* Coupon Input */}
                <div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#C6A46A] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promo code (CHEEKDOLL10)"
                        className="w-full h-9 pl-8 pr-3 rounded-full bg-white border border-[#DFD4CC] text-xs focus:outline-none focus:border-[#702D45]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 h-9 rounded-full bg-[#282326] text-white text-xs font-semibold hover:bg-[#702D45] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 flex items-center justify-between text-xs text-[#1B5E43] font-medium">
                      <span>
                        Code {appliedCoupon.code} ({appliedCoupon.percent}% off) active
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="underline text-[#702D45]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {couponFeedback && !appliedCoupon && (
                    <p className="mt-1.5 text-[11px] text-[#702D45]">{couponFeedback}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-1.5 text-xs tabular-nums">
                  <div className="flex justify-between text-[#282326]/70">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#1B5E43] font-medium">
                      <span>Coupon Discount</span>
                      <span>−{formatINR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#282326]/70">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'Complimentary' : formatINR(shippingFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E3D8CE] flex justify-between text-base font-bold text-[#702D45]">
                    <span>Total</span>
                    <span>{formatINR(finalTotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setConfirmedOrder(null);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#702D45] hover:bg-[#541F33] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* 2. WISHLIST DRAWER */}
      {isWishlistOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex justify-end"
          onClick={() => setIsWishlistOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Wishlist"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FFFDF9] h-full flex flex-col shadow-2xl border-l border-[#E6D6DE]"
          >
            <div className="px-6 py-5 border-b border-[#EFE2E7] flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-2xl font-bold text-[#702D45]">
                  Saved Favourites
                </h2>
                <p className="text-xs text-[#282326]/60 tabular-nums">
                  {wishlistedProducts.length} curated pieces
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWishlistOpen(false)}
                aria-label="Close wishlist"
                className="w-9 h-9 rounded-full hover:bg-[#F6DDE4]/60 flex items-center justify-center text-[#282326]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#F2E6EA]">
              {wishlistedProducts.length === 0 ? (
                <div className="py-16 text-center">
                  <Heart className="w-10 h-10 mx-auto text-[#C98FA1] mb-3" />
                  <p className="font-editorial text-xl text-[#702D45] font-semibold">
                    No favourites saved yet
                  </p>
                  <p className="mt-1.5 text-xs text-[#282326]/60">
                    Tap the heart on any lehenga, frock, or look to keep it ready for upcoming celebrations.
                  </p>
                </div>
              ) : (
                wishlistedProducts.map((product) => (
                  <div key={product.id} className="py-4 flex gap-3.5">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-24 rounded-xl object-cover object-top bg-[#FAF5F0] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#282326]">{product.name}</h3>
                      <p className="text-xs text-[#282326]/55 mt-0.5">
                        {product.category} · {product.ageGroup}
                      </p>
                      <p className="text-sm font-bold text-[#702D45] mt-1.5 tabular-nums">
                        {formatINR(product.price)}
                      </p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart({
                              productId: product.id,
                              name: product.name,
                              price: product.price,
                              originalPrice: product.originalPrice,
                              size: product.availableSizes[2] || '5–6Y',
                              quantity: 1,
                              image: product.image,
                              category: product.category,
                            });
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#702D45] text-white text-[11px] font-semibold"
                        >
                          Move to Bag
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsWishlistOpen(false);
                            selectRackProduct(product.id, true);
                          }}
                          className="px-3 py-1.5 rounded-full border border-[#DFD2CA] text-[11px] font-semibold text-[#282326]"
                        >
                          Inspect
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id, product.name)}
                          className="ml-auto text-[#282326]/45 hover:text-[#8A1C33]"
                          aria-label={`Remove ${product.name} from wishlist`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}

      {/* 3. SEARCH & MULTI-FACET BOUTIQUE CATALOG MODAL */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search Cheekdoll Boutique"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[90vh] bg-[#FFFDF9] rounded-[28px] shadow-2xl border border-[#E5D5DC] flex flex-col overflow-hidden"
          >
            {/* Search Bar Header */}
            <div className="p-5 sm:p-6 border-b border-[#EFE2E7] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#702D45] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lehengas, Anarkalis, colours, age (e.g. 5–6Y, Emerald, Festive)..."
                className="flex-1 text-sm sm:text-base bg-transparent text-[#282326] placeholder:text-[#282326]/45 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close boutique catalog"
                className="w-9 h-9 rounded-full hover:bg-[#F6DDE4]/60 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar: Category, Age/Size, Color, Occasion, Max Price */}
            <div className="px-5 sm:px-6 py-4 bg-[#FAF5F7] border-b border-[#EFE2E7] grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#702D45] mb-1">
                  Category
                </label>
                <select
                  value={filterCat}
                  onChange={(e) =>
                    setFilterCat(e.target.value as 'All Pieces' | ProductCategory)
                  }
                  className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#E4D5DC]"
                >
                  {RACK_FILTERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#702D45] mb-1">
                  Age / Size
                </label>
                <select
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value as 'All' | SizeOption)}
                  className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#E4D5DC]"
                >
                  <option value="All">All Ages (1–14Y)</option>
                  {ALL_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#702D45] mb-1">
                  Colour
                </label>
                <select
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#E4D5DC]"
                >
                  {uniqueColors.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#702D45] mb-1">
                  Occasion
                </label>
                <select
                  value={filterOccasion}
                  onChange={(e) => setFilterOccasion(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#E4D5DC]"
                >
                  {uniqueOccasions.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#702D45] mb-1 tabular-nums">
                  Up to {formatINR(maxPrice)}
                </label>
                <input
                  type="range"
                  min={3500}
                  max={8000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#702D45] mt-2"
                />
              </div>
            </div>

            {/* Catalog Results Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4 text-xs text-[#282326]/65">
                <span className="tabular-nums">
                  Showing {searchResults.length} of {PRODUCTS.length} couture pieces
                </span>
                {(searchQuery ||
                  filterCat !== 'All Pieces' ||
                  filterSize !== 'All' ||
                  filterColor !== 'All' ||
                  filterOccasion !== 'All' ||
                  maxPrice < 8000) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCat('All Pieces');
                      setFilterSize('All');
                      setFilterColor('All');
                      setFilterOccasion('All');
                      setMaxPrice(8000);
                    }}
                    className="font-semibold text-[#702D45] underline"
                  >
                    Reset filters
                  </button>
                )}
              </div>

              {searchResults.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-editorial text-xl text-[#702D45]">
                    No outfits match those filters
                  </p>
                  <p className="mt-1 text-xs text-[#282326]/60">
                    Try widening the price range or resetting the colour filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {searchResults.map((product) => {
                    const saved = isWishlisted(product.id);
                    return (
                      <div
                        key={product.id}
                        className="group rounded-2xl bg-white border border-[#EDE2E6] overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-[3/3.5] bg-[#FAF5F0] overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product.id, product.name)}
                            aria-label={`Save ${product.name}`}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm ${
                              saved
                                ? 'bg-[#702D45] text-white'
                                : 'bg-white/85 text-[#702D45]'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[11px] text-[#C6A46A] font-semibold uppercase tracking-wider">
                              {product.category} · {product.ageGroup}
                            </p>
                            <h3 className="mt-1 font-editorial text-lg font-bold text-[#282326] leading-snug">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-sm font-bold text-[#702D45] tabular-nums">
                              {formatINR(product.price)}
                              {product.originalPrice && (
                                <span className="ml-2 text-xs text-[#282326]/40 line-through font-normal">
                                  {formatINR(product.originalPrice)}
                                </span>
                              )}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                addToCart({
                                  productId: product.id,
                                  name: product.name,
                                  price: product.price,
                                  originalPrice: product.originalPrice,
                                  size: product.availableSizes[2] || '5–6Y',
                                  quantity: 1,
                                  image: product.image,
                                  category: product.category,
                                });
                              }}
                              className="flex-1 py-2 rounded-full bg-[#702D45] hover:bg-[#541F33] text-white text-xs font-semibold transition-colors"
                            >
                              Add to Bag
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsSearchOpen(false);
                                selectRackProduct(product.id, true);
                              }}
                              className="px-3.5 py-2 rounded-full border border-[#DFD2CA] text-xs font-semibold text-[#282326] hover:border-[#702D45] hover:text-[#702D45]"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsCheckoutOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[92vh] bg-[#FFFDF9] rounded-[28px] shadow-2xl border border-[#E5D5DC] overflow-y-auto"
          >
            <div className="px-6 py-5 border-b border-[#EFE2E7] flex items-center justify-between sticky top-0 bg-[#FFFDF9]/95 backdrop-blur-md z-10">
              <h2 className="font-editorial text-2xl font-bold text-[#702D45]">
                {confirmedOrder ? 'Order Confirmed' : 'Boutique Checkout'}
              </h2>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                aria-label="Close checkout"
                className="w-9 h-9 rounded-full hover:bg-[#F6DDE4]/60 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {confirmedOrder ? (
              <div className="p-8 text-center max-w-lg mx-auto">
                <CheckCircle2 className="w-14 h-14 text-[#1B5E43] mx-auto mb-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C6A46A]">
                  Order {confirmedOrder.id} Confirmed
                </p>
                <h3 className="mt-2 font-editorial text-3xl font-bold text-[#702D45]">
                  Thank you, {confirmedOrder.address.fullName}
                </h3>
                <p className="mt-2 text-sm text-[#282326]/70">
                  Our atelier is preparing your Cheekdoll keepsake parcel for dispatch to{' '}
                  {confirmedOrder.address.city}, {confirmedOrder.address.state}.
                </p>

                <div className="mt-6 p-5 rounded-2xl bg-[#FAF5F0] border border-[#E8DDD3] text-left text-xs space-y-2 tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-[#282326]/65">Payment Method</span>
                    <span className="font-semibold">{confirmedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#282326]/65">Items</span>
                    <span className="font-semibold">
                      {confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)} pieces
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E3D7CC] text-sm font-bold text-[#702D45]">
                    <span>Amount Paid / Due</span>
                    <span>{formatINR(confirmedOrder.total)}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setAccountTab('orders');
                      setIsAccountOpen(true);
                    }}
                    className="px-6 py-3 rounded-full bg-[#702D45] text-white text-xs font-semibold"
                  >
                    Track My Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-6 py-3 rounded-full border border-[#702D45]/30 text-[#702D45] text-xs font-semibold"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleCheckoutSubmit}
                className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left: Customer, Shipping & Payment */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#702D45] mb-3">
                      1. Shipping Address
                    </h3>

                    {addresses.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer text-xs ${
                              selectedAddressId === addr.id
                                ? 'border-[#702D45] bg-[#FAF3F5]'
                                : 'border-[#E6DDD6] bg-white'
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-0.5 accent-[#702D45]"
                            />
                            <div>
                              <p className="font-semibold text-[#282326]">
                                {addr.label} · {addr.fullName}
                              </p>
                              <p className="text-[#282326]/70 mt-0.5">
                                {addr.line1}, {addr.city}, {addr.state} — {addr.pincode}
                              </p>
                              <p className="text-[#282326]/55 mt-0.5">{addr.phone}</p>
                            </div>
                          </label>
                        ))}
                        <label
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs ${
                            selectedAddressId === 'new'
                              ? 'border-[#702D45] bg-[#FAF3F5]'
                              : 'border-[#E6DDD6] bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === 'new'}
                            onChange={() => setSelectedAddressId('new')}
                            className="accent-[#702D45]"
                          />
                          <span className="font-semibold text-[#702D45]">
                            Deliver to a new address
                          </span>
                        </label>
                      </div>
                    )}

                    {(selectedAddressId === 'new' || addresses.length === 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <input
                          required
                          placeholder="Full Name"
                          value={checkoutForm.fullName}
                          onChange={(e) =>
                            setCheckoutForm({ ...checkoutForm, fullName: e.target.value })
                          }
                          className="h-10 px-3.5 rounded-xl border border-[#DFD4CC] bg-white"
                        />
                        <input
                          required
                          placeholder="Phone Number (+91)"
                          value={checkoutForm.phone}
                          onChange={(e) =>
                            setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                          }
                          className="h-10 px-3.5 rounded-xl border border-[#DFD4CC] bg-white"
                        />
                        <input
                          required
                          placeholder="Street Address & Apartment"
                          value={checkoutForm.line1}
                          onChange={(e) =>
                            setCheckoutForm({ ...checkoutForm, line1: e.target.value })
                          }
                          className="sm:col-span-2 h-10 px-3.5 rounded-xl border border-[#DFD4CC] bg-white"
                        />
                        <input
                          required
                          placeholder="City"
                          value={checkoutForm.city}
                          onChange={(e) =>
                            setCheckoutForm({ ...checkoutForm, city: e.target.value })
                          }
                          className="h-10 px-3.5 rounded-xl border border-[#DFD4CC] bg-white"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            required
                            placeholder="State"
                            value={checkoutForm.state}
                            onChange={(e) =>
                              setCheckoutForm({ ...checkoutForm, state: e.target.value })
                            }
                            className="h-10 px-3 rounded-xl border border-[#DFD4CC] bg-white"
                          />
                          <input
                            required
                            placeholder="PIN Code"
                            value={checkoutForm.pincode}
                            onChange={(e) =>
                              setCheckoutForm({ ...checkoutForm, pincode: e.target.value })
                            }
                            className="h-10 px-3 rounded-xl border border-[#DFD4CC] bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Options */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#702D45] mb-3">
                      2. Payment Method
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      {(
                        [
                          { id: 'UPI', label: 'UPI / GPay / PhonePe' },
                          { id: 'Card', label: 'Credit / Debit Card' },
                          { id: 'COD', label: 'Cash on Delivery' },
                        ] as const
                      ).map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`p-3 rounded-xl border text-left font-semibold transition-colors ${
                            paymentMethod === pm.id
                              ? 'border-[#702D45] bg-[#FAF3F5] text-[#702D45]'
                              : 'border-[#E4D9D0] bg-white text-[#282326]/75'
                          }`}
                        >
                          {pm.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-5 rounded-2xl bg-[#FAF5F0] border border-[#E9DED4] p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[#702D45] mb-3">
                      Order Summary
                    </h3>
                    <ul className="space-y-2.5 max-h-52 overflow-y-auto pr-1 text-xs">
                      {cart.map((item) => (
                        <li key={item.key} className="flex justify-between gap-2">
                          <span className="text-[#282326]/80 truncate">
                            {item.name} ({item.size}) × {item.quantity}
                          </span>
                          <span className="font-semibold tabular-nums shrink-0">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-4 border-t border-[#E4D8CE] space-y-1.5 text-xs tabular-nums">
                      <div className="flex justify-between text-[#282326]/70">
                        <span>Subtotal</span>
                        <span>{formatINR(subtotal)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-[#1B5E43]">
                          <span>Discount ({appliedCoupon?.code})</span>
                          <span>−{formatINR(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#282326]/70">
                        <span>Express Shipping</span>
                        <span>
                          {shippingFee === 0 ? 'Complimentary' : formatINR(shippingFee)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-[#E4D8CE] flex justify-between text-base font-bold text-[#702D45]">
                        <span>Total Payable</span>
                        <span>{formatINR(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 w-full py-3.5 rounded-full bg-[#702D45] hover:bg-[#541F33] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. CUSTOMER ACCOUNT, ORDER TRACKING & SAVED ADDRESSES MODAL */}
      {isAccountOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsAccountOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Customer Account"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] bg-[#FFFDF9] rounded-[28px] shadow-2xl border border-[#E5D5DC] overflow-y-auto"
          >
            <div className="px-6 py-5 border-b border-[#EFE2E7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F6DDE4] text-[#702D45] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#702D45]">
                    {user.isSignedIn ? `Welcome, ${user.name}` : 'Cheekdoll Member Atelier'}
                  </h2>
                  <p className="text-xs text-[#282326]/60">
                    {user.isSignedIn ? user.email : 'Sign in to manage orders and saved addresses'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAccountOpen(false)}
                aria-label="Close account modal"
                className="w-9 h-9 rounded-full hover:bg-[#F6DDE4]/60 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pt-4 flex items-center gap-6 border-b border-[#EFE2E7] text-xs font-semibold">
              {(
                [
                  { id: 'orders', label: `Orders & Tracking (${orders.length})` },
                  { id: 'addresses', label: `Saved Addresses (${addresses.length})` },
                  { id: 'profile', label: user.isSignedIn ? 'Profile' : 'Sign In / Join' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAccountTab(tab.id)}
                  className={`pb-3 border-b-2 transition-colors ${
                    accountTab === tab.id
                      ? 'border-[#702D45] text-[#702D45]'
                      : 'border-transparent text-[#282326]/55 hover:text-[#282326]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {accountTab === 'orders' && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-[#FAF6F2] border border-[#EAE0D7]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DBD1]">
                        <div>
                          <p className="text-xs font-bold text-[#702D45] tabular-nums">
                            {order.id}
                          </p>
                          <p className="text-[11px] text-[#282326]/60">
                            Placed on {order.date} · {order.paymentMethod}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B5E43]">
                          <Package className="w-3.5 h-3.5" />
                          <span>{order.status}</span>
                        </span>
                      </div>

                      {/* Order Tracking Progress Steps */}
                      <div className="mt-4 grid grid-cols-4 gap-2 text-[10px] text-center">
                        {['Order Confirmed', 'Atelier Tailoring', 'Dispatched', 'Delivered'].map(
                          (step, idx) => {
                            const statusOrder = [
                              'Order Confirmed',
                              'Atelier Tailoring',
                              'Dispatched',
                              'Delivered',
                            ];
                            const reached = statusOrder.indexOf(order.status) >= idx;
                            return (
                              <div key={step}>
                                <div
                                  className={`h-1.5 rounded-full mb-1.5 ${
                                    reached ? 'bg-[#702D45]' : 'bg-[#E2D6CC]'
                                  }`}
                                />
                                <span
                                  className={
                                    reached
                                      ? 'font-semibold text-[#702D45]'
                                      : 'text-[#282326]/45'
                                  }
                                >
                                  {step}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-[#282326]/75">
                          {order.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                        </span>
                        <span className="font-bold text-[#702D45] tabular-nums">
                          {formatINR(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {accountTab === 'addresses' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EAE0D7] text-xs relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#702D45] inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {addr.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAddress(addr.id)}
                            className="text-[#282326]/40 hover:text-[#8A1C33]"
                            aria-label="Remove address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="mt-1.5 font-semibold text-[#282326]">{addr.fullName}</p>
                        <p className="text-[#282326]/70 mt-0.5">
                          {addr.line1}, {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-[#282326]/55 mt-0.5">{addr.phone}</p>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAddrForm.line1 || !newAddrForm.city) return;
                      addAddress(newAddrForm);
                      setNewAddrForm({
                        label: 'Home',
                        fullName: user.name,
                        phone: user.phone,
                        line1: '',
                        city: '',
                        state: '',
                        pincode: '',
                      });
                    }}
                    className="p-4 rounded-2xl border border-[#E6D9D0] bg-white space-y-3 text-xs"
                  >
                    <p className="font-bold text-[#702D45]">Add New Address</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        placeholder="Label (e.g. Home, Jaipur Villa)"
                        value={newAddrForm.label}
                        onChange={(e) =>
                          setNewAddrForm({ ...newAddrForm, label: e.target.value })
                        }
                        className="h-9 px-3 rounded-lg border border-[#DFD4CC]"
                      />
                      <input
                        placeholder="Full Name"
                        value={newAddrForm.fullName}
                        onChange={(e) =>
                          setNewAddrForm({ ...newAddrForm, fullName: e.target.value })
                        }
                        className="h-9 px-3 rounded-lg border border-[#DFD4CC]"
                      />
                      <input
                        required
                        placeholder="Address Line"
                        value={newAddrForm.line1}
                        onChange={(e) =>
                          setNewAddrForm({ ...newAddrForm, line1: e.target.value })
                        }
                        className="sm:col-span-2 h-9 px-3 rounded-lg border border-[#DFD4CC]"
                      />
                      <input
                        required
                        placeholder="City"
                        value={newAddrForm.city}
                        onChange={(e) =>
                          setNewAddrForm({ ...newAddrForm, city: e.target.value })
                        }
                        className="h-9 px-3 rounded-lg border border-[#DFD4CC]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          required
                          placeholder="State"
                          value={newAddrForm.state}
                          onChange={(e) =>
                            setNewAddrForm({ ...newAddrForm, state: e.target.value })
                          }
                          className="h-9 px-3 rounded-lg border border-[#DFD4CC]"
                        />
                        <input
                          required
                          placeholder="Pincode"
                          value={newAddrForm.pincode}
                          onChange={(e) =>
                            setNewAddrForm({ ...newAddrForm, pincode: e.target.value })
                          }
                          className="h-9 px-3 rounded-lg border border-[#DFD4CC]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#702D45] text-white font-semibold"
                    >
                      Save Address
                    </button>
                  </form>
                </div>
              )}

              {accountTab === 'profile' && (
                <div className="max-w-md mx-auto">
                  {user.isSignedIn ? (
                    <div className="p-6 rounded-2xl bg-[#FAF5F0] border border-[#E8DDD3] space-y-3 text-sm">
                      <p>
                        <span className="text-[#282326]/60">Name:</span>{' '}
                        <strong>{user.name}</strong>
                      </p>
                      <p>
                        <span className="text-[#282326]/60">Email:</span>{' '}
                        <strong>{user.email}</strong>
                      </p>
                      <p>
                        <span className="text-[#282326]/60">Phone:</span>{' '}
                        <strong>{user.phone}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={signOut}
                        className="mt-3 px-5 py-2 rounded-full border border-[#702D45] text-[#702D45] text-xs font-semibold"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        signIn(authName, authEmail, authPhone);
                      }}
                      className="space-y-3 text-xs"
                    >
                      <p className="font-editorial text-xl font-bold text-[#702D45]">
                        Sign In or Create Member Profile
                      </p>
                      <input
                        required
                        placeholder="Parent / Member Name"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full h-10 px-4 rounded-xl border border-[#DFD4CC] bg-white"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email Address"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full h-10 px-4 rounded-xl border border-[#DFD4CC] bg-white"
                      />
                      <input
                        required
                        placeholder="Phone (+91)"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        className="w-full h-10 px-4 rounded-xl border border-[#DFD4CC] bg-white"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-full bg-[#702D45] text-white font-semibold"
                      >
                        Continue to Cheekdoll Atelier
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. BRAND, SIZE GUIDE, CONTACT & POLICY MODAL */}
      {activeInfoPage && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => {
            setActiveInfoPage(null);
            setContactSent(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[88vh] bg-[#FFFDF9] rounded-[28px] shadow-2xl border border-[#E5D5DC] overflow-y-auto p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EFE2E7]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C6A46A]">
                  Cheekdoll Apparels
                </p>
                <h2 className="mt-1 font-editorial text-3xl font-bold text-[#702D45]">
                  {activeInfoPage === 'about' && 'Our Story & Philosophy'}
                  {activeInfoPage === 'size-guide' && 'Size Guide (Ages 1–14Y)'}
                  {activeInfoPage === 'contact' && 'Contact Our Atelier'}
                  {activeInfoPage === 'shipping' && 'Shipping Information'}
                  {activeInfoPage === 'returns' && 'Returns & Exchanges'}
                  {activeInfoPage === 'privacy' && 'Privacy Policy'}
                  {activeInfoPage === 'terms' && 'Terms & Conditions'}
                  {activeInfoPage === 'faqs' && 'Frequently Asked Questions'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveInfoPage(null);
                  setContactSent(false);
                }}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full hover:bg-[#F6DDE4]/60 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 text-sm text-[#282326]/80 leading-relaxed space-y-4">
              {activeInfoPage === 'about' && (
                <>
                  <p>
                    Founded with a deep reverence for Indian textile heritage and the effortless
                    joy of childhood, <strong>Cheekdoll Apparels</strong> creates heirloom-quality
                    Indian ethnic and contemporary couture exclusively for girls aged 1 to 14.
                  </p>
                  <p>
                    Every silhouette — from hand-embroidered blush organza lehengas and Jaipur
                    zari Anarkalis to breathable rose-printed garden frocks — is lined with ultra-soft
                    100% cotton mulmul and finished with concealed soft seams so little ones can dance,
                    play, and twirl without irritation.
                  </p>
                </>
              )}

              {activeInfoPage === 'size-guide' && (
                <div className="overflow-x-auto">
                  <p className="text-xs text-[#282326]/65 mb-3">
                    All garments include a generous 2 cm inner tailoring margin for growing years.
                  </p>
                  <table className="w-full text-xs text-left border-collapse tabular-nums">
                    <thead>
                      <tr className="border-b border-[#E5D6DC] text-[#702D45]">
                        <th className="py-2.5 pr-3">Size</th>
                        <th className="py-2.5 pr-3">Age</th>
                        <th className="py-2.5 pr-3">Height</th>
                        <th className="py-2.5 pr-3">Chest</th>
                        <th className="py-2.5 pr-3">Waist</th>
                        <th className="py-2.5">Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2E7EB]">
                      {SIZE_GUIDE_ROWS.map((row) => (
                        <tr key={row.size}>
                          <td className="py-2.5 pr-3 font-bold text-[#702D45]">{row.size}</td>
                          <td className="py-2.5 pr-3">{row.age}</td>
                          <td className="py-2.5 pr-3">{row.height}</td>
                          <td className="py-2.5 pr-3">{row.chest}</td>
                          <td className="py-2.5 pr-3">{row.waist}</td>
                          <td className="py-2.5">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeInfoPage === 'contact' && (
                <div>
                  <p className="text-xs text-[#282326]/70 mb-4">
                    Flagship Boutique: 24 Kala Ghoda Heritage Lane, Mumbai · Mon–Sat, 10:30 AM – 7:30 PM IST · concierge@cheekdollapparels.in
                  </p>
                  {contactSent ? (
                    <div className="p-5 rounded-2xl bg-[#FAF5F0] border border-[#C6A46A]/50 text-[#702D45] font-medium text-xs">
                      Thank you for writing to Cheekdoll Apparels. Our personal stylist will respond within 4 business hours.
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setContactSent(true);
                      }}
                      className="space-y-3 text-xs"
                    >
                      <input
                        required
                        placeholder="Your Name"
                        className="w-full h-10 px-4 rounded-xl border border-[#DFD4CC] bg-white"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email Address"
                        className="w-full h-10 px-4 rounded-xl border border-[#DFD4CC] bg-white"
                      />
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about the occasion, child's age, or styling inquiry..."
                        className="w-full p-4 rounded-xl border border-[#DFD4CC] bg-white"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-[#702D45] text-white font-semibold"
                      >
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeInfoPage === 'shipping' && (
                <>
                  <p>
                    <strong>Complimentary Express Delivery:</strong> All orders across India above
                    ₹5,000 qualify for complimentary insured express shipping. Orders below ₹5,000
                    carry a flat ₹250 courier charge.
                  </p>
                  <p>
                    Ready-to-ship garments dispatch within 24–48 hours in bespoke cotton keepsake
                    garment bags. Delivery takes 2–4 business days in metro cities and 4–6 days
                    nationwide.
                  </p>
                </>
              )}

              {activeInfoPage === 'returns' && (
                <>
                  <p>
                    We offer complimentary <strong>10-day size exchanges</strong> and easy returns
                    on unworn, unwashed garments with original Cheekdoll tags intact.
                  </p>
                  <p>
                    Simply initiate an exchange from your Orders panel and our courier partner will
                    arrange doorstep pickup within 48 hours.
                  </p>
                </>
              )}

              {activeInfoPage === 'privacy' && (
                <p>
                  Cheekdoll Apparels respects your family’s privacy. Personal contact, shipping, and
                  sizing information is used solely to fulfill orders and provide tailored wardrobe
                  recommendations. We never sell or share customer data with third parties.
                </p>
              )}

              {activeInfoPage === 'terms' && (
                <p>
                  All garment photography, embroidery motifs, and digital designs on Cheekdoll
                  Apparels are protected intellectual property. Product prices are inclusive of all
                  applicable Indian GST taxes.
                </p>
              )}

              {activeInfoPage === 'faqs' && (
                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <p className="font-bold text-[#702D45]">Are the ethnic outfits comfortable for sensitive skin?</p>
                    <p className="text-[#282326]/75 mt-0.5">
                      Yes — every lehenga, Anarkali, and gown is fully lined with soft breathable
                      cotton mulmul so no zari or tulle touches your child’s skin.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-[#702D45]">Can I request custom sleeve or length adjustments?</p>
                    <p className="text-[#282326]/75 mt-0.5">
                      Complimentary minor tailoring adjustments are available through our Contact Atelier form after placing an order.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-[#702D45]">Which coupon codes are currently active?</p>
                    <p className="text-[#282326]/75 mt-0.5">
                      Use <strong>CHEEKDOLL10</strong> for 10% off or <strong>FESTIVE15</strong> for 15% off festive orders.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
