// src/components/main/HeroSection/gameOfLife.ts

/** A seed shape as rows of characters: '#' = alive, anything else = dead. */
export type SeedPattern = readonly string[];

/** Small pixel-glyph seeds (sparkle, ring, cross, hollow box, glider-prone cluster). */
export const SEED_PATTERNS: readonly SeedPattern[] = [
  ['.#.', '###', '.#.'],
  ['.###.', '#...#', '#...#', '#...#', '.###.'],
  ['.#.', '.#.', '###', '.#.', '.#.'],
  ['####', '#..#', '#..#', '####'],
  ['.##', '##.', '.#.'],
];

/** Stamps a seed pattern onto the grid, wrapping at the edges. Mutates `grid`. */
export function plantSeed(
  grid: Uint8Array,
  cols: number,
  rows: number,
  pattern: SeedPattern,
  originX: number,
  originY: number
): void {
  for (let y = 0; y < pattern.length; y++) {
    const row = pattern[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== '#') continue;
      const gx = ((originX + x) % cols + cols) % cols;
      const gy = ((originY + y) % rows + rows) % rows;
      grid[gy * cols + gx] = 1;
    }
  }
}

/** Counts live cells in the 8-neighbor (Moore) neighborhood, wrapping at the edges. */
export function countLiveNeighbors(
  grid: Uint8Array,
  cols: number,
  rows: number,
  x: number,
  y: number
): number {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = ((x + dx) % cols + cols) % cols;
      const ny = ((y + dy) % rows + rows) % rows;
      count += grid[ny * cols + nx];
    }
  }
  return count;
}

/**
 * Advances the grid by one generation using standard Conway rules (B3/S23)
 * on a toroidal (wrapping) grid. Returns a new grid and the resulting live
 * cell count — does not mutate the input.
 */
export function stepGameOfLife(
  grid: Uint8Array,
  cols: number,
  rows: number
): { next: Uint8Array; liveCount: number } {
  const next = new Uint8Array(cols * rows);
  let liveCount = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countLiveNeighbors(grid, cols, rows, x, y);
      const alive = grid[y * cols + x] === 1;
      const survives = alive ? neighbors === 2 || neighbors === 3 : neighbors === 3;
      if (survives) {
        next[y * cols + x] = 1;
        liveCount++;
      }
    }
  }
  return { next, liveCount };
}
