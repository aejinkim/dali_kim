'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const CONNECT_DIST = 108;
const PIXEL_SIGNAL_AMBIENT_INTERVAL_MS = 220;
const PIXEL_SIGNAL_CURSOR_INTERVAL_MS = 90;
const PHASE_DELAY_MS = 2500;
const PHASE_TRANSITION_MS = 1500;
const INITIAL_SPAWN_HOLD_MS = 1800;
const CLUSTER_FORCE_MAX = 0;
const BASE_DAMPING = 0.955;
const IDLE_ORBIT_FORCE = 0.018;
const IDLE_DRIFT_FORCE = 0.068;
const CLUSTER_BREATH_FORCE = 0.062;
const CLUSTER_LINK_FORCE = 0.018;
const NODE_SEPARATION_DIST = 76;
const NODE_SEPARATION_FORCE = 0.018;
const PULSE_DURATION_MS = 1200;
const PULSE_ADD_CHANCE = 0.001;
const COLOR_RADIUS = 180;
const COLOR_LERP = 0.07;
const EDGE_REBUILD_INTERVAL = 3;

const MAX_NODES_A = 180;
const AUTO_SPAWN_A = 24;
const MOUSE_SPAWN_A = 50;
const CLICK_BURST_A = 34;

const MAX_NODES_B = 450;
const AUTO_SPAWN_B = 16;
const MOUSE_SPAWN_B = 30;
const CLICK_BURST_B = 54;

const MAX_NODES_C = 320;
const AUTO_SPAWN_C = 32;
const MOUSE_SPAWN_C = 44;
const CLICK_BURST_C = 42;
const PIXEL_SIGNAL_BG = '#0F0DFF';
const PIXEL_SIGNAL_INK = '#FFFFFF';

const HERO_YELLOW = '#F8ED00';
const HERO_PURPLE = '#BA5EF7';
const HERO_STAR_PURPLE = '#A573FF';
const HERO_ORANGE = '#FF735D';
const HERO_GREEN = '#A5EF7A';
const HERO_BLUE = '#00AEEF';

const SHAPES_A = ['sparkle', 'star', 'xcross', 'circle', 'clover', 'burst'] as const;
type ShapeA = typeof SHAPES_A[number];
const COLOR_A: Record<ShapeA, string> = {
  sparkle: HERO_PURPLE,
  star:     HERO_STAR_PURPLE,
  xcross:  HERO_ORANGE,
  circle:  HERO_GREEN,
  clover:  HERO_YELLOW,
  burst:   HERO_BLUE,
};

const SHAPES_B = ['pixel', 'dot', 'hollow', 'tinyL', 'tinyDots'] as const;
type ShapeB = typeof SHAPES_B[number];
const CLUSTER_COLOR_B = ['#1a6aff', '#ddaa00', '#cc2200', '#1a8800', '#9900cc', '#aaaaaa'];

const SHAPES_C = ['pixelCross', 'pixelTarget', 'pixelBrackets', 'pixelDiamond', 'pixelCorners', 'pixelPlus'] as const;
type ShapeC = typeof SHAPES_C[number];

type ShapeType = ShapeA | ShapeB | ShapeC;

interface SimNode {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  clusterId: number;
  opacity: number;
  birthTime: number;
  lifetime: number;
  shape: ShapeType;
  size: number;
  rotation: number;
  rotSpeed: number;
  colorIntensity: number;
  color: string;
  edgeUx?: number;
  edgeUy?: number;
  edgeBounced?: boolean;
}

interface SimEdge {
  a: SimNode; b: SimNode;
  pulses: { startTime: number }[];
}

type SpawnAccent = Partial<Pick<SimNode, 'shape' | 'color' | 'size' | 'clusterId' | 'vx' | 'vy' | 'rotSpeed' | 'lifetime' | 'edgeUx' | 'edgeUy'>> & {
  force?: boolean;
};

const CLUSTERS = [
  { id: 0, cx: 0.15, cy: 0.30 },
  { id: 1, cx: 0.85, cy: 0.25 },
  { id: 2, cx: 0.50, cy: 0.55 },
  { id: 3, cx: 0.12, cy: 0.78 },
  { id: 4, cx: 0.86, cy: 0.76 },
  { id: 5, cx: 0.50, cy: 0.90 },
];

function clusterTarget(clusterId: number, now: number, width: number, height: number) {
  const cluster = CLUSTERS[clusterId % CLUSTERS.length];
  const t = now * 0.00024;
  const baseX = cluster.cx * width;
  const baseY = cluster.cy * height;
  let x = baseX;
  let y = baseY;

  for (const other of CLUSTERS) {
    if (other.id === cluster.id) continue;
    const ox = other.cx * width;
    const oy = other.cy * height;
    const dx = ox - baseX;
    const dy = oy - baseY;
    const dist = Math.hypot(dx, dy) || 1;
    const phase = Math.sin(t * (1.6 + other.id * 0.13) + cluster.id * 1.37 + other.id * 0.91);
    x += (dx / dist) * width * CLUSTER_LINK_FORCE * phase;
    y += (dy / dist) * height * CLUSTER_LINK_FORCE * phase;
  }

  x += Math.sin(t * 3.1 + cluster.id * 1.9) * width * CLUSTER_BREATH_FORCE;
  y += Math.cos(t * 2.7 + cluster.id * 1.4) * height * CLUSTER_BREATH_FORCE;

  return { x, y };
}

const TRAIL_TYPES = ['sparkle', 'star', 'clover', 'xcross', 'circle', 'burst'] as const;
type TrailType = typeof TRAIL_TYPES[number];

const TRAIL_TYPES_B = ['pixel', 'dot', 'hollow', 'tinyL', 'tinyDots'] as const;
type TrailTypeB = typeof TRAIL_TYPES_B[number];
const TRAIL_COLORS_B = ['#1a6aff', '#ddaa00', '#cc2200', '#1a8800', '#9900cc', '#aaaaaa'];

function trailSVG_B(type: TrailTypeB, color: string, size: number): string {
  if (type === 'pixel') return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block"><rect x="0" y="0" width="100" height="100" fill="${color}"/></svg>`;
  if (type === 'dot') return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block"><circle cx="50" cy="50" r="50" fill="${color}"/></svg>`;
  if (type === 'hollow') return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block"><rect x="6" y="6" width="88" height="88" fill="none" stroke="${color}" stroke-width="12"/></svg>`;
  if (type === 'tinyL') return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block"><polyline points="10,10 10,90 90,90" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="square"/></svg>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block"><circle cx="25" cy="25" r="13" fill="${color}"/><circle cx="75" cy="25" r="13" fill="${color}"/><circle cx="25" cy="75" r="13" fill="${color}"/><circle cx="75" cy="75" r="13" fill="${color}"/><circle cx="50" cy="50" r="13" fill="${color}"/></svg>`;
}

function trailSVG_pixelSignal(color: string, size: number): string {
  const unit = Math.max(1, Math.round(size / 18));
  const gap = unit * 2;
  const bar = unit * 4;
  const cx = size / 2;
  const a = Math.round(cx - unit / 2);
  const b = Math.round(cx - bar / 2);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display:block;image-rendering:pixelated"><rect x="${a}" y="${gap}" width="${unit}" height="${bar}" fill="${color}"/><rect x="${a}" y="${size - gap - bar}" width="${unit}" height="${bar}" fill="${color}"/><rect x="${gap}" y="${a}" width="${bar}" height="${unit}" fill="${color}"/><rect x="${size - gap - bar}" y="${a}" width="${bar}" height="${unit}" fill="${color}"/><rect x="${b}" y="${b}" width="${bar}" height="${bar}" fill="none" stroke="${color}" stroke-width="${unit}"/></svg>`;
}

