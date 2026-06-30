import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Leaf, Droplet, Sun } from 'lucide-react';

const HeroSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the hero container image
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: 'power2.out' }
      );

      // Staggered slide right for the left-aligned text block
      gsap.fromTo(
        '.hero-anim-left',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.8, stagger: 0.2, ease: 'power4.out', delay: 0.3 }
      );

      // Slide up for bottom features
      gsap.fromTo(
        '.hero-anim-bottom',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: 'power4.out', delay: 0.8 }
      );
      
      // Fade in the tiny footer text
      gsap.fromTo(
        '.hero-anim-footer',
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: 'power2.out', delay: 1.2 }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative opacity-0 h-[90vh] md:h-[85vh] overflow-hidden bg-[#F3ECE4]">
      {/* Background Image */}
      <picture className="w-full h-full absolute inset-0 block">
        <source media="(min-width: 768px)" srcSet="/product_visuals/Images%20Web%20Format/Lap%20hero%20Section%20Image.webp" />
        <img 
          src="/product_visuals/Images%20Web%20Format/Phone%20Hero%20Section%20Image.webp" 
          alt="Tessara Cosmetics Hero" 
          fetchPriority="high"
          decoding="sync"
          className="w-full h-full object-cover object-center"
        />
      </picture>

      {/* Solid Gradient Overlay at bottom for readable dark text (No expensive blur) */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[50%] md:h-[60%] pointer-events-none z-0"
        style={{ 
          background: 'linear-gradient(to top, rgba(243, 236, 228, 1) 0%, rgba(243, 236, 228, 0.98) 30%, rgba(243, 236, 228, 0.8) 50%, transparent 100%)',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      ></div>

      {/* Main Overlay Content - Left Aligned at Very Bottom */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end items-start pb-0 px-8 md:px-16 max-w-[1400px] mx-auto translate-y-4">
        
        {/* Typography Section */}
        <div className="flex flex-col items-start text-left w-full max-w-2xl mb-4">
          <h1 
            className="hero-anim-left text-4xl md:text-6xl lg:text-7xl font-medium text-[#2d1f1f] tracking-[0.1em] leading-[1.1] mb-4 uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Moroccan<br />Cosmetics
          </h1>

          <p 
            className="hero-anim-left text-sm md:text-base text-[#5a443f] font-light max-w-xs md:max-w-md leading-relaxed tracking-wide"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Discover the timeless beauty secrets of Morocco with pure, natural, and authentically yours.
          </p>
        </div>

        {/* Very Bottom Footer */}
        <p className="hero-anim-footer text-[8px] tracking-[0.4em] uppercase text-[#8c7a6b] font-medium mt-6">
          Inspired by Morocco . Made with Care .
        </p>

      </div>
    </div>
  );
};

export default HeroSection;
