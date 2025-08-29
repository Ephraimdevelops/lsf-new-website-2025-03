import { ArrowRight, PlayCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // assuming you use react-slick

const ImpactHero = () => {
  return (
    <section className="relative">
      <div className="relative h-[90vh] overflow-hidden">
        {/* Sliding background images */}
        <Slider
          autoplay
          autoplaySpeed={4000}
          infinite
          fade
          arrows={false}
          pauseOnHover={false}
          speed={1000}
          className="absolute inset-0"
        >
          {[
            "/lovable-uploads/1697191159.jpg",
            "/lovable-uploads/projects.jpg",
            "/lovable-uploads/WhatsApp Image 2025-01-25 at 16.24.05.jpeg"
          ].map((img, idx) => (
            <div key={idx} className="h-[90vh]">
              <img
                src={img}
                alt={`Impact Slide ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Slider>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"></div>

        <Container size="xl" className="relative z-10 h-full flex items-center">
          <div className="max-w-4xl text-white drop-shadow-lg">

            {/* Icon */}
            <div className="mb-8">
              <div className="bg-secondary-orange/20 p-6 rounded-full backdrop-blur-sm border border-secondary-orange/30 shadow-lg shadow-secondary-orange/40 inline-flex">
                <Target className="h-8 w-8 text-secondary-orange drop-shadow-md" />
              </div>
            </div>

            {/* Title */}
            <Typography
              variant="h1"
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              Our
              <br />
              <span className="text-secondary-orange drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Impact
              </span>
            </Typography>

            {/* Description */}
            <Typography
              variant="body"
              className="text-xl md:text-2xl mb-12 max-w-3xl text-white/90 leading-relaxed drop-shadow-md"
            >
              Over the past decade, LSF has strengthened legal empowerment across Tanzania, delivering measurable change and enabling communities to access justice, protect their rights, and transform lives.
            </Typography>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="#strategic-approaches">
                <Button
                  size="lg"
                  className="bg-secondary-orange hover:bg-secondary-orange/90 text-xl px-8 py-4 shadow-lg shadow-secondary-orange/40"
                >
                  <ArrowRight className="mr-3 h-6 w-6" />
                  Explore Our Model
                </Button>
              </Link>
              <Link to="#focus-areas">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary text-xl px-8 py-4 shadow-lg shadow-black/40"
                >
                  <PlayCircle className="mr-3 h-6 w-6" />
                  Watch Impact Video
                </Button>
              </Link>
            </div>

          </div>
        </Container>
      </div>
    </section>
  );
};

export default ImpactHero;