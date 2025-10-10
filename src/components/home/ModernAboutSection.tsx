import { useState, useEffect } from 'react';
import { ArrowRight, Users, Target, Globe, Award, Heart, Shield, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const ModernAboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const coreValues = [
    {
      icon: Heart,
      title: 'Community-Centered',
      description: 'We put communities at the heart of everything we do, ensuring their voices shape our approach to legal empowerment.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Justice for All',
      description: 'We believe that access to justice is a fundamental right, not a privilege reserved for the few.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Driven',
      description: 'We leverage technology and creative solutions to break down barriers and make legal services accessible.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: TrendingUp,
      title: 'Sustainable Impact',
      description: 'We build lasting change through capacity building and empowering local champions in every community.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

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
      className="py-24 md:py-32 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-orange/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Our Story
              </Typography>
            </div>
            
            <Typography 
              variant="h2" 
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Empowering Communities Through
              <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                Accessible Justice
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Since 2009, we've been Tanzania's leading force in making justice accessible to all. 
              Through innovative technology, community partnerships, and sustainable programs, 
              we're building a future where legal rights are within everyone's reach.
            </Typography>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Content */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-8">
                <div>
                  <Typography variant="h3" className="mb-6 text-3xl font-bold">
                    Building Bridges Between Law and People
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
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="/lovable-uploads/Untitled design-5.png" 
                    alt="Haki Yangu App Interface" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary to-secondary-orange rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-secondary-teal to-secondary-green rounded-2xl flex items-center justify-center shadow-lg animate-float delay-500">
                  <Award className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <Typography variant="h3" className="mb-4 text-3xl font-bold">
                Our Core Values
              </Typography>
              <Typography variant="body" className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These principles guide every decision we make and every program we create.
              </Typography>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value, index) => (
                <div 
                  key={index}
                  className={`group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 h-full">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h4" className="mb-4 text-xl font-bold">
                      {value.title}
                    </Typography>
                    <Typography variant="body" className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 rounded-3xl p-12 border border-primary/10">
            <div className="text-center mb-12">
              <Typography variant="h3" className="mb-4 text-3xl font-bold">
                Measurable Impact
              </Typography>
              <Typography variant="body" className="text-lg text-muted-foreground">
                Real numbers that reflect our commitment to transparency and accountability.
              </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary-orange rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <Typography variant="display" className="text-primary text-4xl font-bold mb-2">
                    {stat.value}
                  </Typography>
                  <Typography variant="h4" className="text-xl font-bold mb-2">
                    {stat.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-muted-foreground mb-2">
                    {stat.description}
                  </Typography>
                  <div className="inline-flex items-center gap-2 bg-secondary-teal/10 text-secondary-teal px-3 py-1 rounded-full text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    {stat.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ModernAboutSection;
