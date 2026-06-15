'use client';

import { useRef, useEffect, useState, type CSSProperties } from 'react';
import Navbar from '@/components/main/Navbar';

interface Particle {
  x: number; y: number;
  size: number;
  speedX: number; speedY: number;
  opacity: number;
  twinkleSpeed: number; twinkleOffset: number;
  flare: boolean;
}

function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const centerSuppression = (x: number, y: number): number => {
      const cx = canvas.width / 2, cy = canvas.height / 2 + 100;
      const rx = canvas.width * 0.22, ry = canvas.height * 0.38;
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      const d = Math.sqrt(dx * dx + dy * dy);
      return d < 1 ? Math.pow(1 - d, 1.5) : 0;
    };

    const init = () => {
      particles = [];
      const area = canvas.width * canvas.height;

      const add = (count: number, minSize: number, maxSize: number, speed: number, opBase: number, opRange: number) => {
        for (let i = 0; i < count; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          if (Math.random() < centerSuppression(x, y) * 0.95) continue;
          particles.push({
            x, y,
            size: Math.random() * (maxSize - minSize) + minSize,
            speedX: (Math.random() - 0.5) * speed,
            speedY: (Math.random() - 0.5) * speed,
            opacity: Math.random() * opRange + opBase,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinkleOffset: Math.random() * Math.PI * 2,
            flare: Math.random() < 0.12,
          });
        }
      };

      add(Math.floor(area / 6000),  0.3, 1.1, 0.08, 0.15, 0.55);
      add(Math.floor(area / 18000), 1.2, 2.2, 0.15, 0.30, 0.45);
      add(Math.floor(area / 60000), 2.5, 4.0, 0.10, 0.65, 0.35);
    };

    let t = 0;
    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        const raw = Math.sin(t * p.twinkleSpeed + p.twinkleOffset);
        const twinkle = p.flare
          ? Math.pow(Math.max(0, raw * 0.5 + 0.5), 2.5)
          : raw * 0.35 + 0.65;
        const alpha = p.opacity * twinkle;

        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();

        if (p.size > 2.5 || (p.flare && twinkle > 0.6)) {
          const glowR = p.flare ? p.size * (6 + twinkle * 8) : p.size * 4;
          const glowAlpha = p.flare ? alpha * 0.6 : alpha * 0.25;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
          grad.addColorStop(0, `rgba(255,255,255,${glowAlpha})`);
          grad.addColorStop(0.4, `rgba(200,220,255,${glowAlpha * 0.4})`);
          grad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize(); draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />;
}

const PARAGRAPHS = [
  "I'm a design leader specializing in complex systems, financial infrastructure, and emerging technologies.",
  "Over the past 15 years, I've led product design, design systems, branding, and cross-functional teams across startups and technology companies, helping transform complex technologies into products people can understand, trust, and use.",
  "This site originally started as a portfolio, but curiosity had other plans. Today, it's where I explore ideas, build experiments, and share what I'm learning along the way.",
  "The deeper I explored AI, the more excited I became about the future of creativity. Today, I spend much of my time experimenting as an AI-native creative designer, exploring new ways of building products, workflows, and experiences with emerging technologies.",
  "I have an entrepreneurial mindset and a strong curiosity for learning. I'm constantly drawn to new challenges, new tools, and new ways of thinking. The most rewarding part of design, for me, is solving difficult problems and finding the intersection where user needs, business goals, and technology come together.",
  "If anything here resonates with you, I'd love to connect.",
];

