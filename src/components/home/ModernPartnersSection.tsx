import { useState } from 'react';
import { Handshake, Globe, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const ModernPartnersSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const partners = [
    { name: 'European Union', logo: '/lovable-uploads/Funded by European Union.png' },
    { name: 'ENABEL', logo: '/lovable-uploads/Enabel.png' },
    { name: 'North-South Cooperation', logo: '/lovable-uploads/Northsouth cooperation.png' },
    { name: 'UK Aid', logo: '/lovable-uploads/UKAid.png' },
    { name: 'Foreign Commonwealth Office', logo: '/lovable-uploads/foregign, commonwealth, office.png' },
    { name: 'Danish Embassy', logo: '/lovable-uploads/Danish amabssador.png' },
  ];

  const impactStats = [
    { value: '31', label: 'Regions Covered', icon: <Globe className="h-6 w-6" /> },
    { value: '50+', label: 'Partner Organizations', icon: <Users className="h-6 w-6" /> },
    { value: '$47M+', label: 'Grants Disbursed', icon: <Award className="h-6 w-6" /> },
  ];

  return (
    <section
      ref={sectionRef as any}
      className="py-24 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 mb-6 bg-primary/10 rounded-full px-5 py-2">
            <Handshake className="h-4 w-4 text-primary" />
            <span className="text-primary font-bold text-sm uppercase tracking-widest">Strategic Partners</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Driving Justice Through <span className="text-primary">Partnerships</span>
          </h2>
          <p className="text-neutral-600 text-lg max-w-3xl mx-auto">
            Our impact is amplified through transformative partnerships with donors, government institutions, and development agencies.
          </p>
        </div>

        {/* Partners Logo Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center text-center group"
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-110">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-neutral-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {partner.name}
              </p>
            </div>
          ))}
        </div>

        {/* Impact Stats - Dark Card */}
        <div className={`bg-neutral-900 rounded-3xl p-10 md:p-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Partnership Impact</h3>
            <p className="text-white/60">Together, we've created lasting change across Tanzania's legal landscape.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary-orange">
                  {stat.icon}
                </div>
                <p className="text-5xl md:text-6xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-white/60 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link to="/contact">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-5 rounded-full text-lg">
                Become a Partner
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernPartnersSection;
