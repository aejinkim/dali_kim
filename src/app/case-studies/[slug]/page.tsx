import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/main/Navbar';
import { getCaseStudyBySlug, parseMarkdownToHtml } from '@/lib/markdown';
import { CS, TYPE } from '../_shared/tokens';
import { Divider, Pill } from '../_shared/components';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CASE_META: Record<string, {
  thumbnail: string;
  subtitle: string;
  year: string;
  role?: string;
  scope?: string;
  company?: string;
}> = {
  'initia-ecosystem': {
    thumbnail: '/Initiamian.webm',
    subtitle: 'Designing a Living Ecosystem',
    year: '2023 – 2026',
    role: 'Head of Design',
    scope: 'Brand Strategy\nVisual Identity\nDesign System',
    company: 'Initia',
  },
  'anchor': {
    thumbnail: '',
    subtitle: 'DeFi Savings Product Design',
    year: '2021 – 2023',
    role: 'Lead Product Designer',
    scope: 'UX Design\nResearch',
    company: 'Terraform Labs',
  },
  'fount-robo-advisor': {
    thumbnail: '/assets/shared/fount_thumbnail.png',
    subtitle: 'WealthTech Product Design',
    year: '2020 – 2021',
    role: 'Lead Product Designer\n(Head of Design)',
    scope: 'Product Design\nDesign System\nBranding',
    company: 'Fount Inc.',
  },
  'satrec-satellite-control': {
    thumbnail: '',
    subtitle: 'Satellite Control UX',
    year: '2017 – 2018',
    role: 'UX Designer',
    scope: 'UX Design\nResearch',
    company: 'SATREC Initiative',
  },
  'virtuswap': {
    thumbnail: '/assets/virtuswap/virtuswap_01.jpg',
    subtitle: 'DeFi Exchange Visual Identity',
    year: '2022',
    role: 'Brand Designer',
    scope: 'Brand Identity\nVisual Design\nLanding Page',
    company: 'Virtuswap',
  },
};

function PageHeader({ title, subtitle, tags, meta }: {
  title: string;
  subtitle: string;
  tags: string[];
  meta: { label: string; value: string }[];
}) {
  return (
    <header className="cs-page-header" style={{
      minHeight: 153,
      paddingTop: CS.space.headerTop,
      paddingBottom: CS.space.section,
    }}>
      <div className="cs-page-header-intro">
        <p style={TYPE.h3_32SemiBold}>{title}</p>
        <p style={TYPE.h3_20Regular}>{subtitle}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {tags.slice(0, 2).map(tag => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      </div>
      <div className="cs-page-header-meta">
        {meta.map(({ label, value }) => (
          <div key={label}>
            <p style={TYPE.pTitle_16Bold}>{label}</p>
            <p style={{ ...TYPE.p16, whiteSpace: 'pre-line' }}>{value}</p>
          </div>
        ))}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${CS.color.line}`,
      padding: 'clamp(40px, 6vh, 64px) var(--page-gutter)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: CS.space.xl,
    }}>
      <Link href="/" style={TYPE.footer}>← Dali Kim</Link>
      <a href="mailto:jiny0410@gmail.com" style={{
        ...TYPE.footer,
        color: CS.color.ink,
        padding: '10px 24px',
        border: '1px solid rgba(0,0,0,0.2)',
        borderRadius: 100,
      }}>Get in touch</a>
    </footer>
  );
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) notFound();

  const htmlContent = parseMarkdownToHtml(study.content);
  const caseMeta = CASE_META[slug] ?? { thumbnail: '', subtitle: '', year: study.date?.split('-')[0] ?? '' };
  const shortTitle = study.title.split(':')[0].trim();

  const metaItems = [
    caseMeta.role    && { label: 'Role',    value: caseMeta.role },
    caseMeta.scope   && { label: 'Scope',   value: caseMeta.scope },
    caseMeta.company && { label: 'Company', value: `${caseMeta.company}\n${caseMeta.year}` },
  ].filter(Boolean) as { label: string; value: string }[];

  const pillTags = study.tags.length > 0
    ? study.tags.slice(0, 2)
    : [caseMeta.year].filter(Boolean);

  return (
    <main style={{ backgroundColor: CS.color.white, color: CS.color.ink }}>
      <Navbar alwaysVisible tone="light" />
      <div
        className="content-width"
        style={{
          maxWidth: CS.size.frame,
          margin: '0 auto',
          overflow: 'hidden',
          padding: '0 var(--cs-page-inset)',
          boxSizing: 'border-box',
        }}
      >
        <PageHeader
          title={shortTitle}
          subtitle={caseMeta.subtitle}
          tags={pillTags}
          meta={metaItems}
        />

        {caseMeta.thumbnail && (
          <div style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
            {/\.(mp4|webm|mov)$/i.test(caseMeta.thumbnail) ? (
              <video
                src={caseMeta.thumbnail}
                autoPlay muted loop playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={caseMeta.thumbnail}
                alt={shortTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>
        )}

        <div style={{ paddingTop: CS.space.section }}>
          <Divider />
        </div>

        <article
          style={{ paddingTop: CS.space.section, paddingBottom: CS.space.section }}
          className="case-study-article"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <Footer />
      </div>
    </main>
  );
}
