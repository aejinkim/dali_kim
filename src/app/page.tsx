import { getCaseStudies } from '@/lib/markdown';
import Navbar from '@/components/main/Navbar';
import HeroSection from '@/components/main/HeroSection';
import BioSection from '@/components/main/BioSection';
import ProjectsSection from '@/components/main/ProjectsSection';
import FooterSection from '@/components/main/FooterSection';

export const revalidate = 60;

const PROJECT_META: Record<string, { subtitle: string; thumbnail: string; date: string }> = {
  'initia-ecosystem':         { subtitle: '0→1 Brand & Full Product Suite Design',    thumbnail: '/initia_glass169_2.mp4',  date: '2026' },
  'anchor-protocol':          { subtitle: 'DeFi Savings Protocol UX to $16B+ TVL',    thumbnail: '',                  date: '2023' },
  'fount-robo-advisor':       { subtitle: 'Robo-Advisor Wealth Management Platform',   thumbnail: '',                  date: '2021' },
  'satrec-satellite-control': { subtitle: 'GEO-KOMPSAT Mission Ground Control UX',    thumbnail: '',                  date: '2018' },
};

export default async function HomePage() {
  const caseStudies = await getCaseStudies();

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
