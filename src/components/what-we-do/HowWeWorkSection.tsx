
import Heading from '@/components/design-system/Heading';
import Text from '@/components/design-system/Text';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

const HowWeWorkSection = () => {
  return (
    <Section variant="default" padding="lg">
      <Container size="xl">
        <div className="text-center mb-16">
          <Heading level={2} variant="section" className="mb-6">
            How We Work
          </Heading>
          <Text variant="body" color="neutral" className="max-w-2xl mx-auto">
            Our approach combines grassroots engagement with strategic advocacy to create sustainable change
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <Heading level={3} variant="subsection" className="mb-4">
              Community Engagement
            </Heading>
            <Text variant="body" color="muted">
              We start by listening to communities, understanding their legal challenges and building trust through direct engagement.
            </Text>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-secondary-teal">2</span>
            </div>
            <Heading level={3} variant="subsection" className="mb-4">
              Capacity Building
            </Heading>
            <Text variant="body" color="muted">
              We train community paralegals and provide legal education to empower communities with knowledge and skills.
            </Text>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-secondary-orange">3</span>
            </div>
            <Heading level={3} variant="subsection" className="mb-4">
              Systemic Change
            </Heading>
            <Text variant="body" color="muted">
              We advocate for policy reforms and work with institutions to create lasting improvements in the justice system.
            </Text>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default HowWeWorkSection;