export default function AboutPage() {
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [boxScrollY, setBoxScrollY] = useState(0);
  const [boxOverflow, setBoxOverflow] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = slideContainerRef.current;
      if (!el) return;
      setBoxOverflow(Math.max(0, el.scrollHeight - window.innerHeight));
    };
    const id = setTimeout(measure, 300);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = scrollDriverRef.current;
      if (!el) return;
      const scrolled = -el.getBoundingClientRect().top;
      const animRange = 2 * window.innerHeight;
      const p = Math.min(Math.max(scrolled / animRange, 0), 1);
      setProgress(p);
      setBoxScrollY(Math.max(0, scrolled - animRange));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const videoScale = Math.max(0, 1.2 * (1 - progress));
  const blurProgress = Math.max(0, (progress - 0.4) / 0.6);
  const videoBlur = blurProgress * 24;

  const textProgress = Math.max(0, (progress - 0.5) / 0.5);
  const textY = (1 - textProgress) * 100;
  const touchProgress = Math.max(0, (textProgress - 0.6) / 0.4);

  if (isMobile) {
    return (
      <>
        <Navbar alwaysVisible />
        <div style={{
          background: 'var(--color-about-bg)',
          minHeight: '100vh',
          paddingTop: '85px',
          paddingBottom: '60px',
          paddingLeft: '20px',
          paddingRight: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 800ms ease',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-google-sans-flex), sans-serif',
            fontSize: '24px',
            fontWeight: 300,
            lineHeight: 1.3,
            letterSpacing: '-0.24px',
            color: '#ffffff',
            textAlign: 'center',
            margin: 0,
          }}>
            Hi there, I&apos;m Dali
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
            <div style={{ background: 'var(--color-about-card-bg)', border: '1px solid var(--color-about-card-border)', padding: '12px', width: '100%', maxWidth: '332px' }}>
              {PARAGRAPHS.map((text, i) => (
                <p key={i} style={{
                  fontFamily: 'var(--font-google-sans-flex), sans-serif',
                  fontWeight: 300, fontSize: '12px', lineHeight: 1.3,
                  letterSpacing: '-0.01em', margin: 0,
                  marginBottom: i < PARAGRAPHS.length - 1 ? '1em' : 0,
                  color: '#ffffff',
                }}>{text}</p>
              ))}
            </div>
            <a href="mailto:jiny0410@gmail.com" style={{
              fontFamily: 'var(--font-google-sans-flex), sans-serif',
              fontSize: '24px', fontWeight: 300, lineHeight: 1.4,
              letterSpacing: '-0.24px', color: '#ffffff',
              textDecoration: 'none', textAlign: 'center',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-dim)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#ffffff')}
            >Get in touch</a>
          </div>
        </div>
      </>
    );
  }

  // Tablet + Desktop — sticky scroll animation
  return (
    <>
      <Navbar alwaysVisible />

      <div ref={scrollDriverRef} style={{ height: `calc(300vh + ${boxOverflow}px)`, position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'var(--color-canvas-bg)',
          overflow: 'clip',
        }}>
          <SpaceCanvas />

          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: `translate(-50%, calc(-50% + 100px)) scale(${videoScale})`,
            transformOrigin: 'center center',
            zIndex: 1,
            willChange: 'transform',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 65% at center, black 30%, transparent 80%)',
            maskImage: 'radial-gradient(ellipse 60% 65% at center, black 30%, transparent 80%)',
            filter: `blur(${videoBlur}px)`,
            mixBlendMode: 'difference',
          }}>
            <video
              src="/about2.mp4"
              autoPlay muted loop playsInline
              style={{ height: '100vh', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>

          <h1 style={{
            position: 'absolute',
            top: '82%',
            left: 0, right: 0,
            margin: 0,
            textAlign: 'center',
            fontFamily: 'var(--font-google-sans-flex), sans-serif',
            fontSize: 'max(26px, 8.1vw)',
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 0,
            opacity: loaded ? 1 : 0,
            transform: `translateY(calc(-50% - ${progress * 64}vh - 20px - ${boxScrollY}px)) scale(${1.5 - progress * 0.5})`,
            transition: 'opacity 2000ms ease',
            willChange: 'transform, opacity',
          }}>
            Hi there, I&apos;m Dali
          </h1>

          <div ref={slideContainerRef} style={{
            position: 'absolute',
            inset: 0,
            transform: `translateY(calc(${textY}% - ${boxScrollY}px))`,
            willChange: 'transform',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: 'var(--page-gutter)',
            paddingRight: 'var(--page-gutter)',
            paddingTop: 'calc(18vh + 4.05vw + 32px)',
            paddingBottom: '100px',
          }}>
            <div style={{ maxWidth: 'clamp(512px, 32.4vw, 800px)', position: 'relative' }}>
              {([
                { top: -4, left: -4 },
                { top: -4, right: -4 },
                { bottom: -4, left: -4 },
                { bottom: -4, right: -4 },
              ] as CSSProperties[]).map((pos, i) => (
                <div key={i} style={{ position: 'absolute', width: 9, height: 9, background: 'var(--color-thumbnail-placeholder)', ...pos }} />
              ))}
              <div style={{
                background: 'var(--color-about-card-bg)',
                border: '1px solid var(--color-about-card-border)',
                padding: '20px',
                opacity: textProgress,
                transition: 'opacity 200ms linear',
              }}>
                {PARAGRAPHS.map((text, i) => (
                  <p key={i} style={{
                    fontFamily: 'var(--font-google-sans-flex), sans-serif',
                    fontWeight: 300,
                    fontSize: 'max(16px, min(24px, 0.97vw))',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    margin: 0,
                    marginBottom: i < PARAGRAPHS.length - 1 ? '1em' : 0,
                    color: '#ffffff',
                  }}>{text}</p>
                ))}
              </div>
            </div>

            <a
              href="mailto:jiny0410@gmail.com"
              style={{
                fontFamily: 'var(--font-google-sans-flex), sans-serif',
                fontSize: 'clamp(20px, 2.5vw, 52px)',
                fontWeight: 300,
                lineHeight: 1.4,
                letterSpacing: '-0.01em',
                color: '#ffffff',
                textDecoration: 'none',
                textAlign: 'center',
                opacity: touchProgress,
                transition: 'opacity 200ms linear, color 200ms ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                marginTop: 'auto',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-dim)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#ffffff')}
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
