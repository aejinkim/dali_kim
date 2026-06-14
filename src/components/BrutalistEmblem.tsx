import React from 'react';

export default function BrutalistEmblem() {
  return (
    <div className="flex items-center gap-4 select-none">
      {/* SVG Graphic with Filter */}
      <svg 
        className="w-[180px] h-[90px] sm:w-[200px] sm:h-[100px]"
        viewBox="0 0 220 110" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Custom Procedural SVG Grunge Filter */}
          <filter id="grunge-effect" x="-10%" y="-10%" width="120%" height="120%">
            {/* 1. Edge Distortion: Turbulence + Displacement Map */}
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="edge-noise" />
            <feDisplacementMap in="SourceGraphic" in2="edge-noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="distorted" />
            
            {/* 2. Grain Texture Overlay: High frequency turbulence */}
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="grain" />
            {/* Tone down the grain and make it semi-transparent */}
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.45 0" in="grain" result="colored-grain" />
            <feComposite operator="in" in="colored-grain" in2="SourceGraphic" result="grain-masked" />
            
            {/* 3. Combine both effects */}
            <feMerge>
              <feMergeNode in="distorted" />
              <feMergeNode in="grain-masked" />
            </feMerge>
          </filter>
        </defs>

        {/* Group with filter applied */}
        <g filter="url(#grunge-effect)">
          {/* Background capsules (filled black) */}
          {/* Top Capsule */}
          <rect x="5" y="5" width="210" height="46" rx="23" fill="#111111" />
          {/* Top Divider */}
          <line x1="110" y1="5" x2="110" y2="51" stroke="#F3F0E6" strokeWidth="2" />
          
          {/* Bottom Capsule */}
          <rect x="5" y="59" width="210" height="46" rx="23" fill="#111111" />
          {/* Bottom Divider */}
          <line x1="110" y1="59" x2="110" y2="105" stroke="#F3F0E6" strokeWidth="2" />

          {/* Icon Elements (drawn in background cream color #F3F0E6) */}
          
          {/* 1. Left Top: Chevron Triangles (<<<) */}
          <path d="M 32 28 L 44 18 L 44 38 Z" fill="#F3F0E6" />
          <path d="M 50 28 L 62 18 L 62 38 Z" fill="#F3F0E6" />
          <path d="M 68 28 L 80 18 L 80 38 Z" fill="#F3F0E6" />

          {/* 2. Right Top: Sun / Starburst */}
          {/* Center Circle */}
          <circle cx="160" cy="28" r="8" fill="#F3F0E6" />
          {/* Spikes */}
          <path d="
            M 160 12 L 160 16 
            M 160 40 L 160 44 
            M 144 28 L 148 28 
            M 172 28 L 176 28 
            M 149 17 L 152 20 
            M 168 36 L 171 39 
            M 149 39 L 152 36 
            M 168 17 L 171 20
          " stroke="#F3F0E6" strokeWidth="2.5" strokeLinecap="round" />

          {/* 3. Left Bottom: Zig-Zag Wave */}
          <path d="M 28 82 L 39 68 L 50 94 L 61 68 L 72 94 L 83 82" stroke="#F3F0E6" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* 4. Right Bottom: Eye */}
          {/* Eye Outline */}
          <path d="M 137 82 C 147 70, 173 70, 183 82 C 173 94, 147 94, 137 82 Z" fill="none" stroke="#F3F0E6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Pupil */}
          <circle cx="160" cy="82" r="5" fill="#F3F0E6" />
          {/* Center point */}
          <circle cx="160" cy="82" r="1.5" fill="#111111" />
        </g>
      </svg>

      {/* Label next to emblem */}
      <span className="text-[10px] tracking-widest font-mono text-[#555555] uppercase select-none">
        [ 그런지 효과 ]
      </span>
    </div>
  );
}
