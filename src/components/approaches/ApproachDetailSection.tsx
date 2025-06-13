
import { ArrowRight, CheckCircle, Users } from 'lucide-react';
import Container from '../shared/Container';
import Typography from '../shared/Typography';
import { Button } from '../ui/button';
import AnimatedCounter from '../shared/AnimatedCounter';

interface ApproachDetailSectionProps {
  approach: {
    id: string;
    icon: React.ReactNode;
    title: string;
    fullDescription: string;
    stats: { value: string; label: string }[];
    process: { step: string; description: string }[];
    testimonial: { quote: string; author: string; role: string };
    highlights: { title: string; description: string; image: string }[];
    color: string;
  };
  index: number;
}

const ApproachDetailSection = ({ approach, index }: ApproachDetailSectionProps) => {
  return (
    <section className={`py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-light'}`}>
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Content */}
          <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <div className="text-primary mr-3">
                {approach.icon}
              </div>
              <Typography variant="overline" className="text-primary font-bold">
                APPROACH {String(index + 1).padStart(2, '0')}
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-6 text-4xl font-bold">
              {approach.title}
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray mb-8 text-lg leading-relaxed">
              {approach.fullDescription}
            </Typography>

            {/* Process Flow */}
            <div className="mb-8">
              <Typography variant="h3" className="mb-6 text-primary">
                Our Process
              </Typography>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {approach.process.map((step, stepIndex) => (
                  <div key={stepIndex} className="text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${approach.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-white font-bold">{stepIndex + 1}</span>
                    </div>
                    <Typography variant="h4" className="mb-2 text-sm">
                      {step.step}
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray text-xs">
                      {step.description}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-primary/5 rounded-2xl p-6 mb-8">
              <Typography variant="body" className="text-primary mb-4 italic text-lg">
                "{approach.testimonial.quote}"
              </Typography>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold">{approach.testimonial.author}</div>
                  <div className="text-neutral-gray text-sm">{approach.testimonial.role}</div>
                </div>
              </div>
            </div>

            <Button size="lg" className={`bg-gradient-to-r ${approach.color} text-white hover:scale-105 transition-transform`}>
              Learn More About This Approach
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats & Highlights */}
          <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
            {/* Impact Stats */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-3xl p-8 mb-8">
              <Typography variant="h3" className="mb-6 text-center">
                Impact Metrics
              </Typography>
              <div className="space-y-6">
                {approach.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="flex items-center justify-between">
                    <span className="text-neutral-gray">{stat.label}</span>
                    <span className="text-2xl font-bold text-primary">
                      <AnimatedCounter 
                        end={parseInt(stat.value.replace(/\D/g, '')) || 0} 
                        suffix={stat.value.replace(/\d/g, '')} 
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Highlights */}
            <div className="space-y-4">
              <Typography variant="h3" className="mb-6">
                Key Initiatives
              </Typography>
              {approach.highlights.map((highlight, hIndex) => (
                <div key={hIndex} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${approach.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <Typography variant="h4" className="mb-2">
                        {highlight.title}
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray">
                        {highlight.description}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ApproachDetailSection;
