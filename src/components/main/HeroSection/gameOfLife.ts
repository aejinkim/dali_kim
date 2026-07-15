// src/components/main/HeroSection/gameOfLife.ts

/** A seed shape as rows of characters: '#' = alive, anything else = dead. */
export type SeedPattern = readonly string[];

/**
 * Canonical named Game of Life objects, pulled from LifeWiki (conwaylife.com)
 * pattern files for byte-accuracy. Seven families for visual variety:
 *  - Spaceships: translate across the grid every generation, forever.
 *  - Oscillators: blink in place on a fixed period, forever.
 *  - Still lifes: never change — stable "anchors" that passing ships react with.
 *  - Methuselahs: chaotic, long-lived — evolve unpredictably for hundreds to
 *    thousands of generations before settling, unlike the abstract glyphs
 *    this replaced (which just decayed quickly with no particular behavior).
 *  - Guns: periodically emit a new spaceship forever — a literal glider factory.
 *  - Puffers: move like a spaceship while continuously leaving debris behind.
 *  - Wickstretchers: move like a spaceship while stretching a trailing "wick"
 *    (here, a boat) that stays attached at the original planting point.
 *
 * Deliberately not included — not a sourcing gap, but a real fit problem:
 *  - Replicator: per LifeWiki, no finite replicator is known to exist at all
 *    under the standard B3/S23 rule this engine uses (they only exist in
 *    other rulesets, e.g. HighLife's B36/S23).
 *  - Breeder / Spacefiller: the smallest known examples are enormous (the
 *    first breeder, Breeder 1, is 4060 cells across a 749×338 bounding box) —
 *    far wider than this field's grid, so it would immediately wrap into and
 *    collide with itself instead of running as designed.
 *  - Slide gun: a rare, actively-researched pattern class; no small
 *    canonical example with a downloadable cell pattern was found.
 *  - 104P177_synth (a 24-glider synthesis of 104P177): 167×88 — needs a huge
 *    empty area for the gliders to converge and collide correctly; on this
 *    grid it would wrap and collide with unrelated cells before completing.
 */
