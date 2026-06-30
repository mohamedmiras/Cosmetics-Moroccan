import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 30;

const BeldiSequence = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    // Preload images to browser cache
    let loaded = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/Videos/product_visuals/Beldi_Webp/frame-${frameNum}.webp`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
      };
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sequence = { frame: 1 };
      
      gsap.to(sequence, {
        frame: FRAME_COUNT,
        snap: "frame",
        ease: "power2.out",
        duration: 1.8, // Plays automatically over 1.8 seconds
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Starts animating when it comes into view
          toggleActions: "play none none none" // Plays once, stays on the last frame
        },
        onUpdate: () => {
          if (imageRef.current) {
            const paddedFrame = String(sequence.frame).padStart(3, '0');
            imageRef.current.src = `/Videos/product_visuals/Beldi_Webp/frame-${paddedFrame}.webp`;
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex justify-center items-center transform-gpu relative">
      <img
        ref={imageRef}
        src="/Videos/product_visuals/Beldi_Webp/frame-001.webp"
        alt="Savon Noir Beldi sequence"
        className="w-full h-full scale-[1.3] md:scale-[1.6] object-contain drop-shadow-2xl origin-center transform-gpu"
        style={{
          opacity: loadedCount > 0 ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 55%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 55%)'
        }}
      />
    </div>
  );
};

export default BeldiSequence;
