import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Ruler,
  X,
} from 'lucide-react';
import { ALL_SIZES, PRODUCTS, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { SizeOption } from '../types';
import { useHorizontalSwipe } from '../hooks/useHorizontalSwipe';

export const RackDetailSection: React.FC = () => {
  const {
    selectedRackProductId,
    selectRackProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setActiveInfoPage,
    jumpToSection,
  } = useStore();

  const currentIdx = Math.max(
    0,
    PRODUCTS.findIndex((p) => p.id === selectedRackProductId)
  );
  const product = PRODUCTS[currentIdx] || PRODUCTS[0];

  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showAvailability, setShowAvailability] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'fabric' | 'care'>('description');
  const [sizePrompt, setSizePrompt] = useState(false);
  const railStripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setViewMode('front');
    setSelectedSize(null);
    setQuantity(1);
    setShowAvailability(false);
    setSizePrompt(false);
  }, [product.id]);

  // Keep active mini-hanger scrolled into view
  useEffect(() => {
    const el = railStripRef.current;
    if (!el) return;
    const item = el.children[currentIdx] as HTMLElement | undefined;
    if (item) {
      const targetLeft = item.offsetLeft - el.clientWidth / 2 + item.clientWidth / 2;
      el.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
  }, [currentIdx]);

  const goPrev = () => {
    const prev = (currentIdx - 1 + PRODUCTS.length) % PRODUCTS.length;
    selectRackProduct(PRODUCTS[prev].id, false);
  };

  const goNext = () => {
    const next = (currentIdx + 1) % PRODUCTS.length;
    selectRackProduct(PRODUCTS[next].id, false);
  };

  const swipeHandlers = useHorizontalSwipe({ onPrev: goPrev, onNext: goNext });

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizePrompt(true);
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      size: selectedSize,
      quantity,
      image: product.image,
      category: product.category,
    });
  };

  const saved = isWishlisted(product.id);
  const displayImage = viewMode === 'front' ? product.rackImage : product.backImage;

  return (
    <section
      id="rack-detail"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 overflow-hidden bg-[#EAE2DB]"
    >
      {/* Blurred Background Clothing Rail Layer */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#DDD3CB]/90 via-[#E7DED7]/75 to-[#D9CFC8]/90" />
        <div className="absolute top-14 inset-x-0 h-2 bg-[#8E867E]/40 blur-[2px]" />
        <div className="absolute inset-0 flex items-center justify-around opacity-55 blur-[10px] scale-105">
          {PRODUCTS.slice(0, 7).map((bgProd) => (
            <div key={bgProd.id} className="w-40 h-72 shrink-0">
              <img
                src={bgProd.rackImage}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Foreground 3D Product Spotlight Container */}
      <div className="relative z-10 max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Lifted Floating Garment on Wooden Hanger with Touch Swipe + Scrollable Strip */}
        <div
          {...swipeHandlers}
          className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[430px] sm:min-h-[540px] touch-pan-y select-none cursor-grab active:cursor-grabbing"
          style={{ perspective: '1300px' }}
        >
          {/* Left / Right Hanger Switcher Arrows */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous garment on rail"
            className="absolute left-1 sm:left-4 top-[44%] -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-[#702D45] text-[#282326] hover:text-white shadow-lg border border-[#C6A46A]/30 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next garment on rail"
            className="absolute right-1 sm:right-4 top-[44%] -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-[#702D45] text-[#282326] hover:text-white shadow-lg border border-[#C6A46A]/30 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Floating Hanger + Garment */}
          <div
            className="relative flex flex-col items-center max-w-[340px] sm:max-w-[410px] w-full transition-transform duration-700 ease-out"
            style={{
              transform:
                viewMode === 'back'
                  ? 'translate3d(0, -6px, 40px) rotateY(12deg)'
                  : 'translate3d(0, -6px, 40px) rotateY(0deg)',
            }}
          >
            {viewMode === 'front' && (
              <svg
                viewBox="0 0 240 82"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[62%] h-auto -mb-5 relative z-20 drop-shadow-[0_10px_14px_rgba(40,35,38,0.22)]"
                aria-hidden="true"
              >
                <path
                  d="M120 26 L120 16 C120 8.5 126 4 133 4 C140 4 145 8.5 145 14.5 C145 18.5 142 22 138 23.5"
                  stroke="#9C8462"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M120 28 C108 28 95 38 68 51 L20 71 C13 74 15 80 23 80 L217 80 C225 80 227 74 220 71 L172 51 C145 38 132 28 120 28 Z"
                  fill="url(#spotlightWood)"
                  stroke="#8D6137"
                  strokeWidth="1.5"
                />
                <defs>
                  <linearGradient id="spotlightWood" x1="20" y1="28" x2="220" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#DFB17B" />
                    <stop offset="0.5" stopColor="#BC854E" />
                    <stop offset="1" stopColor="#996736" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            <div className="relative w-full aspect-[3/3.5] rounded-[28px] overflow-hidden flex items-center justify-center">
              <img
                src={displayImage}
                alt={`${product.name} (${viewMode} view)`}
                referrerPolicy="no-referrer"
                draggable={false}
                className={`w-full h-full transition-all duration-500 ${
                  viewMode === 'front'
                    ? 'object-contain mix-blend-multiply drop-shadow-[0_24px_34px_rgba(40,35,38,0.26)]'
                    : 'object-cover object-top rounded-[28px] shadow-[0_26px_48px_rgba(40,35,38,0.28)] ring-2 ring-white/70'
                }`}
              />
            </div>

            <p className="mt-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#282326]/65 tabular-nums">
              Hanger {currentIdx + 1} of {PRODUCTS.length} · Swipe or tap below
            </p>
          </div>

          {/* Mobile-Friendly Horizontally Scrollable Mini-Hanger Strip */}
          <div className="mt-4 w-full max-w-md px-2">
            <div
              ref={railStripRef}
              className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar py-1.5"
            >
              {PRODUCTS.map((item, idx) => {
                const isSelected = idx === currentIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectRackProduct(item.id, false)}
                    aria-label={`Switch spotlight to ${item.name}`}
                    className={`snap-center shrink-0 w-12 h-14 rounded-xl p-1 bg-[#FFFDF9]/90 border-2 transition-all ${
                      isSelected
                        ? 'border-[#702D45] scale-105 shadow-md'
                        : 'border-white/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.rackImage}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Elevated Luxury Detail Card (6 cols) */}
        <div className="lg:col-span-6 rounded-[28px] bg-[#FFFDF9]/96 backdrop-blur-xl border border-[#DFD2C8] shadow-[0_24px_60px_rgba(40,35,38,0.16)] p-6 sm:p-8 lg:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#C6A46A]">
                {product.category} · {product.ageGroup}
              </p>
              <h3 className="mt-1.5 font-editorial text-2xl sm:text-[30px] font-bold tracking-[0.06em] uppercase text-[#282326] leading-tight">
                {product.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-3 tabular-nums">
                <span className="text-2xl font-bold text-[#702D45]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-[#282326]/45 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="text-xs font-semibold text-[#9A7432]">
                      Save {product.discountPercent}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => jumpToSection('the-rack')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#282326]/65 hover:text-[#702D45] transition-colors shrink-0 py-1 px-2 rounded-lg hover:bg-[#F6DDE4]/40"
              aria-label="Return to clothing rail"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Front / Back View Switcher + Studio Thumbnails */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#EFE6DF]">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setViewMode('front')}
                className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition-all bg-[#FAF7F2] ${
                  viewMode === 'front'
                    ? 'border-[#702D45] shadow-sm'
                    : 'border-[#E6DDD5] opacity-70 hover:opacity-100'
                }`}
                aria-label="Front garment studio view"
              >
                <img
                  src={product.rackImage}
                  alt="Garment studio view"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply p-1"
                />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('back')}
                className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition-all bg-[#FAF7F2] ${
                  viewMode === 'back'
                    ? 'border-[#702D45] shadow-sm'
                    : 'border-[#E6DDD5] opacity-70 hover:opacity-100'
                }`}
                aria-label="Styled editorial look view"
              >
                <img
                  src={product.backImage}
                  alt="Styled model view"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </button>
            </div>

            <div className="inline-flex p-1 rounded-full bg-[#F5EFEA] border border-[#E5DBD2]">
              <button
                type="button"
                onClick={() => setViewMode('front')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  viewMode === 'front'
                    ? 'bg-[#702D45] text-white'
                    : 'text-[#282326]/70 hover:text-[#702D45]'
                }`}
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => setViewMode('back')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  viewMode === 'back'
                    ? 'bg-[#702D45] text-white'
                    : 'text-[#282326]/70 hover:text-[#702D45]'
                }`}
              >
                Styled Look
              </button>
            </div>
          </div>

          {/* Size Selection Grid */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-[#282326] tracking-wide">
                Select Size{' '}
                {sizePrompt && !selectedSize && (
                  <span className="text-[#8A1C33] font-medium ml-1.5">
                    — please choose a size first
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setActiveInfoPage('size-guide')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#702D45] hover:underline underline-offset-4"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {ALL_SIZES.map((size) => {
                const available = product.availableSizes.includes(size);
                const isChosen = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!available}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizePrompt(false);
                    }}
                    className={`py-2 px-2 rounded-full text-xs font-semibold tabular-nums border transition-all ${
                      !available
                        ? 'border-[#ECE6E1] text-[#282326]/30 bg-[#FAF7F4] line-through cursor-not-allowed'
                        : isChosen
                        ? 'bg-[#702D45] text-white border-[#702D45] shadow-sm'
                        : 'bg-white text-[#282326] border-[#DDD3CA] hover:border-[#702D45] hover:text-[#702D45]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Heart + Primary CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-[#DDD3CA] bg-white h-12 px-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#282326]/70 hover:text-[#702D45]"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#282326]/70 hover:text-[#702D45]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id, product.name)}
              aria-label={`Save ${product.name} to wishlist`}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                saved
                  ? 'border-[#702D45] bg-[#F6DDE4]/60 text-[#702D45]'
                  : 'border-[#DDD3CA] bg-white text-[#282326]/70 hover:border-[#702D45] hover:text-[#702D45]'
              }`}
            >
              <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleAddToBag}
              className="flex-1 min-w-[180px] h-12 px-6 rounded-full bg-[#702D45] hover:bg-[#541F33] text-[#FFFDF9] text-sm font-semibold inline-flex items-center justify-center gap-2.5 transition-all shadow-[0_10px_24px_rgba(112,45,69,0.28)] active:scale-[0.99]"
            >
              <span>{selectedSize ? `Add to Bag · ${selectedSize}` : 'Select a Size'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowAvailability((v) => !v)}
              className="font-semibold text-[#702D45] underline underline-offset-4 decoration-[#C6A46A]"
            >
              {showAvailability ? 'Hide availability' : 'See availability'}
            </button>
            <span className="text-[#282326]/60">
              Free express shipping above ₹5,000
            </span>
          </div>

          {showAvailability && (
            <div className="mt-3 p-3.5 rounded-2xl bg-[#FAF5F0] border border-[#E6DACF] text-xs text-[#282326]/80 space-y-1.5">
              <p className="font-semibold text-[#1B5E43] inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>
                  {product.availability} ({product.stockCount} pieces ready at Mumbai & Delhi Ateliers)
                </span>
              </p>
              <p className="text-[#282326]/65">
                Dispatches within 24–48 hours in complimentary Cheekdoll muslin keepsake packaging.
              </p>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-[#EFE6DF]">
            <div className="flex items-center gap-6 text-xs font-semibold border-b border-[#EFE6DF] pb-2.5 overflow-x-auto no-scrollbar">
              {(['description', 'fabric', 'care'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize whitespace-nowrap shrink-0 transition-colors pb-1 -mb-[11px] border-b-2 ${
                    activeTab === tab
                      ? 'text-[#702D45] border-[#702D45]'
                      : 'text-[#282326]/55 border-transparent hover:text-[#282326]'
                  }`}
                >
                  {tab === 'fabric' ? 'Fabric & Craft' : tab === 'care' ? 'Care Guide' : 'Description'}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs sm:text-[13px] leading-relaxed text-[#282326]/75 min-h-[56px]">
              {activeTab === 'description' && <p>{product.description}</p>}
              {activeTab === 'fabric' && (
                <p>
                  <strong className="text-[#282326]">{product.fabric}.</strong>{' '}
                  {product.craftDetails}.
                </p>
              )}
              {activeTab === 'care' && <p>{product.careInstructions}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
