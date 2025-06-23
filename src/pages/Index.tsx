
import Layout from '@/components/layout/Layout';
import HighlightsSection from '@/components/home/HighlightsSection';
import CompactNewsUpdates from '@/components/home/CompactNewsUpdates';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import FocusAreas from '@/components/home/FocusAreas';
import WhatWeDo from '@/components/home/WhatWeDo';
import About from '@/components/home/About';
import ImpactMetricsSectionWrapper from './home/ImpactMetricsSectionWrapper';
import CallToActionSectionWrapper from './home/CallToActionSectionWrapper';

const Index = () => (
  <Layout>
    {/* Hero Section - Clean, minimal with no borders */}
    <section className="relative overflow-hidden">
      <HighlightsSection />
    </section>

    {/* About Us Section - Soft, editorial style */}
    <About />

    {/* Latest Stories & Publications - Editorial newsroom feed */}
    <section className="relative bg-white">
      <CompactNewsUpdates />
    </section>

    {/* Impact Metrics - Clean, minimal background */}
    <section className="bg-neutral-50/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,30,92,.03)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,.02)_0%,transparent_50%)]"></div>
      <ImpactMetricsSectionWrapper />
    </section>

    {/* Focus Areas - Clean section divisions */}
    <section className="bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-teal/3 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <FocusAreas />
    </section>

    {/* Our Approach - Minimal, clean */}
    <section className="bg-neutral-50/20 relative">
      <WhatWeDo />
    </section>

    {/* Partners - Clean, borderless */}
    <section className="bg-white py-12">
      <PartnersCarousel />
    </section>

    {/* Call to Action - Clean, editorial */}
    <section className="relative">
      <CallToActionSectionWrapper />
    </section>
  </Layout>
);

export default Index;
