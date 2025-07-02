import { ArrowRight, Users, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const PartnerWithUs = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
      {/* Modern background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(89,181,176,0.1)_0%,transparent_50%)]"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <Heart className="h-5 w-5 mr-3 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold tracking-wider text-sm">
              JOIN OUR MISSION
            </Typography>
          </div>
          <Typography variant="h2" className="mb-8 text-4xl md:text-5xl font-bold text-white">
            Partner With Us
          </Typography>
          <Typography variant="body" className="text-white/90 mb-12 max-w-4xl mx-auto text-lg leading-relaxed">
            Whether you're a local NGO, international donor, or rights-based movement — your collaboration can change lives. Let's scale justice together.
          </Typography>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                <Users className="mr-3 h-6 w-6" />
                Partner With Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300">
                <Mail className="mr-3 h-6 w-6" />
                Contact Our Programs Team
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PartnerWithUs;