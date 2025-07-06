import Layout from '@/components/layout/Layout';
import InstitutionalHero from '@/components/home/institutional/InstitutionalHero';
import ImpactCardsGrid from '@/components/home/institutional/ImpactCardsGrid';
import TestimonialSection from '@/components/home/institutional/TestimonialSection';
import PartnersSection from '@/components/home/institutional/PartnersSection';
import CallToActionBanner from '@/components/home/institutional/CallToActionBanner';

const InstitutionalIndex = () => (
  <Layout>
    {/* UN-style Hero with Apple UX principles */}
    <InstitutionalHero />

    {/* Apple-style Impact Cards */}
    <ImpactCardsGrid />

    {/* Testimonials with clean design */}
    <TestimonialSection />

    {/* Partners showcase */}
    <PartnersSection />

    {/* Professional Call to Action */}
    <CallToActionBanner />
  </Layout>
);

export default InstitutionalIndex;