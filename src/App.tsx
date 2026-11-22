import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SixMoodsSection } from './components/SixMoodsSection';
import { TryTheLookSection } from './components/TryTheLookSection';
import { PickAStyleSection } from './components/PickAStyleSection';
import { TheRackSection } from './components/TheRackSection';
import { RackDetailSection } from './components/RackDetailSection';
import { MuseFilmSection } from './components/MuseFilmSection';
import { MuseReelsSection } from './components/MuseReelsSection';
import { OccasionCollectionSection } from './components/OccasionCollectionSection';
import { Footer } from './components/Footer';
import { StoreDrawers } from './components/StoreDrawers';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#FFFDF9] text-[#282326]">
        <Navbar />

        <main>
          {/* 1. Hero — The Cheekdoll World */}
          <HeroSection />

          {/* 2. Six Moods — The Cheekdoll Archive */}
          <SixMoodsSection />

          {/* 3. Try the Look — 3D Perspective Runway & Bundle Panel */}
          <TryTheLookSection />

          {/* 4. Pick a Style — 3D Fanned Arc Solid-Colour Cards */}
          <PickAStyleSection />

          {/* 5. The Rack — Interactive Physical Clothing Rail */}
          <TheRackSection />

          {/* 6. Rack Detail — 3D Lifted Garment Spotlight over Blurred Rail */}
          <RackDetailSection />

          {/* 7. The Muse Film — Gold-Framed Brand Film & Opposite-Scrolling Columns */}
          <MuseFilmSection />

          {/* 8. The Muse Reels — 3D Curved Motion Reels Arc */}
          <MuseReelsSection />

          {/* 9. The Occasion Collection — Gold-Framed Curved Arch Carousel */}
          <OccasionCollectionSection />
        </main>

        <Footer />

        {/* Interactive Shopping Bag, Wishlist, Search/Filters, Checkout, Account & Policy Modals */}
        <StoreDrawers />
      </div>
    </StoreProvider>
  );
}
