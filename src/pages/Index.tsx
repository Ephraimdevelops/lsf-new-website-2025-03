
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FloatingImpactCards from '@/components/home/FloatingImpactCards';
import InteractiveStorySection from '@/components/home/InteractiveStorySection';
import ImmersiveApproachSection from '@/components/home/ImmersiveApproachSection';
import AnimatedPartnersSection from '@/components/home/AnimatedPartnersSection';
import FuturisticCallToAction from '@/components/home/FuturisticCallToAction';
import ParallaxNewsSection from '@/components/home/ParallaxNewsSection';

const Index = () => (
  <Layout>
    {/* Simplified Hero with Content Carousel */}
    <Hero />

    {/* Floating Impact Cards */}
    <FloatingImpactCards />

    {/* Simplified Heroes of Justice Section */}
    <InteractiveStorySection />

    {/* Strategic Approaches Section */}
    <ImmersiveApproachSection />

    {/* Parallax News & Updates */}
    <ParallaxNewsSection />

    {/* Animated Partners Showcase */}
    <AnimatedPartnersSection />

    {/* Call to Action */}
    <FuturisticCallToAction />
  </Layout>
);

export default Index;
