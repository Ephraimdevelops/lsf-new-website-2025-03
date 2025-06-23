
import Layout from '@/components/layout/Layout';
import CinematicHero from '@/components/home/CinematicHero';
import FloatingImpactCards from '@/components/home/FloatingImpactCards';
import InteractiveStorySection from '@/components/home/InteractiveStorySection';
import ImmersiveApproachSection from '@/components/home/ImmersiveApproachSection';
import AnimatedPartnersSection from '@/components/home/AnimatedPartnersSection';
import FuturisticCallToAction from '@/components/home/FuturisticCallToAction';
import ParallaxNewsSection from '@/components/home/ParallaxNewsSection';

const Index = () => (
  <Layout>
    {/* Cinematic Hero with Parallax Effects */}
    <CinematicHero />

    {/* Floating Impact Cards with 3D Effects */}
    <FloatingImpactCards />

    {/* Interactive Story Timeline */}
    <InteractiveStorySection />

    {/* Immersive Approach Section with Hover Effects */}
    <ImmersiveApproachSection />

    {/* Parallax News & Updates */}
    <ParallaxNewsSection />

    {/* Animated Partners Showcase */}
    <AnimatedPartnersSection />

    {/* Futuristic Call to Action */}
    <FuturisticCallToAction />
  </Layout>
);

export default Index;
