import React, { useEffect, useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { HERO_CAMPAIGNS } from '../data/catalog';
import { useStore } from '../context/StoreContext';

const TICKER_ITEMS = [
  'TRY THE LOOK',
  'PARTY PERFECT',
  'NEW ARRIVALS',
  'FESTIVE EDIT',
  'LITTLE ICONS',
  'INDIAN WEAR FOR GIRLS',
];

export const HeroSection: React.FC = () => {
  const { jumpToSection } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_CAMPAIGNS.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(Math.min(window.scrollY, 600));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: nx * 16, y: ny * 10 });
  };

  const currentCampaign = HERO_CAMPAIGNS[activeSlide];

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
      className="relative w-full min-h-[88vh] lg:min-h-[94vh] flex flex-col justify-between overflow-hidden bg-[#282326]"
    >
      {/* Parallax Campaign Imagery Stack */}
      <div className="absolute inset-0 overflow-hidden">
        {HERO_CAMPAIGNS.map((slide, idx) => {
          const isActive = idx === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{
                transform: `translate3d(${-mouseOffset.x}px, ${
                  -mouseOffset.y + scrollY * 0.14
                }px, 0) scale(1.06)`,
                transition: 'opacity 1s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <img
                src={slide.image}
                alt={slide.caption}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${slide.focusPos}`}
              />
            </div>
          );
        })}

        {/* Measured Editorial Scrim for Crisp Headline Contrast while Keeping Model Radiant */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#26141B]/78 via-[#26141B]/42 to-transparent" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#26141B]/65 via-transparent to-[#26141B]/25" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-30 flex-1 flex items-center pt-28 pb-12 px-5 sm:px-10 lg:px-16 max-w-[1400px] w-full mx-auto">
        <div
          className="max-w-xl"
          style={{
            transform: `translate3d(${mouseOffset.x * 0.35}px, ${mouseOffset.y * 0.25}px, 0)`,
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#F6DDE4] mb-4">
            THE NEW SEASON COLLECTION
          </p>

          <h1 className="font-editorial text-5xl sm:text-6xl lg:text-[74px] font-bold text-[#FFFDF9] leading-[1.03] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.28)]">
            Little Looks.
            <br />
            Big Dreams.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#FFFDF9]/90 leading-relaxed max-w-md font-normal">
            Beautifully styled moments, thoughtfully designed for every little personality.
          </p>

          {/* Primary Actions matching blueprint */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => jumpToSection('try-the-look')}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#702D45] hover:bg-[#5A2036] text-[#FFFDF9] text-sm font-semibold tracking-wide transition-all duration-200 shadow-[0_10px_28px_rgba(112,45,69,0.45)] hover:-translate-y-0.5 whitespace-nowrap"
            >
              <span>Try the Look</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => jumpToSection('the-rack')}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#FFFDF9] hover:bg-[#F7E8DD] text-[#702D45] text-sm font-semibold tracking-wide transition-all duration-200 shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 whitespace-nowrap"
            >
              <span>Browse the Rack</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Campaign Film Trigger & Interactive Scene Switcher */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => jumpToSection('muse-film')}
              className="inline-flex items-center gap-3 text-left group"
            >
              <span className="w-11 h-11 rounded-full bg-[#FFFDF9]/18 backdrop-blur-md border border-[#C6A46A]/70 flex items-center justify-center text-[#FFFDF9] group-hover:bg-[#702D45] group-hover:border-[#702D45] transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[#C6A46A] font-semibold">
                  Watch Campaign Film
                </span>
                <span className="text-xs text-[#FFFDF9]/85">{currentCampaign.caption}</span>
              </span>
            </button>

            <div className="flex items-center gap-2 pl-1">
              {HERO_CAMPAIGNS.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`View campaign look: ${slide.label}`}
                  className={`relative w-12 h-14 rounded-lg overflow-hidden border transition-all duration-300 ${
                    idx === activeSlide
                      ? 'border-[#C6A46A] scale-105 shadow-[0_0_0_2px_rgba(198,164,106,0.45)]'
                      : 'border-white/35 opacity-65 hover:opacity-100'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Deep Berry Ticker Strip with Champagne Gold Text */}
      <div className="relative z-30 w-full bg-[#702D45] border-t border-[#C6A46A]/35 py-3 overflow-hidden">
        <div className="animate-cheekdoll-marquee flex items-center">
          {[0, 1, 2, 3].map((repeatIdx) => (
            <div key={repeatIdx} className="flex items-center shrink-0">
              {TICKER_ITEMS.map((item) => (
                <span
                  key={`${repeatIdx}-${item}`}
                  className="inline-flex items-center text-[11px] sm:text-xs font-semibold tracking-[0.26em] text-[#E6CB96] uppercase whitespace-nowrap"
                >
                  <span className="px-6">{item}</span>
                  <span className="text-[#C6A46A]/70 text-sm" aria-hidden="true">
                    ✦
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
