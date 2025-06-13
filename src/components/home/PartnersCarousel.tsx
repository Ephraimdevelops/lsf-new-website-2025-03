
import { useState, useEffect } from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';

const PartnersCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const partners = [
    {
      name: 'European Union',
      logo: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      partnership: 'Major Donor'
    },
    {
      name: 'UK Aid',
      logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      partnership: 'Development Partner'
    },
    {
      name: 'Ministry of Justice',
      logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      partnership: 'Policy Partner'
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

  return (
    <section className="py-20 bg-white relative">
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gray-100 rounded-full px-6 py-3 mb-6">
            <Users className="h-5 w-5 mr-3 text-gray-600" />
            <Typography variant="overline" className="text-gray-600 font-bold">
              PARTNERSHIPS
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-6 md:mb-8 text-3xl md:text-5xl lg:text-6xl font-bold">
            Our Partners &
            <span className="block text-primary">Donors</span>
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg leading-relaxed">
            Working together with international development partners to amplify our impact across Tanzania.
          </Typography>
        </div>

        {/* Partners Carousel */}
        <div className="relative mb-12">
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
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full text-center group-hover:-translate-y-1">
                          {/* Logo */}
                          <div className="w-20 h-20 mx-auto mb-6 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          <div className="text-center">
                            <Typography variant="h4" className="text-neutral-dark mb-2 group-hover:text-primary transition-colors">
                              {partner.name}
                            </Typography>
                            
                            <span className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                              {partner.partnership}
                            </span>
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-200 hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-200 hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PartnersCarousel;
