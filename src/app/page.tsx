import { getCaseStudies } from '@/lib/markdown';
import Navbar from '@/components/main/Navbar';
import HeroSection from '@/components/main/HeroSection';
import BioSection from '@/components/main/BioSection';
import ProjectsSection from '@/components/main/ProjectsSection';
import FooterSection from '@/components/main/FooterSection';

export const revalidate = 60;

const PROJECT_META: Record<string, { subtitle: string; thumbnail: string; date: string; href?: string }> = {
  'initia-ecosystem':         { subtitle: '0→1 Brand & Full Product Suite Design',    thumbnail: '/assets/initia/initia_glass169_2.mp4',  date: '2026' },
  'anchor':                   { subtitle: 'DeFi Savings Protocol UX to $16B+ TVL',    thumbnail: '/assets/anchor/anchor_thumbnail.jpg', date: '2023', href: '/case-studies/anchor' },
  'fount-robo-advisor':       { subtitle: "Designing trust for South Korea's leading robo-advisor — from zero to 1.5 trillion KRW in AUM",   thumbnail: '/assets/fount/fount_01.jpg', date: '2021', href: '/case-studies/fount' },
  'satrec-satellite-control': { subtitle: 'GEO-KOMPSAT Mission Ground Control UX',    thumbnail: '',                  date: '2018' },
  'virtuswap':                { subtitle: 'DeFi Exchange Visual Identity',             thumbnail: '/assets/virtuswap/main_task_sumbnail_virtuswap.jpg', date: '2022' },
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
