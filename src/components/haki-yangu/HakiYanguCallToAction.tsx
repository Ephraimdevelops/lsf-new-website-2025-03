import { useState } from 'react';
import { 
  Download, 
  ArrowRight, 
  Smartphone,
  Star,
  Users,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const HakiYanguCallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const finalStats = [
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: Globe, value: '31', label: 'Regions Covered' },
    { icon: Star, value: '4.8★', label: 'User Rating' }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-br from-primary via-secondary-teal to-secondary-orange relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/30">
              <Smartphone className="h-6 w-6 text-white animate-pulse" />
              <Typography variant="overline" className="text-white font-bold text-lg tracking-wider">
                Join the Movement
              </Typography>
            </div>

            {/* Main Heading */}
            <Typography 
              variant="h2" 
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
            >
              Ready to Access
              <span className="block text-white/90">
                Justice Anywhere?
              </span>
            </Typography>

            {/* Description */}
            <Typography 
              variant="body" 
              className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Download Haki Yangu today and join thousands of Tanzanians who are already 
              transforming their communities through accessible legal services. Your rights matter, 
              and we're here to help you protect them.
            </Typography>

            {/* Final Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              {finalStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 shadow-lg">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <Typography variant="display" className="text-white text-4xl font-bold mb-2">
                    {stat.value}
                  </Typography>
                  <Typography variant="h4" className="text-white/90 text-xl font-bold">
                    {stat.label}
                  </Typography>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 group"
              >
                <Download className="mr-3 h-6 w-6" />
                Download Haki Yangu
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              >
                Learn More
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Free to download and use</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Available in Swahili & English</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Works offline in remote areas</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HakiYanguCallToAction;
