import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  ASSETS,
  MUSE_LEFT_GALLERY,
  MUSE_RIGHT_GALLERY,
} from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { useHorizontalSwipe } from '../hooks/useHorizontalSwipe';

const FILM_SCENES = [
  {
    id: 'scene-1',
    image: ASSETS.museFilmCourtyard,
    chapter: 'Chapter I · Heritage Courtyard Twirls',
    startSec: 0,
  },
  {
    id: 'scene-2',
    image: ASSETS.heroShowroom,
    chapter: 'Chapter II · Inside the Cheekdoll Atelier',
    startSec: 46,
  },
  {
    id: 'scene-3',
    image: ASSETS.lookRubyLehenga,
    chapter: 'Chapter III · Royal Velvet & Zari',
    startSec: 92,
  },
];

const TOTAL_FILM_SECONDS = 136;

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const MuseFilmSection: React.FC = () => {
  const { jumpToSection } = useStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [elapsed, setElapsed] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playerRef = useRef<HTMLDivElement | null>(null);
  const mobileGalleryRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setElapsed((prev) => (prev + 1 >= TOTAL_FILM_SECONDS ? 0 : prev + 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    const cleanupAudio = () => {
      if (chimeIntervalRef.current) {
        window.clearInterval(chimeIntervalRef.current);
        chimeIntervalRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };

    if (!isMuted && isPlaying) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
        const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 659.25, 587.33];
        let step = 0;

        const playNote = () => {
          if (!audioCtxRef.current) return;
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[step % notes.length], now);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.035, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.45);
          step += 1;
        };

        playNote();
        chimeIntervalRef.current = window.setInterval(playNote, 1550);
      } catch {
        // AudioContext unavailable
      }
    } else {
      cleanupAudio();
    }

    return cleanupAudio;
  }, [isMuted, isPlaying]);

  const activeSceneIdx = Math.min(
    FILM_SCENES.length - 1,
    Math.floor((elapsed / TOTAL_FILM_SECONDS) * FILM_SCENES.length)
  );
  const activeScene = FILM_SCENES[activeSceneIdx];
  const progressPct = (elapsed / TOTAL_FILM_SECONDS) * 100;

  const jumpChapter = (dir: -1 | 1) => {
    const nextIdx = (activeSceneIdx + dir + FILM_SCENES.length) % FILM_SCENES.length;
    setElapsed(FILM_SCENES[nextIdx].startSec);
  };

  const filmSwipeHandlers = useHorizontalSwipe({
    onPrev: () => jumpChapter(-1),
    onNext: () => jumpChapter(1),
  });

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && playerRef.current) {
        await playerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((v) => !v);
    }
  };

  const scrollMobileLookbook = (dir: -1 | 1) => {
    mobileGalleryRef.current?.scrollBy({ left: dir * 190, behavior: 'smooth' });
  };

  return (
    <section
      id="muse-film"
      className="relative bg-white py-20 sm:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-center">
          {/* Left Opposite-Scrolling Editorial Photo Column (Desktop) */}
          <div className="hidden lg:block lg:col-span-2 relative h-[540px] overflow-hidden rounded-2xl">
            <div className="animate-muse-up flex flex-col gap-4">
              {[...MUSE_LEFT_GALLERY, ...MUSE_LEFT_GALLERY].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-full aspect-[3/3.6] rounded-2xl overflow-hidden bg-[#FAF4F0] shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>

          {/* Center Heading + Ornate Gold-Framed 16:9 Brand Film */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div className="text-center mb-7">
              <p className="text-xs sm:text-[13px] font-semibold tracking-[0.26em] uppercase text-[#702D45]">
                The Little Muse Film
              </p>
              <h2 className="mt-2 font-editorial text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight leading-[1.08]">
                <span className="text-[#702D45]">Little Moments, </span>
                <span className="italic font-semibold text-berry-gold-gradient">
                  Big Magic
                </span>
              </h2>
            </div>

            {/* Double Gold Frame with Ornate Corner Brackets */}
            <div className="relative w-full p-2.5 sm:p-3.5 rounded-[22px] border-[1.5px] border-[#C6A46A] bg-[#FFFDF9] shadow-[0_24px_60px_rgba(112,45,69,0.12)]">
              <span className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-[3px] border-l-[3px] border-[#B68B46] rounded-tl-lg pointer-events-none" />
              <span className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-[3px] border-r-[3px] border-[#B68B46] rounded-tr-lg pointer-events-none" />
              <span className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-[3px] border-l-[3px] border-[#B68B46] rounded-bl-lg pointer-events-none" />
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-[3px] border-r-[3px] border-[#B68B46] rounded-br-lg pointer-events-none" />

              <div
                ref={playerRef}
                {...filmSwipeHandlers}
                className="relative w-full aspect-video rounded-[14px] overflow-hidden bg-[#1F171A] group touch-pan-y"
              >
                {FILM_SCENES.map((scene, idx) => (
                  <img
                    key={scene.id}
                    src={scene.image}
                    alt={scene.chapter}
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
                      idx === activeSceneIdx ? 'opacity-100' : 'opacity-0'
                    } ${isPlaying ? 'animate-ken-burns' : ''}`}
                  />
                ))}

                {isPlaying && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <span className="animate-bokeh absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-[#F6DDE4]/50 blur-[2px]" />
                    <span
                      className="animate-bokeh absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-[#E6CB96]/55 blur-[1px]"
                      style={{ animationDelay: '1.8s' }}
                    />
                    <span
                      className="animate-bokeh absolute bottom-1/3 left-1/3 w-5 h-5 rounded-full bg-white/35 blur-[3px]"
                      style={{ animationDelay: '3.1s' }}
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/20 pointer-events-none" />

                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
                  className="absolute top-3.5 right-3.5 z-20 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md text-white text-xs font-medium border border-white/20 transition-colors"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#E6CB96]" />
                      <span>Sound off</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#E6CB96]" />
                      <span>Sound on</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? 'Pause brand film' : 'Play brand film'}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-15 h-15 sm:w-[70px] sm:h-[70px] rounded-full bg-[#282326]/65 hover:bg-[#702D45]/90 backdrop-blur-md border-2 border-[#E6CB96]/80 text-white flex items-center justify-center shadow-2xl transition-all duration-300 ${
                    isPlaying
                      ? 'opacity-80 group-hover:opacity-100 scale-95 group-hover:scale-100'
                      : 'opacity-100 scale-105'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current ml-1" />
                  )}
                </button>

                <div className="absolute bottom-0 inset-x-0 z-20 px-4 pb-3 pt-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between text-[11px] text-white/90 mb-2">
                    <span className="font-medium truncate pr-4">{activeScene.chapter}</span>
                    <span className="tabular-nums shrink-0">
                      {formatTime(elapsed)} / {formatTime(TOTAL_FILM_SECONDS)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      className="text-white/90 hover:text-[#E6CB96]"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <div
                      role="slider"
                      tabIndex={0}
                      aria-label="Film progress"
                      aria-valuemin={0}
                      aria-valuemax={TOTAL_FILM_SECONDS}
                      aria-valuenow={elapsed}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const ratio = Math.max(
                          0,
                          Math.min(1, (e.clientX - rect.left) / rect.width)
                        );
                        setElapsed(Math.round(ratio * TOTAL_FILM_SECONDS));
                      }}
                      className="flex-1 h-1.5 rounded-full bg-white/25 cursor-pointer overflow-hidden"
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C6A46A] to-[#F6DDE4] transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      aria-label="Toggle fullscreen"
                      className="text-white/90 hover:text-[#E6CB96]"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile & Tablet Horizontally Scrollable Lifestyle Gallery Strip */}
            <div className="lg:hidden w-full mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#702D45]">
                  Behind the Frames · Scroll
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollMobileLookbook(-1)}
                    aria-label="Scroll lifestyle photos left"
                    className="w-8 h-8 rounded-full border border-[#E2D0D7] text-[#702D45] flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollMobileLookbook(1)}
                    aria-label="Scroll lifestyle photos right"
                    className="w-8 h-8 rounded-full border border-[#E2D0D7] text-[#702D45] flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div
                ref={mobileGalleryRef}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1"
              >
                {[...MUSE_LEFT_GALLERY, ...MUSE_RIGHT_GALLERY].map((item) => (
                  <div
                    key={item.id}
                    className="snap-start shrink-0 w-[138px] aspect-[3/3.7] rounded-2xl overflow-hidden bg-[#FAF4F0] border border-[#EFE2E7] shadow-xs"
                  >
                    <img
                      src={item.image}
                      alt={item.caption}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Berry CTA Below Film */}
            <button
              type="button"
              onClick={() => jumpToSection('occasion-collection')}
              className="mt-8 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#702D45] hover:bg-[#541F33] text-[#FFFDF9] text-sm font-semibold tracking-wide shadow-[0_12px_28px_rgba(112,45,69,0.28)] transition-all hover:-translate-y-0.5"
            >
              <span>Shop the Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Opposite-Scrolling Editorial Photo Column (Desktop) */}
          <div className="hidden lg:block lg:col-span-2 relative h-[540px] overflow-hidden rounded-2xl">
            <div className="animate-muse-down flex flex-col gap-4">
              {[...MUSE_RIGHT_GALLERY, ...MUSE_RIGHT_GALLERY].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-full aspect-[3/3.6] rounded-2xl overflow-hidden bg-[#FAF4F0] shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
