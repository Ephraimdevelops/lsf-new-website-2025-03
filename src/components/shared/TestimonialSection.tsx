
import { Quote, Star } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  organization?: string;
  image?: string;
  rating?: number;
}

interface TestimonialSectionProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  variant?: 'default' | 'secondary' | 'primary';
}

const TestimonialSection = ({ 
  title, 
  subtitle, 
  testimonials, 
  variant = 'secondary' 
}: TestimonialSectionProps) => {
  return (
    <Section variant={variant} padding="xl">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="overline" className="text-primary font-bold mb-4">
            TESTIMONIALS
          </Typography>
          <Typography variant="h2" className="mb-6">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              {subtitle}
            </Typography>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="elevated" hover className="relative">
              <div className="absolute top-4 left-4 text-primary/20">
                <Quote className="h-8 w-8" />
              </div>
              
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < testimonial.rating! 
                          ? 'text-secondary-yellow fill-current' 
                          : 'text-neutral-200'
                      }`} 
                    />
                  ))}
                </div>
              )}
              
              <Typography variant="body" className="text-neutral-gray mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </Typography>
              
              <div className="flex items-center">
                {testimonial.image && (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                )}
                <div>
                  <Typography variant="h4" className="mb-1">
                    {testimonial.author}
                  </Typography>
                  <Typography variant="bodySmall" className="text-primary">
                    {testimonial.role}
                  </Typography>
                  {testimonial.organization && (
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      {testimonial.organization}
                    </Typography>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default TestimonialSection;
