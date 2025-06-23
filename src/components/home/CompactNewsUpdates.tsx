
import { Section, Container, Heading, Text } from '../design-system';
import NewsSection from './news/NewsSection';
import PublicationsSection from './news/PublicationsSection';

const CompactNewsUpdates = () => {
  return (
    <Container size="xl">
      {/* Clean, consistent header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-white rounded-full px-6 py-3 mb-6 shadow-sm border border-neutral-100">
          <Text variant="overline" className="text-neutral-600 font-bold text-sm">
            NEWSROOM
          </Text>
        </div>
        <Heading variant="hero" className="mb-6 font-heading text-4xl md:text-5xl">
          Latest Stories & Publications
        </Heading>
        <Text variant="body-large" color="neutral" className="max-w-3xl mx-auto text-lg leading-relaxed">
          Read real stories from the field, updates from our partners, and new reports that shape justice across Tanzania.
        </Text>
      </div>

      {/* Editorial-style layout */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <NewsSection />
        <PublicationsSection />
      </div>
    </Container>
  );
};

export default CompactNewsUpdates;
