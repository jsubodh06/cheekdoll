import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const NAV_LINKS = [
  { label: 'Home', id: 'hero' },
  { label: 'Archive', id: 'archive' },
  { label: 'Try the Look', id: 'try-the-look' },
  { label: 'Styles', id: 'pick-a-style' },
  { label: 'The Rack', id: 'the-rack' },
  { label: 'Muse', id: 'muse-film' },
];

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlistIds,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAccountOpen,
    jumpToSection,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    jumpToSection(id);
  };

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div
        className={`pointer-events-auto mx-auto max-w-[1260px] rounded-full transition-all duration-300 border ${
          scrolled
            ? 'bg-[#FFFDF9]/92 backdrop-blur-xl border-[#C6A46A]/35 shadow-[0_12px_36px_rgba(40,35,38,0.12)]'
            : 'bg-[#FFFDF9]/82 backdrop-blur-lg border-white/60 shadow-[0_10px_30px_rgba(40,35,38,0.10)]'
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-14 sm:h-[60px]">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('hero')}
            className="flex flex-col items-start leading-none text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#702D45] rounded-sm"
            aria-label="Cheekdoll Apparels Home"
          >
            <span className="font-editorial text-xl sm:text-[23px] font-semibold tracking-tight text-[#702D45]">
              Cheekdoll
            </span>
            <span className="text-[8.5px] font-semibold tracking-[0.28em] text-[#C6A46A] uppercase -mt-0.5 pl-0.5">
              APPARELS
            </span>
          </button>

          {/* Zone 2: Clean Typography Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13.5px] font-medium text-[#282326]/85"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="relative py-1 whitespace-nowrap shrink-0 hover:text-[#702D45] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-[#C6A46A] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Interactive Shopping Actions & Primary CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#282326]/80 hover:text-[#702D45] hover:bg-[#F6DDE4]/55 transition-colors"
              aria-label="Search collections and filter products"
              title="Search & Filter"
            >
              <Search className="w-[17px] h-[17px]" />
            </button>

            <button
              type="button"
              onClick={() => setIsAccountOpen(true)}
              className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-[#282326]/80 hover:text-[#702D45] hover:bg-[#F6DDE4]/55 transition-colors"
              aria-label="Account and orders"
              title="Account & Orders"
            >
              <User className="w-[17px] h-[17px]" />
            </button>

            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#282326]/80 hover:text-[#702D45] hover:bg-[#F6DDE4]/55 transition-colors"
              aria-label={`Wishlist (${wishlistIds.length} items)`}
              title="Wishlist"
            >
              <Heart className="w-[17px] h-[17px]" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#C6A46A] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#282326]/80 hover:text-[#702D45] hover:bg-[#F6DDE4]/55 transition-colors"
              aria-label={`Shopping bag (${cartCount} items)`}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-[17px] h-[17px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#702D45] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:inline-flex items-center gap-2 ml-1 px-4 py-2 rounded-full bg-[#702D45] hover:bg-[#541F33] text-[#FFFDF9] text-xs font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <span>Visit the Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#702D45] hover:bg-[#F6DDE4]/60 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden mt-2 mx-auto max-w-[1260px] rounded-3xl bg-[#FFFDF9]/96 backdrop-blur-xl border border-[#C6A46A]/30 shadow-xl p-5">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="px-4 py-3 text-left text-sm font-medium text-[#282326] hover:bg-[#F6DDE4]/45 hover:text-[#702D45] rounded-xl transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#C6A46A]/20 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAccountOpen(true);
              }}
              className="flex-1 py-2.5 px-4 rounded-full border border-[#702D45]/30 text-[#702D45] text-xs font-semibold"
            >
              Account & Orders
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#702D45] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5"
            >
              <span>Visit the Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
