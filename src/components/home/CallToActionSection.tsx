
import { Link } from 'react-router-dom';
import { CheckCircle, Scale, Users, Heart } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const CallToActionSection = () => (
  <section className="py-28 md:py-32 relative overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/lovable-uploads/backgound lsf colours.png')" }}
    ></div>
    
    {/* Gradient Overlays */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/95 via-white/90 to-blue-50/95"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary-teal/5"></div>
    
    {/* Floating Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal/5 rounded-full blur-3xl"></div>
    </div>

    <Container size="xl" className="relative z-10">
      <div className="text-center max-w-5xl mx-auto space-y-12">
        <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4">
          <CheckCircle className="h-6 w-6 mr-4 text-primary" />
          <Typography variant="overline" className="text-primary font-bold text-lg">
            GET INVOLVED
          </Typography>
        </div>

        <Typography variant="display" className="font-heading text-6xl lg:text-7xl">
          Join the Movement for
          <span className="block text-primary">Justice in Tanzania</span>
        </Typography>

        <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-2xl leading-relaxed">
          Be part of creating lasting change across Tanzania. Whether you need legal assistance, want to support our mission, or partner with us, there's a place for you in our community.
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto pt-10">
          <Link to="/contact">
            <div className="group">
              <div className="bg-gradient-to-br from-secondary-orange to-secondary-orange/80 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-3">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <Typography variant="h4" className="text-white mb-4 font-heading text-xl">
                  Get Legal Help
                </Typography>
                <Typography variant="bodySmall" className="text-white/90 text-lg">
                  Access free legal assistance and guidance
                </Typography>
              </div>
            </div>
          </Link>

          <Link to="/about">
            <div className="group">
              <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal/80 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-3">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <Typography variant="h4" className="text-white mb-4 font-heading text-xl">
                  Learn About Us
                </Typography>
                <Typography variant="bodySmall" className="text-white/90 text-lg">
                  Discover our story and mission
                </Typography>
              </div>
            </div>
          </Link>

          <Link to="/contact">
            <div className="group">
              <div className="bg-gradient-to-br from-primary to-primary-dark p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-3">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <Typography variant="h4" className="text-white mb-4 font-heading text-xl">
                  Partner With Us
                </Typography>
                <Typography variant="bodySmall" className="text-white/90 text-lg">
                  Join our network of change-makers
                </Typography>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Container>
  </section>
);

export default CallToActionSection;