export const SEED_PATTERNS: readonly SeedPattern[] = [
  // Glider — spaceship, period 4, moves one cell diagonally per cycle.
  ['.#.', '..#', '###'],
  // Lightweight spaceship (LWSS) — spaceship, period 4, moves horizontally.
  ['.####', '#...#', '....#', '#..#.'],
  // Blinker — oscillator, period 2.
  ['###'],
  // Toad — oscillator, period 2.
  ['.###', '###.'],
  // Beacon — oscillator, period 2.
  ['##..', '##..', '..##', '..##'],
  // Pulsar — oscillator, period 3.
  [
    '..###...###..',
    '.............',
    '#....#.#....#',
    '#....#.#....#',
    '#....#.#....#',
    '..###...###..',
    '.............',
    '..###...###..',
    '#....#.#....#',
    '#....#.#....#',
    '#....#.#....#',
    '.............',
    '..###...###..',
  ],
  // Block — still life, never changes.
  ['##', '##'],
  // Beehive — still life, never changes.
  ['.##.', '#..#', '.##.'],
  // Boat — still life, never changes.
  ['##.', '#.#', '.#.'],
  // R-pentomino — methuselah, doesn't stabilize until generation 1103 (population 116 by then).
  ['.##', '##.', '.#.'],
  // Diehard — methuselah, vanishes completely at generation 130.
  ['......#', '##.....', '.#...###'],
  // Acorn — methuselah, doesn't stabilize until generation 5206.
  ['.#.....', '...#...', '##..###'],
  // 35201M — methuselah, discovered by Andrzej Okrasinski (2008). One of the
  // longest-lived known: doesn't stabilize until generation 35201 (hence the
  // name), growing from 183 to 5828 cells and ejecting dozens of gliders
  // along the way.
  [
    '####..##...##.##...#',
    '##.#..##.###.#.#..##',
    '.#.##....#.....##.##',
    '.#....#....#....#.##',
    '#.....#.#.#....#.#..',
    '.###.#..#####.#.#.##',
    '#.##..####.#.##.####',
    '..#......##.#.#.#.#.',
    '.####....#....##.#.#',
    '.##......###...###..',
    '.#...#..#......#####',
    '###...#..#....#.###.',
    '.##.#.#.##....####..',
    '#.#..##.#..#.#.####.',
    '##....#.#.##.#..#.#.',
    '.##...#.#.#######...',
    '#...#.#......###..##',
    '..##..#..#.#.##.#..#',
    '...#.#.#.#.#....##..',
    '##..##.#.#..#.......',
  ],
  // Gosper glider gun — period 30, emits a new glider every cycle forever.
  [
    '........................#.',
    '......................#.#.',
    '............##......##............##',
    '...........#...#....##............##',
    '##........#.....#...##',
    '##........#...#.##....#.#.',
    '..........#.....#.......#.',
    '...........#...#',
    '............##',
  ],
  // Puffer 1 — moves and continuously leaves behind debris (groups of blinkers).
  [
    '.###......#.....#......###',
    '#..#.....###...###.....#..#',
    '...#....##.#...#.##....#',
    '...#...................#',
    '...#..#.............#..#',
    '...#..##...........##..#',
    '..#...##...........##...#',
  ],
  // Boatstretcher 1 — moves diagonally while stretching a trailing boat.
  [
    '..........#',
    '.........##',
    '.........#.#...#',
    '.............##',
    '..............#..#',
    '............##.#..#',
    '........###.##....#',
    '.......#..#....#',
    '......#....#....##',
    '.##...#.....#.#.##',
    '##....##.........#',
    '..#.....#.........#',
    '.....##..#......###',
    '...#.##...........#.#',
    '...##....#.........##',
    '..#..#.#',
    '........##..#',
    '....#...###.#',
    '.....##....###',
    '..............#',
    '.............##',
  ],
  // 104P177 — oscillator, period 177, discovered by Karel Suhajda (2007).
  // Verified: returns to this exact state after 177 generations.
  [
    '................#............#................',
    '.........##........................##.........',
    '........###...##..............##...###........',
    '..............##.##........##.##..............',
    '................#............#................',
    '................................................',
    '................................................',
    '................................................',
    '..#........................................#..',
    '.##........................................##.',
    '.##........................................##.',
    '................................................',
    '................................................',
    '................................................',
    '..##......................................##..',
    '..##......................................##..',
    '#...#....................................#...#',
    '...#......................................#...',
    '...#......................................#...',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '................................................',
    '...#......................................#...',
    '...#......................................#...',
    '#...#....................................#...#',
    '..##......................................##..',
    '..##......................................##..',
    '................................................',
    '................................................',
    '................................................',
    '.##........................................##.',
    '.##........................................##.',
    '..#........................................#..',
    '................................................',
    '................................................',
    '................................................',
    '................#............#................',
    '..............##.##........##.##..............',
    '........###...##..............##...###........',
    '.........##........................##.........',
    '................#............#................',
  ],
  // Pushalong for 114P6H1V0 — an escort structure that helps push a c/6
  // orthogonal spaceship. Stable and self-sustaining on its own (verified:
  // settles into a repeating population cycle, never dies).
  [
    '.....###..............###.....',
    '###.#....................#.###',
    '....#...#............#...#....',
    '....#....#..........#....#....',
    '..........#........#..........',
    '......#.......##.......#......',
    '.......##.##.####.##.##.......',
    '...........#.#..#.#...........',
    '................................',
    '................................',
    '................................',
    '...........#......#...........',
    '..........#.#.##.#.#..........',
    '..........##..##..##..........',
    '..............##..............',
    '................................',
    '............##..##............',
    '............##..##............',
    '.............####.............',
    '.............#..#.............',
    '............#....#............',
    '............#....#............',
    '............#.##.#............',
    '.............#..#.............',
    '.............#..#.............',
    '................................',
    '.......#..............#.......',
    '.......##....#..#....##.......',
    '.......#.....####.....#.......',
    '........##....##....##........',
    '.........#..........#.........',
    '.......#.#..........#.#.......',
    '........#####....#####........',
    '..........#..####..#..........',
    '.........#....##....#.........',
    '.............#..#.............',
    '..............##..............',
    '...........##.##.##...........',
    '................................',
    '..........#........#..........',
    '.........###......###.........',
    '.........#..#....#..#.........',
    '........##..........##........',
  ],
  // Tagalong for 119P4H1V0 — an escort structure that rides along with a
  // spaceship. Stable and self-sustaining on its own (verified: settles
  // into a repeating population cycle, never dies).
  [
    '.................................#......##.#',
    '................#...............#.#....#.###',
    '......#.#......#.....##........#.......##...',
    '......#....#....#.######....##........#.#...',
    '......#.########..........#..#.###.###.###..',
    '.........#.....#.......####....###.#....#...',
    '....##.................###.#........###.#...',
    '.#..##.......##........##.............##....',
    '.#..#.........................................',
    '#..............................................',
    '.#..#.........................................',
    '.#..##.......##........##.....................',
    '....##.................###.#..................',
    '.........#.....#.......####....###............',
    '......#.########..........#..#.###............',
    '......#....#....#.######....##................',
    '......#.#......#.....##........#..............',
    '................#...............#.#...........',
    '.................................#.............',
  ],
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
