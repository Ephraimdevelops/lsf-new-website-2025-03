import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Target, Globe, Award, Heart, Shield, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

interface MetricData {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: any;
  color: string;
  trend: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  category: 'financial' | 'impact' | 'reach' | 'sustainability';
}

const AppleStyleMetrics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedMetrics, setAnimatedMetrics] = useState<{[key: string]: number}>({});
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const metricsData: MetricData[] = [
    {
      id: 'financial',
      value: '$47M+',
      label: 'Disbursed as Grants',
      description: 'Financial support to legal aid organizations across Tanzania',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      trend: { value: '+12%', direction: 'up' },
      category: 'financial'
    },
    {
      id: 'groups',
      value: '105K+',
      label: 'Supported Groups',
      description: 'Community organizations receiving assistance and training',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      trend: { value: '+8%', direction: 'up' },
      category: 'impact'
    },
    {
      id: 'beneficiaries',
      value: '426K+',
      label: 'Legal Aid Beneficiaries',
      description: 'Individuals receiving direct legal support and representation',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      trend: { value: '+15%', direction: 'up' },
      category: 'impact'
    },
    {
      id: 'education',
      value: '39.8M+',
      label: 'Legal Education Beneficiaries',
      description: 'People reached through awareness programs and training',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-600',
      trend: { value: '+22%', direction: 'up' },
      category: 'reach'
    },
    {
      id: 'regions',
      value: '31',
      label: 'Regions Covered',
      description: 'Districts across Tanzania with active LSF programs',
      icon: Globe,
      color: 'from-teal-500 to-green-600',
      trend: { value: '100%', direction: 'neutral' },
      category: 'reach'
    },
    {
      id: 'years',
      value: '15+',
      label: 'Years of Impact',
      description: 'Sustained commitment to legal empowerment since 2009',
      icon: Award,
      color: 'from-purple-500 to-indigo-600',
      trend: { value: 'Consistent', direction: 'neutral' },
      category: 'sustainability'
    }
  ];

  // Animation effect for numbers
  useEffect(() => {
    if (isVisible) {
      metricsData.forEach((metric, index) => {
        setTimeout(() => {
          setAnimatedMetrics(prev => ({
            ...prev,
            [metric.id]: 1
          }));
        }, index * 200);
      });
    }
  }, [isVisible]);

  const getTrendIcon = (direction: string) => {
    return direction === 'up' ? '↗' : direction === 'down' ? '↘' : '→';
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-neutral-500';
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: "url('/lovable-uploads/background with mother umage .png')",
            filter: 'blur(1px)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-dark/90 to-black/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,.2)_2px,transparent_0)] bg-[length:30px_30px]"></div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/30">
              <TrendingUp className="h-6 w-6 text-secondary-orange animate-pulse" />
              <Typography variant="overline" className="text-secondary-orange font-bold text-lg tracking-wider">
                MEASURABLE IMPACT
              </Typography>
            </div>

            <Typography 
              variant="h2" 
              className="mb-8 text-white text-5xl md:text-6xl font-bold leading-tight"
            >
              Real Results.
              <span className="block text-secondary-orange">Lasting Change.</span>
            </Typography>

            <Typography 
              variant="body" 
              className="text-white/90 max-w-4xl mx-auto text-2xl leading-relaxed"
            >
              Our commitment to transparency and accountability drives us to measure and share the concrete impact of our work across Tanzania.
            </Typography>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {metricsData.map((metric, index) => (
              <div 
                key={metric.id}
                className={`group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-secondary-orange/50 transition-all duration-300 group-hover:-translate-y-2 hover:shadow-2xl h-full">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${metric.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <metric.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Trend Indicator */}
                  <div className="absolute top-6 right-6">
                    <div className={`flex items-center gap-1 ${getTrendColor(metric.trend.direction)}`}>
                      <span className="text-sm font-semibold">{getTrendIcon(metric.trend.direction)}</span>
                      <span className="text-xs font-medium">{metric.trend.value}</span>
                    </div>
                  </div>

                  {/* Metric Value */}
                  <div className="mb-4">
                    <Typography 
                      variant="display" 
                      className="text-white text-4xl md:text-5xl font-bold leading-none"
                    >
                      {metric.value}
                    </Typography>
                  </div>

                  {/* Label */}
                  <Typography 
                    variant="h4" 
                    className="text-white mb-4 font-bold text-xl leading-tight"
                  >
                    {metric.label}
                  </Typography>

                  {/* Description */}
                  <Typography 
                    variant="body" 
                    className="text-white/80 leading-relaxed"
                  >
                    {metric.description}
                  </Typography>

                  {/* Category Badge */}
                  <div className="mt-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      metric.category === 'financial' ? 'bg-green-500/20 text-green-300' :
                      metric.category === 'impact' ? 'bg-blue-500/20 text-blue-300' :
                      metric.category === 'reach' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-purple-500/20 text-purple-300'
                    }`}>
                      {metric.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Story - Redesigned */}
          <div className="relative mt-24">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary-orange/20 rounded-[3rem] blur-3xl opacity-30"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4)_0%,transparent_60%)]"></div>
              
              <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
                    <span className="w-2 h-2 rounded-full bg-secondary-orange animate-pulse"></span>
                    <span className="text-white/90 text-sm font-medium tracking-wide uppercase">Real Stories</span>
                  </div>
                  
                  <Typography variant="h3" className="text-white mb-6 text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                    The Power of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Collective Action</span>
                  </Typography>
                  
                  <div className="space-y-6 text-lg text-white/80 font-light leading-relaxed">
                    <p>
                      These numbers represent more than statistics—they represent real people whose lives have been transformed through access to justice. 
                    </p>
                    <p>
                      Every beneficiary is a story of hope, every region covered is a step toward nationwide equality, and every dollar invested creates ripple effects that strengthen entire communities.
                    </p>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-6 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10"
                    >
                      Read Impact Stories
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="order-1 lg:order-2 relative">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                    <img 
                      src="/lovable-uploads/Untitled design-5.png" 
                      alt="LSF Impact Visualization" 
                      className="w-full aspect-[4/3] object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Integrated Stats Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-between items-end">
                      <div>
                        <div className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">Total Reach</div>
                        <div className="text-white text-3xl font-bold">426K+</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">Coverage</div>
                        <div className="text-white text-3xl font-bold">31 Regions</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary-orange/30 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/30 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AppleStyleMetrics;
