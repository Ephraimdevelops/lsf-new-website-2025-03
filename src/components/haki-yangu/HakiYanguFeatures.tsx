import { useState } from 'react';
import {
  Smartphone,
  Users,
  Globe,
  Shield,
  Zap,
  Heart,
  BookOpen,
  MessageCircle,
  Clock,
  MapPin,
  FileText,
  Video
} from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const HakiYanguFeatures = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for smartphones with offline capabilities, ensuring access even in remote areas with limited connectivity.",
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Users,
      title: "Connect with Paralegals",
      description: "Instantly link with trained community paralegals for personalized legal guidance and support in your area.",
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Globe,
      title: "National Coverage",
      description: "Operates across all 31 regions with thousands of active users and local networks throughout Tanzania.",
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your legal information is protected with end-to-end encryption and strict privacy controls.",
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Zap,
      title: "Real-Time Support",
      description: "Get instant legal advice through our 24/7 chat system with qualified legal professionals.",
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Built by and for Tanzanians, with features that reflect the real needs of our communities.",
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: BookOpen,
      title: "Legal Education",
      description: "Access comprehensive legal guides, videos, and interactive tutorials in Swahili and English.",
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Connect with legal experts through secure messaging for immediate assistance and guidance.",
      color: 'from-teal-500 to-cyan-600'
    },
    {
      icon: MapPin,
      title: "Find Legal Services",
      description: "Locate nearby legal aid clinics, courts, and legal service providers in your area.",
      color: 'from-emerald-500 to-green-600'
    }
  ];

  const additionalFeatures = [
    {
      icon: FileText,
      title: "Document Templates",
      description: "Access ready-to-use legal document templates for common legal needs."
    },
    {
      icon: Video,
      title: "Video Consultations",
      description: "Schedule video calls with legal professionals for detailed consultations."
    },
    {
      icon: Clock,
      title: "Case Tracking",
      description: "Monitor the progress of your legal cases and receive status updates."
    }
  ];

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
          {/* Section Header */}
          <div className="text-center mb-20">
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Powerful Features for
              <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                Every Legal Need
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              From connecting with legal experts to accessing educational resources, 
              Haki Yangu provides everything you need to navigate the legal system with confidence.
            </Typography>
          </div>

          {/* Main Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <Typography variant="h4" className="mb-4 text-xl font-bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body" className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 rounded-3xl p-12 border border-primary/10">
            <div className="text-center mb-12">
              <Typography variant="h3" className="mb-4 text-3xl font-bold">
                Additional Tools & Resources
              </Typography>
              <Typography variant="body" className="text-lg text-muted-foreground">
                More ways to access legal support and manage your legal matters.
              </Typography>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="text-center group transition-all duration-700"
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary-orange rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <Typography variant="h4" className="text-xl font-bold mb-4">
                    {feature.title}
                  </Typography>
                  <Typography variant="body" className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HakiYanguFeatures;
