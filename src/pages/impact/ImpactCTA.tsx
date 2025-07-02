import { Link } from 'react-router-dom';
import Section from '../../components/shared/Section';
import ResponsiveContainer from '../../components/shared/ResponsiveContainer';
import Typography from '../../components/shared/Typography';
import { Button } from '../../components/ui/button';
import { ArrowRight } from 'lucide-react';

export const ImpactCTA = () => {
  return (
    <Section variant="primary" padding="xl">
      <ResponsiveContainer>
        <div className="text-center">
          <Typography variant="h2" className="text-primary-foreground mb-6">
            Help us reach more people with justice that works
          </Typography>
          <Typography variant="body" className="text-primary-foreground/90 mb-12 max-w-3xl mx-auto text-xl">
            Join us in creating a Tanzania where everyone has access to justice, regardless of their background or circumstances.
          </Typography>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/publications">
              <Button size="lg" variant="secondary-orange" className="text-white">
                View Full Report
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Partner With Us
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </ResponsiveContainer>
    </Section>
  );
};