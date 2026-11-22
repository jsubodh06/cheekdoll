import React, { useMemo, useState } from 'react';
import { PRODUCTS, RACK_FILTERS, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory } from '../types';

const WoodenHangerSVG: React.FC<{ isHighlighted: boolean }> = ({ isHighlighted }) => (
  <svg
    viewBox="0 0 180 62"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[74%] h-auto mx-auto -mb-3 relative z-20 drop-shadow-[0_3px_4px_rgba(40,35,38,0.16)]"
    aria-hidden="true"
  >
    {/* Chrome / Champagne-Gold Hook Clipped to Rail */}
    <path
      d="M90 19 L90 12 C90 6.5 94.5 3 99.5 3 C104.5 3 108 6.5 108 11 C108 14 106 16.5 103 17.5"
      stroke={isHighlighted ? '#C6A46A' : '#8E8A87'}
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    {/* Sculpted Luxury Walnut/Honey Wood Shoulders */}
    <path
      d="M90 21 C82 21 72 28 52 38 L16 53 C11 55 12 60 18 60 L162 60 C168 60 169 55 164 53 L128 38 C108 28 98 21 90 21 Z"
      fill="url(#woodGrad)"
      stroke="#966A3E"
      strokeWidth="1.2"
    />
    {/* Subtle Inner Notches */}
    <path
      d="M28 54 L152 54"
      stroke="#F3D6AE"
      strokeOpacity="0.45"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="woodGrad" x1="15" y1="22" x2="165" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D7A773" />
        <stop offset="0.5" stopColor="#BA854F" />
        <stop offset="1" stopColor="#9D6B3B" />
      </linearGradient>
    </defs>
  </svg>
);

export const TheRackSection: React.FC = () => {
  const {
    activeRackFilter,
    setActiveRackFilter,
    selectedRackProductId,
    selectRackProduct,
  } = useStore();

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Pieces': PRODUCTS.length };
    for (const cat of RACK_FILTERS) {
      if (cat === 'All Pieces') continue;
      counts[cat] = PRODUCTS.filter((p) => p.categories.includes(cat)).length;
    }
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeRackFilter === 'All Pieces') return PRODUCTS;
    return PRODUCTS.filter((p) => p.categories.includes(activeRackFilter));
  }, [activeRackFilter]);

  const focusedProduct: Product =
    filteredProducts.find((p) => p.id === (hoveredId || selectedRackProductId)) ||
    filteredProducts[0] ||
    PRODUCTS[0];

  return (
    <section
      id="the-rack"
      className="relative bg-[#FAF7F2] py-18 sm:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden border-t border-[#ECE4DC]"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#282326] tracking-tight">
            Every little look, on the rail.
          </h2>

          {/* Interactive Filter Controls with Live Counts */}
          <div
            role="tablist"
            aria-label="Filter clothing rack by category"
            className="mt-7 flex flex-wrap items-center justify-center gap-2"
          >
            {RACK_FILTERS.map((cat) => {
              const isActive = activeRackFilter === cat;
              const count = filterCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setActiveRackFilter(cat as 'All Pieces' | ProductCategory)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap tabular-nums border ${
                    isActive
                      ? 'bg-[#702D45] text-[#FFFDF9] border-[#702D45] shadow-sm'
                      : 'bg-white text-[#282326]/75 border-[#DFD5CC] hover:border-[#702D45]/45 hover:text-[#702D45]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimensional Physical Boutique Clothing Rail */}
        <div className="relative mt-14 sm:mt-16 pb-10">
          {/* Wall Mount End Finials & Brushed Champagne-Chrome Rail Bar */}
          <div className="relative mx-auto max-w-[1320px]">
            {/* Metallic Rail Rod */}
            <div className="relative h-2.5 rounded-full bg-gradient-to-b from-[#E5E0DA] via-[#B4ADA5] to-[#7F7972] shadow-[0_6px_14px_rgba(40,35,38,0.16)] mx-2 sm:mx-6">
              {/* Highlight specular line */}
              <div className="absolute inset-x-4 top-[2px] h-[2px] rounded-full bg-white/75" />
              {/* Left & Right Rail End Caps */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#DFC087] to-[#9B7840] shadow-md" />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#DFC087] to-[#9B7840] shadow-md" />
            </div>

            {/* Hanging Garments Row on the Rail */}
            <div
              className="relative -mt-2 pt-0 pb-6 flex items-start justify-start lg:justify-center gap-3 sm:gap-4 lg:gap-2 overflow-x-auto no-scrollbar px-4 sm:px-8"
              style={{ perspective: '1200px' }}
            >
              {filteredProducts.map((product) => {
                const isHovered = hoveredId === product.id;
                const isSelected = selectedRackProductId === product.id;
                const isActive = isHovered || (!hoveredId && isSelected);

                return (
                  <button
                    key={product.id}
                    type="button"
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(product.id)}
                    onClick={() => selectRackProduct(product.id, true)}
                    aria-label={`Inspect ${product.name} — ${formatINR(product.price)}`}
                    className="hover-hanger-sway group relative flex flex-col items-center w-[150px] sm:w-[165px] lg:w-[144px] xl:w-[152px] shrink-0 focus-visible:outline-2 focus-visible:outline-[#702D45] rounded-xl pt-0 pb-3 transition-all duration-300"
                    style={{
                      zIndex: isActive ? 30 : 10,
                      transform: isActive
                        ? 'translate3d(0, 4px, 45px) scale(1.09)'
                        : 'translate3d(0, 0, 0) scale(0.97)',
                    }}
                  >
                    <div
                      className="hanger-pendulum w-full flex flex-col items-center"
                      style={{ transformOrigin: '50% 4px' }}
                    >
                      <WoodenHangerSVG isHighlighted={isActive} />

                      {/* Hanging Studio Garment */}
                      <div className="relative w-full aspect-[3/3.85] flex items-start justify-center overflow-hidden rounded-b-xl">
                        <img
                          src={product.rackImage}
                          alt={product.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain object-top mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>

                    {/* Subtle Floor Shadow beneath Hanging Garment */}
                    <div
                      className={`mt-2 h-2.5 rounded-full bg-[#282326]/12 blur-md transition-all duration-300 ${
                        isActive ? 'w-[74%] bg-[#702D45]/20' : 'w-[54%]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floating Active Garment Placard Below the Rail (Matches Blueprint) */}
          <div className="mt-4 flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => selectRackProduct(focusedProduct.id, true)}
              className="group inline-flex flex-col items-center px-7 py-3 rounded-2xl bg-white border border-[#E5DCD3] shadow-[0_12px_30px_rgba(40,35,38,0.08)] hover:border-[#C6A46A] transition-all"
            >
              <span className="text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase text-[#282326] group-hover:text-[#702D45] transition-colors">
                {focusedProduct.name}
              </span>
              <span className="mt-1 text-sm font-bold text-[#702D45] tabular-nums">
                {formatINR(focusedProduct.price)}
                <span className="ml-2 text-[11px] font-medium text-[#C6A46A]">
                  Click hanger to lift & inspect →
                </span>
              </span>
            </button>
          </div>

          {/* Bottom Editorial Rail Captions */}
          <div className="mt-8 pt-4 border-t border-[#EAE2DA] flex flex-wrap items-center justify-between gap-2 text-xs text-[#282326]/55">
            <span>
              Explore the collection ·{' '}
              <strong className="font-semibold text-[#282326]/80 tabular-nums">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
              </strong>
            </span>
            <span>AI-generated studio imagery</span>
          </div>
        </div>
      </div>
    </section>
  );
};
