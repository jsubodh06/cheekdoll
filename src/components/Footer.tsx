import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';

export const Footer: React.FC = () => {
  const {
    setActiveRackFilter,
    jumpToSection,
    setActiveInfoPage,
    setIsSearchOpen,
    showToast,
  } = useStore();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleShopFilter = (cat: 'All Pieces' | ProductCategory) => {
    setActiveRackFilter(cat);
    jumpToSection('the-rack');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    setEmail('');
    showToast('Welcome to the Cheekdoll Inner Circle — check your inbox!');
  };

  return (
    <footer className="bg-[#F6DDE4] text-[#282326] border-t border-[#E6C5D0]">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-10 lg:px-14 pt-16 pb-10">
        {/* Top Newsletter & Brand Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#702D45]/14">
          <div className="lg:col-span-5">
            <div className="flex flex-col items-start leading-none">
              <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#702D45] tracking-tight">
                CHEEKDOLL
              </span>
              <span className="text-[10px] font-semibold tracking-[0.34em] text-[#9A7432] uppercase mt-1">
                APPARELS
              </span>
            </div>
            <p className="mt-4 font-editorial italic text-xl text-[#702D45]">
              “Little Looks. Big Dreams.”
            </p>
            <p className="mt-3 text-xs sm:text-sm text-[#282326]/70 max-w-sm leading-relaxed">
              Heirloom Indian girls’ couture and contemporary celebration wear crafted in
              breathable silks, handloom Chanderi, and soft mulmul linings for ages 1–14.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center lg:items-end">
            <div className="w-full max-w-md">
              <h3 className="font-editorial text-2xl sm:text-[26px] font-semibold text-[#702D45]">
                Get a little dose of fashion magic.
              </h3>
              <p className="mt-1.5 text-xs text-[#282326]/70">
                Receive early access to festive edits, private atelier trunk shows, and styling guides.
              </p>

              {subscribed ? (
                <div className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFFDF9] border border-[#C6A46A]/50 text-xs font-semibold text-[#702D45]">
                  <Check className="w-4 h-4 text-[#1B5E43]" />
                  <span>You’re on the guest list for our next collection drop.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address for newsletter"
                    required
                    className="flex-1 h-12 px-5 rounded-full bg-[#FFFDF9] border border-[#702D45]/20 text-sm text-[#282326] placeholder:text-[#282326]/45 focus:outline-none focus:border-[#702D45]"
                  />
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-full bg-[#702D45] hover:bg-[#541F33] text-[#FFFDF9] text-xs font-semibold tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 text-sm">
          {/* SHOP */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#702D45] mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#282326]/80">
              <li>
                <button
                  type="button"
                  onClick={() => handleShopFilter('All Pieces')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleShopFilter('Dresses')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Dresses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleShopFilter('Ethnic Wear')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Ethnic Wear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleShopFilter('Party Wear')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Party Wear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleShopFilter('Casual Wear')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Casual Wear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Best Sellers
                </button>
              </li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#702D45] mb-4">
              Help
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#282326]/80">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoPage('contact')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoPage('shipping')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Shipping Information
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoPage('returns')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoPage('size-guide')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Size Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoPage('faqs')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* ABOUT */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#702D45] mb-4">
              About
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#282326]/80">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoPage('about')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpToSection('archive')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Our Collections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoPage('about')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Our Philosophy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoPage('privacy')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoPage('terms')}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#702D45] mb-4">
              Social
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#282326]/80">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    jumpToSection('muse-reels');
                    showToast('Exploring @cheekdollapparels lookbook reels');
                  }}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Instagram
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    jumpToSection('archive');
                    showToast('Follow Cheekdoll Apparels on Facebook');
                  }}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Facebook
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    jumpToSection('pick-a-style');
                    showToast('Pinned inspirations on Cheekdoll Pinterest');
                  }}
                  className="hover:text-[#702D45] transition-colors"
                >
                  Pinterest
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 border-t border-[#702D45]/14 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#282326]/65">
          <p>© 2026 Cheekdoll Apparels. All Rights Reserved.</p>
          <p>Handcrafted in India · Worldwide Boutique Delivery</p>
        </div>
      </div>
    </footer>
  );
};
