
import { Users, Globe, BookOpen, Scale } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

const ImpactStatsSection = () => {
  const impactStats = [
    { number: '26,000+', label: 'People Assisted', icon: Users },
    { number: '184', label: 'Districts Covered', icon: Globe },
    { number: '500+', label: 'Paralegals Trained', icon: BookOpen },
    { number: '15', label: 'Years of Experience', icon: Scale }
  ];

  return (
    <Section variant="secondary" padding="lg">
      <Container size="xl">
        <div className="text-center mb-12">
          <Typography variant="h2" className="mb-4">
            Our Impact
          </Typography>
          <Typography variant="body" className="text-neutral-dark">
            Measurable results in advancing access to justice across Tanzania
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <Typography variant="display" className="text-primary mb-2 text-3xl">
                {stat.number}
              </Typography>
              <Typography variant="h4" className="text-neutral-dark">
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ImpactStatsSection;
