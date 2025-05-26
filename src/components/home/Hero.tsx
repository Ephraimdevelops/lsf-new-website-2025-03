
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Phone, Download, Users, Scale, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image: string;
  stat: string;
  statLabel: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 'empowerment',
    title: 'Justice is not a privilege.',
    subtitle: 'It\'s a fundamental right for every Tanzanian.',
    description: 'From rural villages to urban centers, we provide legal aid, education, and advocacy to those who need it most—ensuring no one is left behind in the pursuit of justice.',
    category: 'Legal Empowerment',
    image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    stat: '26,000+',
    statLabel: 'Lives Changed'
  },
  {
    id: 'reach',
    title: 'Every district. Every community.',
    subtitle: 'Legal aid that reaches the unreachable.',
    description: 'Our network of paralegals and legal experts spans all 184 districts of Tanzania, bringing justice directly to communities that have been historically underserved.',
    category: 'National Coverage',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    stat: '184',
    statLabel: 'Districts Covered'
  },
  {
    id: 'innovation',
    title: 'Digital tools. Real solutions.',
    subtitle: 'Technology that bridges the justice gap.',
    description: 'Through our Haki Yangu App and digital platforms, we\'re revolutionizing how Tanzanians access legal information and connect with support when they need it most.',
    category: 'Digital Innovation',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    stat: '5,000+',
    statLabel: 'App Users Helped'
  }
];

// Regions for the paralegal finder with corresponding hotline numbers
const regions = [
  { name: "All Regions", phone: "+255 800 110 303" },
  { name: "Dar es Salaam", phone: "+255 800 110 304" },
  { name: "Mwanza", phone: "+255 800 110 305" },
  { name: "Arusha", phone: "+255 800 110 306" },
  { name: "Dodoma", phone: "+255 800 110 307" },
  { name: "Tanga", phone: "+255 800 110 308" },
  { name: "Morogoro", phone: "+255 800 110 309" }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [hotlineNumber, setHotlineNumber] = useState(regions[0].phone);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Update hotline number when region changes
  useEffect(() => {
    const region = regions.find(r => r.name === selectedRegion);
    if (region) {
      setHotlineNumber(region.phone);
    }
  }, [selectedRegion]);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative text-white min-h-[85vh] flex items-center overflow-hidden">
      {/* Background with overlay gradient similar to DWB */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${currentSlideData.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero content - More compact */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png"
                alt="LSF Logo" 
                className="h-16 w-auto"
              />
            </div>
            
            <div className="transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block bg-secondary-orange text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                  {currentSlideData.category}
                </span>
                <div className="flex items-center text-secondary-orange font-bold text-2xl">
                  <span className="mr-2">{currentSlideData.stat}</span>
                  <span className="text-sm text-white/80 font-normal">{currentSlideData.statLabel}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {currentSlideData.title}
              </h1>
              
              <h2 className="text-xl md:text-2xl font-medium mb-6 text-secondary-teal">
                {currentSlideData.subtitle}
              </h2>
              
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl leading-relaxed">
                {currentSlideData.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/legal-help"
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold transition duration-300 inline-flex items-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get Legal Help Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/what-we-do"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-bold transition duration-300 inline-flex items-center text-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          
          {/* Legal Aid Widget - More compact and impactful */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-primary text-xl font-bold">Emergency Legal Aid</h3>
                  <p className="text-neutral-600 text-sm">Available 24/7 across Tanzania</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="region-select" className="block text-sm font-medium mb-2 text-neutral-dark">
                  Select Your Region
                </label>
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => setSelectedRegion(value)}
                >
                  <SelectTrigger className="w-full bg-white border-gray-200">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.name} value={region.name}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary-teal/10 rounded-xl border border-primary/20">
                <Phone className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-neutral-dark text-sm">Toll-Free Hotline</p>
                  <a href={`tel:${hotlineNumber.replace(/\s/g, '')}`} className="text-xl font-bold text-primary">
                    {hotlineNumber}
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href={`tel:${hotlineNumber.replace(/\s/g, '')}`}
                  className="bg-primary text-white hover:bg-primary-dark px-4 py-3 rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.hakiyangu.app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary-teal text-white hover:bg-opacity-90 px-4 py-3 rounded-lg text-center font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="h-4 w-4" />
                  Get App
                </a>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  Free legal consultation • Available in Swahili & English
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Slider navigation */}
        <div className="absolute bottom-8 right-8 z-30 flex space-x-2">
          <button 
            onClick={prevSlide}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors border border-white/30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button 
            onClick={nextSlide}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors border border-white/30"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-8 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all border border-white/50 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
