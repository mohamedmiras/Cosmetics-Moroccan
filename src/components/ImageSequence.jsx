import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;

const ImageSequence = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [loadedCount, setLoadedCount] = useState(0);
  
  // Animation state
  const frameObj = useRef({ frame: 1 });

  // Load images
  useEffect(() => {
    let loaded = 0;
    const images = [];

    // Prioritize first frame
    const firstImg = new Image();
    firstImg.src = `/Videos/Intro_frames/ezgif-frame-001.png`;
    firstImg.onload = () => {
      images[1] = firstImg;
      setLoadedCount((c) => c + 1);
      drawFrame(1);
    };

    // Load the rest in the background
    for (let i = 2; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/Videos/Intro_frames/ezgif-frame-${frameNum}.png`;
      img.onload = () => {
        images[i] = img;
        loaded++;
        setLoadedCount(loaded + 1);
      };
    }
    
    imagesRef.current = images;
  }, []);

  // Cache rect to avoid layout thrashing on scroll
  const canvasRect = useRef(null);

  useEffect(() => {
    const updateRect = () => {
      if (canvasRef.current) {
        canvasRect.current = canvasRef.current.getBoundingClientRect();
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  // Draw to canvas
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for opaque images
    
    let targetIndex = Math.round(index);
    let img = imagesRef.current[targetIndex];

    // Fallback: If the target frame isn't loaded, find the closest one that is
    if (!img || !img.complete) {
      let found = false;
      for (let i = targetIndex - 1; i >= 1; i--) {
        if (imagesRef.current[i] && imagesRef.current[i].complete) {
          img = imagesRef.current[i];
          found = true;
          break;
        }
      }
      if (!found) {
        for (let i = targetIndex + 1; i <= FRAME_COUNT; i++) {
          if (imagesRef.current[i] && imagesRef.current[i].complete) {
            img = imagesRef.current[i];
            break;
          }
        }
      }
    }

    if (img && img.complete) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvasRect.current || canvas.getBoundingClientRect();
      
      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        ctx.scale(dpr, dpr);
      }

      const hRatio = rect.width / img.width;
      const vRatio = rect.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const centerShift_x = (rect.width - img.width * ratio) / 2;
      const centerShift_y = (rect.height - img.height * ratio) / 2;

      // Fill background instead of clearRect for alpha:false optimization
      ctx.fillStyle = '#020510';
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    }
  };

  // Setup GSAP ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%", // 400vh of scrolling to complete the animation
        pin: true,
        scrub: true, // Use true instead of 0.5 to sync perfectly with Lenis smooth scroll
        onUpdate: (self) => {
          // Progress goes from 0 to 1
          const targetFrame = 1 + self.progress * (FRAME_COUNT - 1);
          frameObj.current.frame = targetFrame;
          drawFrame(targetFrame);

          // Smooth automatic fade-in when reaching the very end
          const finalPreview = document.getElementById('final-preview-overlay');
          const textOverlay = document.getElementById('premium-text-overlay');
          
          if (self.progress > 0.98) {
            if (finalPreview) {
              finalPreview.style.opacity = 1;
              finalPreview.style.pointerEvents = 'auto';
            }
            if (textOverlay) {
              textOverlay.style.opacity = 1;
              textOverlay.style.pointerEvents = 'auto';
              textOverlay.style.transform = 'translateY(0)';
            }
          } else {
            if (finalPreview) {
              finalPreview.style.opacity = 0;
              finalPreview.style.pointerEvents = 'none';
            }
            if (textOverlay) {
              textOverlay.style.opacity = 0;
              textOverlay.style.pointerEvents = 'none';
              textOverlay.style.transform = 'translateY(20px)';
            }
          }
        }
      });
    });

    return () => ctx.revert();
  }, []);

  // Handle resize to redraw correctly
  useEffect(() => {
    const handleResize = () => drawFrame(frameObj.current.frame);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen relative bg-[#020510] overflow-hidden">
      {/* 1. Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* 2. Final Preview Overlay (Mobile Only, Auto Smooth Fade) */}
      <div 
        id="final-preview-overlay"
        className="block md:hidden absolute inset-0 w-full h-full z-10 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/final_preview_mobile_phne/preview.png)',
          opacity: 0, 
          pointerEvents: 'none', 
          transition: 'opacity 1s ease-in-out' 
        }}
      />

      {/* Top Gradient Fade for Navbar/Top Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#020510]/80 to-transparent z-15 pointer-events-none"></div>

      {/* Bottom Gradient Fade for Product Bar */}
      <div className="absolute bottom-0 left-0 w-full h-48 md:h-64 bg-gradient-to-t from-[#020510]/90 to-transparent z-15 pointer-events-none"></div>

      {/* Left Gradient Fade */}
      <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#020510] to-transparent z-15 pointer-events-none"></div>

      {/* Right Gradient Fade */}
      <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#020510] to-transparent z-15 pointer-events-none"></div>

      {loadedCount < FRAME_COUNT && (
        <div className="absolute top-4 right-4 text-xs font-mono text-white/30 z-50">
          Loading HD... {Math.round((loadedCount / FRAME_COUNT) * 100)}%
        </div>
      )}
      
      {/* Premium Typography Overlay */}
      <div 
        id="premium-text-overlay"
        className="absolute bottom-0 left-0 z-20 w-full p-8 md:p-16 pb-12 flex flex-col items-center md:items-start text-center md:text-left pointer-events-none transition-all duration-1000 ease-out"
        style={{ opacity: 0, transform: 'translateY(20px)' }}
      >
        
        {/* Decorative Line */}
        <div className="w-12 h-[1px] bg-white/50 mb-6 hidden md:block"></div>

        <h1 className="text-2xl md:text-4xl font-extralight tracking-[0.5em] uppercase text-white mb-3 drop-shadow-2xl">
          Moroccan
          <span className="block mt-2 font-normal text-white/80">Cosmetics</span>
        </h1>
        
        <p className="text-[10px] md:text-xs font-light text-white/50 tracking-[0.3em] uppercase mb-10 max-w-xs md:max-w-none">
          Discover Authentic Radiance
        </p>

        <button className="pointer-events-auto group relative px-12 py-4 overflow-hidden rounded-full glass border border-white/20 backdrop-blur-2xl transition-all duration-700 hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          {/* Button inner glow */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="relative z-10 text-white/90 font-light tracking-[0.25em] uppercase text-xs flex items-center gap-3">
            Explore Collection
            <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-12 right-8 flex flex-col items-center opacity-50 pointer-events-none z-50 hidden md:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] mb-3 text-white/50">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default ImageSequence;
