import { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  ArrowRight, 
  Play, 
  Star,
  Users,
  Globe,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const HakiYanguHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const quickStats = [
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: Globe, value: '31', label: 'Regions Covered' },
    { icon: Star, value: '4.8★', label: 'User Rating' },
    { icon: Shield, value: '24/7', label: 'Support Available' }
  ];

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 relative overflow-hidden flex items-center"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-teal/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-orange/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 border border-primary/20">
                  <Smartphone className="h-6 w-6 text-primary animate-pulse" />
                  <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                    Haki Yangu App
                  </Typography>
                </div>

                {/* Main Heading */}
                <Typography 
                  variant="h1" 
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                >
                  Your Gateway to
                  <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                    Digital Justice
                  </span>
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body" 
                  className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
                >
                  A revolutionary mobile platform connecting Tanzanians to legal education, 
                  trained paralegals, and real-time justice support—anytime, anywhere. 
                  Experience the future of accessible legal services.
                </Typography>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary-orange rounded-2xl mb-4 shadow-lg">
                        <stat.icon className="h-8 w-8 text-white" />
                      </div>
                      <Typography variant="display" className="text-primary text-2xl font-bold mb-1">
                        {stat.value}
                      </Typography>
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        {stat.label}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                  >
                    <Download className="mr-3 h-6 w-6" />
                    Download Now
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-primary font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                  >
                    <Play className="mr-3 h-6 w-6" />
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="/lovable-uploads/haki yangu app uzinuzi.webp" 
                    alt="Haki Yangu App Interface" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary to-secondary-orange rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <Download className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-secondary-teal to-secondary-green rounded-2xl flex items-center justify-center shadow-lg animate-float delay-500">
                  <Star className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HakiYanguHero;
