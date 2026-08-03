import { useState } from "react";
import { BestO2 } from "./components/BestO2";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Reviews } from "./components/Reviews";
import { SearchModal } from "./components/SearchModal";
import { TopSelling } from "./components/TopSelling";
import { TrendyPlants } from "./components/TrendyPlants";
import { CartProvider } from "./hooks/useCart";

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <CartProvider>
      <div className="page">
        <Header onSearch={() => setSearchOpen(true)} />
        <main>
          <div className="top-scene">
            <Hero />
            <TrendyPlants />
          </div>
          <TopSelling />
          <Reviews />
          <BestO2 />
        </main>
        <Footer />
        <CartDrawer />
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </CartProvider>
  );
}
