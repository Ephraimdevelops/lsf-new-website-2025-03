
import { Link } from 'react-router-dom';
import { CheckCircle, Scale, Users, Heart, ArrowRight, Sparkles } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const FuturisticCallToAction = () => (
  <section className="py-20 relative overflow-hidden">
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
      <div className="text-center max-w-4xl mx-auto space-y-10">
        <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3">
          <CheckCircle className="h-5 w-5 mr-3 text-primary" />
          <Typography variant="overline" className="text-primary font-bold">
            GET INVOLVED
          </Typography>
        </div>

        <Typography variant="h1" className="font-heading text-4xl lg:text-5xl">
          Join the Movement for
          <span className="block text-primary">Justice in Tanzania</span>
        </Typography>

        <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg leading-relaxed">
          Be part of creating lasting change across Tanzania. Whether you need legal assistance, want to support our mission, or partner with us, there's a place for you in our community.
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
          <Link to="/contact">
            <div className="group">
              <div className="bg-gradient-to-br from-secondary-orange to-secondary-orange/80 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <Typography variant="h4" className="text-white mb-3 font-heading">
                  Get Legal Help
                </Typography>
                <Typography variant="bodySmall" className="text-white/90">
                  Access free legal assistance and guidance
                </Typography>
              </div>
            </div>
          </Link>

          <Link to="/about">
            <div className="group">
              <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal/80 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <Typography variant="h4" className="text-white mb-3 font-heading">
                  Learn About Us
                </Typography>
                <Typography variant="bodySmall" className="text-white/90">
                  Discover our story and mission
                </Typography>
              </div>
            </div>
          </Link>

          <Link to="/contact">
            <div className="group">
              <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <Typography variant="h4" className="text-white mb-3 font-heading">
                  Partner With Us
                </Typography>
                <Typography variant="bodySmall" className="text-white/90">
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

export default FuturisticCallToAction;
