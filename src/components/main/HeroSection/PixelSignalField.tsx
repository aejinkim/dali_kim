// src/components/main/HeroSection/PixelSignalField.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
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

const RESEED_LIVE_THRESHOLD = 4;
const RESEED_IDLE_GENERATIONS = 2;
const CURSOR_SEED_INTERVAL_MS = 900;
// A cell is only "stuck" if nothing within this radius has changed recently —
// checking just the cell itself would misfire on oscillators, which always
// have a few core cells that stay alive across their whole period (e.g. a
// blinker's center cell never dies, even though the blinker as a whole is
// clearly still oscillating).
const STILL_LIFE_RADIUS = 3;
const STILL_LIFE_TIMEOUT_GENERATIONS = 24;
const STILL_LIFE_CHECK_INTERVAL_GENERATIONS = 8;

// Tunable values pulled out into a mutable config so the debug panel below
// can drag them live — the animation loop reads `configRef.current` every
// frame instead of closing over module-level consts, so a slider change
// takes effect on the very next frame with no remount.
interface TunableConfig {
  ditherCell: number;
  cellSize: number;
  golCell: number;
  generationInterval: number;
  bg: string;
  ink: string;
  gol: string;
}

const DEFAULT_TUNABLES = {
  ditherCell: 6,
  cellSize: 5,
  golCell: 8,
  generationInterval: 35,
};

// Curated looks a visitor can jump straight to — pulled from palettes this
// project actually shipped with at some point, rather than invented fresh.
const PRESETS: { name: string; bg: string; ink: string; gol: string }[] = [
  { name: 'Signal Blue', bg: '#68B0FF', ink: '#E0F0FF', gol: '#0003FF' },
  { name: 'Deep Navy', bg: '#16227A', ink: '#ffffff', gol: '#4AFF0D' },
  { name: 'Paper Cream', bg: '#F3EFE3', ink: '#2b2620', gol: '#0F0DFF' },
];

