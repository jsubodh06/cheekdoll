import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { PRODUCTS, STYLE_CARDS, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { StyleCardItem } from '../types';

interface TiltState {
  rx: number;
  ry: number;
  pressed: boolean;
}

const FannedStyleCard: React.FC<{
  card: StyleCardItem;
  index: number;
  activeIndex: number;
  total: number;
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
      className="relative w-[195px] sm:w-[220px] lg:w-[235px] h-[350px] sm:h-[405px] lg:h-[430px] rounded-[24px] overflow-hidden cursor-pointer select-none shrink-0 -mx-4 sm:-mx-5 lg:-mx-4 focus-visible:outline-2 focus-visible:outline-[#702D45]"
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
          className="font-condensed font-extrabold uppercase leading-[0.86] tracking-tight text-[44px] sm:text-[54px] lg:text-[58px] drop-shadow-[0_3px_10px_rgba(0,0,0,0.12)]"
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

  const activeCard = STYLE_CARDS[activeIndex];

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
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#702D45] tracking-tight">
            Pick a Style
          </h2>
          <p className="mt-2.5 text-sm sm:text-[15px] text-[#282326]/70">
            Every little personality deserves its own style.
          </p>
          <p className="mt-1 text-xs text-[#702D45]/70 font-medium tracking-wide">
            Tilt a card, press it, discover your favourite.
          </p>
        </div>

        {/* 3D Fanned Arc Stage */}
        <div
          className="relative py-8 sm:py-12 overflow-x-auto lg:overflow-visible no-scrollbar"
          style={{ perspective: '1600px' }}
        >
          <div className="flex items-center justify-start lg:justify-center px-10 lg:px-0 min-w-max lg:min-w-0 preserve-3d">
            {STYLE_CARDS.map((card, idx) => (
              <FannedStyleCard
                key={card.id}
                card={card}
                index={idx}
                activeIndex={activeIndex}
                total={STYLE_CARDS.length}
                onFocus={() => setActiveIndex(idx)}
                onAdd={() => handleQuickAdd(card)}
                onInspect={() => selectRackProduct(card.productId, true)}
                isSaved={isWishlisted(card.productId)}
                onToggleWish={() => toggleWishlist(card.productId, card.fullTitle)}
              />
            ))}
          </div>
        </div>

        {/* Active Card Interactive Action Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-center">
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
    </section>
  );
};
