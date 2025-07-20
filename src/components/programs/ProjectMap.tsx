import { MapPin, Users, Landmark, Globe, Heart, Building } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';
import { useState, useEffect } from 'react';

const coverage = [
  { icon: <MapPin className="text-primary w-6 h-6" />, label: 'Regions Covered', value: 25 },
  { icon: <Users className="text-primary w-6 h-6" />, label: 'Paralegals Supported', value: 4300 },
  { icon: <Landmark className="text-primary w-6 h-6" />, label: 'Ward-Level Presence', value: 1300 },
];

const impactStats = [
  { 
    icon: <Users className="w-8 h-8" />, 
    value: "426,000+", 
    label: "Lives Transformed",
    color: "text-white"
  },
  { 
    icon: <Globe className="w-8 h-8" />, 
    value: "184", 
    label: "Districts Covered",
    color: "text-white"
  },
  { 
    icon: <Heart className="w-8 h-8" />, 
    value: "15,000+", 
    label: "App Users Helped",
    color: "text-white"
  },
  { 
    icon: <Building className="w-8 h-8" />, 
    value: "500+", 
    label: "Paralegals Trained",
    color: "text-white"
  }
];

export default function NationalReachSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveStatIndex(prev => (prev + 1) % impactStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative py-24 bg-muted/20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Textual Content */}
          <div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Our National Reach
            </Typography>
            <p className="text-muted-foreground mb-8 max-w-xl">
              With presence in over 25 regions and 1,300 wards across Tanzania, our paralegals and legal aid providers are making justice accessible in every corner.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {coverage.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">{item.value}+</h4>
                    <p className="text-muted-foreground text-sm">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Illustration */}
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden border bg-background shadow-md">
            {/* Enhanced Impact Stats with Animation */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {impactStats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center transform transition-all duration-500 ${activeStatIndex === index ? 'scale-110' : 'scale-100'} bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 group`}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${stat.color} transition-all duration-500`}>
                  {stat.value}
                </div>
                <div className="text-white/80 text-xs md:text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </Container>
    </section>
  );
}