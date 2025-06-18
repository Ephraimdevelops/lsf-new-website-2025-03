
import Layout from '@/components/layout/Layout';
import AlternativeHero from '@/components/home/AlternativeHero';
import EnhancedHighlights from '@/components/home/EnhancedHighlights';
import CompactNewsUpdates from '@/components/home/CompactNewsUpdates';
import PartnersCarousel from '@/components/home/PartnersCarousel';
import FocusAreas from '@/components/home/FocusAreas';
import VisualImpactSection from '@/components/home/VisualImpactSection';
import CallToActionSectionWrapper from './home/CallToActionSectionWrapper';
import FAQSection from '@/components/shared/FAQSection';

const AlternativeIndex = () => {
  const faqs = [
    {
      question: "How can I access legal aid services?",
      answer: "You can access our legal aid services through our mobile clinics, community outreach programs, or by contacting our offices directly. We also have a digital platform that connects you with paralegals and legal resources."
    },
    {
      question: "What types of legal issues do you help with?",
      answer: "We provide assistance with land rights, women's rights, access to justice, legal education, and community empowerment. Our services cover both legal advice and advocacy for systemic change."
    },
    {
      question: "Is your legal aid service free?",
      answer: "Yes, our legal aid services are provided free of charge to communities across Tanzania. We believe that access to justice should not be limited by financial constraints."
    },
    {
      question: "How do you reach remote communities?",
      answer: "We use mobile legal clinics, community workshops, digital platforms, and local partnerships to reach even the most remote areas of Tanzania. Our approach ensures no community is left behind."
    }
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <AlternativeHero />

      {/* Enhanced Highlights */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white via-blue-50/30 to-neutral-50 relative overflow-hidden">
        <EnhancedHighlights />
      </section>

      {/* Visual Impact Stories */}
      <VisualImpactSection />

      {/* Enhanced News and Documents Section */}
      <CompactNewsUpdates />

      {/* Our Focus Areas Section */}
      <FocusAreas />

      {/* Partners and Donors Carousel */}
      <PartnersCarousel />

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Get answers to common questions about our legal aid services and how we can help your community access justice."
        faqs={faqs}
        variant="secondary"
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Call to Action Section */}
      <CallToActionSectionWrapper />
    </Layout>
  );
};

export default AlternativeIndex;
