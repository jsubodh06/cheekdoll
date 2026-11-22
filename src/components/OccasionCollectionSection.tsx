import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import {
  OCCASION_COLLECTION_IDS,
  PRODUCTS,
  formatINR,
} from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { Product, SizeOption } from '../types';
import { useHorizontalSwipe } from '../hooks/useHorizontalSwipe';

export const OccasionCollectionSection: React.FC = () => {
  const { addToCart, toggleWishlist, isWishlisted, selectRackProduct } = useStore();
  const occasionProducts: Product[] = OCCASION_COLLECTION_IDS.map(
    (id) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0]
  );

  const [activeIndex, setActiveIndex] = useState(2);
  const [chosenSize, setChosenSize] = useState<SizeOption>('5–6Y');
  const thumbStripRef = useRef<HTMLDivElement | null>(null);

  const total = occasionProducts.length;
  const activeProduct = occasionProducts[activeIndex];
  const saved = isWishlisted(activeProduct.id);

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % total);

  const swipeHandlers = useHorizontalSwipe({ onPrev: goPrev, onNext: goNext });

  useEffect(() => {
    const el = thumbStripRef.current;
    if (!el) return;
    const item = el.children[activeIndex] as HTMLElement | undefined;
    if (item) {
      const targetLeft = item.offsetLeft - el.clientWidth / 2 + item.clientWidth / 2;
      el.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
  }, [activeIndex]);

  const effectiveSize: SizeOption = activeProduct.availableSizes.includes(chosenSize)
    ? chosenSize
    : activeProduct.availableSizes[Math.floor(activeProduct.availableSizes.length / 2)] ||
      '5–6Y';

  return (
    <section
      id="occasion-collection"
      className="relative bg-[#FFFDF9] py-20 sm:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden border-t border-[#EFE5DC]"
    >
      <div className="max-w-[1380px] mx-auto">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#702D45] tracking-tight">
            The Occasion Collection
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#282326]/65">
            For every celebration, every twirl and every little dream.
          </p>
        </div>

        {/* Gold-Framed 3D Curved Arch Carousel with Touch Swipe + Trackpad Wheel */}
        <div
          {...swipeHandlers}
          className="relative h-[380px] sm:h-[450px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ perspective: '1500px' }}
        >
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {occasionProducts.map((product, idx) => {
              let offset = idx - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const absOffset = Math.abs(offset);
              if (absOffset > 2) return null;

              const isCenter = offset === 0;
              const translateX = offset * 215;
              const translateZ = isCenter ? 60 : -absOffset * 110;
              const rotateY = offset * -18;
              const scale = isCenter ? 1.06 : absOffset === 1 ? 0.86 : 0.72;
              const opacity = isCenter ? 1 : absOffset === 1 ? 0.8 : 0.45;
              const zIndex = 30 - absOffset * 8;

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    if (isCenter) {
                      selectRackProduct(product.id, true);
                    } else {
                      setActiveIndex(idx);
                    }
                  }}
                  aria-label={`Select ${product.name}`}
                  className="absolute top-1/2 left-1/2 w-[215px] sm:w-[265px] h-[320px] sm:h-[390px] focus-visible:outline-2 focus-visible:outline-[#702D45]"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${translateX}px, ${
                      absOffset * 14
                    }px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition:
                      'transform 640ms cubic-bezier(0.22, 1, 0.36, 1), opacity 480ms ease',
                  }}
                >
                  <div
                    className={`relative w-full h-full overflow-hidden rounded-t-[140px] rounded-b-[18px] bg-[#FAF4EE] ${
                      isCenter
                        ? 'ring-[3px] ring-[#C6A46A] shadow-[0_28px_58px_-14px_rgba(112,45,69,0.28)]'
                        : 'ring-1 ring-[#C6A46A]/45 shadow-[0_14px_30px_-10px_rgba(40,35,38,0.18)]'
                    }`}
                  >
                    {isCenter && (
                      <div className="absolute inset-1.5 rounded-t-[134px] rounded-b-[14px] border border-[#E6CB96]/70 z-20 pointer-events-none" />
                    )}

                    {product.discountPercent && (
                      <span className="absolute top-6 right-5 z-20 px-2.5 py-1 rounded-md bg-[#702D45] text-[#FFFDF9] text-[10px] font-bold tracking-[0.12em] uppercase shadow-md tabular-nums">
                        {product.discountPercent}% OFF
                      </span>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      draggable={false}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous occasion outfit"
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-[#702D45] text-[#702D45] hover:text-white border border-[#C6A46A]/45 shadow-md flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next occasion outfit"
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-[#702D45] text-[#702D45] hover:text-white border border-[#C6A46A]/45 shadow-md flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile-Friendly Horizontally Scrollable Occasion Thumbnail Strip */}
        <div
          ref={thumbStripRef}
          className="mt-3 flex items-center gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar py-1.5 justify-start sm:justify-center max-w-xl mx-auto"
        >
          {occasionProducts.map((prod, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Preview ${prod.name}`}
                className={`snap-center shrink-0 w-11 h-14 rounded-t-full rounded-b-lg overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-[#C6A46A] scale-105 shadow-md'
                    : 'border-[#EAE0D7] opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </button>
            );
          })}
        </div>

        {/* Centered Details Beneath Active Arch Card */}
        <div className="mt-5 max-w-xl mx-auto text-center">
          <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.12em] uppercase text-[#282326]">
            {activeProduct.name}
          </h3>
          <p className="mt-1.5 text-xs sm:text-[13px] text-[#282326]/70">
            {activeProduct.fabric} · {activeProduct.craftDetails}
          </p>
          <p className="mt-1 text-xs text-[#282326]/55">
            Age: {activeProduct.ageGroup} · Sizes: {activeProduct.availableSizes.join(', ')}
          </p>

          <div className="mt-3 flex items-baseline justify-center gap-2.5 tabular-nums">
            <span className="font-editorial text-2xl sm:text-[28px] font-bold text-[#B38A42]">
              {formatINR(activeProduct.price)}
            </span>
            {activeProduct.originalPrice && (
              <span className="text-sm text-[#282326]/40 line-through">
                {formatINR(activeProduct.originalPrice)}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {activeProduct.availableSizes.slice(0, 6).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setChosenSize(sz)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors tabular-nums ${
                  effectiveSize === sz
                    ? 'bg-[#702D45] text-white border-[#702D45]'
                    : 'bg-white text-[#282326]/75 border-[#DFD5CC] hover:border-[#702D45]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => toggleWishlist(activeProduct.id, activeProduct.name)}
              aria-label={`Save ${activeProduct.name} to wishlist`}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
                saved
                  ? 'border-[#702D45] bg-[#F6DDE4]/60 text-[#702D45]'
                  : 'border-[#DDD2CA] bg-white text-[#702D45] hover:border-[#702D45]'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() =>
                addToCart({
                  productId: activeProduct.id,
                  name: activeProduct.name,
                  price: activeProduct.price,
                  originalPrice: activeProduct.originalPrice,
                  size: effectiveSize,
                  quantity: 1,
                  image: activeProduct.image,
                  category: activeProduct.category,
                })
              }
              className="px-7 py-3 rounded-full bg-[#702D45] hover:bg-[#541F33] text-[#FFFDF9] text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-[0_10px_24px_rgba(112,45,69,0.25)] active:scale-[0.98]"
            >
              <span>Add to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
