
import { TrendingUp } from 'lucide-react';
import { Section, Container, Heading, Text } from '../design-system';
import NewsSection from './news/NewsSection';
import PublicationsSection from './news/PublicationsSection';

const CompactNewsUpdates = () => {
  return (
    <Section variant="secondary" size="lg" className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 right-36 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-28 w-64 h-64 bg-secondary-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-secondary-orange/10 rounded-full blur-3xl"></div>
      </div>

      <Container size="xl" className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-secondary-orange/10 to-secondary-teal/10 backdrop-blur-md rounded-full px-8 py-4 mb-8">
            <TrendingUp className="h-6 w-6 mr-4 text-secondary-orange" />
            <Text variant="overline" className="text-secondary-orange tracking-widest font-bold">
              NEWS & RESEARCH
            </Text>
          </div>
          <Heading variant="section" className="mb-6 font-heading">
            Latest <span className="text-secondary-orange">Stories</span> &amp; <span className="text-secondary-teal">Publications</span>
          </Heading>
          <Text variant="body" color="neutral" className="max-w-4xl mx-auto leading-relaxed">
            Discover our most recent impact stories and cutting-edge research transforming Tanzania's justice landscape.
          </Text>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <NewsSection />
          <PublicationsSection />
        </div>
      </Container>
    </Section>
  );
};

export default CompactNewsUpdates;
