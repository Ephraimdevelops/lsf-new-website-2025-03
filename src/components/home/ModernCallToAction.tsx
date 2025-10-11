import { useState } from 'react';
import { ArrowRight, Phone, Mail, MapPin, Download, Users, Shield, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const ModernCallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const actionCards = [
    {
      icon: Phone,
      title: 'Get Legal Help',
      description: 'Connect with our legal aid services and community paralegals',
      action: 'Call Now',
      link: 'tel:+255870119363',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      icon: Download,
      title: 'Download Haki Yangu',
      description: 'Access legal services through our mobile app',
      action: 'Download App',
      link: '/legal-help',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: Users,
      title: 'Join Our Network',
      description: 'Become a community paralegal or partner organization',
      action: 'Join Network',
      link: '/programs',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      icon: Shield,
      title: 'Support Our Mission',
      description: 'Help us expand access to justice across Tanzania',
      action: 'Donate Now',
      link: '/donate',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: 'Call Us',
      value: '+255 870 119 363',
      link: 'tel:+255870119363'
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: 'info@lsf.or.tz',
      link: 'mailto:info@lsf.or.tz'
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: 'Dar es Salaam, Tanzania',
      link: '/contact'
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-5 md:py-5 mb-5 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-orange/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
              <Lightbulb className="h-6 w-6 text-primary animate-pulse" />
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Take Action
              </Typography>
            </div>
            
            <Typography 
              variant="h2" 
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Ready to Make a
              <span className="block bg-gradient-to-r from-primary to-secondary-orange bg-clip-text text-transparent">
                Difference?
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Join thousands of Tanzanians who are already transforming their communities through access to justice. 
              Whether you need legal help, want to volunteer, or support our mission, there's a way for you to get involved.
            </Typography>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 py-10">
            {actionCards.map((card, index) => (
              <div 
                key={index}
                className={`group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <card.icon className="h-8 w-8 text-white" />
                  </div>

                  <Typography variant="h4" className="mb-4 text-xl font-bold">
                    {card.title}
                  </Typography>

                  <Typography variant="body" className="text-muted-foreground mb-6 leading-relaxed">
                    {card.description}
                  </Typography>

                  <Button 
                    className={`w-full bg-gradient-to-r ${card.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 group`}
                    onClick={() => window.location.href = card.link}
                  >
                    {card.action}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ModernCallToAction;
