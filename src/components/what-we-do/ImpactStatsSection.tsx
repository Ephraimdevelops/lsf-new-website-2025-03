
import { Users, Globe, BookOpen, Scale } from 'lucide-react';
import Heading from '@/components/design-system/Heading';
import Text from '@/components/design-system/Text';
import DesignCard from '@/components/design-system/DesignCard';
import DesignIcon from '@/components/design-system/DesignIcon';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

const ImpactStatsSection = () => {
  const impactStats = [
    { number: '7 Million+', label: 'People Reached Annually', icon: Users },
    { number: '100,000+', label: 'Direct Legal Assistance', icon: Scale },
    { number: '168', label: 'Districts Covered', icon: Globe },
    { number: '6,825', label: 'GBV Cases Addressed', icon: BookOpen },
  ];

  return (
    <Section variant="secondary" padding="lg">
      <Container size="xl">
        <div className="text-center mb-12">
          <Heading level={2} variant="section" className="mb-4">
            Our Impact
          </Heading>
          <Text variant="body" color="neutral" className="max-w-2xl mx-auto">
            Measurable results in advancing access to justice across Tanzania
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => (
            <DesignCard key={index} variant="elevated" padding="lg" hover className="text-center">
              <DesignIcon
                icon={<stat.icon />}
                size="xl"
                color="primary"
                wrapper
                wrapperVariant="neutral"
                className="mx-auto mb-4"
              />
              <Heading level={3} variant="card" color="primary" className="mb-2">
                {stat.number}
              </Heading>
              <Text variant="body" color="neutral">
                {stat.label}
              </Text>
            </DesignCard>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ImpactStatsSection;
