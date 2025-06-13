
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Users, Megaphone, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';
import { Button } from '@/components/ui/button';
import LegalAidDialog from '@/components/shared/LegalAidDialog';

interface SlideContent {
  id: string;
  highlightHeading: string;
  mainHeading: string;
  description: string;
  backgroundImage: string;
  link: string;
}

const slideContents: SlideContent[] = [
  {
    id: '1',
    highlightHeading: 'WOMEN\'S EMPOWERMENT',
    mainHeading: 'Empowering Rural Women Through Legal Education',
    description: 'Our latest initiative reaches over 5,000 women across remote villages, providing essential knowledge about land rights and inheritance laws that transforms communities.',
    backgroundImage: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
    link: '/news/1'
  },
  {
    id: '2',
    highlightHeading: 'IMPACT ASSESSMENT',
    mainHeading: 'Annual Impact Report 2024: Transforming Communities',
    description: 'Comprehensive analysis of our work reaching 426,349+ beneficiaries and disbursing $47M+ in grants across Tanzania, showcasing measurable change in justice access.',
    backgroundImage: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
    link: '/publications/annual-report-2024'
  },
  {
    id: '3',
    highlightHeading: 'PROFESSIONAL DEVELOPMENT',
    mainHeading: 'National Legal Aid Conference 2024',
    description: 'Join 500+ legal practitioners, paralegals, and community leaders for Tanzania\'s largest legal empowerment gathering, fostering collaboration and innovation.',
    backgroundImage: '/lovable-uploads/7cdc0b2c-cc42-4f40-9196-2324a35f30a1.png',
    link: '/events/national-conference-2024'
  },
  {
    id: '4',
    highlightHeading: 'DIGITAL INNOVATION',
    mainHeading: '#HakiYanguApp: Digital Justice for All',
    description: 'Our revolutionary mobile app has now helped over 15,000 Tanzanians access legal aid with just a few taps, bringing justice to their fingertips.',
    backgroundImage: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
    link: '/programs/haki-yangu-app'
  }
];

const HighlightsSection = () => {
  const [legalAidDialogOpen, setLegalAidDialogOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideContents.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideContents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideContents.length) % slideContents.length);
  };

  const currentContent = slideContents[currentSlide];

  return (
    <>
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background Images with Transition */}
        {slideContents.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.backgroundImage}
              alt={slide.mainHeading}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
          </div>
        ))}

        {/* Content Overlay - Fixed alignment and spacing */}
        <div className="relative z-10 h-full flex items-center">
          <Container size="xl" className="w-full">
            <div className="max-w-4xl mx-auto text-center lg:text-left lg:mx-0">
              {/* Animated Content */}
              <div
                key={currentSlide}
                className="animate-fade-in space-y-6 md:space-y-8"
              >
                {/* Highlight Small Heading */}
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                  <TrendingUp className="h-5 w-5 mr-3 text-secondary-orange" />
                  <Typography variant="overline" className="text-secondary-orange font-bold">
                    {currentContent.highlightHeading}
                  </Typography>
                </div>

                {/* Main Heading - Increased size */}
                <Typography variant="display" className="text-white font-heading max-w-4xl">
                  {currentContent.mainHeading}
                </Typography>

                {/* Description - Increased size and better spacing */}
                <Typography variant="body" className="text-white/90 max-w-3xl leading-relaxed">
                  {currentContent.description}
                </Typography>

                {/* Action Buttons - Consistent spacing */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to={currentContent.link}>
                    <Button size="lg" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg"
                    variant="outline" 
                    onClick={() => setLegalAidDialogOpen(true)}
                    className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    Get Legal Help
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Navigation Controls - Consistent positioning */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center gap-4">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Slide Indicators */}
            <div className="flex gap-3">
              {slideContents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-secondary-orange scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="h-1 bg-white/20">
            <div 
              className="h-full bg-secondary-orange transition-all duration-300 ease-linear"
              style={{ width: `${((currentSlide + 1) / slideContents.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      <LegalAidDialog 
        open={legalAidDialogOpen} 
        onOpenChange={setLegalAidDialogOpen} 
      />
    </>
  );
};

export default HighlightsSection;
