import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SIX_MOODS } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { MoodArchive } from '../types';

const OrnateArchFrame: React.FC<{
  mood: MoodArchive;
  index: number;
  onSelect: () => void;
}> = ({ mood, index, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex flex-col items-center text-center focus-visible:outline-2 focus-visible:outline-[#702D45] rounded-2xl p-1 w-[210px] sm:w-[225px] lg:w-auto shrink-0 snap-center"
      style={{ perspective: '900px' }}
    >
      {/* 3D Hover Arch Container */}
      <div
        className="relative w-full aspect-[3/4.35] transition-all duration-500 ease-out preserve-3d group-hover:-translate-y-2.5 group-hover:scale-[1.03]"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft Champagne-Gold Ambient Glow on Hover */}
        <div className="absolute -inset-2 rounded-t-[999px] rounded-b-xl bg-gradient-to-b from-[#C6A46A]/0 via-[#C6A46A]/0 to-[#C6A46A]/0 group-hover:from-[#C6A46A]/22 group-hover:via-[#F6DDE4]/30 group-hover:to-[#C6A46A]/15 blur-xl transition-all duration-500 pointer-events-none" />

        {/* Subtle Exhibition Floor Shadow */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[78%] h-4 rounded-full bg-[#702D45]/12 blur-md group-hover:w-[86%] group-hover:bg-[#702D45]/20 transition-all duration-500 pointer-events-none" />

        {/* Ornate Finial + Double Gold Ogee Arch Frame SVG Overlay */}
        <svg
          viewBox="0 0 220 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -inset-[5%] w-[110%] h-[110%] z-20 pointer-events-none drop-shadow-[0_4px_10px_rgba(198,164,106,0.25)] transition-transform duration-500 group-hover:scale-[1.015]"
          aria-hidden="true"
        >
          <path d="M110 4 L114 14 L110 21 L106 14 Z" fill="#C6A46A" />
          <circle cx="110" cy="24" r="3" fill="#C6A46A" />
          <path
            d="M110 26 C110 26 92 48 64 58 C34 69 16 94 16 126 L16 298 C16 303 20 307 25 307 L195 307 C200 307 204 303 204 298 L204 126 C204 94 186 69 156 58 C128 48 110 26 110 26 Z"
            stroke={`url(#goldGrad-${index})`}
            strokeWidth="2.8"
          />
          <path
            d="M110 34 C110 34 94 54 68 63 C41 73 23 96 23 126 L23 293 C23 297 26 300 30 300 L190 300 C194 300 197 297 197 293 L197 126 C197 96 179 73 152 63 C126 54 110 34 110 34 Z"
            stroke="#C6A46A"
            strokeWidth="1"
            strokeOpacity="0.65"
          />
          <circle cx="28" cy="295" r="2" fill="#C6A46A" />
          <circle cx="192" cy="295" r="2" fill="#C6A46A" />
          <defs>
            <linearGradient
              id={`goldGrad-${index}`}
              x1="16"
              y1="20"
              x2="204"
              y2="307"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DFC087" />
              <stop offset="0.5" stopColor="#B8914E" />
              <stop offset="1" stopColor="#DFC087" />
            </linearGradient>
          </defs>
        </svg>

        {/* Clipped Portrait Inside Arch Window */}
        <div
          className="relative w-full h-full overflow-hidden bg-[#F7E8DD] shadow-sm transition-transform duration-500 group-hover:[transform:rotateY(-4deg)_rotateX(2deg)]"
          style={{
            clipPath:
              'path("M 50% 6% C 50% 6%, 40% 14%, 25% 18% C 10% 22%, 2% 31%, 2% 41% L 2% 98% L 98% 98% L 98% 41% C 98% 31%, 90% 22%, 75% 18% C 60% 14%, 50% 6%, 50% 6% Z")',
            borderRadius: '48% 48% 10px 10px / 28% 28% 10px 10px',
          }}
        >
          <img
            src={mood.image}
            alt={mood.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#702D45]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute bottom-3 inset-x-3 text-[10px] font-medium text-[#FFFDF9] tracking-wide opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Explore {mood.filterCategory} →
          </span>
        </div>
      </div>

      {/* Collection Title in Spaced Uppercase */}
      <span className="mt-6 text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#282326] group-hover:text-[#702D45] transition-colors uppercase leading-snug max-w-[155px]">
        {mood.title}
      </span>
      <span className="mt-1 text-[11px] text-[#282326]/55 hidden xl:block max-w-[165px] leading-snug">
        {mood.subtitle}
      </span>
      <span className="sr-only">Collection {index + 1}</span>
    </button>
  );
};

export const SixMoodsSection: React.FC = () => {
  const { setActiveRackFilter, jumpToSection } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleMoodClick = (mood: MoodArchive) => {
    setActiveRackFilter(mood.filterCategory);
    jumpToSection('the-rack');
  };

  const scrollMoods = (dir: -1 | 1) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: dir * 240,
      behavior: 'smooth',
    });
  };

  return (
    <section id="archive" className="relative bg-white py-20 sm:py-24 px-5 sm:px-10 lg:px-14">
      <div className="max-w-[1380px] mx-auto">
        {/* Editorial Header Row */}
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div className="hidden lg:block w-52" aria-hidden="true" />

          <div className="text-center flex-1">
            <p className="text-xs sm:text-[13px] font-semibold tracking-[0.26em] text-[#702D45] uppercase mb-2.5">
              The Cheekdoll Archive
            </p>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.08]">
              <span className="text-[#702D45]">Six Moods. </span>
              <span className="italic font-semibold text-berry-gold-gradient">
                Endless Style
              </span>
            </h2>
          </div>

          <p className="text-center lg:text-right text-xs sm:text-[13px] text-[#282326]/65 max-w-[230px] mx-auto lg:mx-0 leading-relaxed font-medium">
            Made for little moments,
            <br className="hidden lg:inline" /> remembered for a lifetime.
          </p>
        </div>

        {/* Mobile/Tablet Scroll Controls + Hint */}
        <div className="flex lg:hidden items-center justify-between mb-4">
          <span className="text-[11px] font-medium text-[#282326]/55">
            Swipe or use arrows to browse moods
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollMoods(-1)}
              aria-label="Scroll moods left"
              className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#E2D0D7] text-[#702D45] flex items-center justify-center shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollMoods(1)}
              aria-label="Scroll moods right"
              className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#E2D0D7] text-[#702D45] flex items-center justify-center shadow-xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Six Arch-Framed Exhibition: Snap-Scroll Strip on Mobile/Tablet, 6-Col Gallery on Desktop */}
        <div
          ref={scrollContainerRef}
          className="flex lg:grid lg:grid-cols-6 gap-5 lg:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar pt-3 pb-4 -mx-5 px-5 sm:-mx-10 sm:px-10 lg:mx-0 lg:px-0 items-start"
        >
          {SIX_MOODS.map((mood, idx) => (
            <OrnateArchFrame
              key={mood.id}
              mood={mood}
              index={idx}
              onSelect={() => handleMoodClick(mood)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