function trailSVG(type: TrailType, color: string, size: number): string {
  if (type === 'sparkle') return `<svg width="${size}" height="${size}" viewBox="0 0 130.87 130.87" style="display:block"><path fill="${color}" d="M65.4351 0C66.4214 35.7222 95.1479 64.4487 130.87 65.4351C95.1479 66.4214 66.4214 95.1479 65.4351 130.87C64.4487 95.1479 35.7222 66.4214 0 65.4351C35.7222 64.4487 64.4487 35.7222 65.4351 0Z"/></svg>`;
  if (type === 'star') return `<svg width="${size}" height="${size}" viewBox="0 0 122.781 122.781" style="display:block"><path fill="${color}" d="M68.4463 42.8389L91.6143 31.4668L80.3545 54.4023L122.781 61.3906L80.3545 68.3779L91.6143 91.3145L68.4463 79.9414L61.3906 122.781L54.3789 80.2139L31.7656 91.3145L42.9795 68.4697L0 61.3906L42.9795 54.3105L31.7656 31.4668L54.3789 42.5664L61.3906 0L68.4463 42.8389Z"/></svg>`;
  if (type === 'clover') return `<svg width="${size}" height="${size}" viewBox="0 0 120.161 120.475" style="display:block"><path fill="${color}" d="M101.122 42.7578C111.637 42.7578 120.161 50.5836 120.161 60.2363C120.161 69.8893 111.637 77.7148 101.122 77.7148C99.688 77.7148 98.2907 77.5689 96.9473 77.293C81.8616 75.5346 63.8101 63.1521 60.4707 60.7822C62.7063 63.9324 73.8661 80.1961 76.5889 94.6992C77.3164 96.7935 77.7158 99.0637 77.7158 101.436C77.7158 111.95 69.8901 120.474 60.2373 120.475C50.5846 120.474 42.7598 111.95 42.7598 101.436C42.7598 100.001 42.9055 98.6036 43.1816 97.2598C44.9409 82.1682 57.3315 64.1085 59.6943 60.7793C56.3608 63.1453 38.3012 75.5373 23.2109 77.2939C21.8686 77.5694 20.4719 77.7148 19.0391 77.7148C8.52468 77.7144 6.28811e-05 69.889 0 60.2363C0.000287211 50.5839 8.52482 42.7582 19.0391 42.7578C21.4113 42.7578 23.6828 43.158 25.7773 43.8857C40.9893 46.7418 58.1385 58.8793 60.0605 60.2656C60.0729 60.2487 60.0797 60.2392 60.0811 60.2373C60.0821 60.2388 60.0882 60.2487 60.1006 60.2656C62.0135 58.8859 79.1661 46.745 94.3818 43.8867C96.4771 43.1583 98.7488 42.7579 101.122 42.7578ZM59.9219 0C69.5748 0 77.4004 8.52424 77.4004 19.0391C77.4004 20.4746 77.255 21.8731 76.9785 23.2178C75.0311 39.9117 60.0781 60.2373 60.0781 60.2373C60.0074 60.1411 46.5934 41.873 43.5713 25.7754C42.8438 23.6811 42.4444 21.4109 42.4443 19.0391C42.4443 8.52461 50.2694 0.00059142 59.9219 0Z"/></svg>`;
  if (type === 'xcross') return `<svg width="${size}" height="${size}" viewBox="0 0 126 126" style="display:block"><path fill="${color}" d="M62.9991 73.7434C58.1702 80.9881 50.8328 89.805 41.9582 98.6796C23.2634 117.374 4.83127 129.252 0.789442 125.211C-3.25239 121.169 8.62562 102.737 27.3204 84.0418C36.195 75.1672 45.0119 67.8298 52.2566 63.0009C45.0113 58.172 36.195 50.8328 27.3204 41.9582C8.62532 23.2631 -3.25268 4.83157 0.789442 0.789442C4.83157 -3.25268 23.2631 8.62532 41.9582 27.3204C50.8328 36.195 58.172 45.0113 63.0009 52.2566C67.8298 45.0119 75.1672 36.195 84.0418 27.3204C102.737 8.62562 121.169 -3.25239 125.211 0.789442C129.252 4.83127 117.374 23.2634 98.6796 41.9582C89.805 50.8328 80.9881 58.1702 73.7434 62.9991C80.9887 67.828 89.805 75.1672 98.6796 84.0418C117.375 102.737 129.253 121.168 125.211 125.211C121.168 129.253 102.737 117.375 84.0418 98.6796C75.1672 89.805 67.828 80.9887 62.9991 73.7434Z"/></svg>`;
  if (type === 'burst') return `<svg width="${size}" height="${size}" viewBox="0 0 122 122" style="display:block;overflow:visible"><g style="mix-blend-mode:plus-lighter"><rect x="53.502" y="0" width="14.6347" height="121.643" rx="7.31736" fill="${color}"/><rect x="121.643" y="53.5049" width="14.6347" height="121.643" rx="7.31736" transform="rotate(90 121.643 53.5049)" fill="${color}"/><rect x="12.6348" y="22.9883" width="14.6347" height="121.643" rx="7.31736" transform="rotate(-45 12.6348 22.9883)" fill="${color}"/><rect x="98.6504" y="12.6396" width="14.6347" height="121.643" rx="7.31736" transform="rotate(45 98.6504 12.6396)" fill="${color}"/></g></svg>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block"><circle cx="50" cy="50" r="50" fill="${color}"/></svg>`;
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map(c => c + c).join('')
    : value;
  const int = Number.parseInt(normalized, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function colorToRgba(color: string, alpha: number) {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

let _sparklePath: Path2D | null = null;
function drawSparkle(ctx: CanvasRenderingContext2D, size: number) {
  if (!_sparklePath) _sparklePath = new Path2D('M65.4351 0C66.4214 35.7222 95.1479 64.4487 130.87 65.4351C95.1479 66.4214 66.4214 95.1479 65.4351 130.87C64.4487 95.1479 35.7222 66.4214 0 65.4351C35.7222 64.4487 64.4487 35.7222 65.4351 0Z');
  const scale = size / 65.435;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-65.435, -65.435);
  ctx.fill(_sparklePath);
  ctx.restore();
}
let _starPath: Path2D | null = null;
function drawStar(ctx: CanvasRenderingContext2D, size: number) {
  if (!_starPath) _starPath = new Path2D('M68.4463 42.8389L91.6143 31.4668L80.3545 54.4023L122.781 61.3906L80.3545 68.3779L91.6143 91.3145L68.4463 79.9414L61.3906 122.781L54.3789 80.2139L31.7656 91.3145L42.9795 68.4697L0 61.3906L42.9795 54.3105L31.7656 31.4668L54.3789 42.5664L61.3906 0L68.4463 42.8389Z');
  const scale = size / 61.3905;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-61.3905, -61.3905);
  ctx.fill(_starPath);
  ctx.restore();
}
let _cloverPath: Path2D | null = null;
function drawClover(ctx: CanvasRenderingContext2D, size: number) {
  if (!_cloverPath) _cloverPath = new Path2D('M101.122 42.7578C111.637 42.7578 120.161 50.5836 120.161 60.2363C120.161 69.8893 111.637 77.7148 101.122 77.7148C99.688 77.7148 98.2907 77.5689 96.9473 77.293C81.8616 75.5346 63.8101 63.1521 60.4707 60.7822C62.7063 63.9324 73.8661 80.1961 76.5889 94.6992C77.3164 96.7935 77.7158 99.0637 77.7158 101.436C77.7158 111.95 69.8901 120.474 60.2373 120.475C50.5846 120.474 42.7598 111.95 42.7598 101.436C42.7598 100.001 42.9055 98.6036 43.1816 97.2598C44.9409 82.1682 57.3315 64.1085 59.6943 60.7793C56.3608 63.1453 38.3012 75.5373 23.2109 77.2939C21.8686 77.5694 20.4719 77.7148 19.0391 77.7148C8.52468 77.7144 6.28811e-05 69.889 0 60.2363C0.000287211 50.5839 8.52482 42.7582 19.0391 42.7578C21.4113 42.7578 23.6828 43.158 25.7773 43.8857C40.9893 46.7418 58.1385 58.8793 60.0605 60.2656C60.0729 60.2487 60.0797 60.2392 60.0811 60.2373C60.0821 60.2388 60.0882 60.2487 60.1006 60.2656C62.0135 58.8859 79.1661 46.745 94.3818 43.8867C96.4771 43.1583 98.7488 42.7579 101.122 42.7578ZM59.9219 0C69.5748 0 77.4004 8.52424 77.4004 19.0391C77.4004 20.4746 77.255 21.8731 76.9785 23.2178C75.0311 39.9117 60.0781 60.2373 60.0781 60.2373C60.0074 60.1411 46.5934 41.873 43.5713 25.7754C42.8438 23.6811 42.4444 21.4109 42.4443 19.0391C42.4443 8.52461 50.2694 0.00059142 59.9219 0Z');
  const scale = size / 60.2375;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-60.0805, -60.2375);
  ctx.fill(_cloverPath);
  ctx.restore();
}
let _xcrossPath: Path2D | null = null;
function drawXCross(ctx: CanvasRenderingContext2D, size: number) {
  if (!_xcrossPath) _xcrossPath = new Path2D('M62.9991 73.7434C58.1702 80.9881 50.8328 89.805 41.9582 98.6796C23.2634 117.374 4.83127 129.252 0.789442 125.211C-3.25239 121.169 8.62562 102.737 27.3204 84.0418C36.195 75.1672 45.0119 67.8298 52.2566 63.0009C45.0113 58.172 36.195 50.8328 27.3204 41.9582C8.62532 23.2631 -3.25268 4.83157 0.789442 0.789442C4.83157 -3.25268 23.2631 8.62532 41.9582 27.3204C50.8328 36.195 58.172 45.0113 63.0009 52.2566C67.8298 45.0119 75.1672 36.195 84.0418 27.3204C102.737 8.62562 121.169 -3.25239 125.211 0.789442C129.252 4.83127 117.374 23.2634 98.6796 41.9582C89.805 50.8328 80.9881 58.1702 73.7434 62.9991C80.9887 67.828 89.805 75.1672 98.6796 84.0418C117.375 102.737 129.253 121.168 125.211 125.211C121.168 129.253 102.737 117.375 84.0418 98.6796C75.1672 89.805 67.828 80.9887 62.9991 73.7434Z');
  const scale = size / 63;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-63, -63);
  ctx.fill(_xcrossPath);
  ctx.restore();
}
function drawCircle(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
}
function fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.fill();
}
function drawBurst(ctx: CanvasRenderingContext2D, size: number) {
  const scale = size / 61;
  const barWidth = 14.6347 * scale;
  const barHeight = 121.643 * scale;
  const radius = 7.31736 * scale;
  const drawBar = (rotation: number) => {
    ctx.save();
    ctx.rotate(rotation);
    fillRoundRect(ctx, -barWidth / 2, -barHeight / 2, barWidth, barHeight, radius);
    ctx.restore();
  };

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  drawBar(0);
  drawBar(Math.PI / 2);
  drawBar(-Math.PI / 4);
  drawBar(Math.PI / 4);
  ctx.restore();
}
function drawPixel(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillRect(-size, -size, size * 2, size * 2);
}
function drawDot(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
}
function drawHollow(ctx: CanvasRenderingContext2D, size: number) {
  ctx.lineWidth = Math.max(size * 0.28, 0.8);
  ctx.strokeRect(-size, -size, size * 2, size * 2);
}
function drawTinyL(ctx: CanvasRenderingContext2D, size: number) {
  ctx.lineWidth = Math.max(size * 0.32, 0.8);
  ctx.lineCap = 'square';
  ctx.beginPath();
  ctx.moveTo(-size, -size);
  ctx.lineTo(-size, size);
  ctx.lineTo(size, size);
  ctx.stroke();
}
function drawTinyDots(ctx: CanvasRenderingContext2D, size: number) {
  const d = size * 0.5, r = Math.max(size * 0.2, 0.6);
  for (const [x, y] of [[-d, -d], [d, -d], [-d, d], [d, d], [0, 0]] as [number, number][]) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}
