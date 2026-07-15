'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PixelSignalField from './PixelSignalField';

const CONNECT_DIST = 108;
const PHASE_DELAY_MS = 2500;
const PHASE_TRANSITION_MS = 1500;
const INITIAL_SPAWN_HOLD_MS = 1800;
const CLUSTER_FORCE_MAX = 0;
const BASE_DAMPING = 0.955;
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

type ShapeType = ShapeA | ShapeB;

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

const DRAW_FN: Record<ShapeType, (ctx: CanvasRenderingContext2D, size: number) => void> = {
  sparkle: drawSparkle, star: drawStar, xcross: drawXCross,
  circle: drawCircle, clover: drawClover, burst: drawBurst,
  pixel: drawPixel, dot: drawDot, hollow: drawHollow,
  tinyL: drawTinyL, tinyDots: drawTinyDots,
};

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'a' | 'b' | 'c'>('a');
  const [colInfoOpen, setColInfoOpen] = useState(false);

  const sectionRef   = useRef<HTMLElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const modeRef      = useRef<'a' | 'b' | 'c'>('a');
  const bgColorRef   = useRef('#000000');
  const shouldResetRef = useRef(false);
  const sharedMouseRef = useRef({ x: -9999, y: -9999 });
  const trailContainerRef = useRef<HTMLDivElement>(null);

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

  const handleModeSwitch = (m: 'a' | 'b' | 'c') => {
    if (m === modeRef.current) return;
    modeRef.current = m;
    // Never read for mode c — animate() returns early before this ref is
    // consumed — so no mode-c branch is needed here.
    bgColorRef.current = m === 'b' ? '#ffffff' : '#000000';
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
      const maxNodes = isB ? MAX_NODES_B : MAX_NODES_A;
      if (nodes.length >= maxNodes) {
        if (isB) {
          const removed = nodes.shift()!;
          for (let i = edges.length - 1; i >= 0; i--) {
            if (edges[i].a === removed || edges[i].b === removed) {
              edgeSet.delete(getKey(edges[i].a, edges[i].b));
              edges.splice(i, 1);
            }
          }
        } else {
          if (!accent?.force) return;
          let oldestIndex = 0;
          for (let i = 1; i < nodes.length; i++) {
            if (nodes[i].birthTime < nodes[oldestIndex].birthTime) oldestIndex = i;
          }
          removeNodeAt(oldestIndex);
        }
      }
      const clusterId = accent?.clusterId ?? Math.floor(Math.random() * CLUSTERS.length);
      let shape: ShapeType, color: string, size: number;
      if (isB) {
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
      const lifetime = accent?.lifetime ?? (isB ? Number.POSITIVE_INFINITY : 8000 + Math.random() * 7000);
      nodes.push({
        id: nodeId++, x, y,
        vx: accent?.vx ?? (Math.random() - 0.5) * (isB ? 1.5 : 2.2),
        vy: accent?.vy ?? (Math.random() - 0.5) * (isB ? 1.5 : 2.2),
        clusterId, opacity: 0, birthTime: performance.now(), lifetime,
        shape, size, color,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: accent?.rotSpeed ?? (Math.random() - 0.5) * (isB ? 0.006 : 0.012),
        colorIntensity: 0,
        edgeUx: accent?.edgeUx,
        edgeUy: accent?.edgeUy,
        edgeBounced: false,
      });
    };

    const burstAt = (x: number, y: number) => {
      if (modeRef.current === 'c') return;
      if (modeRef.current === 'b') return;
      for (let i = 0; i < CLICK_BURST_A; i++) {
        const spread = (i / CLICK_BURST_A) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
        const speed = 2.2 + Math.random() * 5.2;
        const distance = Math.random() * 18;
        const px = x + Math.cos(spread) * distance;
        const py = y + Math.sin(spread) * distance;
        const shape = SHAPES_A[Math.floor(Math.random() * SHAPES_A.length)];
        const rareAccent = Math.random() > 0.985;
        spawn(px, py, {
          shape,
          color: COLOR_A[shape],
          clusterId: Math.floor(Math.random() * CLUSTERS.length),
          size: rareAccent ? 28 + Math.random() * 32 : 2 + Math.random() * 11,
          vx: Math.cos(spread) * speed,
          vy: Math.sin(spread) * speed,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          lifetime: 2400 + Math.random() * 1400,
          force: true,
        });
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
      if (modeRef.current === 'b') {
        for (let i = 0; i < 80; i++) {
          spawn(Math.random() * canvas.width, Math.random() * canvas.height);
        }
        return;
      }

      const visibleHeight = Math.min(canvas.height, window.innerHeight || canvas.height);
      const cx = canvas.width * 0.5;
      const cy = visibleHeight * 0.53;
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
        const speed = 7.4 + Math.random() * 3.4 + (i % 9 === 0 ? 1.4 : 0);
        const sizeRoll = Math.random();
        const size = sizeRoll < 0.68
          ? 2 + Math.random() * 6
          : sizeRoll < 0.992
            ? 9 + Math.random() * 13
            : 48 + Math.random() * 36;

        spawn(cx + ux * radius, cy + uy * radius, {
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
        const speed = 3.4 + Math.random() * 3.1;
        const sizeRoll = Math.random();
        const size = sizeRoll < 0.76
          ? 1.8 + Math.random() * 5.4
          : sizeRoll < 0.994
            ? 7 + Math.random() * 11
            : 40 + Math.random() * 28;

        spawn(cx + ux * radius, cy + uy * radius, {
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
      frame += 1;
      if (modeRef.current === 'c') return;

      if (shouldResetRef.current) {
        shouldResetRef.current = false;
        nodes.length = 0; edges.length = 0; edgeSet.clear();
        nodeId = 0; startTime = now;
        lastAutoSpawn = 0; lastMouseSpawn = 0;
        seedInitial();
        return;
      }

      const isB = modeRef.current === 'b';
      const elapsed = now - startTime;
      const phaseT = Math.min(Math.max((elapsed - PHASE_DELAY_MS) / PHASE_TRANSITION_MS, 0), 1);
      const eased = phaseT * phaseT;
      const cf = CLUSTER_FORCE_MAX * eased;
      const damp = BASE_DAMPING + (0.982 - BASE_DAMPING) * eased * 0.5;
      const autoInterval = isB ? AUTO_SPAWN_B : AUTO_SPAWN_A;
      const mouseInterval = isB ? MOUSE_SPAWN_B : MOUSE_SPAWN_A;
      const maxNodes = isB ? MAX_NODES_B : MAX_NODES_A;

      if (elapsed > INITIAL_SPAWN_HOLD_MS && now - lastAutoSpawn > autoInterval && nodes.length < maxNodes) {
        spawn(Math.random() * canvas.width, Math.random() * canvas.height);
        lastAutoSpawn = now;
      }
      if (mouseX > -1 && mouseY > -1 && now - lastMouseSpawn > mouseInterval) {
        spawn(mouseX + (Math.random() - 0.5) * 24, mouseY + (Math.random() - 0.5) * 24);
        lastMouseSpawn = now;
      }

      if (!isB && frame % 2 === 0) {
        for (let i = nodes.length - 1; i >= 0; i--) {
          if (now - nodes[i].birthTime >= nodes[i].lifetime) removeNodeAt(i);
        }
      }

      if (!isB) {
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
        n.vx += (Math.random() - 0.5) * (isB ? 0.1 : 0.055);
        n.vy += (Math.random() - 0.5) * (isB ? 0.1 : 0.055);
        if (!isB && !n.edgeBounced && n.edgeUx !== undefined && n.edgeUy !== undefined) {
          n.vx += n.edgeUx * 0.18;
          n.vy += n.edgeUy * 0.18;
        }
        if (cf > 0) {
          const c = CLUSTERS[n.clusterId % CLUSTERS.length];
          n.vx += (c.cx * canvas.width - n.x) * cf;
          n.vy += (c.cy * canvas.height - n.y) * cf;
        }
        n.vx *= damp; n.vy *= damp;
        n.x += n.vx; n.y += n.vy;
        n.rotation += n.rotSpeed;
        const m = isB ? n.size : Math.max(2, n.size * 0.18);
        let hitEdge = false;
        if (n.x < m) { n.x = m; n.vx = Math.abs(n.vx); hitEdge = true; }
        else if (n.x > canvas.width - m) { n.x = canvas.width - m; n.vx = -Math.abs(n.vx); hitEdge = true; }
        if (n.y < m) { n.y = m; n.vy = Math.abs(n.vy); hitEdge = true; }
        else if (n.y > canvas.height - m) { n.y = canvas.height - m; n.vy = -Math.abs(n.vy); hitEdge = true; }
        if (!isB && hitEdge && n.edgeUx !== undefined && n.edgeUy !== undefined) {
          const speed = Math.hypot(n.vx, n.vy);
          const angle = Math.atan2(n.vy, n.vx) + (Math.random() - 0.5) * 0.95;
          const bounceSpeed = speed * (0.72 + Math.random() * 0.28);
          n.vx = Math.cos(angle) * bounceSpeed;
          n.vy = Math.sin(angle) * bounceSpeed;
          n.edgeBounced = true;
        }
        if (isB) {
          n.opacity = Math.min(1, (now - n.birthTime) / 300);
        } else {
          const nodeAge = now - n.birthTime;
          const fadeIn = Math.min(1, nodeAge / 300);
          const fadeOutStart = n.lifetime * 0.68;
          const fadeOutDuration = n.lifetime - fadeOutStart;
          const fadeOut = nodeAge > fadeOutStart
            ? Math.max(0, 1 - (nodeAge - fadeOutStart) / fadeOutDuration)
            : 1;
          n.opacity = fadeIn * fadeOut;
        }

        const cdx = n.x - mouseX, cdy = n.y - mouseY;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        const targetCI = cdist < COLOR_RADIUS ? Math.pow(1 - cdist / COLOR_RADIUS, 0.6) : 0;
        n.colorIntensity += (targetCI - n.colorIntensity) * COLOR_LERP;
      }

      if (!isB && frame % EDGE_REBUILD_INTERVAL === 0) {
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
      if (!isB) {
        for (const edge of edges) {
          for (let i = edge.pulses.length - 1; i >= 0; i--) {
            if (now - edge.pulses[i].startTime >= PULSE_DURATION_MS) edge.pulses.splice(i, 1);
          }
          if (edge.pulses.length === 0 && Math.random() < PULSE_ADD_CHANCE) {
            edge.pulses.push({ startTime: now });
          }
        }
      }

      ctx.fillStyle = bgColorRef.current;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isB) {
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
        ctx.globalCompositeOperation = isB ? 'multiply' : 'lighter';
        if (!isB && n.colorIntensity > 0.06) {
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
      const isB = modeRef.current === 'b';
      const type = isB
        ? TRAIL_TYPES_B[Math.floor(Math.random() * TRAIL_TYPES_B.length)]
        : TRAIL_TYPES[Math.floor(Math.random() * TRAIL_TYPES.length)];
      const color = isB
        ? TRAIL_COLORS_B[Math.floor(Math.random() * TRAIL_COLORS_B.length)]
        : COLOR_A[type as ShapeA];
      let size = 22 + Math.random() * 38;
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

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const { x: mx, y: my } = sharedMouseRef.current;
      const active = mx > -1 && modeRef.current !== 'c';
      if (active && now - lastSpawn > 90) {
        spawn(mx, my, now);
        lastSpawn = now;
      }
      for (const p of pool) {
        const age = now - p.born;
        if (age >= p.lifetime) {
          if (p.el.style.opacity !== '0') p.el.style.opacity = '0';
          continue;
        }
        p.vx *= 0.978;
        p.vy *= 0.978;
        p.x += p.vx;
        p.y += p.vy;
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
          style={{ transform: `translateY(${translateY}%)`, willChange: 'transform', backgroundColor: mode === 'c' ? 'var(--color-bonsai-bg)' : mode === 'b' ? '#ffffff' : '#000000' }}
        >
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: mode === 'c' ? 'none' : 'block' }} />

          {mode === 'c' && <PixelSignalField />}

          {/* Trail shapes layer */}
          <div
            ref={trailContainerRef}
            style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', overflow: 'hidden' }}
          />

          <div
            className="content-width h-full flex flex-col items-center justify-center px-6 sm:px-10"
            style={{ position: 'relative', zIndex: 5, gap: 'clamp(24px, 3vh, 40px)', pointerEvents: 'none' }}
          >
            {/* Mode toggle */}
            <div style={{ flexShrink: 0, pointerEvents: 'auto' }}>
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
                  aria-label="Switch to clover interaction mode"
                  data-cursor="default"
                  type="button"
                  style={{
                    width: 'var(--toggle-btn-size)', height: 'var(--toggle-btn-size)', borderRadius: '50%',
                    background: mode === 'a' ? 'var(--color-project-card-dark)' : 'transparent',
                    border: mode === 'a' ? '1.5px solid var(--color-ink)' : 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 250ms ease, border-color 250ms ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--color-project-card-dark)';
                    e.currentTarget.style.border = '1.5px solid var(--color-ink)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = mode === 'a' ? 'var(--color-project-card-dark)' : 'transparent';
                    e.currentTarget.style.border = mode === 'a' ? '1.5px solid var(--color-ink)' : 'none';
                  }}
                >
                  <svg style={{ width: 'var(--toggle-icon-size)', height: 'var(--toggle-icon-size)' }} viewBox="0 0 193 194">
                    <path
                      fill={mode === 'a' ? '#F5E000' : '#555555'}
                      style={{ transition: 'fill 250ms ease' }}
                      d="M162.285 68.6201C179.159 68.6202 192.839 81.1788 192.839 96.6699C192.839 112.161 179.159 124.719 162.285 124.719C159.991 124.719 157.755 124.485 155.605 124.045C131.388 121.232 102.399 101.345 97.0439 97.5439C100.63 102.598 118.542 128.701 122.911 151.978C124.078 155.338 124.72 158.98 124.72 162.786C124.72 179.66 112.162 193.339 96.6709 193.34C81.1798 193.34 68.6212 179.66 68.6211 162.786C68.6211 160.491 68.8546 158.256 69.2949 156.105C72.1088 131.883 92.0039 102.885 95.7979 97.54C90.4517 101.335 61.4567 121.231 37.2344 124.045C35.0841 124.485 32.8485 124.719 30.5537 124.719C13.6796 124.719 0.000265296 112.161 0 96.6699C7.41128e-05 81.1788 13.6795 68.6202 30.5537 68.6201C34.3616 68.6201 38.0062 69.2623 41.3682 70.4307C65.7862 75.0161 93.3132 94.5007 96.3857 96.7168C96.4076 96.6868 96.4191 96.671 96.4199 96.6699C96.4216 96.6722 96.4319 96.688 96.4521 96.7158C99.5221 94.5015 127.051 75.0165 151.471 70.4307C154.833 69.2623 158.477 68.6202 162.285 68.6201ZM96.1689 0C111.66 0.000260499 124.219 13.6796 124.219 30.5537C124.219 32.8457 123.985 35.0787 123.546 37.2266C120.441 63.9849 96.4891 96.5759 96.4199 96.6699C96.3521 96.5777 74.7871 67.2286 69.9307 41.3682C68.7623 38.0062 68.1201 34.3616 68.1201 30.5537C68.1202 13.6796 80.678 0.000285852 96.1689 0Z"
                    />
                  </svg>
                </button>

                {/* Mode B — square — temporarily hidden from the toggle UI;
                    logic kept fully intact (spawn/burst/seedInitial/animate
                    isB branches, Navbar's mode==='b' light-bg check, etc.)
                    for a possible later comeback, just unreachable since no
                    button dispatches handleModeSwitch('b') anymore. */}

                {/* Mode C — pixel signal */}
                <button
                  onClick={() => handleModeSwitch('c')}
                  aria-label="Switch to pixel signal mode"
                  data-cursor="default"
                  type="button"
                  style={{
                    width: 'var(--toggle-btn-size)', height: 'var(--toggle-btn-size)', borderRadius: '50%',
                    background: mode === 'c' ? 'var(--color-project-card-dark)' : 'transparent',
                    border: mode === 'c' ? '1.5px solid var(--color-ink)' : 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 250ms ease, border-color 250ms ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--color-project-card-dark)';
                    e.currentTarget.style.border = '1.5px solid var(--color-ink)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = mode === 'c' ? 'var(--color-project-card-dark)' : 'transparent';
                    e.currentTarget.style.border = mode === 'c' ? '1.5px solid var(--color-ink)' : 'none';
                  }}
                >
                  <svg style={{ width: 'var(--toggle-icon-size)', height: 'var(--toggle-icon-size)' }} viewBox="0 0 24 24">
                    <g fill={mode === 'c' ? 'var(--color-bonsai-ink)' : '#555555'} style={{ transition: 'fill 250ms ease' }}>
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
                fontFamily: mode === 'c' ? 'var(--font-pixel), monospace' : 'var(--font-google-sans-flex), sans-serif',
                fontSize: mode === 'c' ? 'var(--hero-font-size-pixel)' : 'var(--hero-font-size)',
                lineHeight: mode === 'c' ? 1.5 : 1.1,
                letterSpacing: mode === 'c' ? '0' : '-0.02em',
                maxWidth: 'min(1224px, 92vw)',
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(48px)',
                transitionDelay: '200ms',
                fontWeight: 400,
                color: mode === 'c' ? 'var(--color-hero-text-bonsai)' : mode === 'b' ? '#000000' : '#ffffff',
                transition: 'color 300ms ease, opacity 1000ms ease, transform 1000ms ease, font-size 300ms ease',
              }}
            >
              {mode === 'c' ? (
                <>
                  <span>Let&apos;s Play:</span>
                  <br />
                  <span>
                    Game of Life
                    <button
                      type="button"
                      onClick={() => setColInfoOpen(true)}
                      aria-label="What is Conway's Game of Life"
                      style={{
                        pointerEvents: 'auto',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.3em',
                        height: '2.3em',
                        marginLeft: '1em',
                        verticalAlign: 'middle',
                        transform: 'translateY(-0.5em)',
                        background: 'var(--color-retro-panel-bg)',
                        color: 'var(--color-retro-panel-fg)',
                        border: '2px solid var(--color-retro-panel-fg)',
                        fontFamily: 'var(--font-pixel), monospace',
                        fontSize: '0.45em',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      ?
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <span>I design where</span>
                  <br />
                  <span>complexity</span>
                  <span> meets</span>
                  <br />
                  <span style={{ fontWeight: 700 }}>consequence</span>
                </>
              )}
            </h1>
          </div>

          {mode !== 'c' && (
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{ height: '40%', background: `linear-gradient(to bottom, transparent, ${mode === 'b' ? '#ffffff' : '#000000'})`, zIndex: 2 }}
            />
          )}
        </div>
      </div>

      {colInfoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="What is Conway's Game of Life"
          onClick={() => setColInfoOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(10,10,10,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--page-gutter)',
          }}
        >
          <div
            className="retro-panel-frame"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '560px',
              width: '100%',
              maxHeight: '80vh',
              padding: 4,
            }}
          >
            <div
              style={{
                background: 'var(--color-retro-panel-bg)',
                color: 'var(--color-retro-panel-fg)',
                border: '2px solid var(--color-retro-panel-fg)',
                maxHeight: 'calc(80vh - 8px)',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  borderBottom: '2px solid var(--color-retro-panel-fg)',
                  padding: '10px 14px',
                }}
              >
                <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', letterSpacing: '0.02em' }}>
                  CONWAY&apos;S GAME OF LIFE
                </span>
                <button
                  type="button"
                  onClick={() => setColInfoOpen(false)}
                  aria-label="Close"
                  style={{
                    width: 18,
                    height: 18,
                    border: '2px solid var(--color-retro-panel-fg)',
                    background: 'var(--color-retro-panel-bg)',
                    color: 'var(--color-retro-panel-fg)',
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: 9,
                    lineHeight: 1,
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  x
                </button>
              </div>

              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  padding: '20px 14px',
                }}
              >
                <p style={{ margin: 0 }}>
                  Created by mathematician John Conway in 1970, this is a &quot;zero-player game&quot;
                  — you set a starting pattern, then watch it evolve entirely on its own, one
                  generation at a time.
                </p>
                <p style={{ margin: 0 }}>
                  Every cell on the grid is either alive or dead, and the whole simulation runs on
                  just one rule: a dead cell with exactly 3 live neighbors is born, and a live cell
                  with 2 or 3 live neighbors survives — otherwise it dies, from loneliness or
                  overcrowding.
                </p>
                <p style={{ margin: 0 }}>
                  That single rule is enough to produce gliders that drift forever, oscillators that
                  blink in place, still lifes that never change, and guns that fire off new gliders
                  indefinitely. It&apos;s even been proven capable of computing anything a computer
                  can — a whole universe of complexity from one simple rule.
                </p>
                <p style={{ margin: 0 }}>
                  Click anywhere in the field behind this page to plant a new pattern and watch it
                  unfold.
                </p>
                <a
                  href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-retro-panel-fg)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  Read more on Wikipedia →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
