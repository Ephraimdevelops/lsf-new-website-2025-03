import Layout from '@/components/layout/Layout';
import SlidingHero from '@/components/home/hero/SlidingHero';
import AboutUsHighlight from '@/components/home/AboutUsHighlight';
import HakiYanguHighlight from '@/components/home/HakiYanguHighlight';
import ImpactMetricsSection from '@/components/home/ImpactMetricsSection';
import InteractiveStorySection from '@/components/home/InteractiveStorySection';
import ParallaxNewsSection from '@/components/home/ParallaxNewsSection';
import PartnersCarousel from '@/components/home/PartnersCarousel';

const Index = () => (
  <Layout>
    {/* Hero Section with Sliding Carousel */}
    <SlidingHero />
    
  {/* About Us Highlight */}
  <AboutUsHighlight />
  <InteractiveStorySection />
    {/* Featured News & Updates */}
    <ParallaxNewsSection />
    <ImpactMetricsSection /> 
  

    {/* Haki Yangu Highlight */}
    <HakiYanguHighlight />
    <PartnersCarousel />
  

  </Layout>
);

export default Index;