function pixelUnit(size: number) {
  return Math.max(1, Math.round(size / 7));
}
function drawPixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function drawPixelCross(ctx: CanvasRenderingContext2D, size: number) {
  const u = pixelUnit(size);
  drawPixelRect(ctx, -u, -size, u * 2, size * 2);
  drawPixelRect(ctx, -size, -u, size * 2, u * 2);
  drawPixelRect(ctx, -u * 3, -u * 3, u * 6, u * 6);
}
function drawPixelTarget(ctx: CanvasRenderingContext2D, size: number) {
  const u = pixelUnit(size);
  const s = size;
  drawPixelRect(ctx, -s, -s, u * 4, u);
  drawPixelRect(ctx, -s, -s, u, u * 4);
  drawPixelRect(ctx, s - u * 4, -s, u * 4, u);
  drawPixelRect(ctx, s - u, -s, u, u * 4);
  drawPixelRect(ctx, -s, s - u, u * 4, u);
  drawPixelRect(ctx, -s, s - u * 4, u, u * 4);
  drawPixelRect(ctx, s - u * 4, s - u, u * 4, u);
  drawPixelRect(ctx, s - u, s - u * 4, u, u * 4);
}
function drawPixelBrackets(ctx: CanvasRenderingContext2D, size: number) {
  const u = pixelUnit(size);
  drawPixelRect(ctx, -size, -size * 0.55, u, size * 1.1);
  drawPixelRect(ctx, -size, -size * 0.55, u * 4, u);
  drawPixelRect(ctx, -size, size * 0.55 - u, u * 4, u);
  drawPixelRect(ctx, size - u, -size * 0.55, u, size * 1.1);
  drawPixelRect(ctx, size - u * 4, -size * 0.55, u * 4, u);
  drawPixelRect(ctx, size - u * 4, size * 0.55 - u, u * 4, u);
}
function drawPixelDiamond(ctx: CanvasRenderingContext2D, size: number) {
  const u = pixelUnit(size);
  for (let y = -4; y <= 4; y++) {
    const width = (5 - Math.abs(y)) * 2 - 1;
    drawPixelRect(ctx, -width * u / 2, y * u, width * u, u);
  }
}
function drawPixelCorners(ctx: CanvasRenderingContext2D, size: number) {
  const u = pixelUnit(size);
  const o = size * 0.62;
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      drawPixelRect(ctx, sx * o - (sx < 0 ? 0 : u * 4), sy * o, u * 4, u);
      drawPixelRect(ctx, sx * o, sy * o - (sy < 0 ? 0 : u * 4), u, u * 4);
    }
  }
}
function drawPixelPlus(ctx: CanvasRenderingContext2D, size: number) {
  const u = pixelUnit(size);
  drawPixelRect(ctx, -u, -size * 0.72, u * 2, size * 1.44);
  drawPixelRect(ctx, -size * 0.72, -u, size * 1.44, u * 2);
}

