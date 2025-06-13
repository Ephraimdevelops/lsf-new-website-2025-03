
import Container from '../shared/Container';
import Typography from '../shared/Typography';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

interface ImpactStorySectionProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  stats?: { value: string; label: string }[];
}

const ImpactStorySection = ({ 
  title, 
  subtitle, 
  description, 
  backgroundImage, 
  ctaText,
  stats 
}: ImpactStorySectionProps) => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <Typography variant="overline" className="text-secondary-orange mb-4 uppercase tracking-wider font-bold">
              {subtitle}
            </Typography>
            <Typography variant="h1" className="mb-6 text-4xl md:text-5xl font-bold leading-tight">
              {title}
            </Typography>
            <Typography variant="body" className="mb-8 text-xl leading-relaxed text-white/90">
              {description}
            </Typography>
            <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white">
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {stats && (
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <Typography variant="h1" className="text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </Typography>
                  <Typography variant="body" className="text-white/80 text-sm uppercase tracking-wide">
                    {stat.label}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default ImpactStorySection;
