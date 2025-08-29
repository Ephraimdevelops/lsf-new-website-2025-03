import { ArrowRight, PlayCircle, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';


const AboutHero = () => {
  const images = [
    '/lovable-uploads/msaada kisheria lsf yazindua .webp',
    '/lovable-uploads/lsf from IGP sirro police award.jpg',
    '/lovable-uploads/b2226752-4a54-463b-af38-a1dd2b57350b.png',
    '/lovable-uploads/SaveVid.Net_484979213_18264975220279523_3508195274631451945_n.jpg',
    '/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative">
      <div className="relative h-[90vh] overflow-hidden">
        {/* Image Slideshow */}
        <div className="absolute inset-0">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Hero image ${index + 1}`}
              className={`w-full h-full object-cover absolute top-0 left-0 transition-all duration-1000 ease-in-out ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <Container size="xl" className="relative z-10 h-full flex items-center">
          <div className="max-w-3xl text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-4 bg-primary/20 backdrop-blur-sm rounded-full px-5 py-2">
              <Target className="h-6 w-6 text-primary" />
              <span className="font-semibold text-sm uppercase tracking-wider text-white">About Us</span>
            </div>

            {/* Title */}
            <Typography
              variant="h1"
              className="text-white mb-6 text-4xl md:text-6xl font-bold leading-tight [text-shadow:_0_2px_3px_rgba(0,0,0,0.5)]"
            >
              Empowering Communities
              <br />
              <span className="text-white">Through Access to Justice</span>
            </Typography>

            {/* Description */}
            <Typography
              variant="body"
              className="text-white/90 mb-6 text-lg md:text-xl max-w-2xl leading-relaxed [text-shadow:_0_1px_2px_rgba(0,0,0,0.4)]"
            >
              For over 15 years, the Legal Services Facility has been at the forefront of strengthening legal empowerment across Tanzania, ensuring that every citizen has access to justice regardless of their economic status or social background.
            </Typography>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/what-we-do">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  Explore Our Model
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link to="#focus-areas">
                <Button
                size="lg"
                variant="outline"
                onClick={() => setIsVideoOpen(true)}
                className="border-2 border-primary text-white hover:bg-primary hover:text-white font-semibold px-8 py-4 rounded-lg flex items-center"
                >
                  <PlayCircle className="mr-2 h-6 w-6" />
                  Watch Our Impact Video
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default AboutHero;