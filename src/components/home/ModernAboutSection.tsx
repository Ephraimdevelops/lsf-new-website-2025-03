import { useState, useEffect } from 'react';
import { ArrowRight, Users, Target, Globe, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const ModernAboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });


  const impactStats = [
    { 
      icon: Users, 
      value: '426K+', 
      label: 'Lives Transformed',
      description: 'Individuals who received direct legal support',
      trend: '+12% this year'
    },
    { 
      icon: Target, 
      value: '31', 
      label: 'Regions Covered',
      description: 'Districts across Tanzania with active programs',
      trend: '100% coverage'
    },
    { 
      icon: Globe, 
      value: '4K+', 
      label: 'Paralegal Network',
      description: 'Community champions trained and deployed',
      trend: '+500 new this year'
    },
    { 
      icon: Award, 
      value: '15+', 
      label: 'Years of Impact',
      description: 'Sustained commitment to legal empowerment',
      trend: 'Since 2009'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-orange/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-14">
            {/* Content */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-8">
                <div>
                   {/* Section Header */}
                <div className="text-left mb-10">
                 <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-2 mb-6 border border-primary/20">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                   <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                   Our Story
                   </Typography>
                </div>
            
            <Typography 
              variant="h2" 
              className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-left"
            >
              Empowering Communities Through-
              <span className="bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                Accessible Justice
              </span>
                </Typography>
                 </div>
                  <Typography variant="body" className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Since 2009, we've been Tanzania's leading force in making justice accessible to all. 
                 Through innovative technology, community partnerships, and sustainable programs, 
                 we're building a future where legal rights are within everyone's reach.
                 </Typography>
                 <Typography variant="body" className="text-lg text-muted-foreground leading-relaxed mb-6">
                   Our work spans from training community paralegals in remote villages to developing 
                    digital platforms that connect people with legal services. We believe that justice 
                    is not a privilege—it's a fundamental right that should be accessible to every 
                    Tanzanian, regardless of their location, income, or background.
                  </Typography>
                  <Typography variant="body" className="text-lg text-muted-foreground leading-relaxed">
                    Through our comprehensive approach combining technology, education, and community 
                    empowerment, we've created sustainable pathways to justice that transform lives 
                    and strengthen communities across Tanzania.
                  </Typography>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="group">
                    <Link to="/about">
                      Learn Our Story
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/what-we-do">
                      Explore Our Work
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <div className="aspect-[4/3]  overflow-hidden">
                  <img 
                    src="/lovable-uploads/Untitled design-5.png" 
                    alt="Haki Yangu App Interface" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ModernAboutSection;
