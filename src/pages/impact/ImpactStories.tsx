import Section from '../../components/shared/Section';
import ResponsiveContainer from '../../components/shared/ResponsiveContainer';
import Typography from '../../components/shared/Typography';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Through LSF's support, I learned my rights and successfully reclaimed my family's land. Now I help other women in my community do the same.",
    author: "Fatuma Hassan",
    role: "Land Rights Beneficiary",
    location: "Morogoro Region"
  },
  {
    quote: "The paralegal training changed my life. I've helped resolve over 200 cases in my community and became a voice for justice.",
    author: "James Mwalimu",
    role: "Community Paralegal",
    location: "Mwanza Region"
  },
  {
    quote: "LSF's evidence-based approach to legal empowerment has transformed how we think about access to justice in Tanzania.",
    author: "Dr. Sarah Kinyoki",
    role: "Development Partner",
    location: "Partner Organization"
  }
];

export const ImpactStories = () => {
  return (
    <Section variant="default" padding="xl">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <Typography variant="h2" className="mb-4">
            Stories of Change
          </Typography>
          <Typography variant="body" className="text-muted-foreground max-w-3xl mx-auto">
            Behind every statistic is a human story of transformation, empowerment, and justice.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card rounded-2xl border border-border p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary/20 mb-6">
                <Quote className="h-12 w-12" />
              </div>
              <Typography variant="body" className="text-muted-foreground mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </Typography>
              <div className="border-t border-border pt-6">
                <Typography variant="h4" className="mb-2">
                  {testimonial.author}
                </Typography>
                <Typography variant="bodySmall" className="text-primary mb-1">
                  {testimonial.role}
                </Typography>
                <Typography variant="bodySmall" className="text-muted-foreground">
                  {testimonial.location}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </Section>
  );
};