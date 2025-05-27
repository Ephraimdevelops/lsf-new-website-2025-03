
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

const GetInvolvedCTA = () => {
  return (
    <Section variant="gradient" padding="lg">
      <Container size="xl">
        <div className="max-w-2xl mx-auto text-center text-white">
          <Typography variant="h2" className="text-white mb-6">
            Get Involved
          </Typography>
          <Typography variant="body" className="text-white/90 mb-8 text-xl">
            Join us in advancing access to justice across Tanzania. Together, we can ensure that everyone has equal protection under the law.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/legal-help">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Get Legal Help
              </Button>
            </Link>
            <Link to="/opportunities">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90">
                Join Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default GetInvolvedCTA;
