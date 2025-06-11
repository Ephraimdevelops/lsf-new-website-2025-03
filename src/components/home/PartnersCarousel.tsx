
import { useState, useEffect } from 'react';
import { ExternalLink, Heart, Globe, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';

const PartnersCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const partners = [
    {
      name: 'European Union',
      logo: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Supporting gender justice initiatives across Tanzania',
      partnership: 'Major Donor',
      amount: '$15M+'
    },
    {
      name: 'UK Aid',
      logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Funding legal empowerment and access to justice programs',
      partnership: 'Development Partner',
      amount: '$8.5M+'
    },
    {
      name: 'Ford Foundation',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Supporting community-driven development initiatives',
      partnership: 'Strategic Partner',
      amount: '$12M+'
    },
    {
      name: 'UNDP Tanzania',
      logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Development agency supporting our flagship projects',
      partnership: 'Implementation Partner',
      amount: '$6.2M+'
    },
    {
      name: 'Open Society Foundations',
      logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Advancing human rights and justice initiatives',
      partnership: 'Funding Partner',
      amount: '$4.8M+'
    },
    {
      name: 'Ministry of Justice',
      logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Government partnership for policy development',
      partnership: 'Policy Partner',
      amount: 'Strategic'
    }
  ];

  const partnersPerSlide = 3;
  const totalSlides = Math.ceil(partners.length / partnersPerSlide);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentPartners = () => {
    const start = currentSlide * partnersPerSlide;
    return partners.slice(start, start + partnersPerSlide);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-secondary-teal via-secondary-teal-dark to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-60 h-60 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary-yellow/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <Users className="h-6 w-6 mr-4 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
              STRATEGIC PARTNERSHIPS
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold text-white">
            Our Partners &
            <span className="block text-secondary-orange">Donors</span>
          </Typography>
          
          <Typography variant="body" className="text-white/90 max-w-4xl mx-auto text-xl leading-relaxed">
            Working together with international development partners to amplify our impact and reach more communities across Tanzania.
          </Typography>
        </div>

        {/* Partners Carousel */}
        <div className="relative mb-16">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {partners.slice(slideIndex * partnersPerSlide, (slideIndex + 1) * partnersPerSlide).map((partner, index) => (
                      <div key={partner.name} className="group">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-secondary-orange/50 transition-all duration-300 h-full group-hover:-translate-y-2">
                          {/* Logo */}
                          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center">
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          
                          <div className="text-center">
                            <span className="inline-block bg-secondary-orange/20 text-secondary-orange text-sm font-bold px-4 py-2 rounded-full mb-4">
                              {partner.partnership}
                            </span>
                            
                            <Typography variant="h3" className="text-white mb-3 group-hover:text-secondary-orange transition-colors">
                              {partner.name}
                            </Typography>
                            
                            <Typography variant="bodySmall" className="text-white/80 leading-relaxed mb-4">
                              {partner.description}
                            </Typography>
                            
                            <div className="text-2xl font-bold text-secondary-yellow">
                              {partner.amount}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:border-secondary-orange/50 hover:bg-secondary-orange/20 transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:border-secondary-orange/50 hover:bg-secondary-orange/20 transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mb-12">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-secondary-orange scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PartnersCarousel;
