// src/components/main/HeroSection/PixelSignalField.tsx
'use client';

import { useEffect, useRef } from 'react';
import { SEED_PATTERNS, plantSeed, stepGameOfLife } from './gameOfLife';

// Classic 8x8 ordered (Bayer) dithering matrix, values 0-63.
const BAYER: readonly number[] = [
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
];

const DITHER_CELL = 4;
const GOL_CELL = 8;
const GENERATION_INTERVAL_MS = 160;

export default function PixelSignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const bg = styles.getPropertyValue('--color-bonsai-bg').trim() || '#F3EFE3';
    const ink = styles.getPropertyValue('--color-bonsai-ink').trim() || '#2b2620';

    let width = 0;
    let height = 0;

    let golCols = 0;
    let golRows = 0;
    let grid: Uint8Array<ArrayBufferLike> = new Uint8Array(0);

    const randomSeed = () => SEED_PATTERNS[Math.floor(Math.random() * SEED_PATTERNS.length)];

    const plantRandom = () => {
      const ox = Math.floor(Math.random() * golCols);
      const oy = Math.floor(Math.random() * golRows);
      plantSeed(grid, golCols, golRows, randomSeed(), ox, oy);
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = Math.round(rect?.width ?? window.innerWidth);
      height = Math.round(rect?.height ?? window.innerHeight);
      canvas.width = width;
      canvas.height = height;
      golCols = Math.max(1, Math.floor(width / GOL_CELL));
      golRows = Math.max(1, Math.floor(height / GOL_CELL));
      grid = new Uint8Array(golCols * golRows);
      plantRandom();
      plantRandom();
      plantRandom();
    };
    resize();
    window.addEventListener('resize', resize);

    let ditherTime = Math.random() * 100;

    const drawDither = () => {
      const dcols = Math.ceil(width / DITHER_CELL);
      const drows = Math.ceil(height / DITHER_CELL);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = ink;
      ctx.globalAlpha = 0.35;
      for (let y = 0; y < drows; y++) {
        const by = (y % 8) * 8;
        const sy = Math.sin(y * 0.09 + ditherTime * 0.8);
        for (let x = 0; x < dcols; x++) {
          const v = Math.sin(x * 0.13 + ditherTime * 1.4 + sy) + Math.sin(x * 0.06 + y * 0.1 - ditherTime * 0.9);
          const n = (v + 2) / 4;
          const d = (n - 0.55) * 1.6;
          if (d <= 0) continue;
          if (BAYER[(x % 8) + by] / 64 < d) {
            ctx.fillRect(x * DITHER_CELL, y * DITHER_CELL, 3, 3);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawGrid = () => {
      ctx.fillStyle = ink;
      for (let y = 0; y < golRows; y++) {
        for (let x = 0; x < golCols; x++) {
          if (grid[y * golCols + x]) {
            ctx.fillRect(x * GOL_CELL + 1, y * GOL_CELL + 1, GOL_CELL - 2, GOL_CELL - 2);
          }
        }
      }
    };

    let raf = 0;
    let lastStepAt = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      ditherTime += 0.015;
      drawDither();

      if (now - lastStepAt > GENERATION_INTERVAL_MS) {
        lastStepAt = now;
        const { next } = stepGameOfLife(grid, golCols, golRows);
        grid = next;
      }

      drawGrid();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
