'use client';

import { useEffect, useRef } from 'react';

type CursorMode = 'default' | 'hover' | 'circle' | 'hand';

function resolveMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return 'default';
  if (target.closest('[data-cursor="coming-soon"]')) return 'default';
  if (target.closest('[data-cursor="default"]')) return 'default';
  if (target.closest('[data-cursor="circle"]')) return 'circle';
  if (target.closest('[data-cursor="hand"]')) return 'hand';
  if (target.closest('[data-cursor="project"]')) return 'hover';
  if (target.closest('a, button, [role="button"]')) return 'hover';
  return 'default';
}

export default function CustomCursor() {
  // Two separate `position: fixed` layers, kept in sync every frame.
  // `position: fixed` always establishes its own stacking context, and
  // `mix-blend-mode` on a *descendant* of that context can only blend
  // against other content inside the same context (i.e. nothing, since
  // this layer has no other content) — it can never reach the real page
  // behind it, so it silently renders as an unblended, invisible-on-
  // matching-backgrounds color. The blend-mode must sit directly on the
  // fixed element itself. Since the hand icon must NOT be blended (it's a
  // fixed white icon with a black outline, drawn on top of the blended
  // circle), it needs its own separate fixed layer with no blend-mode.
  const blendLayerRef = useRef<HTMLDivElement>(null);
  const iconLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;

    const blendLayer = blendLayerRef.current;
    const iconLayer = iconLayerRef.current;
    if (!blendLayer || !iconLayer) return;

    document.documentElement.classList.add('custom-cursor-active');

    let hasMoved = false;
    let mode: CursorMode = 'default';

    const setOpacity = (v: string) => {
      blendLayer.style.opacity = v;
      iconLayer.style.opacity = v;
    };

    // No JS lerp/rAF loop for position: the CSS `transition: transform`
    // on both layers (see globals.css) animates the catch-up on its own
    // whenever we set a new target here, and — unlike a manual per-frame
    // loop — it does zero work once it reaches the target. Same technique
    // used by the reference site (studioodea.com.au): they update
    // `transform` directly on `mousemove` and let CSS ease it into place.
    const onMouseMove = (e: MouseEvent) => {
      const t = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      blendLayer.style.transform = t;
      iconLayer.style.transform = t;
      if (!hasMoved) {
        hasMoved = true;
        setOpacity('1');
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const next = resolveMode(e.target);
      if (next === mode) return;
      mode = next;
      blendLayer.dataset.mode = mode;
      iconLayer.dataset.mode = mode;
    };

    const onDocMouseLeave = () => setOpacity('0');
    const onDocMouseEnter = () => { if (hasMoved) setOpacity('1'); };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onDocMouseLeave);
    document.documentElement.addEventListener('mouseenter', onDocMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.documentElement.removeEventListener('mouseleave', onDocMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onDocMouseEnter);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <>
      <div
        ref={blendLayerRef}
        aria-hidden="true"
        data-mode="default"
        className="custom-cursor-blend-layer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'var(--cursor-size)',
          height: 'var(--cursor-size)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      >
        {/* default mouse: arrow (Figma node 924:37802) */}
        <svg
          className="custom-cursor-arrow"
          width="23.334" height="26.075" viewBox="0 0 25.3343 26.0754"
          style={{ position: 'absolute', left: 19.5, top: 19.14 }}
        >
          <path
            d="M23.8931 11.4574L13.4674 14.4359L9.77302 24.6302L0.893139 0.957376L23.8931 11.4574Z"
            fill="var(--color-cursor-fg)"
          />
        </svg>

        {/* mouse hover in image: filled circle (Figma node 924:37759) */}
        <svg
          className="custom-cursor-circle"
          width="42" height="42" viewBox="0 0 42 42"
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          <circle cx="21" cy="21" r="21" fill="var(--color-cursor-fg)" />
        </svg>
      </div>

      {/* Hand icon: fixed colors, not blended — drawn on top of the circle */}
      <div
        ref={iconLayerRef}
        aria-hidden="true"
        data-mode="default"
        className="custom-cursor-icon-layer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'var(--cursor-size)',
          height: 'var(--cursor-size)',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: 0,
          willChange: 'transform',
        }}
      >
        <svg
          className="custom-cursor-hand"
          width="24" height="24" viewBox="0 0 24 24"
          style={{ position: 'absolute', left: 13, top: 15 }}
        >
          <path
            d="M8.27 16.28C7.99 15.92 7.64 15.19 7.03 14.28C6.68 13.78 5.82 12.83 5.56 12.34C5.37257 12.0422 5.31819 11.6797 5.41 11.34C5.56696 10.6942 6.17956 10.2658 6.84 10.34C7.3508 10.4426 7.82022 10.693 8.19 11.06C8.44818 11.3032 8.68567 11.5674 8.9 11.85C9.06 12.05 9.1 12.13 9.28 12.36C9.46 12.59 9.58 12.82 9.49 12.48C9.42 11.98 9.3 11.14 9.13 10.39C9 9.82 8.97 9.73 8.85 9.3C8.73 8.87 8.66 8.51 8.53 8.02C8.41117 7.53858 8.31771 7.05124 8.25 6.56C8.12395 5.93171 8.21566 5.27922 8.51 4.71C8.85939 4.38137 9.37193 4.29464 9.81 4.49C10.2506 4.81534 10.5791 5.26966 10.75 5.79C11.0121 6.43039 11.187 7.10307 11.27 7.79C11.43 8.79 11.74 10.25 11.75 10.55C11.75 10.18 11.68 9.4 11.75 9.05C11.8194 8.68513 12.073 8.38232 12.42 8.25C12.7178 8.15863 13.0328 8.13808 13.34 8.19C13.65 8.25482 13.9247 8.43315 14.11 8.69C14.3417 9.2734 14.4703 9.8926 14.49 10.52C14.5168 9.97059 14.6108 9.42653 14.77 8.9C14.9371 8.66455 15.1811 8.49479 15.46 8.42C15.7906 8.35956 16.1294 8.35956 16.46 8.42C16.7311 8.51063 16.9682 8.68152 17.14 8.91C17.3518 9.44035 17.48 10.0003 17.52 10.57C17.52 10.71 17.59 10.18 17.81 9.83C17.9243 9.4906 18.211 9.23797 18.5621 9.16728C18.9132 9.09659 19.2754 9.21857 19.5121 9.48728C19.7489 9.75599 19.8243 10.1306 19.71 10.47C19.71 11.12 19.71 11.09 19.71 11.53C19.71 11.97 19.71 12.36 19.71 12.73C19.6736 13.3152 19.5933 13.8968 19.47 14.47C19.296 14.9771 19.0538 15.4582 18.75 15.9C18.2644 16.44 17.8633 17.0502 17.56 17.71C17.4848 18.0378 17.4512 18.3738 17.46 18.71C17.459 19.0206 17.4994 19.33 17.58 19.63C17.1711 19.6732 16.7589 19.6732 16.35 19.63C15.96 19.57 15.48 18.79 15.35 18.55C15.2857 18.4211 15.154 18.3397 15.01 18.3397C14.866 18.3397 14.7343 18.4211 14.67 18.55C14.45 18.93 13.96 19.62 13.62 19.66C12.95 19.74 11.57 19.66 10.48 19.66C10.48 19.66 10.66 18.66 10.25 18.3C9.84 17.94 9.42 17.52 9.11 17.24L8.27 16.28Z"
            fill="var(--color-cursor-fg)" stroke="var(--color-cursor-hand-stroke)" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"
          />
          <path d="M16.75 16.8259V13.3741C16.75 13.1675 16.5821 13 16.375 13C16.1679 13 16 13.1675 16 13.3741V16.8259C16 17.0325 16.1679 17.2 16.375 17.2C16.5821 17.2 16.75 17.0325 16.75 16.8259Z" fill="var(--color-cursor-hand-stroke)" />
          <path d="M14.77 16.8246L14.75 13.3711C14.7488 13.1649 14.5799 12.9988 14.3728 13C14.1657 13.0012 13.9988 13.1693 14 13.3754L14.02 16.8289C14.0212 17.035 14.1901 17.2012 14.3972 17.2C14.6043 17.1988 14.7712 17.0307 14.77 16.8246Z" fill="var(--color-cursor-hand-stroke)" />
          <path d="M12 13.379L12.02 16.8254C12.0212 17.0335 12.1901 17.2012 12.3972 17.2C12.6043 17.1988 12.7712 17.0291 12.77 16.821L12.75 13.3746C12.7488 13.1665 12.5799 12.9988 12.3728 13C12.1657 13.0012 11.9988 13.1709 12 13.379Z" fill="var(--color-cursor-hand-stroke)" />
        </svg>
      </div>
    </>
  );
}
