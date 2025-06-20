
import Layout from '@/components/layout/Layout';
import HighlightsSection from '@/components/home/HighlightsSection';
import CompactNewsUpdates from '@/components/home/CompactNewsUpdates';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import FocusAreas from '@/components/home/FocusAreas';
import EnhancedHighlights from '@/components/home/EnhancedHighlights';

import ImpactMetricsSectionWrapper from './home/ImpactMetricsSectionWrapper';
import CallToActionSectionWrapper from './home/CallToActionSectionWrapper';

const Index = () => (
  <Layout>
    {/* Highlights */}
    <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
      <HighlightsSection />
    </section>
    {/* Enhanced Highlights */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white via-blue-50/30 to-neutral-50 relative overflow-hidden">
        <EnhancedHighlights />
      </section>

    {/* Enhanced News and Documents Section */}
    <CompactNewsUpdates />

    {/* Impact Metrics Section */}
    <ImpactMetricsSectionWrapper />

    {/* Our Focus Areas Section */}
    <FocusAreas />

    {/* Partners and Donors Carousel */}
    <PartnersCarousel />

    {/* Call to Action Section */}
    <CallToActionSectionWrapper />
  </Layout>
);

export default Index;
