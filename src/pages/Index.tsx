import Layout from '@/components/layout/Layout';
import SlidingHero from '@/components/home/hero/SlidingHero';
import FeaturedNewsSection from '@/components/home/FeaturedNewsSection';
import AboutUsHighlight from '@/components/home/AboutUsHighlight';
import PublicationsShowcase from '@/components/home/PublicationsShowcase';
import TestimonialSection from '@/components/home/TestimonialSection';
import OrganizationHighlights from '@/components/home/OrganizationHighlights';
import PartnersSection from '@/components/home/PartnersSection';
import CallToActionBanner from '@/components/home/CallToActionBanner';

const Index = () => (
  <Layout>
    {/* Hero Section with Sliding Carousel */}
    <SlidingHero />

    {/* Featured News & Updates */}
    <FeaturedNewsSection />

    {/* About Us Highlight */}
    <AboutUsHighlight />

    {/* Organization Highlights & Impact */}
    <OrganizationHighlights />

    {/* Publications Showcase */}
    <PublicationsShowcase />

    {/* Testimonials */}
    <TestimonialSection />

    {/* Partners Network */}
    <PartnersSection />

    {/* Call to Action */}
    <CallToActionBanner />
  </Layout>
);

export default Index;