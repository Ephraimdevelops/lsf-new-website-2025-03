
import { Handshake, ArrowRight, Download } from 'lucide-react';
import Container from './Container';
import Typography from './Typography';
import { Button } from '../ui/button';

interface CallToActionSectionProps {
  title: string;
  subtitle: string;
  description: string;
  primaryButton: {
    text: string;
    icon?: React.ReactNode;
  };
  secondaryButton?: {
    text: string;
    icon?: React.ReactNode;
  };
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
}

const CallToActionSection = ({ 
  title, 
  subtitle, 
  description, 
  primaryButton, 
  secondaryButton,
  badge 
}: CallToActionSectionProps) => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
      <Container size="xl">
        <div className="text-center">
          {badge && (
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
              {badge.icon && <div className="h-6 w-6 mr-4 text-secondary-orange">{badge.icon}</div>}
              <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
                {badge.text}
              </Typography>
            </div>
          )}
          
          <Typography variant="h1" className="mb-8 text-white text-5xl font-bold">
            {title}
          </Typography>
          
          <Typography variant="body" className="text-white/90 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
            {description}
          </Typography>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white text-lg px-8 py-4">
              {primaryButton.text}
              {primaryButton.icon && <div className="ml-3 h-6 w-6">{primaryButton.icon}</div>}
            </Button>
            
            {secondaryButton && (
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
                {secondaryButton.icon && <div className="mr-3 h-6 w-6">{secondaryButton.icon}</div>}
                {secondaryButton.text}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CallToActionSection;
