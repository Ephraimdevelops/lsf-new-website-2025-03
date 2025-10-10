import { useState } from 'react';
import {
  Smartphone,
  Users,
  Globe,
  Apple,
  Download,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Heart,
  Star,
  Play
} from "lucide-react";
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const ModernHakiYanguSection = () => {
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
    }
  ];

  const appStats = [
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '31', label: 'Regions Covered', icon: Globe },
    { value: '24/7', label: 'Support Available', icon: Shield },
    { value: '4.8★', label: 'User Rating', icon: Star }
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-orange/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
              <Smartphone className="h-6 w-6 text-primary animate-pulse" />
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Haki Yangu App
              </Typography>
            </div>
            
            <Typography 
              variant="h2" 
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Your Gateway to
              <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                Digital Justice
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              A revolutionary mobile platform connecting Tanzanians to legal education, trained paralegals, 
              and real-time justice support—anytime, anywhere. Experience the future of accessible legal services.
            </Typography>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Content */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-8">
                <div>
                  <Typography variant="h3" className="mb-6 text-3xl font-bold">
                    Justice at Your Fingertips
                  </Typography>
                  <Typography variant="body" className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Haki Yangu (My Rights) is more than just an app—it's a movement towards democratizing access to legal services. 
                    Built with the needs of ordinary Tanzanians in mind, our platform breaks down barriers and brings legal 
                    empowerment directly to your smartphone.
                  </Typography>
                  <Typography variant="body" className="text-lg text-muted-foreground leading-relaxed">
                    Whether you're in a bustling city or a remote village, Haki Yangu ensures that legal knowledge, 
                    support, and services are always within reach. Join thousands of Tanzanians who are already 
                    transforming their communities through accessible justice.
                  </Typography>
                </div>

                {/* App Stats */}
                <div className="grid grid-cols-2 gap-6">
                  {appStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary-orange rounded-2xl mb-4 shadow-lg">
                        <stat.icon className="h-8 w-8 text-white" />
                      </div>
                      <Typography variant="display" className="text-primary text-3xl font-bold mb-1">
                        {stat.value}
                      </Typography>
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        {stat.label}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                  >
                    <Download className="mr-3 h-6 w-6" />
                    Download for Android
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-primary font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                  >
                    <Apple className="mr-3 h-6 w-6" />
                    Download for iPhone
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
                    alt="Haki Yangu App Screenshots" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary to-secondary-orange rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-secondary-teal to-secondary-green rounded-2xl flex items-center justify-center shadow-lg animate-float delay-500">
                  <Star className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <Typography variant="h3" className="mb-4 text-3xl font-bold">
                Powerful Features
              </Typography>
              <Typography variant="body" className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to access legal services, connect with experts, and protect your rights.
              </Typography>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
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
          </div>

          {/* Demo Section */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 rounded-3xl p-12 border border-primary/10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Typography variant="h3" className="mb-6 text-3xl font-bold">
                  See Haki Yangu in Action
                </Typography>
                <Typography variant="body" className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Watch how Haki Yangu is transforming lives across Tanzania. From connecting communities 
                  with legal experts to providing instant access to legal information, see the power of 
                  digital justice in action.
                </Typography>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary-orange hover:opacity-90 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Watch Demo
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary-orange">
                    <Play className="h-20 w-20 text-white opacity-80" />
                  </div>
                </div>
                {/* Video Thumbnail Overlay */}
                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ModernHakiYanguSection;
