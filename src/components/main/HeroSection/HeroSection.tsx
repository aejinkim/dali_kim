'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const CONNECT_DIST = 120;
const PHASE_DELAY_MS = 2500;
const PHASE_TRANSITION_MS = 1500;
const CLUSTER_FORCE_MAX = 0.0022;
const BASE_DAMPING = 0.955;
const PULSE_DURATION_MS = 1200;
const PULSE_ADD_CHANCE = 0.001;
const COLOR_RADIUS = 180;
const COLOR_LERP = 0.07;

const MAX_NODES_A = 180;
const AUTO_SPAWN_A = 30;
const MOUSE_SPAWN_A = 50;

const MAX_NODES_B = 450;
const AUTO_SPAWN_B = 16;
const MOUSE_SPAWN_B = 30;

const SHAPES_A = ['sparkle', 'xcross', 'circle', 'clover'] as const;
type ShapeA = typeof SHAPES_A[number];
const COLOR_A: Record<ShapeA, string> = {
  sparkle: '#BA5EF7',
  xcross:  '#EF9E6F',
  circle:  '#A5EF7A',
  clover:  '#167AB5',
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
  shape: ShapeType;
  size: number;
  rotation: number;
  rotSpeed: number;
  colorIntensity: number;
  color: string;
}

interface SimEdge {
  a: SimNode; b: SimNode;
  pulses: { startTime: number }[];
}

const CLUSTERS = [
  { id: 0, cx: 0.15, cy: 0.30 },
  { id: 1, cx: 0.85, cy: 0.25 },
  { id: 2, cx: 0.50, cy: 0.55 },
  { id: 3, cx: 0.12, cy: 0.78 },
  { id: 4, cx: 0.86, cy: 0.76 },
  { id: 5, cx: 0.50, cy: 0.90 },
];

const TRAIL_TYPES = ['sparkle', 'clover', 'xcross', 'circle'] as const;
type TrailType = typeof TRAIL_TYPES[number];
const TRAIL_COLORS = ['#BA5EF7', '#167AB5', '#EF9E6F', '#A5EF7A'];

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
  if (type === 'sparkle') return `<svg width="${size}" height="${size}" viewBox="0 0 251 251" style="display:block"><path fill="${color}" d="M125.5 0L126.838 48.4682C127.979 89.7907 161.209 123.021 202.532 124.162L251 125.5L202.532 126.838C161.209 127.979 127.979 161.209 126.838 202.532L125.5 251L124.162 202.532C123.021 161.209 89.7907 127.979 48.4682 126.838L0 125.5L48.4682 124.162C89.7907 123.021 123.021 89.7907 124.162 48.4682L125.5 0Z"/></svg>`;
  if (type === 'clover') return `<svg width="${size}" height="${size}" viewBox="0 0 193 194" style="display:block"><path fill="${color}" d="M162.285 68.6201C179.159 68.6202 192.839 81.1788 192.839 96.6699C192.839 112.161 179.159 124.719 162.285 124.719C159.991 124.719 157.755 124.485 155.605 124.045C131.388 121.232 102.399 101.345 97.0439 97.5439C100.63 102.598 118.542 128.701 122.911 151.978C124.078 155.338 124.72 158.98 124.72 162.786C124.72 179.66 112.162 193.339 96.6709 193.34C81.1798 193.34 68.6212 179.66 68.6211 162.786C68.6211 160.491 68.8546 158.256 69.2949 156.105C72.1088 131.883 92.0039 102.885 95.7979 97.54C90.4517 101.335 61.4567 121.231 37.2344 124.045C35.0841 124.485 32.8485 124.719 30.5537 124.719C13.6796 124.719 0.000265296 112.161 0 96.6699C7.41128e-05 81.1788 13.6795 68.6202 30.5537 68.6201C34.3616 68.6201 38.0062 69.2623 41.3682 70.4307C65.7862 75.0161 93.3132 94.5007 96.3857 96.7168C96.4076 96.6868 96.4191 96.671 96.4199 96.6699C96.4216 96.6722 96.4319 96.688 96.4521 96.7158C99.5221 94.5015 127.051 75.0165 151.471 70.4307C154.833 69.2623 158.477 68.6202 162.285 68.6201ZM96.1689 0C111.66 0.000260499 124.219 13.6796 124.219 30.5537C124.219 32.8457 123.985 35.0787 123.546 37.2266C120.441 63.9849 96.4891 96.5759 96.4199 96.6699C96.3521 96.5777 74.7871 67.2286 69.9307 41.3682C68.7623 38.0062 68.1201 34.3616 68.1201 30.5537C68.1202 13.6796 80.678 0.000285852 96.1689 0Z"/></svg>`;
  if (type === 'xcross') return `<svg width="${size}" height="${size}" viewBox="-8 -8 187 187" style="display:block"><path fill="${color}" d="M6.44838 5.84294C19.6396 -7.2476 51.6018 2.40496 85.3781 27.3342C119.345 2.66411 151.38 -6.74284 164.471 6.44841C177.561 19.6397 167.909 51.6017 142.98 85.3781C167.65 119.345 177.057 151.38 163.865 164.471C150.674 177.561 118.712 167.908 84.9357 142.979C50.969 167.649 18.9336 177.057 5.84291 163.865C-7.24753 150.674 2.40486 118.712 27.3341 84.9357C2.66426 50.9693 -6.74277 18.9336 6.44838 5.84294Z"/></svg>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="display:block"><circle cx="50" cy="50" r="50" fill="${color}"/></svg>`;
}

