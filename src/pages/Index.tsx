
import Layout from '@/components/layout/Layout';
import HighlightsSection from '@/components/home/HighlightsSection';
import CompactNewsUpdates from '@/components/home/CompactNewsUpdates';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import CombinedApproachSection from '@/components/home/CombinedApproachSection';
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

    {/* Combined Strategic Focus & Approaches - Integrated methodology */}
    <CombinedApproachSection />

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
