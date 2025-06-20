
import Layout from '@/components/layout/Layout';
import HighlightsSection from '@/components/home/HighlightsSection';
import CompactNewsUpdates from '@/components/home/CompactNewsUpdates';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import FocusAreas from '@/components/home/FocusAreas';
import WhatWeDo from '@/components/home/WhatWeDo';
import ImpactMetricsSectionWrapper from './home/ImpactMetricsSectionWrapper';
import CallToActionSectionWrapper from './home/CallToActionSectionWrapper';

const Index = () => (
  <Layout>
    {/* Hero Section - Primary engagement point */}
    <section className="relative overflow-hidden">
      <HighlightsSection />
    </section>

    {/* Impact Metrics - Build credibility early */}
    <section className="bg-gradient-to-br from-neutral-50 via-white to-neutral-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,30,92,.08)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,.06)_0%,transparent_50%)]"></div>
      <ImpactMetricsSectionWrapper />
    </section>

    {/* Our Approach - Core methodology */}
    <section className="bg-white relative">
      <WhatWeDo />
    </section>

    {/* Focus Areas - Detailed work areas */}
    <section className="bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-teal/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <FocusAreas />
    </section>

    {/* News and Resources - Stay informed */}
    <section className="relative">
      <CompactNewsUpdates />
    </section>

    {/* Partners - Build trust through associations */}
    <section className="bg-white py-16 border-t border-neutral-100">
      <PartnersCarousel />
    </section>

    {/* Call to Action - Final engagement */}
    <section className="relative">
      <CallToActionSectionWrapper />
    </section>
  </Layout>
);

export default Index;
