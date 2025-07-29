import HomeHero from '@/components/home/HomeHero';
import CleanNewsSection from '@/components/home/CleanNewsSection';
import PublicationsSection from '@/components/home/PublicationsSection';
import OpportunitiesSection from '@/components/home/OpportunitiesSection';
import SuccessStoriesSection from '@/components/home/SuccessStoriesSection';

export default function Home() {
  return (
    <main>
      <HomeHero />
      <CleanNewsSection />
      <PublicationsSection />
      <OpportunitiesSection />
      <SuccessStoriesSection />
    </main>
  );
}
