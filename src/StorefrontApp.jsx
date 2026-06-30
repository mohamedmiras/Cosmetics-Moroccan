import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import './styles/animations.css';

import { allProducts } from './data/products';
import BottomCheckoutBar from './components/BottomCheckoutBar';
import CheckoutPage from './components/CheckoutPage';
import { CartProvider } from './context/CartContext';
import { Sun, Moon, PackageSearch } from 'lucide-react';
import OrderTrackingModal from './components/OrderTrackingModal';

function App() {
  const [isCheckout, setIsCheckout] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, [isCheckout]); // Re-init scroll smoothly when view changes

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#F3ECE4] selection:bg-[#731625]/30 selection:text-[#3a2522] transition-colors duration-500">
        
        {isCheckout ? (
          <CheckoutPage onBack={() => {
            setIsCheckout(false);
            setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'instant' }), 10);
          }} />
        ) : (
          <main>
            {/* Track Order Button */}
            <button 
              onClick={() => setIsTrackingOpen(true)}
              className="fixed top-6 right-6 md:top-8 md:right-10 z-40 flex items-center gap-2 bg-[#FAF6F2]/80 backdrop-blur-md border border-[#E8D8C8] px-4 py-2.5 rounded-full text-[#6B4F4F] hover:text-[#3A2E2A] hover:bg-[#FAF6F2] shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <PackageSearch size={16} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] tracking-[0.15em] font-semibold uppercase">Track Order</span>
            </button>

            <HeroSection />
            
            {/* The Collection - Unified Grid System */}
            <ProductGrid products={allProducts} />
            
            <BottomCheckoutBar onCheckout={() => {
              setScrollPos(window.scrollY);
              window.scrollTo({ top: 0, behavior: 'instant' });
              setIsCheckout(true);
            }} />
          </main>
        )}
        {!isCheckout && <Footer />}

        <OrderTrackingModal 
          isOpen={isTrackingOpen} 
          onClose={() => setIsTrackingOpen(false)} 
        />
      </div>
    </CartProvider>
  );
}

export default App;
