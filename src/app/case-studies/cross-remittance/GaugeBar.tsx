'use client';

import { useEffect, useRef, useState } from 'react';
import { CS } from '../_shared/tokens';

const CROSS_BLUE = '#272aff';
const FILL_TRANSITION = 'left 1.1s cubic-bezier(0.16, 1, 0.3, 1), width 1.1s cubic-bezier(0.16, 1, 0.3, 1)';

export function GaugeBar({ value }: { value: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const revealIfVisible = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) setVisible(true);
    };

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    revealIfVisible();
    const raf = requestAnimationFrame(revealIfVisible);
    window.addEventListener('pageshow', revealIfVisible);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pageshow', revealIfVisible);
      obs.disconnect();
    };
  }, []);

  const fill = visible ? value : 0;

  return (
    <div ref={trackRef} style={{ paddingTop: 13 }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: `${fill}%`,
          top: -13,
          width: 0,
          height: 0,
          transform: 'translateX(-50%)',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `6px solid ${CS.color.dim}`,
          transition: FILL_TRANSITION,
        }} />
        <div style={{ height: 12, borderRadius: 100, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${fill}%`, backgroundColor: CROSS_BLUE, transition: FILL_TRANSITION }} />
          <div style={{ flex: 1, backgroundColor: '#ededff' }} />
        </div>
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `calc(${fill}% - 1px)`,
          width: 2,
          backgroundColor: CS.color.white,
          transition: FILL_TRANSITION,
        }} />
      </div>
    </div>
  );
}
