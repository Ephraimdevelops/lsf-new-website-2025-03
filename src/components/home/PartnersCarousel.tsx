import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const PartnersCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const partners = [
    {
      name: 'European Union',
      logo: '/lovable-uploads/Funded by European Union.png',
      partnership: 'Major Donor'
    },
    {
      name: 'ENABEL',
      logo: '/lovable-uploads/Enabel.png',
      partnership: 'Major Donor'
    },
    {
      name: 'North-South Cooperation',
      logo: '/lovable-uploads/Northsouth cooperation.png',
      partnership: 'Policy Partner'
    },
    {
      name: 'UK Aid',
      logo: '/lovablwe-uploads/UKAid.png',
      partnership: 'Development Partner'
    },
    {
      name: 'Ministry of Justice',
      logo: '/lovable-uploads/foregign, commonwealth, office.png',
      partnership: 'Policy Partner'
    },
    {
      name: 'Danish Embassy Tanzania',
      logo: '/lovable-uploads/Danish amabssador.png',
      partnership: 'Development Partner'
    }
  ];

  const partnersPerSlide = 6;
  const totalSlides = Math.ceil(partners.length / partnersPerSlide);

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

  return (
    <section className="py-18 bg-transparent relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/70 to-neutral-900/50 z-0"></div>

      <Container size="xl" className="relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-primary/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-3"
            />
            <Text variant="overline" color="primary" className="font-semibold text-base tracking-wider">
              Strategic Partners
            </Text>
          </div>
          <Typography variant="h2" className="mb-6 text-4xl md:text-5xl font-bold text-white">
            Driving Justice Through Partnerships
          </Typography>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Our work is made possible through transformative partnerships with donors, government institutions, and development agencies.
          </p>
        </div>

        <div className="relative mb-12">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 px-4">
                    {partners.slice(slideIndex * partnersPerSlide, (slideIndex + 1) * partnersPerSlide).map((partner) => (
                      <div key={partner.name} className="group">
                        <div className="bg-primary/0 text-center group-hover:-translate-y-1">
                          <div className="w-16 h-16 mx-auto mb-2 overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <Typography variant="h3" className="text-white text-sm font-medium group-hover:text-primary transition-colors">
                            {partner.name}
                          </Typography>
                          <span className="block text-grey-100 text-xs mt-1">
                            {partner.partnership}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-white/80 shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-white/80 shadow-md rounded-full flex items-center justify-center border border-gray-200 hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PartnersCarousel;