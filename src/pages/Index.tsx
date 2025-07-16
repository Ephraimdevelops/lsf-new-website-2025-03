import Layout from '@/components/layout/Layout';
import SlidingHero from '@/components/home/hero/SlidingHero';
import FeaturedNewsSection from '@/components/home/FeaturedNewsSection';
import AboutUsHighlight from '@/components/home/AboutUsHighlight';
import PublicationsShowcase from '@/components/home/PublicationsShowcase';
import TestimonialSection from '@/components/home/TestimonialSection';
import OrganizationHighlights from '@/components/home/OrganizationHighlights';
import PartnersSection from '@/components/home/PartnersSection';
import CallToActionBanner from '@/components/home/CallToActionBanner';
import HakiYanguHighlight from '@/components/home/HakiYanguHighlight';
import ImpactMetricsSection from '@/components/home/ImpactMetricsSection';
import InteractiveStorySection from '@/components/home/InteractiveStorySection';
import CombinedApproachSection from '@/components/home/CombinedApproachSection';
import ParallaxNewsSection from '@/components/home/ParallaxNewsSection';

const Index = () => (
  <Layout>
    {/* Hero Section with Sliding Carousel */}
    <SlidingHero />
    

    {/* Featured News & Updates */}
    <ParallaxNewsSection />
    <InteractiveStorySection />
    
    
     {/* About Us Highlight */}
    <AboutUsHighlight />
    <CombinedApproachSection />
    <ImpactMetricsSection /> 

    {/* Organization Highlights & Impact */}
    <OrganizationHighlights />

    {/* Publications Showcase */}
    <PublicationsShowcase />

    {/* Testimonials */}
    <TestimonialSection />
    <ImpactMetricsSection />   

    {/* Haki Yangu Highlight */}
    <HakiYanguHighlight />

    {/* Partners Network */}
    <PartnersSection />

    {/* Call to Action */}
    <CallToActionBanner />
  </Layout>
);

export default Index;