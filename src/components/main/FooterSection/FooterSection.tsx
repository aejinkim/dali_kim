'use client';

import { useEffect, useRef, useState } from 'react';

const FONT_FILL   = 'rgba(255,255,255,0.23)';
const DOT_RADIUS  = 2.2;
const DOT_SPACING = 9;
const REPULSION_RADIUS   = 140;
const REPULSION_STRENGTH = 60;
const LERP = 0.08;

interface Dot {
  hx: number; hy: number;   // home position
  x:  number; y:  number;   // current position
  vx: number; vy: number;
}

function buildDots(w: number, h: number): Dot[] {
  // Draw "DALI" onto an offscreen canvas, then sample pixel positions
  const off = document.createElement('canvas');
  off.width  = w;
  off.height = h;
  const ctx  = off.getContext('2d')!;

  let fontSize = Math.floor(h * 0.85);
  ctx.font = `900 ${fontSize}px Arial, sans-serif`;
  const measured = ctx.measureText('DALI').width;
  const maxW = w * 0.92;
  if (measured > maxW) {
    fontSize = Math.floor(fontSize * (maxW / measured));
  }
  ctx.fillStyle    = '#ffffff';
  ctx.font         = `900 ${fontSize}px Arial, sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('DALI', w / 2, h * 0.98);

  const img  = ctx.getImageData(0, 0, w, h);
  const dots: Dot[] = [];

  for (let y = DOT_SPACING; y < h - DOT_SPACING; y += DOT_SPACING) {
    for (let x = DOT_SPACING; x < w - DOT_SPACING; x += DOT_SPACING) {
      const alpha = img.data[((y * w + x) * 4) + 3];
      if (alpha > 128) {
        dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
      }
    }
  }
  return dots;
}

export default function FooterSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const dotsRef   = useRef<Dot[]>([]);
  const mouseRef  = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (canvas.width === 0 || canvas.height === 0) return;
      dotsRef.current = buildDots(canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { x: mx, y: my } = mouseRef.current;

      ctx.fillStyle = FONT_FILL;
      for (const d of dotsRef.current) {
        // Repulsion from mouse
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPULSION_RADIUS && dist > 0) {
          const force = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        // Spring back to home
        d.vx += (d.hx - d.x) * 0.12;
        d.vy += (d.hy - d.y) * 0.12;

        // Damping
        d.vx *= 0.78;
        d.vy *= 0.78;

        d.x += d.vx * LERP * 2;
        d.y += d.vy * LERP * 2;

        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section style={{ position: 'relative', backgroundColor: 'var(--color-canvas-bg)', height: '100vh', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: 'var(--font-google-sans-flex), sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '16px',
        }}>
          Let's Connect
        </span>
        <a
          href="mailto:jiny0410@gmail.com"
          style={{
            fontFamily: 'var(--font-google-sans-flex), sans-serif',
            fontSize: 'var(--footer-cta-size)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textDecoration: 'none',
            pointerEvents: 'auto',
            boxSizing: 'border-box',
            padding: 'clamp(12px, 1.5vw, 24px) clamp(32px, 4vw, 64px)',
            borderRadius: '90px',
            border: hovered ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
            background: hovered ? 'rgba(0,0,0,0.2)' : 'transparent',
            backdropFilter: hovered ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: hovered ? 'blur(12px)' : 'none',
            transition: 'background 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Get in touch
        </a>
      </div>

      {/* Bottom-right links */}
      <div style={{
        position: 'absolute',
        bottom: 'var(--page-gutter)',
        right: 'var(--page-gutter)',
        display: 'flex',
        gap: '32px',
        pointerEvents: 'auto',
      }}>
        {[
          { label: 'X (Twitter)', href: 'https://x.com/dali__design' },
          { label: 'LinkedIn',    href: 'https://www.linkedin.com/in/dali-k-50780379/' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-google-sans-flex), sans-serif',
              fontSize: '13px',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
