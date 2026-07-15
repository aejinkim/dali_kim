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

/**
 * Stamps a seed pattern onto the grid, wrapping at the edges. Mutates `grid`.
 * Also stamps `changedAt` to `generation` for every planted cell — without
 * this, a freshly-planted still life (whose cells never flip again) would
 * keep whatever stale/sentinel value `changedAt` already held, making it
 * look like it's been stagnant since before generation 0 and eligible for
 * still-life clearing almost immediately instead of after a real grace
 * period of inactivity.
 */
export function plantSeed(
  grid: Uint8Array,
  cols: number,
  rows: number,
  pattern: SeedPattern,
  originX: number,
  originY: number,
  changedAt: Int32Array,
  generation: number
): void {
  for (let y = 0; y < pattern.length; y++) {
    const row = pattern[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== '#') continue;
      const gx = ((originX + x) % cols + cols) % cols;
      const gy = ((originY + y) % rows + rows) % rows;
      grid[gy * cols + gx] = 1;
      changedAt[gy * cols + gx] = generation;
    }
  }
}

/**
 * Counts live cells in the 8-neighbor (Moore) neighborhood, wrapping at the
 * edges. Wraparound is only reachable via the `x === 0/cols-1` etc. branches
 * below — a plain modulo (as this used to compute) pays two `%` ops per
 * neighbor for every cell, when only cells on the grid's four edges ever
 * actually wrap.
 */
export function countLiveNeighbors(
  grid: Uint8Array,
  cols: number,
  rows: number,
  x: number,
  y: number
): number {
  const xm1 = x === 0 ? cols - 1 : x - 1;
  const xp1 = x === cols - 1 ? 0 : x + 1;
  const ym1 = y === 0 ? rows - 1 : y - 1;
  const yp1 = y === rows - 1 ? 0 : y + 1;
  const rowUp = ym1 * cols;
  const rowMid = y * cols;
  const rowDown = yp1 * cols;
  return (
    grid[rowUp + xm1] + grid[rowUp + x] + grid[rowUp + xp1] +
    grid[rowMid + xm1] + grid[rowMid + xp1] +
    grid[rowDown + xm1] + grid[rowDown + x] + grid[rowDown + xp1]
  );
}

/**
 * Advances the grid by one generation using standard Conway rules (B3/S23)
 * on a toroidal (wrapping) grid. Does not mutate `grid`. Accepts an optional
 * `next` buffer to write into — callers that step every frame should keep
 * two buffers and ping-pong them across calls instead of letting this
 * allocate a fresh `Uint8Array` every generation.
 */
export function stepGameOfLife(
  grid: Uint8Array,
  cols: number,
  rows: number,
  next: Uint8Array = new Uint8Array(cols * rows)
): { next: Uint8Array; liveCount: number } {
  let liveCount = 0;
  for (let y = 0; y < rows; y++) {
    const rowMid = y * cols;
    for (let x = 0; x < cols; x++) {
      const neighbors = countLiveNeighbors(grid, cols, rows, x, y);
      const alive = grid[rowMid + x] === 1;
      const survives = alive ? neighbors === 2 || neighbors === 3 : neighbors === 3;
      next[rowMid + x] = survives ? 1 : 0;
      if (survives) liveCount++;
    }
  }
  return { next, liveCount };
}
