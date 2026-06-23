'use client';

import { useState, useEffect } from 'react';


function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const bg = tone === 'light' ? 'var(--color-ink)' : 'var(--color-brand-bg)';
  const fg = tone === 'light' ? 'var(--color-brand-bg)' : 'var(--color-ink)';
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: '78px',
        height: '21px',
        backgroundColor: bg,
        borderRadius: '50%',
        color: fg,
        fontSize: '11px',
        fontWeight: 800,
        letterSpacing: '-0.02em',
      }}
    >
      DALI KIM
    </div>
  );
}

type NavLink = { label: string; href: string; external?: boolean };
const NAV_LEFT: NavLink[] = [
  { label: 'DALI KIM', href: '/' },
  { label: 'WORK', href: '/#projects' },
  { label: 'CRAFT', href: '/case-studies' },
];
const NAV_RIGHT: NavLink[] = [
  { label: 'ABOUT', href: '/about' },
  { label: 'EMAIL', href: 'mailto:jiny0410@gmail.com' },
  { label: 'X', href: 'https://x.com/dali__design', external: true },
];
const ALL_LINKS = [...NAV_LEFT, ...NAV_RIGHT];

export default function Navbar({ alwaysVisible = false, tone = 'dark' }: { alwaysVisible?: boolean; tone?: 'dark' | 'light' }) {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (alwaysVisible) return;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const fadeStart = window.innerHeight * 0.2;
      const fadeEnd   = window.innerHeight * 0.5;
      const opacity = Math.max(0, Math.min(1, 1 - (y - fadeStart) / (fadeEnd - fadeStart)));
      setNavOpacity(opacity);
      setDark(y > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const rafSync = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(rafSync);
      window.removeEventListener('scroll', onScroll);
    };
  }, [alwaysVisible]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const lightTone = tone === 'light';
  const textColor = lightTone ? 'var(--color-ink)' : 'var(--color-brand-bg)';
  const effectiveScrolled = alwaysVisible ? true : scrolled;
  const effectiveDark = alwaysVisible ? true : dark;
  const bg = lightTone
    ? 'transparent'
    : effectiveScrolled && !effectiveDark
      ? 'rgba(10,10,10,0.85)'
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0) 100%)';
  const blurVal = lightTone ? 'none' : effectiveScrolled && !effectiveDark ? 'blur(14px)' : 'blur(2px)';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: bg,
          backdropFilter: blurVal,
          WebkitBackdropFilter: blurVal,
          opacity: alwaysVisible ? 1 : navOpacity,
          pointerEvents: !alwaysVisible && navOpacity < 0.05 ? 'none' : 'auto',
          transition: 'background 300ms ease',
        }}
      >
        <nav className="hidden md:flex items-center w-full" style={{ padding: 'var(--nav-v-pad) var(--nav-gutter)', height: 'var(--nav-height)', gap: '10px' }}>
          <div
            className="flex items-center justify-between flex-1 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-google-sans-flex), sans-serif', color: textColor, letterSpacing: 'var(--tracking-caption)', fontSize: 'var(--nav-font-size)' }}
          >
            <div className="flex items-center gap-10">
              {NAV_LEFT.map(({ label, href }) => (
                <a key={label} href={href} className="hover:opacity-50 transition-opacity duration-200">
                  {label === 'DALI KIM' ? <Logo tone={tone} /> : label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-6">
              {NAV_RIGHT.map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="hover:opacity-50 transition-opacity duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <nav className="flex md:hidden items-center" style={{ padding: '16px var(--page-gutter)', gap: '30px' }}>
          {NAV_LEFT.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="hover:opacity-50 transition-opacity duration-200"
              style={{
                fontFamily: 'var(--font-google-sans-flex), sans-serif',
                fontSize: '13px',
                color: textColor,
                letterSpacing: '-0.13px',
                textDecoration: 'none',
              }}
            >
                {label === 'DALI KIM' ? <Logo tone={tone} /> : label}
            </a>
          ))}
        </nav>

        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: menuOpen ? '400px' : '0', background: 'var(--color-brand-bg)' }}
        >
          <div className="flex flex-col px-6 pb-6 gap-5">
            {ALL_LINKS.map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => setMenuOpen(false)}
                className="text-[15px] tracking-widest font-medium hover:opacity-50 transition-opacity border-b pb-4"
                style={{ color: 'var(--color-ink)', borderColor: 'rgba(0,0,0,0.08)', fontFamily: 'var(--font-google-sans-flex), sans-serif' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div
        className="fixed z-50 hidden md:flex flex-col items-center"
        style={{
          top: '33px',
          right: 'var(--page-gutter)',
          gap: '10px',
          opacity: 1 - navOpacity,
          pointerEvents: dark ? 'auto' : 'none',
          transition: 'opacity 200ms ease',
        }}
      >
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Open navigation"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-nav-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            transition: 'transform 200ms ease, background-color 200ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <div style={{ position: 'relative', width: 18, height: 18 }}>
            <div
              style={{
                position: 'absolute', top: 8, left: 0, width: 18, height: 1.5, background: 'var(--color-brand-bg)',
                transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                transformOrigin: 'center',
                transition: 'transform 300ms ease',
              }}
            />
            <div
              style={{
                position: 'absolute', top: 0, left: 8, width: 1.5, height: 18, background: 'var(--color-brand-bg)',
                transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                transformOrigin: 'center',
                transition: 'transform 300ms ease',
              }}
            />
          </div>
        </button>

        <span
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            fontFamily: 'var(--font-google-sans-flex), sans-serif',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.18em',
            color: 'var(--color-brand-bg)',
            textTransform: 'uppercase',
          }}
        >
          INDEX
        </span>
      </div>

      <div
        className="fixed inset-0 z-40 hidden md:flex flex-col items-center justify-center"
        style={{
          backgroundColor: 'var(--color-ink)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 400ms ease',
        }}
        onClick={() => setMenuOpen(false)}
      >
        <nav
          className="flex flex-col items-center"
          style={{ gap: '48px' }}
          onClick={e => e.stopPropagation()}
        >
          {ALL_LINKS.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => setMenuOpen(false)}
              className="hover:opacity-40 transition-opacity duration-200"
              style={{
                fontFamily: 'var(--font-google-sans-flex), sans-serif',
                fontSize: 'clamp(28px, 4vw, 56px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--color-brand-bg)',
                textDecoration: 'none',
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
