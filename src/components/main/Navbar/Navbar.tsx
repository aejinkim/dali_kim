'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={tone === 'light' ? '/logo_bl.png' : '/logo_dalikim.svg'}
      alt="DALI KIM"
      style={{
        width: 'auto',
        height: 24,
        display: 'block',
        filter: tone === 'light' ? 'none' : 'invert(1)',
      }}
    />
  );
}


type NavLink = { label: string; href: string; external?: boolean };
const NAV_LEFT: NavLink[] = [
  { label: 'DALI KIM', href: '/' },
  { label: 'WORK', href: '/#projects' },
];
const NAV_RIGHT: NavLink[] = [
  { label: 'ABOUT', href: '/about' },
  { label: 'EMAIL', href: 'mailto:jiny0410@gmail.com' },
  { label: 'X', href: 'https://x.com/dali__design', external: true },
];
const ALL_LINKS = [...NAV_LEFT, ...NAV_RIGHT];

const MOBILE_MENU_LINKS: NavLink[] = [
  { label: 'Works', href: '/#projects' },
  { label: 'About', href: '/about' },
  { label: 'Email', href: 'mailto:jiny0410@gmail.com' },
  { label: "X (Let's chat)", href: 'https://x.com/dali__design', external: true },
];

const MOBILE_CHARACTER_IMG = '/assets/shared/mobile_character.png';

function NavItem({
  href,
  external,
  className,
  style,
  onClick,
  children,
}: NavLink & {
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export default function Navbar({ alwaysVisible = false, tone = 'dark' }: { alwaysVisible?: boolean; tone?: 'dark' | 'light' }) {
  const [dark, setDark] = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightBg, setLightBg] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (alwaysVisible) return;
    const onScroll = () => {
      const y = window.scrollY;
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

  useEffect(() => {
    const onMode = (e: Event) => setLightBg((e as CustomEvent<string>).detail === 'b');
    window.addEventListener('hero-mode', onMode);
    return () => window.removeEventListener('hero-mode', onMode);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLightBg(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const check = () => setIsMobileView(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const effectiveLightBg = tone === 'light' || lightBg;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'transparent',
          opacity: alwaysVisible ? 1 : navOpacity,
          pointerEvents: !alwaysVisible && navOpacity < 0.05 ? 'none' : 'auto',
          transition: 'opacity 300ms ease',
          mixBlendMode: 'difference',
        }}
      >
        <nav className="hidden md:flex items-center w-full" style={{ padding: 'var(--nav-v-pad) var(--nav-gutter)', height: 'var(--nav-height)', gap: '10px' }}>
          <div
            className="flex items-center justify-between flex-1 whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-google-sans-flex), sans-serif',
              color: 'var(--color-surface-inverse)',
              letterSpacing: 'var(--tracking-caption)',
              fontSize: 'var(--nav-font-size)',
            }}
          >
            <div className="flex items-center gap-10">
              {NAV_LEFT.map(({ label, href, external }) => (
                <NavItem key={label} label={label} href={href} external={external} className="hover:opacity-50 transition-opacity duration-200">
                  {label === 'DALI KIM' ? <Logo /> : label}
                </NavItem>
              ))}
            </div>
            <div className="flex items-center gap-6">
              {NAV_RIGHT.map(({ label, href, external }) => (
                <NavItem
                  key={label}
                  label={label}
                  href={href}
                  external={external}
                  className="hover:opacity-50 transition-opacity duration-200"
                >
                  {label === 'X' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/icons_x.svg"
                      alt="X"
                      style={{ width: 24, height: 24, display: 'block', filter: 'invert(1)' }}
                    />
                  ) : label}
                </NavItem>
              ))}
            </div>
          </div>
        </nav>

        <nav className="flex md:hidden items-center justify-between" style={{ padding: '16px var(--page-gutter)' }}>
          <NavItem
            label="DALI KIM"
            href="/"
            className="hover:opacity-50 transition-opacity duration-200"
            style={{ textDecoration: 'none' }}
          >
            <Logo tone={effectiveLightBg ? 'light' : tone} />
          </NavItem>
        </nav>
      </header>

      <div
        className="fixed z-50 flex flex-col items-center"
        style={{
          top: isMobileView ? '8px' : '33px',
          right: isMobileView ? '20px' : 'var(--page-gutter)',
          gap: '10px',
          opacity: isMobileView ? 1 : (1 - navOpacity),
          pointerEvents: isMobileView ? 'auto' : (dark ? 'auto' : 'none'),
          transition: 'opacity 200ms ease',
        }}
      >
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Open navigation"
          style={{
            width: isMobileView ? '40px' : '52px',
            height: isMobileView ? '40px' : '52px',
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
          <div style={{ position: 'relative', width: isMobileView ? 14 : 18, height: isMobileView ? 14 : 18 }}>
            <div
              style={{
                position: 'absolute', top: isMobileView ? 6 : 8, left: 0, width: isMobileView ? 14 : 18, height: 1.5, background: 'var(--color-brand-bg)',
                transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                transformOrigin: 'center',
                transition: 'transform 300ms ease',
              }}
            />
            <div
              style={{
                position: 'absolute', top: 0, left: isMobileView ? 6 : 8, width: 1.5, height: isMobileView ? 14 : 18, background: 'var(--color-brand-bg)',
                transform: menuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                transformOrigin: 'center',
                transition: 'transform 300ms ease',
              }}
            />
          </div>
        </button>

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
            <NavItem
              key={label}
              label={label}
              href={href}
              external={external}
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
            </NavItem>
          ))}
        </nav>
      </div>

      {/* Mobile full-screen overlay */}
      <div
        className="fixed inset-0 z-50 md:hidden overflow-hidden"
        style={{
          backgroundColor: 'var(--color-ink)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      >
        {/* Top navbar row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px var(--page-gutter)',
        }}>
          <Logo tone="dark" />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
            }}
          >
            <div style={{ position: 'relative', width: 18, height: 18 }}>
              <div style={{
                position: 'absolute', top: '50%', left: 0, width: '100%', height: 1.5,
                background: 'var(--color-brand-bg)',
                transform: 'translateY(-50%) rotate(45deg)',
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: 0, width: '100%', height: 1.5,
                background: 'var(--color-brand-bg)',
                transform: 'translateY(-50%) rotate(-45deg)',
              }} />
            </div>
          </button>
        </div>

        {/* Nav links */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 var(--page-gutter)',
        }}>
          {MOBILE_MENU_LINKS.map(({ label, href, external }, i) => (
            <div key={label}>
              <NavItem
                label={label}
                href={href}
                external={external}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-google-sans-flex), sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  letterSpacing: '-0.16px',
                  color: 'var(--color-brand-bg)',
                  textDecoration: 'none',
                  padding: '16px 0',
                }}
              >
                {label}
              </NavItem>
              {i < MOBILE_MENU_LINKS.length - 1 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.12)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Character image */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 0,
          width: '80vw',
          height: 'calc(80vw * 0.943)',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 2,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MOBILE_CHARACTER_IMG}
            alt=""
            style={{
              position: 'absolute',
              top: '-31.9%',
              left: '-91.06%',
              width: '282.11%',
              height: '298.91%',
              maxWidth: 'none',
              display: 'block',
            }}
          />
        </div>
      </div>
    </>
  );
}
