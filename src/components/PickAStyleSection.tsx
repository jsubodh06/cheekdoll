import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Plus } from 'lucide-react';
import { PRODUCTS, STYLE_CARDS, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { StyleCardItem } from '../types';
import { useHorizontalSwipe } from '../hooks/useHorizontalSwipe';

interface TiltState {
  rx: number;
  ry: number;
  pressed: boolean;
}

const FannedStyleCard: React.FC<{
  card: StyleCardItem;
  index: number;
  activeIndex: number;
  onFocus: () => void;
  onAdd: () => void;
  onInspect: () => void;
  isSaved: boolean;
  onToggleWish: () => void;
}> = ({
  card,
  index,
  activeIndex,
  onFocus,
  onAdd,
  onInspect,
  isSaved,
  onToggleWish,
}) => {
  const [tilt, setTilt] = useState<TiltState>({ rx: 0, ry: 0, pressed: false });

  const offset = index - activeIndex;
  const absOffset = Math.abs(offset);
  const isCenter = offset === 0;

  // Fanned 3D arc geometry matching reference blueprint
  const baseRotateZ = offset * 4.2;
  const baseRotateY = offset * -14;
  const baseTranslateY = absOffset * absOffset * 9;
  const baseTranslateZ = isCenter ? 60 : -absOffset * 38;
  const baseScale = isCenter ? 1.06 : Math.max(0.84, 0.96 - absOffset * 0.045);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt((prev) => ({
      ...prev,
      rx: -py * 16,
      ry: px * 18,
    }));
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, pressed: false });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onFocus}
      onDoubleClick={onInspect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFocus();
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setTilt((prev) => ({ ...prev, pressed: true }))}
      onMouseUp={() => setTilt((prev) => ({ ...prev, pressed: false }))}
      aria-label={`${card.fullTitle} — ${formatINR(card.price)}`}
      className="relative w-[205px] sm:w-[225px] lg:w-[235px] h-[360px] sm:h-[405px] lg:h-[430px] rounded-[24px] overflow-hidden cursor-pointer select-none shrink-0 snap-center mx-1.5 lg:-mx-4 focus-visible:outline-2 focus-visible:outline-[#702D45]"
      style={{
        backgroundColor: card.cardBg,
        zIndex: isCenter ? 30 : 20 - absOffset * 3,
        transform: `translate3d(0, ${baseTranslateY}px, ${baseTranslateZ}px) rotateZ(${baseRotateZ}deg) rotateY(${
          baseRotateY + tilt.ry
        }deg) rotateX(${tilt.rx}deg) scale(${tilt.pressed ? baseScale * 0.96 : baseScale})`,
        transition:
          tilt.rx === 0 && tilt.ry === 0
            ? 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 400ms ease'
            : 'transform 110ms ease-out',
        boxShadow: isCenter
          ? '0 32px 60px -16px rgba(40, 35, 38, 0.38), 0 0 0 1.5px rgba(255, 253, 249, 0.45) inset'
          : '0 20px 38px -16px rgba(40, 35, 38, 0.28), 0 0 0 1px rgba(255, 253, 249, 0.25) inset',
      }}
    >
      {/* Subtle Top Lighting Gradient inside Solid Color Card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%)',
        }}
      />

      {/* Wishlist Heart Top Right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWish();
        }}
        aria-label={`Save ${card.fullTitle} to wishlist`}
        className={`absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all ${
          isSaved
            ? 'bg-white text-[#702D45] border-white shadow-sm'
            : 'bg-black/15 text-white border-white/35 hover:bg-white hover:text-[#702D45]'
        }`}
      >
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      </button>

      {/* Oversized Condensed Editorial Title Behind Model */}
      <div
        className="absolute top-6 inset-x-3 z-10 text-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <p
          className="font-condensed font-extrabold uppercase leading-[0.86] tracking-tight text-[46px] sm:text-[54px] lg:text-[58px] drop-shadow-[0_3px_10px_rgba(0,0,0,0.12)]"
          style={{ color: card.textColor }}
        >
          {card.titleTop}
          <br />
          {card.titleBottom}
        </p>
      </div>

      {/* Full-Length Editorial Child Portrait Layered in Front of Title */}
      <div className="absolute inset-x-3 bottom-0 top-[96px] sm:top-[114px] z-20 flex items-end justify-center pointer-events-none">
        <div className="relative w-[92%] h-[98%] rounded-t-[140px] overflow-hidden shadow-[0_14px_30px_rgba(0,0,0,0.32)] ring-2 ring-white/25">
          <img
            src={card.image}
            alt={card.fullTitle}
            loading="lazy"
            referrerPolicy="no-referrer"
            draggable={false}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
        </div>
      </div>

      {/* Bottom Price & Add to Bag Button */}
      <div className="absolute bottom-3.5 inset-x-4 z-30 flex items-center justify-between">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.16em] text-white/80 font-medium">
            {card.categoryTag}
          </span>
          <span className="text-base sm:text-lg font-bold text-white tabular-nums drop-shadow">
            {formatINR(card.price)}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          aria-label={`Add ${card.fullTitle} to bag`}
          className="w-9 h-9 rounded-full bg-[#282326] hover:bg-[#702D45] text-white border border-white/30 shadow-lg flex items-center justify-center transition-transform active:scale-90"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const PickAStyleSection: React.FC = () => {
  const { addToCart, toggleWishlist, isWishlisted, selectRackProduct } = useStore();
  // Default focus on card index 2 ("PRINCESS DREAM" deep berry) matching the visual blueprint
  const [activeIndex, setActiveIndex] = useState(2);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const scrollRaf = useRef<number | null>(null);

  const total = STYLE_CARDS.length;
  const activeCard = STYLE_CARDS[activeIndex];

  const scrollCardIntoCenter = (idx: number) => {
    setActiveIndex(idx);
    const el = trackRef.current;
    if (!el) return;
    const inner = el.firstElementChild as HTMLElement | null;
    const cardEl = inner?.children[idx] as HTMLElement | undefined;
    if (cardEl && el.scrollWidth > el.clientWidth) {
      const targetLeft = cardEl.offsetLeft - el.clientWidth / 2 + cardEl.clientWidth / 2;
      el.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
  };

  const goPrev = () => scrollCardIntoCenter((activeIndex - 1 + total) % total);
  const goNext = () => scrollCardIntoCenter((activeIndex + 1) % total);

  const swipeHandlers = useHorizontalSwipe({ onPrev: goPrev, onNext: goNext });

  // Sync activeIndex when mobile user scrolls horizontally through cards
  const handleHorizontalScroll = () => {
    const el = trackRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    scrollRaf.current = requestAnimationFrame(() => {
      const centerX = el.scrollLeft + el.clientWidth / 2;
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      let closestIdx = activeIndex;
      let minDist = Infinity;
      Array.from(inner.children).forEach((child, idx) => {
        const node = child as HTMLElement;
        const cardCenter = node.offsetLeft + node.clientWidth / 2;
        const dist = Math.abs(cardCenter - centerX);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      });
      if (closestIdx !== activeIndex) {
        setActiveIndex(closestIdx);
      }
    });
  };

  const handleQuickAdd = (card: StyleCardItem) => {
    const prod = PRODUCTS.find((p) => p.id === card.productId);
    addToCart({
      productId: card.productId,
      name: prod?.name || card.fullTitle,
      price: card.price,
      size: prod?.availableSizes[3] || '5–6Y',
      quantity: 1,
      image: card.image,
      category: prod?.category || card.categoryTag,
    });
  };

  return (
    <section
      id="pick-a-style"
      className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FBF5F7] to-[#FFFDF9] py-20 sm:py-24 px-4 sm:px-8 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#702D45] tracking-tight">
            Pick a Style
          </h2>
          <p className="mt-2.5 text-sm sm:text-[15px] text-[#282326]/70">
            Every little personality deserves its own style.
          </p>
          <p className="mt-1 text-xs text-[#702D45]/70 font-medium tracking-wide">
            Tilt a card, scroll or tap arrows to discover your favourite.
          </p>
        </div>

        {/* 3D Fanned Arc Stage with Both Native Mobile Snap-Scroll & Prev/Next Buttons */}
        <div className="relative" onWheel={swipeHandlers.onWheel}>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous style card"
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#702D45] text-[#702D45] hover:text-white border border-[#C6A46A]/35 shadow-md flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next style card"
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#702D45] text-[#702D45] hover:text-white border border-[#C6A46A]/35 shadow-md flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={trackRef}
            onScroll={handleHorizontalScroll}
            className="relative py-10 sm:py-12 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar"
            style={{ perspective: '1600px' }}
          >
            <div className="flex items-center justify-start lg:justify-center px-16 sm:px-24 lg:px-0 min-w-max lg:min-w-0 preserve-3d">
              {STYLE_CARDS.map((card, idx) => (
                <FannedStyleCard
                  key={card.id}
                  card={card}
                  index={idx}
                  activeIndex={activeIndex}
                  onFocus={() => scrollCardIntoCenter(idx)}
                  onAdd={() => handleQuickAdd(card)}
                  onInspect={() => selectRackProduct(card.productId, true)}
                  isSaved={isWishlisted(card.productId)}
                  onToggleWish={() => toggleWishlist(card.productId, card.fullTitle)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator Dots + Active Card Interactive Action Strip */}
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {STYLE_CARDS.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => scrollCardIntoCenter(idx)}
                aria-label={`Select ${card.fullTitle}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? 'w-7 bg-[#702D45]' : 'w-2 bg-[#C98FA1]/50 hover:bg-[#702D45]/60'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
            <span className="text-xs font-medium text-[#282326]/65">
              Selected:{' '}
              <strong className="text-[#702D45] font-semibold">{activeCard.fullTitle}</strong>{' '}
              · {formatINR(activeCard.price)}
            </span>
            <button
              type="button"
              onClick={() => selectRackProduct(activeCard.productId, true)}
              className="text-xs font-semibold text-[#702D45] underline underline-offset-4 decoration-[#C6A46A] hover:text-[#541F33] transition-colors"
            >
              Inspect on The Rack →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
