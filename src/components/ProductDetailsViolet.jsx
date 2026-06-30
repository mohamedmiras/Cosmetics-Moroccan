import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const activeProduct = {
  id: "savon-beldi",
  name: "Savon Noir Beldi",
  description: "Authentic Moroccan black soap. A rich, purifying paste that prepares the skin for deep exfoliation, leaving it incredibly soft.",
  price: 6,
  image: "/Videos/product_visuals/Beldi/ezgif-frame-300-hd.webp",
  imageLight: "/nobg_products/Savon_noir_beldi_300.webp",
  tag: "Purifying Care"
};

const ProductDetailsViolet = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textGroupRef = useRef(null);
  const { increment, decrement, getQuantity, catalog } = useCart();
  
  const count = getQuantity(activeProduct.id);
  const catalogItem = catalog[activeProduct.id] || { price: activeProduct.price, quantity: 50, maxQuantity: 50 };
  const livePrice = catalogItem.price;
  const availableQty = catalogItem.quantity;
  const maxQty = catalogItem.maxQuantity || 50;
  const pct = Math.min(100, Math.max(0, (availableQty / maxQty) * 100));
  const isOutOfStock = availableQty <= 0;


  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      });

      tl.fromTo(imageRef.current, 
        { y: 60, opacity: 0, scale: 0.8, rotation: -15 },
        { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.0, ease: "power3.out" }
      );

      const texts = textGroupRef.current.children;
      tl.fromTo(texts,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-transparent dark:bg-[#0f0217] flex items-center justify-center py-4 md:py-6 px-8 relative overflow-hidden transition-colors duration-500">
      
      {/* Animated Flowing Light/Dark Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none product-glow">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-white/40 dark:bg-violet-900/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-white/30 dark:bg-purple-800/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 items-center z-10">
        
        <div className="relative mb-4 md:mb-0 h-[280px] md:h-[520px] w-full flex justify-center items-center transform-gpu will-change-[transform,opacity]" ref={imageRef}>
          
          {/* Light Theme Version: No Background, No Mask, Correct Size */}
          <div className="absolute inset-0 w-full h-full flex justify-center items-center opacity-100 dark:opacity-0 transition-opacity duration-700 ease-in-out">
            <div className="product-image-wrap w-full h-full flex justify-center items-center animate-[float_5s_ease-in-out_infinite] transform-gpu">
              <img 
                src={activeProduct.imageLight} 
                alt={activeProduct.name} 
                loading="eager"
                className="w-full h-full scale-[1.5] md:scale-[1.7] object-contain origin-center transform-gpu md:hover:scale-[1.8]"
              />
            </div>
          </div>

          {/* Dark Theme Version: Original Background, Masked, Massive Size */}
          <div 
            className="absolute inset-0 w-full h-full overflow-visible opacity-0 dark:opacity-100 transition-opacity duration-700 ease-in-out"
            style={{
              maskImage: 'radial-gradient(ellipse closest-side, black 35%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse closest-side, black 35%, transparent 100%)'
            }}
          >
            <div className="product-image-wrap w-full h-full flex justify-center items-center animate-[float_5s_ease-in-out_infinite] transform-gpu">
              <img 
                src={activeProduct.image} 
                alt={activeProduct.name} 
                loading="lazy"
                className="w-full h-full scale-[1.4] md:scale-[1.6] object-contain origin-center transform-gpu md:hover:scale-[1.7]"
              />
            </div>
          </div>

        </div>

        <div ref={textGroupRef} className="flex flex-col items-center text-center md:items-start md:text-left -mt-6 md:-mt-8 transform-gpu will-change-[transform,opacity]">
          <p className="text-violet-800 dark:text-violet-400 font-mono tracking-[0.2em] uppercase text-xs mb-2 transition-colors duration-500">
            {activeProduct.tag}
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-wide text-[#3a2522] dark:text-white mb-3 leading-tight transition-colors duration-500">
            {activeProduct.name}
          </h2>
          <p className="text-[#5a443f] dark:text-white/60 font-light leading-relaxed max-w-md mb-4 text-sm md:text-base transition-colors duration-500">
            {activeProduct.description}
          </p>
          <div className="flex items-end gap-6 mb-4 justify-center md:justify-start">
            <span className="text-4xl font-light text-[#3a2522] dark:text-white transition-colors duration-500">{livePrice} MAD</span>
            <span className="text-sm font-mono text-[#5a443f]/60 dark:text-white/40 mb-1 tracking-widest uppercase transition-colors duration-500">/ 250g</span>
          </div>
          
          <div className="flex flex-col gap-5 w-full max-w-md mx-auto md:mx-0">
            <div className="flex items-center gap-4 w-full justify-center md:justify-start">
              <div className="flex items-center justify-between border border-[#3a2522]/10 dark:border-white/10 rounded-full px-4 py-3 min-w-[150px] bg-white/30 dark:bg-white/5 backdrop-blur-sm transform-gpu transition-colors duration-500">
                <button 
                  onClick={() => decrement(activeProduct.id)}
                  className="text-[#3a2522]/50 hover:text-[#3a2522] dark:text-white/50 dark:hover:text-white text-2xl transition-colors w-10 h-10 flex items-center justify-center disabled:opacity-30 disabled:hover:text-[#3a2522]/50 dark:disabled:hover:text-white/50"
                  disabled={count === 0}
                >
                  -
                </button>
                <span className="text-[#3a2522] dark:text-white font-light text-xl min-w-[30px] text-center transition-colors duration-500">{count}</span>
                <button 
                  onClick={() => increment(activeProduct.id, livePrice, activeProduct.name)}
                  className="text-[#3a2522]/50 hover:text-[#3a2522] dark:text-white/50 dark:hover:text-white text-2xl transition-colors w-10 h-10 flex items-center justify-center"
                 disabled={isOutOfStock || count >= availableQty}>
                  +
                </button>
              </div>
            </div>
            {/* Inventory Status Bar */}
            <div className="w-full max-w-xs mx-auto md:mx-0 mt-2 transform-gpu transition-all duration-500">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#3a2522]/70 dark:text-white/60 mb-1.5">
                <span>{isOutOfStock ? 'Sold Out' : 'Available Stock'}</span>
                {!isOutOfStock && <span>{availableQty} Units</span>}
              </div>
              <div className="w-full h-1 bg-[#3a2522]/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${pct <= 20 ? 'bg-red-500' : 'bg-[#3a2522] dark:bg-white'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsViolet;
