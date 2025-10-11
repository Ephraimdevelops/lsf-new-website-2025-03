import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Handshake, Globe, Award, Users } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const ModernPartnersSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });
  const [currentSlide, setCurrentSlide] = useState(0);

  const partners = [
    {
      name: 'European Union',
      logo: '/lovable-uploads/Funded by European Union.png',
      partnership: 'Major Donor',
      description: 'Supporting legal empowerment across Tanzania',
      type: 'donor'
    },
    {
      name: 'ENABEL',
      logo: '/lovable-uploads/Enabel.png',
      partnership: 'Development Partner',
      description: 'Building capacity for sustainable justice systems',
      type: 'development'
    },
    {
      name: 'North-South Cooperation',
      logo: '/lovable-uploads/Northsouth cooperation.png',
      partnership: 'Policy Partner',
      description: 'Advancing global justice cooperation',
      type: 'policy'
    },
    {
      name: 'UK Aid',
      logo: '/lovable-uploads/UKAid.png',
      partnership: 'Development Partner',
      description: 'Strengthening legal aid infrastructure',
      type: 'development'
    },
    {
      name: 'Ministry of Justice',
      logo: '/lovable-uploads/foregign, commonwealth, office.png',
      partnership: 'Government Partner',
      description: 'Official government collaboration',
      type: 'government'
    },
    {
      name: 'Danish Embassy Tanzania',
      logo: '/lovable-uploads/Danish amabssador.png',
      partnership: 'Development Partner',
      description: 'Supporting community legal empowerment',
      type: 'development'
    }
  ];

  const partnersPerSlide = 4;
  const totalSlides = Math.ceil(partners.length / partnersPerSlide);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const partnerTypes = {
    donor: { icon: Award, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', text: 'text-green-700' },
    development: { icon: Globe, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50', text: 'text-blue-700' },
    policy: { icon: Users, color: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50', text: 'text-purple-700' },
    government: { icon: Handshake, color: 'from-orange-500 to-red-600', bg: 'bg-orange-50', text: 'text-orange-700' }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-8 md:py-8 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
              <Handshake className="h-6 w-6 text-primary animate-pulse" />
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Strategic Partners
              </Typography>
            </div>
            
            <Typography 
              variant="h2" 
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Driving Justice Through
              <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                Powerful Partnerships
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Our impact is amplified through transformative partnerships with donors, government institutions, 
              and development agencies who share our vision of accessible justice for all Tanzanians.
            </Typography>
          </div>

          {/* Partners Carousel */}
          <div className="relative mb-16">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4">
                      {partners.slice(slideIndex * partnersPerSlide, (slideIndex + 1) * partnersPerSlide).map((partner, index) => {
                        const typeInfo = partnerTypes[partner.type as keyof typeof partnerTypes];
                        return (
                          <div 
                            key={partner.name}
                            className={`group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                          >
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 h-full">
                              {/* Logo */}
                              <div className="text-center mb-6">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 overflow-hidden bg-neutral-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                  <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="w-full h-full object-contain p-2"
                                  />
                                </div>
                              </div>

                              {/* Partner Info */}
                              <div className="text-center">
                                <Typography variant="h4" className="mb-2 text-lg sm:text-xl font-bold">
                                  {partner.name}
                                </Typography>
                                
                                {/* Partnership Type */}
                                <div className="mb-4">
                                  <div className={`inline-flex items-center gap-2 ${typeInfo.bg} ${typeInfo.text} px-3 py-1 rounded-full text-sm font-semibold`}>
                                    <typeInfo.icon className="h-4 w-4" />
                                    {partner.partnership}
                                  </div>
                                </div>

                                <Typography variant="body" className="text-muted-foreground leading-relaxed">
                                  {partner.description}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center border border-neutral-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-neutral-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center border border-neutral-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-neutral-600" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-3 mb-16">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 ${
                  index === currentSlide 
                    ? 'w-12 h-3 bg-primary rounded-full shadow-lg' 
                    : 'w-3 h-3 bg-neutral-300 hover:bg-primary/50 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>


          {/* Partnership Impact */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5 rounded-3xl p-12 border border-primary/10">
            <div className="text-center mb-12">
              <Typography variant="h3" className="mb-4 text-3xl font-bold">
                Partnership Impact
              </Typography>
              <Typography variant="body" className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Together with our partners, we've created lasting change across Tanzania's legal landscape.
              </Typography>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary-orange rounded-3xl mb-6 shadow-lg">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <Typography variant="display" className="text-primary text-4xl font-bold mb-2">
                  31
                </Typography>
                <Typography variant="h4" className="text-xl font-bold mb-2">
                  Regions Covered
                </Typography>
                <Typography variant="body" className="text-muted-foreground">
                  Nationwide reach through strategic partnerships
                </Typography>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary-teal to-secondary-green rounded-3xl mb-6 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <Typography variant="display" className="text-primary text-4xl font-bold mb-2">
                  50+
                </Typography>
                <Typography variant="h4" className="text-xl font-bold mb-2">
                  Partner Organizations
                </Typography>
                <Typography variant="body" className="text-muted-foreground">
                  Collaborative network driving change
                </Typography>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl mb-6 shadow-lg">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <Typography variant="display" className="text-primary text-4xl font-bold mb-2">
                  $47M+
                </Typography>
                <Typography variant="h4" className="text-xl font-bold mb-2">
                  Grants Disbursed
                </Typography>
                <Typography variant="body" className="text-muted-foreground">
                  Financial support for legal empowerment
                </Typography>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default ModernPartnersSection;
