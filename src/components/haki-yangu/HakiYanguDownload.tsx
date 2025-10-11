import { useState } from 'react';
import { 
  Download, 
  ArrowRight, 
  Apple, 
  Smartphone,
  Shield,
  Clock,
  Globe,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const HakiYanguDownload = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const downloadFeatures = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your data is encrypted and protected with enterprise-grade security."
    },
    {
      icon: Clock,
      title: "Always Available",
      description: "Access legal help 24/7, even offline in remote areas."
    },
    {
      icon: Globe,
      title: "Works Everywhere",
      description: "Available in all regions of Tanzania with local language support."
    },
    {
      icon: CheckCircle,
      title: "Free to Use",
      description: "No hidden costs, no subscriptions - justice should be accessible to all."
    }
  ];

  const appStoreLinks = [
    {
      name: "Google Play Store",
      icon: <Smartphone className="h-8 w-8" />,
      description: "Download for Android",
      color: "from-green-600 to-green-700",
      hoverColor: "hover:from-green-700 hover:to-green-800",
      link: "#"
    },
    {
      name: "Apple App Store",
      icon: <Apple className="h-8 w-8" />,
      description: "Download for iPhone",
      color: "from-gray-700 to-gray-800",
      hoverColor: "hover:from-gray-800 hover:to-gray-900",
      link: "#"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-orange/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 border border-primary/20">
                  <Download className="h-6 w-6 text-primary animate-pulse" />
                  <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                    Download Now
                  </Typography>
                </div>

                {/* Main Heading */}
                <Typography 
                  variant="h2" 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                >
                  Get Started Today
                  <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                    Download Haki Yangu
                  </span>
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body" 
                  className="text-xl text-muted-foreground leading-relaxed"
                >
                  Join thousands of Tanzanians who are already accessing legal services through their smartphones. 
                  Download the app now and experience the future of accessible justice.
                </Typography>


                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-8">
                  {downloadFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary-orange rounded-xl shadow-lg">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Typography variant="h4" className="text-sm font-bold mb-1">
                          {feature.title}
                        </Typography>
                        <Typography variant="bodySmall" className="text-muted-foreground">
                          {feature.description}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>


                {/* Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {appStoreLinks.map((store, index) => (
                    <Button 
                      key={index}
                      size="lg" 
                      className={`bg-gradient-to-r ${store.color} ${store.hoverColor} text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 group`}
                    >
                      {store.icon}
                      <div className="ml-3 text-left">
                        <div className="text-sm opacity-90">Get it on</div>
                        <div className="text-lg font-bold">{store.name}</div>
                      </div>
                      <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <div className="aspect-[4/4] overflow-hidden">
                  <img 
                    src="/lovable-uploads/2.png" 
                    alt="Haki Yangu App Download" 
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

export default HakiYanguDownload;
