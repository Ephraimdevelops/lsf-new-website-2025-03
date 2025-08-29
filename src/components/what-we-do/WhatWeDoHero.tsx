import { ArrowRight, PlayCircle, Target } from 'lucide-react';
import { useState } from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const WhatWeDoHero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const images = [
    "/lovable-uploads/mwanamke shamba.png",
    "/lovable-uploads/haki yangu app uzinuzi.webp",
    "/lovable-uploads/SaveVid.Net_484842638_18264975178279523_2515659245077784889_n.jpg",
    "/lovable-uploads/WhatsApp Image 2025-01-30 at 04.36.07.jpeg"
  ];

  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    fade: true,
    arrows: false,
    pauseOnHover: false,
    speed: 1000
  };

  return (
    <section className="relative">
      {/* Hero with sliding images */}
      <div className="relative h-[90vh] overflow-hidden">
        <Slider {...sliderSettings} className="absolute inset-0">
          {images.map((img, idx) => (
            <div key={idx} className="h-[90vh]">
              <img
                src={img}
                alt={`Slide ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Slider>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        <Container size="xl" className="relative z-10 h-full flex items-center">
          <div className="max-w-4xl text-white">
            <div className="inline-flex items-center gap-3 mb-6 bg-secondary backdrop-blur-sm rounded-full px-6 py-3">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm uppercase tracking-wider text-primary">Our Work</span>
            </div>

            <Typography variant="h1" className="text-white mb-6 text-5xl md:text-6xl leading-tight">
              Everyday Justice<br />
              <span className="text-white">For Everyday Problems.</span>
            </Typography>

            <Typography variant="body" className="text-white/90 mb-8 text-xl max-w-3xl leading-relaxed">
              Explore how our legal empowerment model drives impact in Tanzania through sustainable strategies, inclusive partnerships, and transformative focus areas.
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="#strategic-approaches">
                <Button size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg">
                  Explore Our Model
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsVideoOpen(true)}
                className="border-2 border-primary text-white hover:bg-primary hover:text-white font-semibold px-8 py-4 rounded-lg flex items-center"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Our Impact Video
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/fNZ8bAgBJnY?autoplay=1"
              title="Impact Video"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 text-white text-3xl hover:text-primary"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default WhatWeDoHero;