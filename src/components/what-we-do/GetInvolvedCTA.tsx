
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DesignButton from '@/components/design-system/DesignButton';
import Heading from '@/components/design-system/Heading';
import Text from '@/components/design-system/Text';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

const GetInvolvedCTA = () => {
  return (
    <Section variant="gradient" padding="lg">
      <Container size="xl">
        <div className="max-w-2xl mx-auto text-center text-white">
          <Heading level={2} variant="section" color="white" className="mb-6">
            Get Involved
          </Heading>
          <Text variant="body-large" color="white" className="mb-8">
            Join us in advancing access to justice across Tanzania. Together, we can ensure that everyone has equal protection under the law.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/legal-help">
              <DesignButton variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Get Legal Help
              </DesignButton>
            </Link>
            <Link to="/opportunities">
              <DesignButton variant="secondary" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                Join Our Team
              </DesignButton>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default GetInvolvedCTA;
