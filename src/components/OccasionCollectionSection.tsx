import React, { useRef, useState } from 'react';
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

export const OccasionCollectionSection: React.FC = () => {
  const { addToCart, toggleWishlist, isWishlisted, selectRackProduct } = useStore();
  const occasionProducts: Product[] = OCCASION_COLLECTION_IDS.map(
    (id) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0]
  );

  // Start on Blush Zari Organza Lehenga / Ivory Elegance in center
  const [activeIndex, setActiveIndex] = useState(2);
  const [chosenSize, setChosenSize] = useState<SizeOption>('5–6Y');
  const dragStartX = useRef<number | null>(null);

  const total = occasionProducts.length;
  const activeProduct = occasionProducts[activeIndex];
  const saved = isWishlisted(activeProduct.id);

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % total);

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

        {/* Gold-Framed 3D Curved Arch Carousel */}
        <div
          className="relative h-[380px] sm:h-[450px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
          style={{ perspective: '1500px' }}
          onPointerDown={(e) => {
            dragStartX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (dragStartX.current === null) return;
            const delta = e.clientX - dragStartX.current;
            dragStartX.current = null;
            if (Math.abs(delta) > 40) {
              if (delta > 0) goPrev();
              else goNext();
            }
          }}
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
                  {/* Arch-Topped Card Shell */}
                  <div
                    className={`relative w-full h-full overflow-hidden rounded-t-[140px] rounded-b-[18px] bg-[#FAF4EE] ${
                      isCenter
                        ? 'ring-[3px] ring-[#C6A46A] shadow-[0_28px_58px_-14px_rgba(112,45,69,0.28)]'
                        : 'ring-1 ring-[#C6A46A]/45 shadow-[0_14px_30px_-10px_rgba(40,35,38,0.18)]'
                    }`}
                  >
                    {/* Subtle Inner Champagne Filigree Line on Center Card */}
                    {isCenter && (
                      <div className="absolute inset-1.5 rounded-t-[134px] rounded-b-[14px] border border-[#E6CB96]/70 z-20 pointer-events-none" />
                    )}

                    {/* Discount Tag on Selected Products */}
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

          {/* Left / Right Navigation Arrows */}
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

        {/* Centered Details Beneath Active Arch Card (Matches Blueprint) */}
        <div className="mt-6 max-w-xl mx-auto text-center">
          <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.12em] uppercase text-[#282326]">
            {activeProduct.name}
          </h3>
          <p className="mt-1.5 text-xs sm:text-[13px] text-[#282326]/70">
            {activeProduct.fabric} · {activeProduct.craftDetails}
          </p>
          <p className="mt-1 text-xs text-[#282326]/55">
            Age: {activeProduct.ageGroup} · Sizes: {activeProduct.availableSizes.join(', ')}
          </p>

          {/* Gold Price Display */}
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

          {/* Compact Size Picker Row */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {activeProduct.availableSizes.slice(0, 6).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setChosenSize(sz)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors tabular-nums ${
                  effectiveSize === sz
                    ? 'bg-[#702D45] text-white border-[#702D45]'
                    : 'bg-white text-[#282326]/75 border-[#DFD5CC] hover:border-[#702D45]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Wishlist Heart & Add to Cart Button */}
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
