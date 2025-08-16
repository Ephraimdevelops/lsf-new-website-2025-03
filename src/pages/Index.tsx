import Layout from '@/components/layout/Layout';
import EnhancedSlidingHero from '@/components/home/hero/EnhancedSlidingHero';
import AboutUsHighlight from '@/components/home/AboutUsHighlight';
import HakiYanguHighlight from '@/components/home/HakiYanguHighlight';
import ImpactMetricsSection from '@/components/home/ImpactMetricsSection';
import InteractiveStorySection from '@/components/home/InteractiveStorySection';
import EnhancedNewsSection from '@/components/home/EnhancedNewsSection';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import ParallaxNewsSection from '@/components/home/ParallaxNewsSection';
import NewsSection from '@/components/home/NewsSection';

const Index = () => (
  <Layout>
    {/* Enhanced Hero Section with Database Integration */}
    <EnhancedSlidingHero />

    {/* About Us Highlight */}
     <AboutUsHighlight />

     <InteractiveStorySection />

    <NewsSection />
    
    <ParallaxNewsSection />

    {/* Enhanced News & Publications Section */}
    <ImpactMetricsSection /> 
  

    {/* Haki Yangu Highlight */}
    <HakiYanguHighlight />
    <PartnersCarousel />
  

  </Layout>
);

export default Index;