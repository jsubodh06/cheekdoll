import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Hand,
  Heart,
  Plus,
} from 'lucide-react';
import { TRY_THE_LOOKS, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';

export const TryTheLookSection: React.FC = () => {
  const { addToCart, addLookBundleToCart, toggleWishlist, isWishlisted } = useStore();
  // Start on look index 6 ("7 of 8 · Ivory Elegance") matching the visual blueprint
  const [activeIndex, setActiveIndex] = useState(6);
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const total = TRY_THE_LOOKS.length;
  const activeLook = TRY_THE_LOOKS[activeIndex];

  const originalTotal = activeLook.pieces.reduce((sum, p) => sum + p.price, 0);
  const discountedTotal = Math.round(
    originalTotal * (1 - activeLook.bundleDiscountPercent / 100)
  );

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % total);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    isDragging.current = false;
    dragStartX.current = null;
    if (Math.abs(delta) > 42) {
      if (delta > 0) goPrev();
      else goNext();
    }
  };

  const handleAddFullLook = () => {
    const bundleItems = activeLook.pieces.map((piece) => ({
      productId: piece.productId || piece.id,
      name: piece.name,
      price: Math.round(piece.price * (1 - activeLook.bundleDiscountPercent / 100)),
      originalPrice: piece.price,
      size: piece.sizeDefault,
      quantity: 1,
      image: piece.thumbnail,
      category: piece.category,
      isBundleItem: true,
    }));
    addLookBundleToCart(bundleItems, activeLook.title);
  };

  return (
    <section
      id="try-the-look"
      className="relative bg-[#FAF3F5] py-16 sm:py-22 px-4 sm:px-8 lg:px-12 overflow-hidden border-y border-[#EBD8DF]"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left/Center 3D Fashion Stage (8 columns on desktop) */}
        <div
          className="lg:col-span-8 relative flex flex-col justify-between rounded-[28px] bg-gradient-to-b from-[#FFFFFF] via-[#FBF7F8] to-[#F3E6EA] border border-[#E6D1D8]/80 shadow-[0_18px_48px_rgba(112,45,69,0.06)] overflow-hidden min-h-[540px] sm:min-h-[620px] select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            isDragging.current = false;
            dragStartX.current = null;
          }}
        >
          {/* Stage Top Title */}
          <div className="relative z-30 text-center pt-8 sm:pt-10 px-6">
            <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#702D45] tracking-tight">
              Try the Look.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#282326]/65 max-w-md mx-auto">
              Discover the magic of a perfectly styled little outfit.
            </p>
          </div>

          {/* True 3D Curved Model Runway Stage */}
          <div
            className="relative flex-1 flex items-center justify-center my-4"
            style={{ perspective: '1400px' }}
          >
            {/* Soft Studio Runway Floor Reflection */}
            <div className="absolute bottom-4 inset-x-10 h-14 rounded-full bg-gradient-to-r from-transparent via-[#702D45]/10 to-transparent blur-xl pointer-events-none" />

            <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center preserve-3d">
              {TRY_THE_LOOKS.map((look, idx) => {
                // Compute shortest circular offset (-3..+3)
                let offset = idx - activeIndex;
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const absOffset = Math.abs(offset);
                const isVisible = absOffset <= 3;
                if (!isVisible) return null;

                const isCenter = offset === 0;
                const translateX = offset * 158;
                const translateZ = -absOffset * 115;
                const rotateY = offset * -16;
                const scale = isCenter ? 1.04 : Math.max(0.62, 1 - absOffset * 0.14);
                const blurPx = isCenter ? 0 : absOffset === 1 ? 2.5 : absOffset === 2 ? 4.5 : 6;
                const opacity = isCenter ? 1 : absOffset === 1 ? 0.72 : absOffset === 2 ? 0.42 : 0.2;
                const zIndex = 30 - absOffset * 5;

                return (
                  <button
                    key={look.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Select look ${look.title}`}
                    className="absolute top-1/2 left-1/2 w-[225px] sm:w-[275px] h-[340px] sm:h-[415px] rounded-2xl overflow-hidden focus-visible:outline-2 focus-visible:outline-[#702D45]"
                    style={{
                      transform: `translate(-50%, -50%) translate3d(${translateX}px, ${
                        absOffset * 8
                      }px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      filter: `blur(${blurPx}px)`,
                      opacity,
                      zIndex,
                      transition:
                        'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), filter 550ms ease, opacity 550ms ease',
                      boxShadow: isCenter
                        ? '0 26px 55px -12px rgba(112, 45, 69, 0.24)'
                        : '0 10px 24px -10px rgba(40, 35, 38, 0.14)',
                    }}
                  >
                    <img
                      src={look.modelImage}
                      alt={`${look.title} — ${look.subtitle}`}
                      referrerPolicy="no-referrer"
                      draggable={false}
                      className="w-full h-full object-cover object-top"
                    />
                    {isCenter && (
                      <div className="absolute inset-0 ring-1 ring-inset ring-[#C6A46A]/45 rounded-2xl pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Navigation Arrows */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous look"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-[#702D45] text-[#702D45] hover:text-white border border-[#C6A46A]/35 shadow-md flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next look"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-[#702D45] text-[#702D45] hover:text-white border border-[#C6A46A]/35 shadow-md flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Counter & Drag Hint */}
          <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 px-6 pb-6 pt-2">
            <div className="hidden sm:block text-xs text-[#282326]/55 font-medium">
              {activeLook.ageLabel}
            </div>

            <div className="mx-auto sm:mx-0 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/95 border border-[#C6A46A]/30 shadow-sm text-xs font-semibold text-[#702D45] tabular-nums">
              <span>{activeIndex + 1} of {total}</span>
              <span className="text-[#C6A46A]">·</span>
              <span>{activeLook.title}</span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#282326]/60 font-medium">
              <Hand className="w-3.5 h-3.5 text-[#702D45]" />
              <span>Scroll or drag</span>
            </div>
          </div>
        </div>

        {/* Right Side: "In This Look" Editorial Styling Panel (4 columns on desktop) */}
        <aside className="lg:col-span-4 flex flex-col justify-between rounded-[28px] bg-[#FFFDF9] border border-[#E6D1D8] shadow-[0_18px_48px_rgba(112,45,69,0.06)] p-6 sm:p-7">
          <div>
            <div className="flex items-baseline justify-between border-b border-[#EEDEE4] pb-4">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#702D45]">
                  In this look
                </h3>
                <p className="text-xs text-[#282326]/60 mt-0.5">{activeLook.subtitle}</p>
              </div>
              <span className="text-xs font-medium text-[#C6A46A] tabular-nums">
                {activeLook.pieces.length} pieces
              </span>
            </div>

            {/* Itemized Piece List */}
            <ul className="mt-4 divide-y divide-[#F2E6EA]">
              {activeLook.pieces.map((piece) => {
                const wishId = piece.productId || piece.id;
                const saved = isWishlisted(wishId);

                return (
                  <li
                    key={piece.id}
                    className="py-3 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF4F1] border border-[#EBDDE2] shrink-0">
                        <img
                          src={piece.thumbnail}
                          alt={piece.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#282326] truncate group-hover:text-[#702D45] transition-colors">
                          {piece.name}
                        </p>
                        <p className="text-xs text-[#702D45] font-semibold tabular-nums mt-0.5">
                          {formatINR(piece.price)}
                          <span className="text-[#282326]/45 font-normal">
                            {' '}
                            · {piece.category}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleWishlist(wishId, piece.name)}
                        aria-label={`Save ${piece.name} to wishlist`}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                          saved
                            ? 'border-[#702D45] bg-[#F6DDE4]/60 text-[#702D45]'
                            : 'border-[#E6D5DC] text-[#282326]/55 hover:text-[#702D45] hover:border-[#702D45]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            productId: piece.productId || piece.id,
                            name: piece.name,
                            price: piece.price,
                            size: piece.sizeDefault,
                            quantity: 1,
                            image: piece.thumbnail,
                            category: piece.category,
                          })
                        }
                        aria-label={`Add ${piece.name} to bag`}
                        className="w-8 h-8 rounded-full bg-[#702D45] hover:bg-[#541F33] text-white flex items-center justify-center transition-transform active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Complete Bundle Summary & CTA */}
          <div className="mt-6 pt-5 border-t border-[#EEDEE4]">
            <div className="flex items-baseline justify-between gap-2 mb-4">
              <div className="flex items-baseline gap-2.5 tabular-nums">
                <span className="text-sm text-[#282326]/45 line-through font-medium">
                  {formatINR(originalTotal)}
                </span>
                <span className="font-editorial text-2xl font-bold text-[#702D45]">
                  {formatINR(discountedTotal)}
                </span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A7432] bg-[#F7E8DD] px-2.5 py-1 rounded-md">
                {activeLook.bundleDiscountPercent}% Bundle Off
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddFullLook}
              className="w-full py-3.5 px-6 rounded-full bg-[#702D45] hover:bg-[#541F33] text-[#FFFDF9] text-sm font-semibold inline-flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_10px_24px_rgba(112,45,69,0.28)] active:scale-[0.99]"
            >
              <span>Add Full Look to Bag</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};
