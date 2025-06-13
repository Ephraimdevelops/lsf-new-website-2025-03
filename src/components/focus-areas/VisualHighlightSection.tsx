
import Container from '../shared/Container';
import Typography from '../shared/Typography';
import Card from '../shared/Card';
import { Button } from '../ui/button';

interface HighlightCard {
  title: string;
  description: string;
  backgroundImage: string;
  buttonText: string;
}

interface VisualHighlightSectionProps {
  title: string;
  subtitle: string;
  highlights: HighlightCard[];
}

const VisualHighlightSection = ({ title, subtitle, highlights }: VisualHighlightSectionProps) => {
  return (
    <section className="py-24 bg-neutral-light">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="overline" className="text-primary mb-4 uppercase tracking-wider font-bold">
            {subtitle}
          </Typography>
          <Typography variant="h1" className="mb-8 text-4xl md:text-5xl font-bold">
            {title}
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Background Image */}
              <div 
                className="h-96 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${highlight.backgroundImage}')` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Typography variant="h3" className="mb-3 text-2xl font-bold">
                    {highlight.title}
                  </Typography>
                  <Typography variant="body" className="mb-4 text-white/90 leading-relaxed">
                    {highlight.description}
                  </Typography>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-black transition-colors"
                  >
                    {highlight.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default VisualHighlightSection;
