import { useState } from 'react';
import { Users, Globe, Award, TrendingUp, Clock, Star } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const HakiYanguStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const stats = [
    { 
      icon: Users, 
      value: '50K+', 
      label: 'Active Users',
      description: 'Tanzanians actively using the app',
      trend: '+15% this month'
    },
    { 
      icon: Globe, 
      value: '31', 
      label: 'Regions Covered',
      description: 'Complete national coverage',
      trend: '100% of Tanzania'
    },
    { 
      icon: Award, 
      value: '15K+', 
      label: 'Cases Resolved',
      description: 'Legal matters successfully addressed',
      trend: '+2K this quarter'
    },
    { 
      icon: Clock, 
      value: '< 2hrs', 
      label: 'Average Response',
      description: 'Time to connect with legal experts',
      trend: '24/7 availability'
    },
    { 
      icon: Star, 
      value: '4.8★', 
      label: 'User Rating',
      description: 'Based on 10K+ reviews',
      trend: 'Excellent satisfaction'
    },
    { 
      icon: TrendingUp, 
      value: '95%', 
      label: 'Success Rate',
      description: 'Of users who get legal help',
      trend: 'Consistently high'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 relative overflow-hidden"
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
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Trusted by Thousands
              <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                Across Tanzania
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Real numbers that demonstrate our impact and commitment to making legal services 
              accessible to every Tanzanian, regardless of location or background.
            </Typography>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 h-full">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary-orange rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <Typography variant="display" className="text-primary text-4xl font-bold mb-2">
                    {stat.value}
                  </Typography>
                  <Typography variant="h4" className="text-xl font-bold mb-2">
                    {stat.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-muted-foreground mb-4">
                    {stat.description}
                  </Typography>
                  <div className="inline-flex items-center gap-2 bg-secondary-teal/10 text-secondary-teal px-3 py-1 rounded-full text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    {stat.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HakiYanguStats;
