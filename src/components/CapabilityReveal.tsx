'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function CapabilityReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through a specific viewport range:
      // Starts fading when container top is 85% down the viewport
      // Fully visible when container top reaches 20% down the viewport
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.20;
      
      const total = start - end;
      const current = start - rect.top;
      
      const progress = Math.max(0, Math.min(1, current / total));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initially to set correct state on load
    handleScroll();
    
    // Add additional triggers to account for delayed page layout calculations
    window.addEventListener('load', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', handleScroll);
    };
  }, []);

  const mainText = "Transforming complex technology into premium digital products. Architecting intuitive interfaces for Web3 blockchains, aerospace ground stations, and AI-driven fintech—where every interaction impacts capital and consequence.";
  const words = mainText.split(' ');

  return (
    <div 
      ref={containerRef}
      className="p-8 md:p-20 text-left border-b border-[#111111] bg-[#EBECEC] flex flex-col justify-center min-h-[50vh] transition-colors duration-300"
    >
      <div className="max-w-5xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] uppercase select-none">
          {words.map((word, idx) => {
            // Apply a rolling window window for smooth word-by-word fading
            const progressPerWord = 0.25; 
            const startThreshold = (idx / words.length) * (1 - progressPerWord);
            const endThreshold = startThreshold + progressPerWord;
            
            let opacity = 0.15;
            if (scrollProgress > startThreshold) {
              if (scrollProgress >= endThreshold) {
                opacity = 1;
              } else {
                const t = (scrollProgress - startThreshold) / progressPerWord;
                opacity = 0.15 + t * 0.85;
              }
            }

            return (
              <span 
                key={idx} 
                className="inline-block mr-[0.2em] transition-all duration-150 ease-out"
                style={{ 
                  opacity,
                  transform: `translateY(${opacity === 1 ? '0' : `${(1 - opacity) * 4}px`})`,
                  color: opacity > 0.5 ? '#111111' : '#555555'
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>
        
        {/* Sub-text block */}
        <p className="mt-12 text-xs sm:text-sm font-mono uppercase tracking-wider text-[#555555] max-w-2xl border-t border-[#111111]/10 pt-6">
          [ Specializing in Brand Strategy, Web Design, Pitch Decks, Design Systems, and Coaching ]
        </p>
      </div>
    </div>
  );
}
