import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { MUSE_REELS, PRODUCTS, formatINR } from '../data/catalog';
import { useStore } from '../context/StoreContext';

export const MuseReelsSection: React.FC = () => {
  const { selectRackProduct, addToCart } = useStore();
  // Default center focus on Reel 03 ("Festive Twirls") matching blueprint
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(32);
  const [modalReelIndex, setModalReelIndex] = useState<number | null>(null);
  const [modalMuted, setModalMuted] = useState(false);

  const total = MUSE_REELS.length;

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((idx) => (idx + 1) % total);
          return 0;
        }
        return prev + 2.5;
      });
    }, 320);
    return () => window.clearInterval(id);
  }, [isPlaying, total]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
    setProgress(0);
  };

  const modalReel = modalReelIndex !== null ? MUSE_REELS[modalReelIndex] : null;
  const modalProduct = modalReel
    ? PRODUCTS.find((p) => p.id === modalReel.productId)
    : null;

  return (
    <section
      id="muse-reels"
      className="relative bg-[#FAF7F4] py-20 sm:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden border-t border-[#ECE2DA]"
    >
      <div className="max-w-[1380px] mx-auto">
        {/* Header with Top-Right Controls matching Blueprint */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="hidden sm:block w-36" aria-hidden="true" />

          <div className="text-center">
            <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#702D45] tracking-tight">
              Style, in Motion.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#282326]/65">
              Little personalities. Beautifully captured.
            </p>
          </div>

          {/* Prev / Pause / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous reel"
              className="w-10 h-10 rounded-full bg-white hover:bg-[#702D45] text-[#702D45] hover:text-white border border-[#DEC9D0] shadow-sm flex items-center justify-center transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause reels' : 'Play reels'}
              className="w-10 h-10 rounded-full bg-white hover:bg-[#702D45] text-[#702D45] hover:text-white border border-[#DEC9D0] shadow-sm flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next reel"
              className="w-10 h-10 rounded-full bg-white hover:bg-[#702D45] text-[#702D45] hover:text-white border border-[#DEC9D0] shadow-sm flex items-center justify-center transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Curved Arc of 5 Vertical Fashion Reel Cards */}
        <div
          className="relative h-[430px] sm:h-[490px] flex items-center justify-center select-none"
          style={{ perspective: '1500px' }}
        >
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {MUSE_REELS.map((reel, idx) => {
              let offset = idx - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const absOffset = Math.abs(offset);
              const isCenter = offset === 0;

              const translateX = offset * 198;
              const translateZ = isCenter ? 60 : -absOffset * 95;
              const rotateY = offset * -19;
              const scale = isCenter ? 1.05 : Math.max(0.74, 0.94 - absOffset * 0.08);
              const opacity = isCenter ? 1 : absOffset === 1 ? 0.82 : 0.56;
              const zIndex = 30 - absOffset * 6;

              return (
                <button
                  key={reel.id}
                  type="button"
                  onClick={() => {
                    if (isCenter) {
                      setModalReelIndex(idx);
                    } else {
                      setActiveIndex(idx);
                      setProgress(0);
                    }
                  }}
                  aria-label={`${reel.number}: ${reel.title} — ${reel.category}`}
                  className={`absolute top-1/2 left-1/2 w-[215px] sm:w-[248px] h-[370px] sm:h-[430px] rounded-[22px] overflow-hidden text-left bg-[#1C1618] focus-visible:outline-2 focus-visible:outline-[#702D45] ${
                    isCenter ? 'ring-2 ring-[#C6A46A]' : 'ring-1 ring-white/20'
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${translateX}px, ${
                      absOffset * 10
                    }px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition:
                      'transform 620ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms ease, box-shadow 450ms ease',
                    boxShadow: isCenter
                      ? '0 28px 60px -14px rgba(40, 35, 38, 0.48)'
                      : '0 16px 34px -14px rgba(40, 35, 38, 0.28)',
                  }}
                >
                  {/* Vertical Portrait Media */}
                  <img
                    src={reel.image}
                    alt={reel.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover object-center ${
                      isCenter && isPlaying ? 'animate-ken-burns' : ''
                    }`}
                  />

                  {/* Editorial Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/45" />

                  {/* Top Metadata: Reel Number & Duration */}
                  <div className="absolute top-3.5 inset-x-4 flex items-center justify-between text-[11px] font-medium text-white/90 tabular-nums">
                    <span className="tracking-wider uppercase">{reel.number}</span>
                    <span>{reel.duration}</span>
                  </div>

                  {/* Center Play Button on Active Reel */}
                  {isCenter && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-13 h-13 rounded-full bg-black/50 backdrop-blur-md border border-[#E6CB96]/80 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  )}

                  {/* Bottom Editorial Caption + Gold Progress Bar */}
                  <div className="absolute bottom-4 inset-x-4">
                    <h3 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white leading-none">
                      {reel.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] text-white/80 font-medium">
                      {reel.category} · {reel.location}
                    </p>

                    {isCenter && (
                      <div className="mt-3 h-1 w-full rounded-full bg-white/25 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#C6A46A] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#282326]/55">
          Tap the centre reel to watch full-screen and shop the featured look.
        </p>
      </div>

      {/* Full-Screen Immersive Reel Theatre Modal */}
      {modalReel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modalReel.title}
          className="fixed inset-0 z-50 bg-black/88 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setModalReelIndex(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[430px] aspect-[9/15] max-h-[88vh] rounded-[28px] overflow-hidden bg-[#191316] border border-[#C6A46A]/60 shadow-2xl"
          >
            <img
              src={modalReel.image}
              alt={modalReel.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/50" />

            {/* Top Controls */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#E6CB96]">
                {modalReel.number} · {modalReel.duration}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalMuted((m) => !m)}
                  aria-label="Toggle reel audio"
                  className="w-9 h-9 rounded-full bg-black/55 text-white flex items-center justify-center border border-white/20"
                >
                  {modalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setModalReelIndex(null)}
                  aria-label="Close reel"
                  className="w-9 h-9 rounded-full bg-black/55 text-white flex items-center justify-center border border-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Info + Shop Featured Outfit */}
            <div className="absolute bottom-5 inset-x-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#E6CB96] font-semibold">
                {modalReel.category} · {modalReel.location}
              </p>
              <h3 className="mt-1 font-editorial text-3xl font-bold text-white">
                {modalReel.title}
              </h3>
              <p className="mt-2 text-xs text-white/80 leading-relaxed">
                {modalReel.caption}
              </p>

              {modalProduct && (
                <div className="mt-4 p-3 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {modalProduct.name}
                    </p>
                    <p className="text-xs font-bold text-[#E6CB96] tabular-nums">
                      {formatINR(modalProduct.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart({
                          productId: modalProduct.id,
                          name: modalProduct.name,
                          price: modalProduct.price,
                          size: modalProduct.availableSizes[3] || '5–6Y',
                          quantity: 1,
                          image: modalProduct.image,
                          category: modalProduct.category,
                        });
                      }}
                      className="px-3.5 py-2 rounded-full bg-[#702D45] hover:bg-[#541F33] text-white text-xs font-semibold"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModalReelIndex(null);
                        selectRackProduct(modalProduct.id, true);
                      }}
                      className="px-3.5 py-2 rounded-full bg-white text-[#702D45] text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