let _sparklePath: Path2D | null = null;
function drawSparkle(ctx: CanvasRenderingContext2D, size: number) {
  if (!_sparklePath) _sparklePath = new Path2D('M125.5 0L126.838 48.4682C127.979 89.7907 161.209 123.021 202.532 124.162L251 125.5L202.532 126.838C161.209 127.979 127.979 161.209 126.838 202.532L125.5 251L124.162 202.532C123.021 161.209 89.7907 127.979 48.4682 126.838L0 125.5L48.4682 124.162C89.7907 123.021 123.021 89.7907 124.162 48.4682L125.5 0Z');
  const scale = size / 125.5;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-125.5, -125.5);
  ctx.fill(_sparklePath);
  ctx.restore();
}
let _cloverPath: Path2D | null = null;
function drawClover(ctx: CanvasRenderingContext2D, size: number) {
  if (!_cloverPath) _cloverPath = new Path2D('M162.285 68.6201C179.159 68.6202 192.839 81.1788 192.839 96.6699C192.839 112.161 179.159 124.719 162.285 124.719C159.991 124.719 157.755 124.485 155.605 124.045C131.388 121.232 102.399 101.345 97.0439 97.5439C100.63 102.598 118.542 128.701 122.911 151.978C124.078 155.338 124.72 158.98 124.72 162.786C124.72 179.66 112.162 193.339 96.6709 193.34C81.1798 193.34 68.6212 179.66 68.6211 162.786C68.6211 160.491 68.8546 158.256 69.2949 156.105C72.1088 131.883 92.0039 102.885 95.7979 97.54C90.4517 101.335 61.4567 121.231 37.2344 124.045C35.0841 124.485 32.8485 124.719 30.5537 124.719C13.6796 124.719 0.000265296 112.161 0 96.6699C7.41128e-05 81.1788 13.6795 68.6202 30.5537 68.6201C34.3616 68.6201 38.0062 69.2623 41.3682 70.4307C65.7862 75.0161 93.3132 94.5007 96.3857 96.7168C96.4076 96.6868 96.4191 96.671 96.4199 96.6699C96.4216 96.6722 96.4319 96.688 96.4521 96.7158C99.5221 94.5015 127.051 75.0165 151.471 70.4307C154.833 69.2623 158.477 68.6202 162.285 68.6201ZM96.1689 0C111.66 0.000260499 124.219 13.6796 124.219 30.5537C124.219 32.8457 123.985 35.0787 123.546 37.2266C120.441 63.9849 96.4891 96.5759 96.4199 96.6699C96.3521 96.5777 74.7871 67.2286 69.9307 41.3682C68.7623 38.0062 68.1201 34.3616 68.1201 30.5537C68.1202 13.6796 80.678 0.000285852 96.1689 0Z');
  const scale = size / 96.5;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-96.5, -97);
  ctx.fill(_cloverPath);
  ctx.restore();
}
let _xcrossPath: Path2D | null = null;
function drawXCross(ctx: CanvasRenderingContext2D, size: number) {
  if (!_xcrossPath) _xcrossPath = new Path2D('M6.44838 5.84294C19.6396 -7.2476 51.6018 2.40496 85.3781 27.3342C119.345 2.66411 151.38 -6.74284 164.471 6.44841C177.561 19.6397 167.909 51.6017 142.98 85.3781C167.65 119.345 177.057 151.38 163.865 164.471C150.674 177.561 118.712 167.908 84.9357 142.979C50.969 167.649 18.9336 177.057 5.84291 163.865C-7.24753 150.674 2.40486 118.712 27.3341 84.9357C2.66426 50.9693 -6.74277 18.9336 6.44838 5.84294Z');
  const scale = size / 85.5;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(-85.5, -85.5);
  ctx.fill(_xcrossPath);
  ctx.restore();
}
function drawCircle(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
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
  sparkle: drawSparkle, xcross: drawXCross,
  circle: drawCircle, clover: drawClover,
  pixel: drawPixel, dot: drawDot, hollow: drawHollow,
  tinyL: drawTinyL, tinyDots: drawTinyDots,
};

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'a' | 'b'>('a');

  const sectionRef   = useRef<HTMLElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const modeRef      = useRef<'a' | 'b'>('a');
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

  const handleModeSwitch = (m: 'a' | 'b') => {
    if (m === modeRef.current) return;
    modeRef.current = m;
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

    const getKey = (a: SimNode, b: SimNode) =>
      a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;

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

    const spawn = (x: number, y: number) => {
      const isB = modeRef.current === 'b';
      const maxNodes = isB ? MAX_NODES_B : MAX_NODES_A;
      if (nodes.length >= maxNodes) {
        const removed = nodes.shift()!;
        for (let i = edges.length - 1; i >= 0; i--) {
          if (edges[i].a === removed || edges[i].b === removed) {
            edgeSet.delete(getKey(edges[i].a, edges[i].b));
            edges.splice(i, 1);
          }
        }
      }
      const clusterId = Math.floor(Math.random() * CLUSTERS.length);
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
        size = sr < 0.55 ? 3 + Math.random() * 6 : sr < 0.88 ? 8 + Math.random() * 9 : 17 + Math.random() * 12;
      }
      nodes.push({
        id: nodeId++, x, y,
        vx: (Math.random() - 0.5) * (isB ? 1.5 : 2.2),
        vy: (Math.random() - 0.5) * (isB ? 1.5 : 2.2),
        clusterId, opacity: 0, birthTime: performance.now(),
        shape, size, color,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * (isB ? 0.006 : 0.012),
        colorIntensity: 0,
      });
    };

    const seedInitial = () => {
      const count = modeRef.current === 'b' ? 80 : 40;
      for (let i = 0; i < count; i++) {
        spawn(Math.random() * canvas.width, Math.random() * canvas.height);
      }
    };
    seedInitial();

    const hoverHue = Math.floor(Math.random() * 360);
    const cd2 = CONNECT_DIST * CONNECT_DIST;
    const killDist2 = (CONNECT_DIST * 1.3) ** 2;

    const animate = (now: number) => {
      simRaf = requestAnimationFrame(animate);

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
      const damp = BASE_DAMPING + (0.99 - BASE_DAMPING) * eased * 0.5;
      const autoInterval = isB ? AUTO_SPAWN_B : AUTO_SPAWN_A;
      const mouseInterval = isB ? MOUSE_SPAWN_B : MOUSE_SPAWN_A;
      const maxNodes = isB ? MAX_NODES_B : MAX_NODES_A;

      if (now - lastAutoSpawn > autoInterval && nodes.length < maxNodes) {
        spawn(Math.random() * canvas.width, Math.random() * canvas.height);
        lastAutoSpawn = now;
      }
      if (mouseX > -1 && mouseY > -1 && now - lastMouseSpawn > mouseInterval) {
        spawn(mouseX + (Math.random() - 0.5) * 24, mouseY + (Math.random() - 0.5) * 24);
        lastMouseSpawn = now;
      }

      for (const n of nodes) {
        n.vx += (Math.random() - 0.5) * (isB ? 0.1 : 0.16);
        n.vy += (Math.random() - 0.5) * (isB ? 0.1 : 0.16);
        if (cf > 0) {
          const c = CLUSTERS[n.clusterId % CLUSTERS.length];
          n.vx += (c.cx * canvas.width - n.x) * cf;
          n.vy += (c.cy * canvas.height - n.y) * cf;
        }
        n.vx *= damp; n.vy *= damp;
        n.x += n.vx; n.y += n.vy;
        n.rotation += n.rotSpeed;
        const m = n.size;
        if (n.x < m) { n.x = m; n.vx = Math.abs(n.vx); }
        else if (n.x > canvas.width - m) { n.x = canvas.width - m; n.vx = -Math.abs(n.vx); }
        if (n.y < m) { n.y = m; n.vy = Math.abs(n.vy); }
        else if (n.y > canvas.height - m) { n.y = canvas.height - m; n.vy = -Math.abs(n.vy); }
        n.opacity = Math.min(1, (now - n.birthTime) / 300);

        const cdx = n.x - mouseX, cdy = n.y - mouseY;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        const targetCI = cdist < COLOR_RADIUS ? Math.pow(1 - cdist / COLOR_RADIUS, 0.6) : 0;
        n.colorIntensity += (targetCI - n.colorIntensity) * COLOR_LERP;
      }

      // Edges only in Mode A
      if (!isB) {
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
            ? `hsla(${hoverHue},70%,65%,${(base * ci * 0.35).toFixed(3)})`
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
        ctx.globalCompositeOperation = isB ? 'multiply' : 'screen';
        if (n.colorIntensity > 0.06) {
          ctx.fillStyle = `hsla(${hoverHue},85%,65%,${(n.colorIntensity * 0.22).toFixed(3)})`;
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
        : TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
      const size = 22 + Math.random() * 38;
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
      const active = mx > -1;
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
          style={{ transform: `translateY(${translateY}%)`, willChange: 'transform', backgroundColor: mode === 'b' ? '#ffffff' : '#000000' }}
        >
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

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
              <div style={{
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
                  style={{
                    width: 'var(--toggle-btn-size)', height: 'var(--toggle-btn-size)', borderRadius: '50%',
                    background: '#0d0d0d',
                    border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 250ms ease',
                    flexShrink: 0,
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

                {/* Mode B — square */}
                <button
                  onClick={() => handleModeSwitch('b')}
                  style={{
                    width: 'var(--toggle-btn-size)', height: 'var(--toggle-btn-size)', borderRadius: '50%',
                    background: '#0d0d0d',
                    border: '0.926px solid #000000',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    transition: 'background 250ms ease',
                  }}
                >
                  <div style={{
                    width: 'var(--toggle-square-size)', height: 'var(--toggle-square-size)', flexShrink: 0,
                    border: `2.471px solid ${mode === 'b' ? '#ffffff' : '#555555'}`,
                    transition: 'border-color 250ms ease',
                  }} />
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
                color: mode === 'b' ? '#000000' : '#ffffff',
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
            style={{ height: '40%', background: `linear-gradient(to bottom, transparent, ${mode === 'b' ? '#ffffff' : '#000000'})`, zIndex: 2 }}
          />
        </div>
      </div>
    </section>
  );
}