const DRAW_FN: Record<ShapeType, (ctx: CanvasRenderingContext2D, size: number) => void> = {
  sparkle: drawSparkle, star: drawStar, xcross: drawXCross,
  circle: drawCircle, clover: drawClover, burst: drawBurst,
  pixel: drawPixel, dot: drawDot, hollow: drawHollow,
  tinyL: drawTinyL, tinyDots: drawTinyDots,
  pixelCross: drawPixelCross, pixelTarget: drawPixelTarget,
  pixelBrackets: drawPixelBrackets, pixelDiamond: drawPixelDiamond,
  pixelCorners: drawPixelCorners, pixelPlus: drawPixelPlus,
};

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'a' | 'b' | 'c'>('a');
  const [hoverMode, setHoverMode] = useState<'a' | 'b' | 'c' | null>(null);

  const modeBgColor = mode === 'c' ? PIXEL_SIGNAL_BG : mode === 'b' ? '#ffffff' : '#000000';
  const modeTextColor = mode === 'b' ? '#000000' : '#ffffff';

  const sectionRef   = useRef<HTMLElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const modeRef      = useRef<'a' | 'b' | 'c'>('a');
  const bgColorRef   = useRef('#000000');
  const shouldResetRef = useRef(false);
  const sharedMouseRef = useRef({ x: -9999, y: -9999 });
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const heroActiveRef = useRef(true);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const { top, height } = section.getBoundingClientRect();
    const scrollable = height - window.innerHeight;
    if (scrollable <= 0) return;
    setProgress(Math.min(Math.max(-top / scrollable, 0), 1));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const { top, height } = section.getBoundingClientRect();
        const scrollable = height - window.innerHeight;
        const p = Math.min(Math.max(-top / scrollable, 0), 1);
        setProgress(p);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    const rafSync = requestAnimationFrame(handleScroll);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(rafSync);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let inView = true;
    const syncActive = () => {
      heroActiveRef.current = inView && !document.hidden;
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncActive();
    }, { threshold: 0 });

    observer.observe(section);
    document.addEventListener('visibilitychange', syncActive);
    syncActive();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncActive);
    };
  }, []);

  const handleModeSwitch = (m: 'a' | 'b' | 'c') => {
    if (m === modeRef.current) return;
    modeRef.current = m;
    bgColorRef.current = m === 'c' ? PIXEL_SIGNAL_BG : m === 'b' ? '#ffffff' : '#000000';
    shouldResetRef.current = true;
    setMode(m);
    window.dispatchEvent(new CustomEvent('hero-mode', { detail: m }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes: SimNode[] = [];
    const edges: SimEdge[] = [];
    const edgeSet = new Set<string>();
    let nodeId = 0;
    let mouseX = -9999, mouseY = -9999;
    let lastAutoSpawn = 0, lastMouseSpawn = 0;
    let startTime = performance.now();
    let simRaf = 0;
    let frame = 0;

    const getKey = (a: SimNode, b: SimNode) =>
      a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;

    const removeNodeAt = (index: number) => {
      const removed = nodes[index];
      nodes.splice(index, 1);
      for (let i = edges.length - 1; i >= 0; i--) {
        if (edges[i].a === removed || edges[i].b === removed) {
          edgeSet.delete(getKey(edges[i].a, edges[i].b));
          edges.splice(i, 1);
        }
      }
    };

    const resize = () => {
      const p = canvas.parentElement;
      if (p) { canvas.width = p.clientWidth; canvas.height = p.clientHeight; }
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const onMouseMove = (e: MouseEvent) => {
      const header = document.querySelector('header');
      const navBottom = header ? header.getBoundingClientRect().bottom : 0;
      if (e.clientY < navBottom) {
        mouseX = -9999; mouseY = -9999;
        sharedMouseRef.current = { x: -9999, y: -9999 };
        return;
      }
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        mouseX = x; mouseY = y;
        sharedMouseRef.current = { x, y };
      } else {
        mouseX = -9999; mouseY = -9999;
        sharedMouseRef.current = { x: -9999, y: -9999 };
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const spawn = (
      x: number,
      y: number,
      accent?: SpawnAccent
    ) => {
      const isB = modeRef.current === 'b';
      const isC = modeRef.current === 'c';
      const maxNodes = isC ? MAX_NODES_C : isB ? MAX_NODES_B : MAX_NODES_A;
      if (nodes.length >= maxNodes) {
        if (!accent?.force) return;
        let oldestIndex = 0;
        for (let i = 1; i < nodes.length; i++) {
          if (nodes[i].birthTime < nodes[oldestIndex].birthTime) oldestIndex = i;
        }
        removeNodeAt(oldestIndex);
      }
      const clusterId = accent?.clusterId ?? Math.floor(Math.random() * CLUSTERS.length);
      let shape: ShapeType, color: string, size: number;
      if (isC) {
        shape = SHAPES_C[Math.floor(Math.random() * SHAPES_C.length)];
        color = PIXEL_SIGNAL_INK;
        const sr = Math.random();
        size = sr < 0.74 ? 4 + Math.random() * 5 : sr < 0.97 ? 8 + Math.random() * 8 : 18 + Math.random() * 10;
      } else if (isB) {
        shape = SHAPES_B[Math.floor(Math.random() * SHAPES_B.length)];
        color = CLUSTER_COLOR_B[clusterId];
        const sr = Math.random();
        size = sr < 0.6 ? 2 + Math.random() * 3 : sr < 0.9 ? 4 + Math.random() * 4 : 7 + Math.random() * 5;
      } else {
        shape = SHAPES_A[Math.floor(Math.random() * SHAPES_A.length)];
        color = COLOR_A[shape as ShapeA];
        const sr = Math.random();
        size = sr < 0.62
          ? 1.4 + Math.random() * 4.2
          : sr < 0.88
            ? 5 + Math.random() * 9
            : sr < 0.996
              ? 15 + Math.random() * 16
              : 64 + Math.random() * 36;
      }
      shape = accent?.shape ?? shape;
      color = accent?.color ?? color;
      size = accent?.size ?? size;
      if (!isB && shape === 'sparkle' && !accent?.size) size *= 1.35;
      const lifetime = accent?.lifetime ?? (isC ? 11000 + Math.random() * 7000 : isB ? 9000 + Math.random() * 8000 : 8000 + Math.random() * 7000);
      nodes.push({
        id: nodeId++, x, y,
        vx: accent?.vx ?? (Math.random() - 0.5) * (isC ? 1.1 : isB ? 1.5 : 2.2),
        vy: accent?.vy ?? (Math.random() - 0.5) * (isC ? 1.1 : isB ? 1.5 : 2.2),
        clusterId, opacity: 0, birthTime: performance.now(), lifetime,
        shape, size, color,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: accent?.rotSpeed ?? (Math.random() - 0.5) * (isC ? 0.004 : isB ? 0.006 : 0.012),
        colorIntensity: 0,
        edgeUx: accent?.edgeUx,
        edgeUy: accent?.edgeUy,
        edgeBounced: false,
      });
    };

    const burstAt = (x: number, y: number) => {
      const isB = modeRef.current === 'b';
      const isC = modeRef.current === 'c';
      const count = isC ? CLICK_BURST_C : isB ? CLICK_BURST_B : CLICK_BURST_A;
      for (let i = 0; i < count; i++) {
        const spread = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
        const speed = isC ? 2 + Math.random() * 3.6 : isB ? 2.5 + Math.random() * 4.5 : 2.2 + Math.random() * 5.2;
        const distance = Math.random() * 18;
        const px = x + Math.cos(spread) * distance;
        const py = y + Math.sin(spread) * distance;
        const clusterId = Math.floor(Math.random() * CLUSTERS.length);

        if (isC) {
          const shape = SHAPES_C[Math.floor(Math.random() * SHAPES_C.length)];
          spawn(px, py, {
            shape,
            color: PIXEL_SIGNAL_INK,
            clusterId,
            size: 5 + Math.random() * 16,
            vx: Math.cos(spread) * speed,
            vy: Math.sin(spread) * speed,
            rotSpeed: (Math.random() - 0.5) * 0.045,
            lifetime: 2600 + Math.random() * 1600,
            force: true,
          });
        } else if (isB) {
          const shape = SHAPES_B[Math.floor(Math.random() * SHAPES_B.length)];
          spawn(px, py, {
            shape,
            color: CLUSTER_COLOR_B[clusterId],
            clusterId,
            size: 2 + Math.random() * 7,
            vx: Math.cos(spread) * speed,
            vy: Math.sin(spread) * speed,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            lifetime: 2600 + Math.random() * 1400,
            force: true,
          });
        } else {
          const shape = SHAPES_A[Math.floor(Math.random() * SHAPES_A.length)];
          const rareAccent = Math.random() > 0.985;
          spawn(px, py, {
            shape,
            color: COLOR_A[shape],
            clusterId,
            size: rareAccent ? 28 + Math.random() * 32 : 2 + Math.random() * 11,
            vx: Math.cos(spread) * speed,
            vy: Math.sin(spread) * speed,
            rotSpeed: (Math.random() - 0.5) * 0.1,
            lifetime: 2400 + Math.random() * 1400,
            force: true,
          });
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const header = document.querySelector('header');
      const navBottom = header ? header.getBoundingClientRect().bottom : 0;
      if (e.clientY < navBottom) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) burstAt(x, y);
    };
    window.addEventListener('pointerdown', onPointerDown);

    const seedInitial = () => {
      const isB = modeRef.current === 'b';
      const isC = modeRef.current === 'c';
      const visibleHeight = Math.min(canvas.height, window.innerHeight || canvas.height);
      const cx = canvas.width * 0.5;
      const cy = visibleHeight * 0.53;
      if (isC) {
        const count = 132;
        const fillerCount = 64;
        const startRadius = Math.min(canvas.width, visibleHeight) * 0.025;
        const fillRadius = Math.min(canvas.width, visibleHeight) * 0.56;

        for (let i = 0; i < count; i++) {
          const shape = SHAPES_C[i % SHAPES_C.length];
          const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.36;
          const radius = Math.random() * startRadius;
          const ux = Math.cos(angle);
          const uy = Math.sin(angle);
          const speed = 5.6 + Math.random() * 3.2;
          const sizeRoll = Math.random();
          const size = sizeRoll < 0.78
            ? 5 + Math.random() * 5
            : sizeRoll < 0.98
              ? 10 + Math.random() * 9
              : 24 + Math.random() * 12;

          spawn(cx + ux * radius, cy + uy * radius, {
            shape,
            color: PIXEL_SIGNAL_INK,
            clusterId: i % CLUSTERS.length,
            size,
            vx: ux * speed,
            vy: uy * speed,
            edgeUx: ux,
            edgeUy: uy,
            rotSpeed: (Math.random() - 0.5) * 0.035,
            lifetime: 10500 + Math.random() * 7500,
            force: true,
          });
        }

        for (let i = 0; i < fillerCount; i++) {
          const shape = SHAPES_C[(i + 3) % SHAPES_C.length];
          const angle = (i / fillerCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
          const radius = fillRadius * (0.22 + Math.random() * 0.78);
          const ux = Math.cos(angle);
          const uy = Math.sin(angle);
          const speed = 2.2 + Math.random() * 2.4;

          spawn(cx + ux * radius, cy + uy * radius, {
            shape,
            color: PIXEL_SIGNAL_INK,
            clusterId: (i + 3) % CLUSTERS.length,
            size: 4 + Math.random() * 12,
            vx: ux * speed,
            vy: uy * speed,
            edgeUx: ux,
            edgeUy: uy,
            rotSpeed: (Math.random() - 0.5) * 0.026,
            lifetime: 10000 + Math.random() * 8000,
            force: true,
          });
        }
        return;
      }
      if (isB) {
        const count = 180;
        const fillerCount = 90;
        const startRadius = Math.min(canvas.width, visibleHeight) * 0.02;
        const fillRadius = Math.min(canvas.width, visibleHeight) * 0.58;

        for (let i = 0; i < count; i++) {
          const shape = SHAPES_B[i % SHAPES_B.length];
          const clusterId = i % CLUSTERS.length;
          const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
          const radius = Math.random() * startRadius;
          const ux = Math.cos(angle);
          const uy = Math.sin(angle);
          const speed = 6.4 + Math.random() * 4.6 + (i % 11 === 0 ? 1.8 : 0);
          const sizeRoll = Math.random();
          const size = sizeRoll < 0.72
            ? 2 + Math.random() * 4
            : sizeRoll < 0.985
              ? 6 + Math.random() * 8
              : 18 + Math.random() * 18;

          spawn(cx + ux * radius, cy + uy * radius, {
            shape,
            color: CLUSTER_COLOR_B[clusterId],
            clusterId,
            size,
            vx: ux * speed,
            vy: uy * speed,
            edgeUx: ux,
            edgeUy: uy,
            rotSpeed: (Math.random() - 0.5) * 0.06,
            lifetime: 9000 + Math.random() * 8000,
            force: true,
          });
        }

        for (let i = 0; i < fillerCount; i++) {
          const shape = SHAPES_B[(i + 2) % SHAPES_B.length];
          const clusterId = (i + 2) % CLUSTERS.length;
          const angle = (i / fillerCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.42;
          const radius = fillRadius * (0.18 + Math.random() * 0.82);
          const ux = Math.cos(angle);
          const uy = Math.sin(angle);
          const speed = 2.8 + Math.random() * 3.4;
          const sizeRoll = Math.random();
          const size = sizeRoll < 0.78
            ? 1.5 + Math.random() * 3.5
            : sizeRoll < 0.99
              ? 5 + Math.random() * 7
              : 15 + Math.random() * 16;

          spawn(cx + ux * radius, cy + uy * radius, {
            shape,
            color: CLUSTER_COLOR_B[clusterId],
            clusterId,
            size,
            vx: ux * speed,
            vy: uy * speed,
            edgeUx: ux,
            edgeUy: uy,
            rotSpeed: (Math.random() - 0.5) * 0.045,
            lifetime: 8500 + Math.random() * 8000,
            force: true,
          });
        }
        return;
      }

      const count = 112;
      const fillerCount = 58;
      const startRadius = Math.min(canvas.width, visibleHeight) * 0.018;
      const fillRadius = Math.min(canvas.width, visibleHeight) * 0.52;

      for (let i = 0; i < count; i++) {
        const shape = SHAPES_A[i % SHAPES_A.length];
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.26;
        const radius = Math.random() * startRadius;
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        const x = cx + ux * radius;
        const y = cy + uy * radius;
        const speed = 7.4 + Math.random() * 3.4 + (i % 9 === 0 ? 1.4 : 0);
        const sizeRoll = Math.random();
        const size = sizeRoll < 0.68
          ? 2 + Math.random() * 6
          : sizeRoll < 0.992
            ? 9 + Math.random() * 13
            : 48 + Math.random() * 36;

        spawn(x, y, {
          shape,
          color: COLOR_A[shape],
          clusterId: i % CLUSTERS.length,
          size: shape === 'sparkle' ? size * 1.35 : size,
          vx: ux * speed,
          vy: uy * speed,
          edgeUx: ux,
          edgeUy: uy,
          rotSpeed: (Math.random() - 0.5) * 0.055,
          lifetime: 9000 + Math.random() * 7000,
          force: true,
        });
      }

      for (let i = 0; i < fillerCount; i++) {
        const shape = SHAPES_A[(i + 2) % SHAPES_A.length];
        const angle = (i / fillerCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.38;
        const radius = fillRadius * (0.18 + Math.random() * 0.82);
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        const x = cx + ux * radius;
        const y = cy + uy * radius;
        const speed = 3.4 + Math.random() * 3.1;
        const sizeRoll = Math.random();
        const size = sizeRoll < 0.76
          ? 1.8 + Math.random() * 5.4
          : sizeRoll < 0.994
            ? 7 + Math.random() * 11
            : 40 + Math.random() * 28;

        spawn(x, y, {
          shape,
          color: COLOR_A[shape],
          clusterId: (i + 2) % CLUSTERS.length,
          size: shape === 'sparkle' ? size * 1.35 : size,
          vx: ux * speed,
          vy: uy * speed,
          edgeUx: ux,
          edgeUy: uy,
          rotSpeed: (Math.random() - 0.5) * 0.04,
          lifetime: 8500 + Math.random() * 7000,
          force: true,
        });
      }
    };
    seedInitial();

    const cd2 = CONNECT_DIST * CONNECT_DIST;
    const killDist2 = (CONNECT_DIST * 1.3) ** 2;

    const animate = (now: number) => {
      simRaf = requestAnimationFrame(animate);

      if (!heroActiveRef.current) return;
      frame += 1;

      if (shouldResetRef.current) {
        shouldResetRef.current = false;
        nodes.length = 0; edges.length = 0; edgeSet.clear();
        nodeId = 0; startTime = now;
        lastAutoSpawn = 0; lastMouseSpawn = 0;
        seedInitial();
        return;
      }

      const isB = modeRef.current === 'b';
      const isC = modeRef.current === 'c';
      const isA = !isB && !isC;
      const elapsed = now - startTime;
      const phaseT = Math.min(Math.max((elapsed - PHASE_DELAY_MS) / PHASE_TRANSITION_MS, 0), 1);
      const eased = phaseT * phaseT;
      const cf = CLUSTER_FORCE_MAX * eased;
      const damp = BASE_DAMPING + (0.982 - BASE_DAMPING) * eased * 0.5;
      const autoInterval = isC ? AUTO_SPAWN_C : isB ? AUTO_SPAWN_B : AUTO_SPAWN_A;
      const mouseInterval = isC ? MOUSE_SPAWN_C : isB ? MOUSE_SPAWN_B : MOUSE_SPAWN_A;
      const maxNodes = isC ? MAX_NODES_C : isB ? MAX_NODES_B : MAX_NODES_A;

      if (elapsed > INITIAL_SPAWN_HOLD_MS && now - lastAutoSpawn > autoInterval && nodes.length < maxNodes) {
        spawn(Math.random() * canvas.width, Math.random() * canvas.height);
        lastAutoSpawn = now;
      }
      if (mouseX > -1 && mouseY > -1 && now - lastMouseSpawn > mouseInterval) {
        spawn(mouseX + (Math.random() - 0.5) * 24, mouseY + (Math.random() - 0.5) * 24);
        lastMouseSpawn = now;
      }

      for (let i = nodes.length - 1; i >= 0; i--) {
        if (now - nodes[i].birthTime >= nodes[i].lifetime) removeNodeAt(i);
      }

      if (!isB && frame % 2 === 0) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const minDist = NODE_SEPARATION_DIST + (a.size + b.size) * 0.35;
            const dist2 = dx * dx + dy * dy;
            if (dist2 <= 0.01 || dist2 > minDist * minDist) continue;
            const dist = Math.sqrt(dist2);
            const push = ((minDist - dist) / minDist) * NODE_SEPARATION_FORCE;
            const nx = dx / dist;
            const ny = dy / dist;
            a.vx += nx * push;
            a.vy += ny * push;
            b.vx -= nx * push;
            b.vy -= ny * push;
          }
        }
      }

      for (const n of nodes) {
        n.vx += (Math.random() - 0.5) * (isC ? 0.035 : isB ? 0.1 : 0.055);
        n.vy += (Math.random() - 0.5) * (isC ? 0.035 : isB ? 0.1 : 0.055);
        if (!n.edgeBounced && n.edgeUx !== undefined && n.edgeUy !== undefined) {
          const edgePush = isC ? 0.1 : isB ? 0.12 : 0.18;
          n.vx += n.edgeUx * edgePush;
          n.vy += n.edgeUy * edgePush;
        }
        if (cf > 0) {
          const target = clusterTarget(n.clusterId, now, canvas.width, canvas.height);
          const targetX = target.x;
          const targetY = target.y;
          const dx = targetX - n.x;
          const dy = targetY - n.y;
          n.vx += dx * cf;
          n.vy += dy * cf;
          const orbit = IDLE_ORBIT_FORCE * eased;
          const drift = IDLE_DRIFT_FORCE * eased;
          n.vx += (-dy / canvas.height) * orbit + Math.sin(now * 0.0011 + n.id * 1.73) * drift;
          n.vy += (dx / canvas.width) * orbit + Math.cos(now * 0.0013 + n.id * 1.91) * drift;
        }
        n.vx *= damp; n.vy *= damp;
        n.x += n.vx; n.y += n.vy;
        n.rotation += n.rotSpeed;
        const m = Math.max(2, n.size * 0.18);
        let hitEdge = false;
        if (n.x < m) { n.x = m; n.vx = Math.abs(n.vx); hitEdge = true; }
        else if (n.x > canvas.width - m) { n.x = canvas.width - m; n.vx = -Math.abs(n.vx); hitEdge = true; }
        if (n.y < m) { n.y = m; n.vy = Math.abs(n.vy); hitEdge = true; }
        else if (n.y > canvas.height - m) { n.y = canvas.height - m; n.vy = -Math.abs(n.vy); hitEdge = true; }
        if (hitEdge && n.edgeUx !== undefined && n.edgeUy !== undefined) {
          const speed = Math.hypot(n.vx, n.vy);
          const angle = Math.atan2(n.vy, n.vx) + (Math.random() - 0.5) * 0.95;
          const bounceSpeed = speed * (0.72 + Math.random() * 0.28);
          n.vx = Math.cos(angle) * bounceSpeed;
          n.vy = Math.sin(angle) * bounceSpeed;
          n.edgeBounced = true;
        }
        const nodeAge = now - n.birthTime;
        const fadeIn = Math.min(1, nodeAge / 300);
        const fadeOutStart = n.lifetime * 0.68;
        const fadeOutDuration = n.lifetime - fadeOutStart;
        const fadeOut = nodeAge > fadeOutStart
          ? Math.max(0, 1 - (nodeAge - fadeOutStart) / fadeOutDuration)
          : 1;
        n.opacity = fadeIn * fadeOut;

        const cdx = n.x - mouseX, cdy = n.y - mouseY;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        const targetCI = cdist < COLOR_RADIUS ? Math.pow(1 - cdist / COLOR_RADIUS, 0.6) : 0;
        n.colorIntensity += (targetCI - n.colorIntensity) * COLOR_LERP;
      }

      if (isA && frame % EDGE_REBUILD_INTERVAL === 0) {
        for (let i = edges.length - 1; i >= 0; i--) {
          const { a, b } = edges[i];
          const dx = a.x - b.x, dy = a.y - b.y;
          if (dx * dx + dy * dy > killDist2) { edgeSet.delete(getKey(a, b)); edges.splice(i, 1); }
        }
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            if (dx * dx + dy * dy > cd2) continue;
            const key = getKey(a, b);
            if (!edgeSet.has(key)) { edgeSet.add(key); edges.push({ a, b, pulses: [{ startTime: now }] }); }
          }
        }
      }
      if (isA) {
        for (const edge of edges) {
          for (let i = edge.pulses.length - 1; i >= 0; i--) {
            if (now - edge.pulses[i].startTime >= PULSE_DURATION_MS) edge.pulses.splice(i, 1);
          }
          if (edge.pulses.length === 0 && Math.random() < PULSE_ADD_CHANCE) {
            edge.pulses.push({ startTime: now });
          }
        }
      }

      if (isC) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = bgColorRef.current;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (isA) {
        for (const { a, b, pulses } of edges) {
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const base = (1 - dist / CONNECT_DIST) * Math.min(a.opacity, b.opacity);
          const ci = Math.max(a.colorIntensity, b.colorIntensity);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = ci > 0.05
            ? colorToRgba(a.color, base * ci * 0.45)
            : `rgba(255,255,255,${(base * 0.07).toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
          for (const { startTime: pst } of pulses) {
            const t = Math.min((now - pst) / PULSE_DURATION_MS, 1);
            const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
            const px = a.x + (b.x - a.x) * ease, py = a.y + (b.y - a.y) * ease;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${(Math.sin(t * Math.PI) * 0.9 * base).toFixed(3)})`;
            ctx.fill();
          }
        }
      }

      for (const n of nodes) {
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rotation);
        ctx.globalAlpha = n.opacity;
        ctx.globalCompositeOperation = isC ? 'source-over' : isB ? 'multiply' : 'lighter';
        if (!isC && n.colorIntensity > 0.06) {
          ctx.fillStyle = colorToRgba(n.color, n.colorIntensity * 0.24);
          ctx.beginPath();
          ctx.arc(0, 0, n.size * (2 + n.colorIntensity) * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = n.color;
        ctx.strokeStyle = n.color;
        DRAW_FN[n.shape](ctx, n.size);
        ctx.restore();
      }

    };

    simRaf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(simRaf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  // Trail spawn loop — particles continuously created at cursor, drift and fade out
  useEffect(() => {
    const container = trailContainerRef.current;
    if (!container) return;

    interface TrailP {
      el: HTMLDivElement;
      x: number; y: number;
      vx: number; vy: number;
      born: number;
      lifetime: number;
      size: number;
      rot: number;
      rotSpeed: number;
    }

    const pool: TrailP[] = [];
    let lastSpawn = 0;
    let raf = 0;

    const spawn = (mx: number, my: number, now: number) => {
      let p = pool.find(pp => now - pp.born >= pp.lifetime);
      if (!p) {
        if (pool.length >= 28) return;
        const el = document.createElement('div');
        el.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;will-change:transform,opacity;opacity:0;';
        container.appendChild(el);
        p = { el, x: 0, y: 0, vx: 0, vy: 0, born: 0, lifetime: 0, size: 0, rot: 0, rotSpeed: 0 };
        pool.push(p);
      }
      const currentMode = modeRef.current;

      if (currentMode === 'c') {
        const size = 12 + Math.random() * 18;
        const color = PIXEL_SIGNAL_INK;
        p.x = mx + (Math.random() - 0.5) * 20;
        p.y = my + (Math.random() - 0.5) * 20;
        p.vx = (Math.random() - 0.5) * 0.5;
        p.vy = (Math.random() - 0.5) * 0.7;
        p.born = now;
        p.lifetime = 1600 + Math.random() * 1200;
        p.size = size;
        p.rot = Math.random() * Math.PI * 2;
        p.rotSpeed = (Math.random() - 0.5) * 0.035;
        p.el.style.width = size + 'px';
        p.el.style.height = size + 'px';
        p.el.innerHTML = trailSVG_pixelSignal(color, size);
        return;
      }

      const isB = currentMode === 'b';
      const type = isB
        ? TRAIL_TYPES_B[Math.floor(Math.random() * TRAIL_TYPES_B.length)]
        : TRAIL_TYPES[Math.floor(Math.random() * TRAIL_TYPES.length)];
      const color = isB
        ? TRAIL_COLORS_B[Math.floor(Math.random() * TRAIL_COLORS_B.length)]
        : COLOR_A[type as ShapeA];
      const sizeRoll = Math.random();
      let size = sizeRoll < 0.7
        ? 6 + Math.random() * 16
        : sizeRoll < 0.99
          ? 20 + Math.random() * 28
          : 48 + Math.random() * 18;
      if (!isB && type === 'sparkle') size *= 1.3;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 1.2;
      p.x = mx + (Math.random() - 0.5) * 16;
      p.y = my + (Math.random() - 0.5) * 16;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 0.3;
      p.born = now;
      p.lifetime = 1400 + Math.random() * 900;
      p.size = size;
      p.rot = Math.random() * Math.PI * 2;
      p.rotSpeed = (Math.random() - 0.5) * 0.05;
      p.el.style.width = size + 'px';
      p.el.style.height = size + 'px';
      p.el.innerHTML = isB
        ? trailSVG_B(type as TrailTypeB, color, size)
        : trailSVG(type as TrailType, color, size);
    };

    let lastAmbientPixelSignal = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!heroActiveRef.current) return;
      const { x: mx, y: my } = sharedMouseRef.current;
      const active = mx > -1;
      const isC = modeRef.current === 'c';

      if (isC) {
        if (now - lastAmbientPixelSignal > PIXEL_SIGNAL_AMBIENT_INTERVAL_MS) {
          const x = Math.random() * container.clientWidth;
          const y = Math.random() * container.clientHeight;
          spawn(x, y, now);
          lastAmbientPixelSignal = now;
        }
        if (active && now - lastSpawn > PIXEL_SIGNAL_CURSOR_INTERVAL_MS) {
          spawn(mx, my, now);
          lastSpawn = now;
        }
      } else if (active && now - lastSpawn > 90) {
        spawn(mx, my, now);
        lastSpawn = now;
      }
      for (const p of pool) {
        const age = now - p.born;
        if (age >= p.lifetime) {
          if (p.el.style.opacity !== '0') p.el.style.opacity = '0';
          continue;
        }
        if (isC) {
          p.x += p.vx + Math.sin(now / 700 + p.rot) * 0.3;
          p.y += p.vy;
        } else {
          p.vx *= 0.978;
          p.vy *= 0.978;
          p.x += p.vx;
          p.y += p.vy;
        }
        p.rot += p.rotSpeed;
        const t = age / p.lifetime;
        const fadeIn = Math.min(1, age / 180);
        const fadeOut = t > 0.3 ? 1 - (t - 0.3) / 0.7 : 1;
        p.el.style.opacity = (fadeIn * fadeOut).toFixed(3);
        p.el.style.transform = `translate(${p.x - p.size / 2}px, ${p.y - p.size / 2}px) rotate(${p.rot}rad)`;
      }
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      pool.forEach(p => p.el.remove());
    };
  }, []);

  const translateY = progress * -100;

  return (
    <section ref={sectionRef} className="relative" style={{ height: '150vh', zIndex: 10 }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${translateY}%)`, willChange: 'transform', backgroundColor: modeBgColor }}
        >
          {mode === 'c' && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                backgroundColor: PIXEL_SIGNAL_BG,
                backgroundImage: `
                  radial-gradient(circle at 19% 32%, rgba(255,255,255,0.28) 0 12%, transparent 12.5%),
                  radial-gradient(circle at 76% 26%, rgba(255,255,255,0.2) 0 9%, transparent 9.5%),
                  radial-gradient(circle at 62% 78%, rgba(255,255,255,0.18) 0 15%, transparent 15.5%),
                  linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px),
                  linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
                  radial-gradient(circle, rgba(255,255,255,0.9) 0 1.5px, transparent 2px)
                `,
                backgroundSize: '100% 100%, 100% 100%, 100% 100%, 12px 12px, 12px 12px, 8px 8px',
                backgroundPosition: 'center, center, center, 0 0, 0 0, 0 0',
                mixBlendMode: 'normal',
                imageRendering: 'pixelated',
              }}
            />
          )}
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', zIndex: 1 }} />

          {/* Trail shapes layer */}
          <div
            ref={trailContainerRef}
            style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', overflow: 'hidden' }}
          />

          <div
            className="content-width h-full flex flex-col items-center justify-center px-6 sm:px-10"
            style={{ position: 'relative', zIndex: 5, gap: 'clamp(24px, 3vh, 40px)' }}
          >
            {/* Mode toggle */}
            <div style={{ flexShrink: 0 }}>
              <div data-cursor="default" style={{
                width: 'var(--toggle-pill-width)', height: 'var(--toggle-pill-height)',
                background: '#3e3e3e',
                borderRadius: '45.088px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2.471px 4.941px',
                boxSizing: 'border-box',
              }}>
                {/* Mode A — clover */}
                <button
                  onClick={() => handleModeSwitch('a')}
                  onMouseEnter={() => setHoverMode('a')}
                  onMouseLeave={() => setHoverMode(null)}
                  aria-label="Switch to clover interaction mode"
                  data-cursor="default"
                  type="button"
                  style={{
                    width: 'var(--toggle-btn-size)', height: 'var(--toggle-btn-size)', borderRadius: '50%',
                    background: '#0d0d0d',
                    border: 'none', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 250ms ease',
                    flexShrink: 0,
                  }}
                >
                  <svg style={{ width: 'var(--toggle-icon-size)', height: 'var(--toggle-icon-size)' }} viewBox="0 0 193 194">
                    <path
                      fill={mode === 'a' || hoverMode === 'a' ? HERO_YELLOW : '#555555'}
                      style={{ transition: 'fill 250ms ease' }}
                      d="M162.285 68.6201C179.159 68.6202 192.839 81.1788 192.839 96.6699C192.839 112.161 179.159 124.719 162.285 124.719C159.991 124.719 157.755 124.485 155.605 124.045C131.388 121.232 102.399 101.345 97.0439 97.5439C100.63 102.598 118.542 128.701 122.911 151.978C124.078 155.338 124.72 158.98 124.72 162.786C124.72 179.66 112.162 193.339 96.6709 193.34C81.1798 193.34 68.6212 179.66 68.6211 162.786C68.6211 160.491 68.8546 158.256 69.2949 156.105C72.1088 131.883 92.0039 102.885 95.7979 97.54C90.4517 101.335 61.4567 121.231 37.2344 124.045C35.0841 124.485 32.8485 124.719 30.5537 124.719C13.6796 124.719 0.000265296 112.161 0 96.6699C7.41128e-05 81.1788 13.6795 68.6202 30.5537 68.6201C34.3616 68.6201 38.0062 69.2623 41.3682 70.4307C65.7862 75.0161 93.3132 94.5007 96.3857 96.7168C96.4076 96.6868 96.4191 96.671 96.4199 96.6699C96.4216 96.6722 96.4319 96.688 96.4521 96.7158C99.5221 94.5015 127.051 75.0165 151.471 70.4307C154.833 69.2623 158.477 68.6202 162.285 68.6201ZM96.1689 0C111.66 0.000260499 124.219 13.6796 124.219 30.5537C124.219 32.8457 123.985 35.0787 123.546 37.2266C120.441 63.9849 96.4891 96.5759 96.4199 96.6699C96.3521 96.5777 74.7871 67.2286 69.9307 41.3682C68.7623 38.0062 68.1201 34.3616 68.1201 30.5537C68.1202 13.6796 80.678 0.000285852 96.1689 0Z"
                    />
                  </svg>
                </button>

                {/* Mode B — square */}
                <button
                  onClick={() => handleModeSwitch('b')}
                  onMouseEnter={() => setHoverMode('b')}
                  onMouseLeave={() => setHoverMode(null)}
                  aria-label="Switch to square interaction mode"
                  data-cursor="default"
                  type="button"
                  style={{
                    width: 'var(--toggle-btn-size)', height: 'var(--toggle-btn-size)', borderRadius: '50%',
                    background: '#0d0d0d',
                    border: '0.926px solid #000000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    transition: 'background 250ms ease',
                  }}
                >
                  <div style={{
                    width: 'var(--toggle-square-size)', height: 'var(--toggle-square-size)', flexShrink: 0,
                    border: `2.471px solid ${mode === 'b' || hoverMode === 'b' ? '#ffffff' : '#555555'}`,
                    transition: 'border-color 250ms ease',
                  }} />
                </button>

                {/* Mode C — pixel signal */}
                <button
                  onClick={() => handleModeSwitch('c')}
                  onMouseEnter={() => setHoverMode('c')}
                  onMouseLeave={() => setHoverMode(null)}
                  aria-label="Switch to pixel signal mode"
                  data-cursor="default"
                  type="button"
                  style={{
                    width: 'var(--toggle-btn-size)', height: 'var(--toggle-btn-size)', borderRadius: '50%',
                    background: '#0d0d0d',
                    border: 'none', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 250ms ease',
                    flexShrink: 0,
                  }}
                >
                  <svg style={{ width: 'var(--toggle-icon-size)', height: 'var(--toggle-icon-size)' }} viewBox="0 0 24 24">
                    <g fill={mode === 'c' || hoverMode === 'c' ? PIXEL_SIGNAL_INK : '#555555'} style={{ transition: 'fill 250ms ease' }}>
                      <rect x="11" y="2" width="2" height="7" />
                      <rect x="11" y="15" width="2" height="7" />
                      <rect x="2" y="11" width="7" height="2" />
                      <rect x="15" y="11" width="7" height="2" />
                      <rect x="10" y="10" width="4" height="4" />
                    </g>
                  </svg>
                </button>
              </div>
            </div>

            {/* Hero text */}
            <h1
              className="text-center transition-all duration-1000 ease-out"
              style={{
                fontFamily: 'var(--font-google-sans-flex), sans-serif',
                fontSize: 'var(--hero-font-size)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: 'min(1224px, 92vw)',
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(48px)',
                transitionDelay: '200ms',
                fontWeight: 400,
                color: modeTextColor,
                transition: 'color 300ms ease, opacity 1000ms ease, transform 1000ms ease',
              }}
            >
              <span>I design where</span>
              <br />
              <span>complexity</span>
              <span> meets</span>
              <br />
              <span style={{ fontWeight: 700 }}>consequence</span>
            </h1>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{ height: '40%', background: `linear-gradient(to bottom, transparent, ${modeBgColor})`, zIndex: 2 }}
          />
        </div>
      </div>
    </section>
  );
}
