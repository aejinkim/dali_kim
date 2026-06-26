import { getCaseStudies } from '@/lib/markdown';
import Navbar from '@/components/main/Navbar';
import HeroSection from '@/components/main/HeroSection';
import BioSection from '@/components/main/BioSection';
import ProjectsSection from '@/components/main/ProjectsSection';
import FooterSection from '@/components/main/FooterSection';

export const revalidate = 60;

const PROJECT_META: Record<string, { subtitle: string; thumbnail: string; date: string; href?: string; objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' }> = {
  'initia-ecosystem':         { subtitle: 'Designing a Living Ecosystem — Brand Identity & Visual Language', thumbnail: '/assets/initia/initia_glass169_2.mp4',  date: '2026', href: '/case-studies/initia-ecosystem' },
  'initia-app':               { subtitle: 'Initia App 1.0 — Designing Without Data',                        thumbnail: '/assets/initia/initia_01.png', date: '2024', href: '/case-studies/initia-app' },
  'initia-app-v2':            { subtitle: 'Initia App 2.0 — Redesigning for the Users Who Stayed',          thumbnail: '/assets/initia/initia_06.png', date: '2026', href: '/case-studies/initia-app-v2' },
  'anchor':                   { subtitle: 'DeFi Savings Protocol UX to $16B+ TVL',    thumbnail: '/assets/anchor/anchor_01.jpg', date: '2023', href: '/case-studies/anchor' },
  'fount-robo-advisor':       { subtitle: "Designing trust for South Korea's leading robo-advisor — from zero to 1.5 trillion KRW in AUM",   thumbnail: '/assets/fount/fount_01.jpg', date: '2021', href: '/case-studies/fount' },
  'satrec-satellite-control': { subtitle: 'GEO-KOMPSAT Mission Ground Control UX',    thumbnail: '',                  date: '2018' },
  'virtuswap':                { subtitle: 'DeFi Exchange Visual Identity',             thumbnail: '/assets/virtuswap/main_task_sumbnail_virtuswap.jpg', date: '2022' },
  'satreci-ci-renewal':       { subtitle: 'Corporate Identity Redesign for a Satellite Technology Company', thumbnail: '', date: '2014', href: '/case-studies/satreci' },
};

const VISIBLE_SLUGS = ['initia-ecosystem', 'initia-app', 'initia-app-v2', 'anchor', 'fount-robo-advisor', 'virtuswap', 'satreci-ci-renewal'];

export default async function HomePage() {
  const allStudies = await getCaseStudies();
  const caseStudies = VISIBLE_SLUGS
    .map(slug => allStudies.find(s => s.slug === slug))
    .filter(Boolean) as Awaited<ReturnType<typeof getCaseStudies>>;

  return (
    <>
      <Navbar />
      <HeroSection />
      <BioSection />
      <ProjectsSection studies={caseStudies} metadata={PROJECT_META} />
      <FooterSection />
    </>
  );
}
