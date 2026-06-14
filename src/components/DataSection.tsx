'use client';

import { useRef, useEffect } from 'react';

const COLUMNS = [
  {
    label: 'WEB3',
    title: 'INITIA ECOSYSTEM',
    body: `Head of Design at 23Labs from August 2023 to January 2026. Defined the brand identity and product suite for a next-generation L1 blockchain ecosystem. Built visual identity, wallet, DEX, and cross-chain bridge from zero to mainnet, scaling design alongside $25M+ in funding. IBC Protocol. Cosmos SDK. EVM Compatible. Rollup architecture. Modular blockchain design. Validator onboarding. Node operators. Governance dashboards. Interoperability flows. Liquidity pools. NFT marketplace. InitiaScan block explorer. Cross-chain bridge. Wallet UX for retail and institutional users. Zero to mainnet in under eighteen months. L1 Blockchain. Brand Identity. Visual Identity. Design Systems. Component Library. Whitepapers. Design language at scale. Token economics visualization. Staking interface. Mission-critical product design where every interaction impacts capital and consequence.`,
  },
  {
    label: 'DEFI',
    title: 'ANCHOR PROTOCOL',
    body: `Senior Product Designer at Terraform Labs from March 2021 to January 2023. Owned product design for Anchor Protocol, Terra's flagship DeFi savings product growing to $16B+ TVL at peak. The Stripe for Savings — bringing stable high-yield returns to mainstream depositors. Making stablecoin yields as simple as a bank account. UST. LUNA. bLUNA. Stablecoin. Smart contracts. CDP. Collateral. Liquidation ratios. Yield optimization. Earn. Borrow. Deposit. Withdraw. Risk management. Protocol design. Retail investor onboarding. Institutional flows. Variable interest rate dynamics. Advanced wallet interactions. Gas optimization. Terra ecosystem. DeFi UX research. User testing with retail depositors. Reducing friction in decentralized finance. 19.5% APY. Collateralized debt positions.`,
  },
  {
    label: 'FINTECH & AEROSPACE',
    title: 'FOUNT + SATREC',
    body: `Led product design and branding for Fount, South Korea's leading AI-driven wealth management platform, acting as hybrid PM. Robo-advisor. Asset allocation. Risk profiling. Portfolio rebalancing. ETF selection. Pension management. KYC onboarding. Financial dashboard. Backtesting engine. Returns visualization. Market volatility. GEO-KOMPSAT-2A satellite ground station mission control UX at Satrec Initiative. Telemetry. Anomaly detection. Flight dynamics. Low Earth Orbit. Command uplink. Data downlink. Attitude control. Sensor fusion. Real-time monitoring. KA/X-Band communication. KOMPSAT. Space systems. Eclipse season planning. Orbit maneuver visualization. Mission-critical interface for aerospace engineers.`,
  },
  {
    label: 'CRAFT',
    title: 'DESIGN PRACTICE',
    body: `Product designer with fifteen years of experience transforming complex technology into premium digital products. Architecting intuitive interfaces for Web3 blockchains, aerospace ground stations, and AI-driven fintech — where every interaction impacts capital and consequence. Visual Identity. Design Systems. Motion Design. Interaction Design. User Research. Prototyping. Design Sprint. Figma. Framer. After Effects. Next.js. TypeScript. Tailwind CSS. Design Tokens. A/B Testing. Usability Testing. Wireframing. Information Architecture. Typography. Color Theory. Grid Systems. Accessibility. WCAG. Brand Voice. Storytelling. Emotional design. Systems thinking. Gestalt principles. Visual hierarchy. Contrast. Affordance. Feedback loops. Mental models. Conversion. Retention. Growth. Complexity. Consequence. Capital. Clarity. Precision. Seoul. Singapore. Zero to one.`,
  },
];

// Column visual config — varied widths + vertical offsets for non-grid feel
const COL_CONFIG = [
  { flex: '0 0 28%',  marginTop: 0   },
  { flex: '0 0 22%',  marginTop: 64  },
  { flex: '0 0 26%',  marginTop: 24  },
  { flex: '0 0 22%',  marginTop: 96  },
];

// Break body text into chunks with random indent levels
function buildChunks(text: string): { text: string; indent: number }[] {
  const sentences = text.split('. ');
  const chunks: { text: string; indent: number }[] = [];
  const indents = [0, 0, 12, 0, 24, 0, 8, 0, 16, 0];
  sentences.forEach((s, i) => {
    chunks.push({ text: s + (i < sentences.length - 1 ? '. ' : ''), indent: indents[i % indents.length] });
  });
  return chunks;
}

const REPULSION_RADIUS = 110;
const REPULSION_STRENGTH = 85;
const LERP = 0.09;
const AUTO_AMP_X = 3.5;
const AUTO_AMP_Y = 2.5;

