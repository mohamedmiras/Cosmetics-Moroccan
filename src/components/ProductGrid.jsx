import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';

const ProductGrid = ({ products }) => {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftPos.current = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDragging.current = false;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll-fast multiplier
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -480, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 480, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#F3ECE4] pt-8 pb-20 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full mb-12 flex items-end justify-between">
        
        {/* Section Header */}
        <div>
          <h2 className="text-4xl md:text-5xl font-normal text-[#2d1f1f] leading-tight">
            The Collection
          </h2>
          <div className="w-16 h-[1px] bg-[#731625] mt-6"></div>
        </div>

        {/* Carousel Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full border border-[#8c7a6b]/30 flex items-center justify-center text-[#2d1f1f] hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button 
            onClick={scrollRight}
            className="w-12 h-12 rounded-full border border-[#8c7a6b]/30 flex items-center justify-center text-[#2d1f1f] hover:bg-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

      </div>

      {/* The Carousel */}
      <div className="relative w-full">
        {/* Hardware-accelerated minimal fade effects for small margin */}
        <div className="absolute top-0 left-0 w-4 md:w-16 h-full bg-gradient-to-r from-[#F3ECE4] to-transparent z-10 pointer-events-none transform-gpu translate-z-0"></div>
        <div className="absolute top-0 right-0 w-4 md:w-16 h-full bg-gradient-to-l from-[#F3ECE4] to-transparent z-10 pointer-events-none transform-gpu translate-z-0"></div>
        
        <div 
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide px-4 md:px-[5vw] pb-12 pt-8 will-change-scroll cursor-grab active:cursor-grabbing"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* Universal Swipe/Drag Hint */}
      <div className="flex justify-center mt-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8c7a6b] flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-[#E8D8C8]/50 shadow-sm">
          <MoveHorizontal className="w-4 h-4 text-[#731625]" />
          Drag or Swipe to Explore
        </p>
      </div>

    </div>
  );
};

export default ProductGrid;
