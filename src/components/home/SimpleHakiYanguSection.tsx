import { useState } from 'react';
import { Smartphone, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const SimpleHakiYanguSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
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
                  <Smartphone className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 border border-primary/20">
                  <Smartphone className="h-6 w-6 text-primary animate-pulse" />
                  <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                    Haki Yangu App
                  </Typography>
                </div>

                {/* Heading */}
                <Typography 
                  variant="h2" 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                >
                  Your Gateway to
                  <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                    Digital Justice
                  </span>
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body" 
                  className="text-xl text-muted-foreground leading-relaxed"
                >
                  A revolutionary mobile platform connecting Tanzanians to legal education, 
                  trained paralegals, and real-time justice support—anytime, anywhere.
                </Typography>

                {/* Highlights */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <Typography variant="body" className="text-muted-foreground">
                      Connect with trained paralegals in your area
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <Typography variant="body" className="text-muted-foreground">
                      Access legal education and resources offline
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <Typography variant="body" className="text-muted-foreground">
                      Available in all 31 regions of Tanzania
                    </Typography>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="group">
                    <Link to="/haki-yangu">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="group">
                    <Download className="mr-2 h-5 w-5" />
                    Download App
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SimpleHakiYanguSection;
