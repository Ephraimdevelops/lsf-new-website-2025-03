
import Layout from '../components/layout/Layout';
import { 
  Heart, Target, Users, Scale, ArrowRight, PlayCircle, 
  MapPin, TrendingUp, Award, CheckCircle, Globe
} from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const impactStats = [
    { number: "2.8M+", label: "Tanzanians Reached", color: "secondary-orange" },
    { number: "4,000+", label: "Trained Paralegals", color: "secondary-teal" },
    { number: "31", label: "Regions Covered", color: "secondary-yellow" },
    { number: "78%", label: "Cases Resolved", color: "white" }
  ];

  const features = [
    {
      icon: Scale,
      title: "Legal Empowerment",
      description: "Providing accessible legal aid and education to marginalized communities across Tanzania.",
      color: "primary"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Training paralegals and building legal networks in 184 communities nationwide.",
      color: "secondary-teal"
    },
    {
      icon: Heart,
      title: "Justice for All",
      description: "Advocating for policy reforms and systemic changes that protect vulnerable populations.",
      color: "secondary-orange"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center text-white max-w-6xl mx-auto">
            <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <Heart className="h-6 w-6 text-secondary-orange" />
              <span className="text-secondary-orange font-bold text-lg uppercase tracking-wider">
                Legal Services Facility
              </span>
            </div>
            
            <Typography variant="display" className="text-white mb-8 leading-none text-6xl md:text-8xl font-bold">
              Transforming Access to
              <span className="block text-secondary-orange">Justice in Tanzania.</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              For over two decades, we've empowered communities across Tanzania through legal education, advocacy, and innovative solutions that bring justice closer to those who need it most.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/what-we-do">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-5 text-lg rounded-full">
                  Discover Our Work
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/impact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-10 py-5 text-lg rounded-full">
                  <PlayCircle className="mr-3 h-6 w-6" />
                  See Our Impact
                </Button>
              </Link>
            </div>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-4xl md:text-5xl font-bold mb-2 text-${stat.color}`}>{stat.number}</div>
                  <div className="text-white/80 text-sm uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4 mb-8">
              <Target className="h-6 w-6 mr-4 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-lg">
                OUR FOCUS
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
              Empowering Communities
              <span className="block text-primary">Through Legal Access</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-xl leading-relaxed">
              We work tirelessly to ensure every Tanzanian has access to justice, legal education, and the support they need to live with dignity and security.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full group-hover:-translate-y-4">
                  <div className={`bg-gradient-to-br from-${feature.color} to-${feature.color}/80 p-8 relative`}>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h3" className="text-white mb-4 leading-tight">
                      {feature.title}
                    </Typography>
                  </div>

                  <div className="p-8">
                    <Typography variant="body" className="text-neutral-gray leading-relaxed text-lg">
                      {feature.description}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
        <Container size="xl">
          <div className="text-center max-w-4xl mx-auto">
            <Typography variant="h2" className="text-white mb-8 text-4xl md:text-5xl font-bold">
              Join the Movement for Justice
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-xl leading-relaxed">
              Be part of creating lasting change across Tanzania. Whether you need legal assistance, want to support our mission, or partner with us.
            </Typography>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4 w-full">
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold py-4 w-full">
                  Learn About Us
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="bg-secondary-teal hover:bg-secondary-teal/90 font-bold py-4 w-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Index;
