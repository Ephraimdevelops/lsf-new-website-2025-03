import Layout from '../components/layout/Layout';
import Hero from '@/components/home/Hero';
import VisualImpactSection from '@/components/home/VisualImpactSection';
import HighlightsSection from '@/components/home/HighlightsSection';
import CompactNewsUpdates from '@/components/home/CompactNewsUpdates';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import FocusAreas from '@/components/home/FocusAreas';

import CircularCallouts from '@/components/home/CircularCallouts';
import ImpactMetricsSection from '@/components/home/ImpactMetricsSection';
import CallToActionSection from '@/components/home/CallToActionSection';

import ImpactMetricsSectionWrapper from './home/ImpactMetricsSectionWrapper';
import CallToActionSectionWrapper from './home/CallToActionSectionWrapper';
import CircularCalloutsSection from './home/CircularCalloutsSection';

const Index = () => (
  <Layout>
      {/* Highlights */}
      <HighlightsSection />
      {/* Circular Callouts */}
      <CircularCalloutsSection />
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