export default function DataSection() {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const positionsRef = useRef<{ cx: number; cy: number }[]>([]);
  const offsetsRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const totalCharsRef = useRef(0);

  // Count total chars for ref array sizing
  const colChunks = COLUMNS.map(col => ({
    label: col.label,
    title: col.title,
    chunks: buildChunks(col.body),
  }));

  // Compute total char count for offsetsRef init
  useEffect(() => {
    const total = charRefs.current.length;
    totalCharsRef.current = total;
    offsetsRef.current = Array.from({ length: total }, () => ({ x: 0, y: 0 }));

    const readPositions = () => {
      positionsRef.current = charRefs.current.map(el => {
        if (!el) return { cx: 0, cy: 0 };
        const r = el.getBoundingClientRect();
        return {
          cx: r.left + r.width / 2 + window.scrollX,
          cy: r.top + r.height / 2 + window.scrollY,
        };
      });
    };
    const id = setTimeout(readPositions, 200);
    window.addEventListener('resize', readPositions);
    return () => { clearTimeout(id); window.removeEventListener('resize', readPositions); };
  }, []);

  useEffect(() => {
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      const { x: mx, y: my } = mouseRef.current;
      const buf = REPULSION_RADIUS + 50;

      charRefs.current.forEach((el, i) => {
        if (!el) return;
        const pos = positionsRef.current[i];
        const off = offsetsRef.current[i];
        if (!pos || !off) return;

        // Autonomous DNA oscillation — unique phase per character
        const phase = i * 0.13;
        const autoX = Math.sin(t * 0.55 + phase) * AUTO_AMP_X;
        const autoY = Math.cos(t * 0.42 + phase * 0.9) * AUTO_AMP_Y;

        const vx = pos.cx - window.scrollX;
        const vy = pos.cy - window.scrollY;

        let repX = 0, repY = 0;
        const adx = Math.abs(vx - mx);
        const ady = Math.abs(vy - my);
        if (adx < buf || ady < buf) {
          const dx = vx - mx;
          const dy = vy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPULSION_RADIUS && dist > 1) {
            const force = ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) ** 2 * REPULSION_STRENGTH;
            repX = (dx / dist) * force;
            repY = (dy / dist) * force;
          }
        }

        const targetX = autoX + repX;
        const targetY = autoY + repY;

        off.x += (targetX - off.x) * LERP;
        off.y += (targetY - off.y) * LERP;
        el.style.transform = `translate(${off.x.toFixed(2)}px,${off.y.toFixed(2)}px)`;
      });
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  let globalIdx = 0;

  return (
    <section
      className="bg-black"
      style={{
        paddingTop: '120px',
        paddingBottom: '160px',
        paddingLeft: 'var(--page-gutter)',
        paddingRight: 'var(--page-gutter)',
        overflow: 'hidden',
      }}
      onMouseMove={e => { mouseRef.current = { x: e.clientX, y: e.clientY }; }}
      onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
    >
      <div style={{ display: 'flex', gap: 'clamp(16px, 2.5vw, 40px)', alignItems: 'flex-start', userSelect: 'none' }}>
        {colChunks.map((col, ci) => {
          const cfg = COL_CONFIG[ci];

          // Render helpers — inline to capture globalIdx closure correctly
          const labelChars = col.label.split('');
          const titleChars = col.title.split('');

          const renderChars = (chars: string[], style: React.CSSProperties) =>
            chars.map((ch, i) => {
              const idx = globalIdx++;
              return (
                <span
                  key={idx}
                  ref={el => { charRefs.current[idx] = el; }}
                  style={{ display: 'inline-block', willChange: 'transform', ...style }}
                >{ch}</span>
              );
            });

          return (
            <div key={ci} style={{ flex: cfg.flex, minWidth: 0, marginTop: cfg.marginTop }}>

              {/* Label */}
              <div style={{
                fontFamily: 'var(--font-google-sans-flex), sans-serif',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.25)',
                marginBottom: 14,
              }}>
                {renderChars(labelChars, {})}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'var(--font-google-sans-flex), sans-serif',
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.03em',
                marginBottom: 18,
              }}>
                {renderChars(titleChars, {})}
              </div>

              {/* Body — chunk by chunk with random indent */}
              <div style={{
                fontFamily: 'var(--font-google-sans-flex), sans-serif',
                fontSize: 11,
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.38)',
              }}>
                {col.chunks.map((chunk, ki) => {
                  const chunkChars = chunk.text.split('');
                  return (
                    <span
                      key={ki}
                      style={{ display: 'inline', paddingLeft: chunk.indent }}
                    >
                      {renderChars(chunkChars, {})}
                    </span>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
