
import { Section, Container, Heading, Text } from '../design-system';
import NewsSection from './news/NewsSection';
import PublicationsSection from './news/PublicationsSection';

const CompactNewsUpdates = () => {
  return (
    <Section variant="default" size="xl" className="relative overflow-hidden py-20 md:py-24">
      {/* Minimal background elements - very subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 right-36 w-80 h-80 bg-primary/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-28 w-96 h-96 bg-secondary-teal/2 rounded-full blur-3xl"></div>
      </div>

      <Container size="xl" className="relative z-10">
        {/* Clean, editorial header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-neutral-100/50">
            <Text variant="overline" className="text-neutral-600 tracking-wider font-medium text-sm">
              NEWSROOM
            </Text>
          </div>
          <Heading variant="section" className="mb-6 font-heading text-4xl md:text-5xl lg:text-6xl">
            Latest Stories & Publications
          </Heading>
          <Text variant="body-large" color="neutral" className="max-w-4xl mx-auto leading-relaxed text-lg">
            Read real stories from the field, updates from our partners, and new reports that shape justice across Tanzania.
          </Text>
        </div>

        {/* Editorial-style layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <NewsSection />
          <PublicationsSection />
        </div>
      </Container>
    </Section>
  );
};

export default CompactNewsUpdates;
