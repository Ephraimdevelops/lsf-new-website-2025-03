
import Layout from '@/components/layout/Layout';
import HighlightsSection from '@/components/home/HighlightsSection';
import CompactNewsUpdates from '@/components/home/CompactNewsUpdates';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import CombinedApproachSection from '@/components/home/CombinedApproachSection';
import About from '@/components/home/About';
import SuccessStories from '@/components/home/SuccessStories';
import ImpactMetricsSectionWrapper from './home/ImpactMetricsSectionWrapper';
import CallToActionSectionWrapper from './home/CallToActionSectionWrapper';

const Index = () => (
  <Layout>
    {/* Hero Section - Clean, minimal with consistent spacing */}
    <section className="relative overflow-hidden">
      <HighlightsSection />
    </section>

    {/* About Us Section - Consistent padding */}
    <section className="py-16 md:py-20">
      <About />
    </section>

    {/* Combined Strategic Focus & Approaches - Streamlined single section */}
    <section className="py-16 md:py-20 bg-gradient-to-br from-neutral-50 to-white">
      <CombinedApproachSection />
    </section>

    {/* Success Stories - New sliding section */}
    <section className="relative">
      <SuccessStories />
    </section>

    {/* Impact Metrics - Clean, consistent spacing */}
    <section className="py-16 md:py-20 bg-white">
      <ImpactMetricsSectionWrapper />
    </section>

    {/* Latest Stories & Publications - Editorial newsroom feed */}
    <section className="py-16 md:py-20 bg-neutral-50/50">
      <CompactNewsUpdates />
    </section>

    {/* Partners - Clean, consistent */}
    <section className="py-12 md:py-16 bg-white">
      <PartnersCarousel />
    </section>

    {/* Call to Action - Clean, editorial */}
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
      <CallToActionSectionWrapper />
    </section>
  </Layout>
);

export default Index;
