'use client';

import { useEffect, useRef } from 'react';

export default function PixelSignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bonsai-bg').trim() || '#F3EFE3';

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = Math.round(rect?.width ?? window.innerWidth);
      canvas.height = Math.round(rect?.height ?? window.innerHeight);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