export default function PixelSignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<TunableConfig>({
    ...DEFAULT_TUNABLES,
    bg: PRESETS[0].bg,
    ink: PRESETS[0].ink,
    gol: PRESETS[0].gol,
  });
  const reinitGolRef = useRef<() => void>(() => {});

  // Customize panel — visible to every visitor in Mode C, not gated behind
  // a debug flag. Lets them pick a curated preset or drag the raw values.
  const [panelValues, setPanelValues] = useState<TunableConfig>(configRef.current);
  const [copied, setCopied] = useState(false);

  const updateConfig = <K extends keyof TunableConfig>(key: K, value: TunableConfig[K]) => {
    configRef.current[key] = value;
    setPanelValues(prev => ({ ...prev, [key]: value }));
    if (key === 'golCell') reinitGolRef.current();
  };

  const applyPreset = (preset: typeof PRESETS[number]) => {
    configRef.current = { ...configRef.current, bg: preset.bg, ink: preset.ink, gol: preset.gol };
    setPanelValues({ ...configRef.current });
  };

  const copyValues = () => {
    const c = configRef.current;
    const text = [
      `DITHER_CELL: ${c.ditherCell}`,
      `dither cell size: ${c.cellSize}px`,
      `GOL_CELL: ${c.golCell}`,
      `GENERATION_INTERVAL_MS: ${c.generationInterval}`,
      `--color-bonsai-bg: ${c.bg};`,
      `--color-bonsai-ink: ${c.ink};`,
      `--color-bonsai-gol: ${c.gol};`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const bg = styles.getPropertyValue('--color-bonsai-bg').trim() || '#F3EFE3';
    const ink = styles.getPropertyValue('--color-bonsai-ink').trim() || '#2b2620';
    const gol = styles.getPropertyValue('--color-bonsai-gol').trim() || '#0F0DFF';
    configRef.current = { ...configRef.current, bg, ink, gol };
    setPanelValues({ ...configRef.current });

    let width = 0;
    let height = 0;

    let golCols = 0;
    let golRows = 0;
    let grid: Uint8Array<ArrayBufferLike> = new Uint8Array(0);
    // Generation index each cell last flipped state at — used to tell a
    // truly-frozen still life apart from an oscillator's unchanging core.
    let changedAt: Int32Array<ArrayBufferLike> = new Int32Array(0);
    let generation = 0;

    const randomSeed = () => SEED_PATTERNS[Math.floor(Math.random() * SEED_PATTERNS.length)];

    const plantRandom = () => {
      const ox = Math.floor(Math.random() * golCols);
      const oy = Math.floor(Math.random() * golRows);
      plantSeed(grid, golCols, golRows, randomSeed(), ox, oy);
    };

    const initGrid = () => {
      const golCell = configRef.current.golCell;
      golCols = Math.max(1, Math.floor(width / golCell));
      golRows = Math.max(1, Math.floor(height / golCell));
      grid = new Uint8Array(golCols * golRows);
      changedAt = new Int32Array(golCols * golRows).fill(-STILL_LIFE_TIMEOUT_GENERATIONS);
      generation = 0;
      plantRandom();
      plantRandom();
      plantRandom();
    };
    reinitGolRef.current = initGrid;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = Math.round(rect?.width ?? window.innerWidth);
      height = Math.round(rect?.height ?? window.innerHeight);
      canvas.width = width;
      canvas.height = height;
      initGrid();
    };
    resize();
    window.addEventListener('resize', resize);

    let mouseX = -9999;
    let mouseY = -9999;
    let lastCursorSeed = 0;
    const hint = hintRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x < width && y >= 0 && y < height) {
        mouseX = x;
        mouseY = y;
        if (hint) {
          hint.style.transform = `translate3d(${x}px, ${y}px, 0) translate(14px, -50%)`;
          hint.style.opacity = '1';
        }
      } else {
        mouseX = -9999;
        mouseY = -9999;
        if (hint) hint.style.opacity = '0';
      }
    };
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = Math.floor((e.clientX - rect.left) / configRef.current.golCell);
      const cy = Math.floor((e.clientY - rect.top) / configRef.current.golCell);
      plantSeed(grid, golCols, golRows, randomSeed(), cx, cy);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('click', onClick);

    let ditherTime = Math.random() * 100;

    // Low-frequency waves (a handful of cycles across the *whole* canvas,
    // normalized 0-1 so it scales with viewport size instead of the fixed
    // per-cell frequency this was originally tuned at on a small mockup)
    // produce a few large light/dark regions — like a photo's macro shading —
    // instead of a uniform fine-grained texture repeating everywhere.
    const DITHER_FREQ_X = 1.6;
    const DITHER_FREQ_Y = 1.1;
    // Slow horizontal scroll — like clouds drifting on wind — instead of the
    // pattern only oscillating in place.
    const DITHER_DRIFT = 0.05;

    const drawDither = () => {
      const { ditherCell, cellSize, bg: bgColor, ink: inkColor } = configRef.current;
      const dcols = Math.ceil(width / ditherCell);
      const drows = Math.ceil(height / ditherCell);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = inkColor;
      ctx.globalAlpha = 0.35;
      const drift = ditherTime * DITHER_DRIFT;
      for (let y = 0; y < drows; y++) {
        const by = (y % 8) * 8;
        const ny = y / drows;
        for (let x = 0; x < dcols; x++) {
          const nx = x / dcols + drift;
          // Two big, slow waves shape the large cloud-like blobs...
          const big = Math.sin(nx * Math.PI * 2 * DITHER_FREQ_X + ny * Math.PI * 1.7)
                    + Math.sin(ny * Math.PI * 2 * DITHER_FREQ_Y - nx * Math.PI * 1.1 + 1.3);
          // ...multiplied by a finer octave so their edges read as fluffy/
          // irregular rather than a clean, geometric wave interference line.
          const detail = Math.sin(nx * Math.PI * 7 + ny * Math.PI * 5.3)
                        * Math.sin(ny * Math.PI * 6 - nx * Math.PI * 4.1) * 0.35;
          const v = big + detail;
          const n = (v + 2.35) / 4.7;
          // Wider contrast than a plain remap: pushes low regions to fully
          // empty and high regions to fully solid, instead of every region
          // sitting in the same mid-density speckle.
          const d = (n - 0.42) * 2.8;
          if (d <= 0) continue;
          if (BAYER[(x % 8) + by] / 64 < d) {
            ctx.fillRect(x * ditherCell, y * ditherCell, cellSize, cellSize);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawGrid = () => {
      const { golCell, gol: golColor } = configRef.current;
      ctx.fillStyle = golColor;
      for (let y = 0; y < golRows; y++) {
        for (let x = 0; x < golCols; x++) {
          if (grid[y * golCols + x]) {
            ctx.fillRect(x * golCell + 1, y * golCell + 1, golCell - 2, golCell - 2);
          }
        }
      }
    };

    let raf = 0;
    let lastStepAt = 0;
    let idleGenerations = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      ditherTime += 0.015;
      drawDither();

      const golCell = configRef.current.golCell;
      if (mouseX > -1 && now - lastCursorSeed > CURSOR_SEED_INTERVAL_MS) {
        lastCursorSeed = now;
        const cx = Math.floor(mouseX / golCell);
        const cy = Math.floor(mouseY / golCell);
        plantSeed(grid, golCols, golRows, randomSeed(), cx, cy);
      }

      if (now - lastStepAt > configRef.current.generationInterval) {
        lastStepAt = now;
        generation++;
        const { next, liveCount } = stepGameOfLife(grid, golCols, golRows);
        for (let i = 0; i < next.length; i++) {
          if (next[i] !== grid[i]) changedAt[i] = generation;
        }

        // Every so often, clear any alive cell with no recent activity in
        // its neighborhood — a real still life (nothing nearby has changed
        // in a long time), as opposed to an oscillator (always has *some*
        // cell nearby flipping every period). Decide the whole batch first,
        // against one unmutated snapshot of `changedAt`, then apply it all
        // at once — clearing cells one at a time as we scan would make the
        // first cell's own clear look like "recent activity" to its still-
        // frozen neighbors a moment later, sparing them and leaving a
        // partial shape that the birth rule immediately regrows from.
        if (generation % STILL_LIFE_CHECK_INTERVAL_GENERATIONS === 0) {
          const toClear: number[] = [];
          for (let y = 0; y < golRows; y++) {
            for (let x = 0; x < golCols; x++) {
              const idx = y * golCols + x;
              if (next[idx] !== 1) continue;
              let recentlyActive = false;
              for (let dy = -STILL_LIFE_RADIUS; dy <= STILL_LIFE_RADIUS && !recentlyActive; dy++) {
                const ny = ((y + dy) % golRows + golRows) % golRows;
                for (let dx = -STILL_LIFE_RADIUS; dx <= STILL_LIFE_RADIUS; dx++) {
                  const nx = ((x + dx) % golCols + golCols) % golCols;
                  if (generation - changedAt[ny * golCols + nx] < STILL_LIFE_TIMEOUT_GENERATIONS) {
                    recentlyActive = true;
                    break;
                  }
                }
              }
              if (!recentlyActive) toClear.push(idx);
            }
          }
          for (const idx of toClear) {
            next[idx] = 0;
            changedAt[idx] = generation;
          }
        }

        grid = next;
        idleGenerations = liveCount < RESEED_LIVE_THRESHOLD ? idleGenerations + 1 : 0;
        if (idleGenerations > RESEED_IDLE_GENERATIONS) {
          plantRandom();
          idleGenerations = 0;
        }
      }

      drawGrid();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
      {/* Click affordance: a small label that follows the cursor, hinting
          that clicking plants a new seed. Purely decorative — never
          intercepts pointer events, so it can't block the click it's
          advertising. */}
      <div
        ref={hintRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          transition: 'opacity 150ms ease',
          fontFamily: 'var(--font-google-sans-flex), sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.02em',
          color: 'var(--color-surface-inverse)',
          backgroundColor: 'var(--color-ink)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-button)',
          whiteSpace: 'nowrap',
        }}
      >
        Click
      </div>

      {/* Customize panel — visible to every visitor while in Mode C. Writes
          straight into configRef, which the animation loop reads every
          frame, so every preset pick or slider drag applies live. */}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 50,
          width: 260,
          background: 'rgba(10,10,10,0.88)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '11px',
          lineHeight: 1.6,
          backdropFilter: 'blur(6px)',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Customize</div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              title={preset.name}
              style={{
                flex: 1,
                height: 28,
                borderRadius: 6,
                border: panelValues.bg === preset.bg && panelValues.gol === preset.gol
                  ? '2px solid #ffffff'
                  : '1px solid rgba(255,255,255,0.3)',
                background: preset.bg,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span style={{ display: 'block', width: '60%', height: 6, margin: '0 auto', borderRadius: 3, background: preset.gol }} />
            </button>
          ))}
        </div>

          <label style={{ display: 'block', marginBottom: 8 }}>
            dither cell: {panelValues.ditherCell}px
            <input
              type="range" min={2} max={16} step={1}
              value={panelValues.ditherCell}
              onChange={e => updateConfig('ditherCell', Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 8 }}>
            dither dot size: {panelValues.cellSize}px
            <input
              type="range" min={1} max={16} step={1}
              value={panelValues.cellSize}
              onChange={e => updateConfig('cellSize', Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 8 }}>
            GoL cell: {panelValues.golCell}px
            <input
              type="range" min={4} max={20} step={1}
              value={panelValues.golCell}
              onChange={e => updateConfig('golCell', Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 8 }}>
            generation speed: {panelValues.generationInterval}ms
            <input
              type="range" min={10} max={200} step={5}
              value={panelValues.generationInterval}
              onChange={e => updateConfig('generationInterval', Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>

          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <label style={{ flex: 1 }}>
              bg
              <input
                type="color" value={panelValues.bg}
                onChange={e => updateConfig('bg', e.target.value)}
                style={{ width: '100%', height: 24 }}
              />
            </label>
            <label style={{ flex: 1 }}>
              ink
              <input
                type="color" value={panelValues.ink}
                onChange={e => updateConfig('ink', e.target.value)}
                style={{ width: '100%', height: 24 }}
              />
            </label>
            <label style={{ flex: 1 }}>
              GoL
              <input
                type="color" value={panelValues.gol}
                onChange={e => updateConfig('gol', e.target.value)}
                style={{ width: '100%', height: 24 }}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={copyValues}
            style={{
              width: '100%',
              padding: '8px',
              background: copied ? '#4AFF0D' : '#ffffff',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {copied ? 'Copied!' : 'Copy values'}
          </button>
      </div>
    </div>
  );
}
