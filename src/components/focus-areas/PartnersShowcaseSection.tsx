
import Container from '../shared/Container';
import Typography from '../shared/Typography';

interface Partner {
  name: string;
  role: string;
  image: string;
  quote: string;
}

interface PartnersShowcaseSectionProps {
  title: string;
  subtitle: string;
  description: string;
  partners: Partner[];
  backgroundImage: string;
}

const PartnersShowcaseSection = ({ 
  title, 
  subtitle, 
  description, 
  partners, 
  backgroundImage 
}: PartnersShowcaseSectionProps) => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      ></div>
      
      {/* Colored Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-teal/90 via-primary/85 to-primary-dark/90"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16 text-white">
          <Typography variant="overline" className="text-secondary-orange mb-4 uppercase tracking-wider font-bold">
            {subtitle}
          </Typography>
          <Typography variant="h1" className="mb-8 text-4xl md:text-5xl font-bold">
            {title}
          </Typography>
          <Typography variant="body" className="text-xl leading-relaxed max-w-3xl mx-auto text-white/90">
            {description}
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full bg-cover bg-center border-3 border-secondary-orange mr-4"
                  style={{ backgroundImage: `url('${partner.image}')` }}
                ></div>
                <div>
                  <Typography variant="h4" className="text-white font-bold">
                    {partner.name}
                  </Typography>
                  <Typography variant="body" className="text-secondary-orange text-sm">
                    {partner.role}
                  </Typography>
                </div>
              </div>
              <Typography variant="body" className="text-white/90 italic leading-relaxed">
                "{partner.quote}"
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PartnersShowcaseSection;
