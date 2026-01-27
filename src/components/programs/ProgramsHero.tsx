import { ArrowRight, PlayCircle, Heart } from 'lucide-react';
import { useState } from 'react';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProgramsHero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const images = [
    "/lovable-uploads/programs-hero-slide-1.png",
    "/lovable-uploads/programs-hero-slide-2.png",
    "/lovable-uploads/programs-hero-slide-3.png",
    "/lovable-uploads/mwanamke shamba.png"
  ];

  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    fade: true,
    arrows: false,
    pauseOnHover: false,
    speed: 1500,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)"
  };

  return (
    <section className="relative bg-black h-[90vh] min-h-[600px] overflow-hidden group">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <Slider {...sliderSettings} className="h-full w-full [&_.slick-slider]:h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full">
          {images.map((img, idx) => (
            <div key={idx} className="h-full w-full relative">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={img}
                alt={`Programs slide ${idx + 1}`}
                className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[10000ms] ease-linear"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-center">
        <div className="max-w-4xl space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
            <Heart className="h-4 w-4" />
            <span className="font-bold text-sm uppercase tracking-widest">Our Programs & Projects</span>
          </div>

          <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-2xl">
            Strategy into Action. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white">
              Impact into Change.
            </span>
          </Typography>

          <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md border-l-4 border-primary pl-6">
            LSF designs and delivers high-impact projects that bring our legal empowerment model to life — especially for women, girls, and marginalized communities across Tanzania.
          </Typography>

          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <a href="#flagship-programs">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white font-bold px-8 md:px-10 py-4 md:py-6 rounded-full text-base md:text-lg shadow-[0_0_30px_-5px_var(--primary)] hover:shadow-[0_0_40px_-5px_var(--primary)] transition-all duration-300 hover:-translate-y-1">
                Explore Flagship Projects
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsVideoOpen(true)}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold px-8 md:px-10 py-4 md:py-6 rounded-full text-base md:text-lg flex items-center shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <PlayCircle className="mr-3 h-6 w-6" />
              View Impact
            </Button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src="https://www.youtube.com/embed/LaIz3lOlOxc?autoplay=1"
              title="Impact Video"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProgramsHero;