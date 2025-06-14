
import Layout from '@/components/layout/Layout';
import HighlightsSection from '@/components/home/HighlightsSection';
import CompactNewsUpdates from '@/components/home/CompactNewsUpdates';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import FocusAreas from '@/components/home/FocusAreas';

import ImpactMetricsSectionWrapper from './home/ImpactMetricsSectionWrapper';
import CallToActionSectionWrapper from './home/CallToActionSectionWrapper';
import CircularCalloutsSection from './home/CircularCalloutsSection';

const Index = () => (
  <Layout>
    {/* Highlights */}
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <HighlightsSection />
    </section>

    {/* Circular Callouts */}
    <CircularCalloutsSection />

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

